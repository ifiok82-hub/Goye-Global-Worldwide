const PI_APP_ID = 'piappstudio-QVT1FNbDcNvVGzNMN-1f2LWG9MHQ5pUr';

async function callPiApprove(paymentId: string, apiKey: string) {
  const r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const text = await r.text().catch(() => '');
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  return { r, data };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = (process.env.PI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

  console.log('APPROVE app check', {
    hasKey: !!process.env.PI_API_KEY,
    keyPrefix: process.env.PI_API_KEY?.slice(0, 7),
    keyLength: process.env.PI_API_KEY?.length,
  });

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ok: true,
      hasKey: !!apiKey,
      keyPrefix: apiKey ? apiKey.slice(0, 8) : '',
      appId: PI_APP_ID,
      sandbox: true,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY missing - check Vercel Env' });
  }
  if (apiKey.startsWith('sk_live_')) {
    return res.status(400).json({
      error: 'KEY MISMATCH: Live key in Testnet mode - use sk_test_ from SAME Pi App',
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const paymentId = body.paymentId || body.payment_id || body.id;
    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    const { r, data } = await callPiApprove(paymentId, apiKey);

    console.log('Pi approve status', r.status, data);

    if (r.status === 404) {
      return res.status(404).json({
        error: 'Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment',
        status: 404,
        data,
      });
    }

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error_message || data?.error || data?.message || `Pi API error ${r.status}`,
        status: r.status,
        data,
      });
    }

    return res.status(200).json({ approved: true, success: true, paymentId, data });
  } catch (e: any) {
    console.error('APPROVE EXCEPTION', e);
    return res.status(500).json({ error: e?.message || 'Approve failed' });
  }
}
