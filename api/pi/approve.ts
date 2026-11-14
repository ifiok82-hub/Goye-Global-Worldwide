export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log(
    'APPROVE HIT',
    req.method,
    req.body,
    'KEY_EXISTS:',
    !!process.env.PI_API_KEY,
    'KEY_LENGTH:',
    process.env.PI_API_KEY?.length
  );

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ok: true,
      hasKey: !!process.env.PI_API_KEY,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = (process.env.PI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY missing - check Vercel Env' });
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

    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
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

    console.log('APPROVE PI RESPONSE', paymentId, r.status, data);

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
