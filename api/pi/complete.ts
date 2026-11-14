export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log(
    'COMPLETE HIT',
    req.method,
    req.body,
    'KEY_EXISTS:',
    !!process.env.PI_API_KEY,
    'KEY_LENGTH:',
    process.env.PI_API_KEY?.length
  );

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
    const txid = body.txid || body.txId || body.transactionId;
    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    const text = await r.text().catch(() => '');
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    console.log('COMPLETE PI RESPONSE', paymentId, txid, r.status, data);

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error_message || data?.error || data?.message || `Pi API error ${r.status}`,
        status: r.status,
        data,
      });
    }

    return res.status(200).json({ completed: true, success: true, paymentId, txid, data });
  } catch (e: any) {
    console.error('COMPLETE EXCEPTION', e);
    return res.status(500).json({ error: e?.message || 'Complete failed' });
  }
}
