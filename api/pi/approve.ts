const PI_APP_ID = 'piappstudio-QVT1FNbDcNvVGzNMN-1f2LWG9MHQ5pUr';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = (process.env.PI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

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
    console.log('APPROVE HIT', paymentId, {
      hasKey: !!apiKey,
      keyPrefix: apiKey.slice(0, 7),
      keyLength: apiKey.length,
    });

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    let r: Response;
    let text = '';
    try {
      r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      });
      text = await r.text().catch(() => '');
    } finally {
      clearTimeout(timer);
    }

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

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

    return res.status(200).json({ success: true, approved: true, paymentId, data });
  } catch (e: any) {
    console.error('APPROVE EXCEPTION', e);
    return res.status(500).json({ error: e?.message || 'Approve failed' });
  }
}
