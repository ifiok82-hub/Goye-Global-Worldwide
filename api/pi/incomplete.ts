// Vercel Serverless Function: POST /api/pi/incomplete
// Handles incomplete Pi payments found by onIncompletePaymentFound callback

export default async function handler(req: any, res: any) {
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res && typeof res.status === 'function'
      ? res.status(200).end()
      : new Response(null, { status: 200 });
  }

  const apiKey = (process.env.PI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

  console.log(
    'INCOMPLETE HIT',
    req.method,
    req.body,
    'KEY_EXISTS:',
    !!apiKey,
    'KEY_LENGTH:',
    apiKey.length
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }

    const payment = body.payment || body;
    const paymentId = payment.identifier || payment.paymentId || payment.id;
    const txid = payment.transaction?.txid || payment.txid;

    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY missing - check Vercel Env' });
    }
    if (apiKey.startsWith('sk_live_')) {
      console.warn('KEY MISMATCH: Testnet mode but Live key');
    }

    let action = 'none';
    if (paymentId) {
      if (txid && !payment.status?.developer_completed) {
        action = 'complete';
        const r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ txid })
        });
        console.log('Incomplete complete status:', paymentId, r.status);
      } else if (!payment.status?.developer_approved) {
        action = 'cancel';
        // Cancel stale unapproved incomplete payments so user can start fresh
        const r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        console.log('Incomplete cancel status:', paymentId, r.status);
      }
    }

    return res.status(200).json({ handled: true, action, paymentId });
  } catch (err: any) {
    console.error('Error handling incomplete payment:', err);
    return res.status(500).json({ handled: false, error: err?.message });
  }
}
