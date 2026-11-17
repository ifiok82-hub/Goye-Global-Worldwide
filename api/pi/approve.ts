const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  console.log(
    'APPROVE HIT',
    req.method,
    req.body,
    'KEY_EXISTS:',
    !!apiKey,
    'KEY_LENGTH:',
    apiKey.length
  );

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ok: true,
      hasKey: !!apiKey,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY missing - check Vercel Env' });
  }
  if (apiKey.startsWith('sk_live_')) {
    console.warn('KEY MISMATCH: Testnet mode but Live key');
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

    let { r, data } = await callPiApprove(paymentId, apiKey);

    // Handle Pi Platform database propagation lag on freshly created payments
    if (r.status === 404) {
      console.log('Pi approve initial 404 - retrying after 700ms propagation wait for', paymentId);
      await wait(700);
      ({ r, data } = await callPiApprove(paymentId, apiKey));
    }

    console.log('Pi approve status', r.status, data);

    if (r.status === 404) {
      return res.status(404).json({
        error: 'Payment expired - please tap LOCK again for a fresh payment',
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
