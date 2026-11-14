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

  console.log(
    'INCOMPLETE HIT',
    req.method,
    req.body,
    'KEY_EXISTS:',
    !!process.env.PI_API_KEY,
    'KEY_LENGTH:',
    process.env.PI_API_KEY?.length
  );

  if (req.method !== 'POST') {
    if (res && typeof res.status === 'function') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }

    const payment = body.payment || body;
    const paymentId = payment.identifier || payment.paymentId || payment.id;
    const txid = payment.transaction?.txid || payment.txid;
    const apiKey = (process.env.PI_API_KEY || '').trim();

    if (!apiKey) {
      if (res && typeof res.status === 'function') {
        return res.status(500).json({ error: 'PI_API_KEY missing - check Vercel Env' });
      }
      return new Response(JSON.stringify({ error: 'PI_API_KEY missing - check Vercel Env' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (paymentId) {
      if (txid) {
        await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ txid })
        }).catch(e => console.error('Incomplete payment complete error:', e));
      } else if (!payment.status?.developer_approved) {
        await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }).catch(e => console.error('Incomplete payment approve error:', e));
      }
    }

    const payload = { handled: true, paymentId };
    if (res && typeof res.status === 'function') {
      return res.status(200).json(payload);
    }
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Error handling incomplete payment:', err);
    const payload = { handled: false, error: err?.message };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(payload);
    }
    return new Response(JSON.stringify(payload), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
