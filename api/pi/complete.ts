export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = (process.env.PI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

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
    const txid = body.txid || body.txId || body.transactionId;
    console.log('COMPLETE HIT', paymentId, txid, {
      hasKey: !!apiKey,
      keyPrefix: apiKey.slice(0, 7),
      keyLength: apiKey.length,
    });

    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    let r: Response;
    let text = '';
    try {
      r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid }),
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

    console.log('COMPLETE PI RESPONSE', paymentId, txid, r.status, data);

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error_message || data?.error || data?.message || `Pi API error ${r.status}`,
        status: r.status,
        data,
      });
    }

    return res.status(200).json({ success: true, completed: true, paymentId, txid, data });
  } catch (e: any) {
    console.error('COMPLETE EXCEPTION', e);
    return res.status(500).json({ error: e?.message || 'Complete failed' });
  }
}
