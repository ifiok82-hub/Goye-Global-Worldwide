// Vercel Serverless Function: POST /api/pi/incomplete
// Handles incomplete Pi payments found by onIncompletePaymentFound callback

export default async function handler(req: any, res: any) {
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
      try { body = JSON.parse(body); } catch (e) {}
    }

    const payment = body.payment || body;
    const paymentId = payment.identifier || payment.paymentId || payment.id;
    const txid = payment.transaction?.txid || payment.txid;
    const apiKey = (process.env.PI_NETWORK_API_KEY || process.env.PI_API_KEY || '').trim();

    console.log(`[PI_PAYMENT] Incomplete payment found: ${paymentId}, txid: ${txid}`);

    if (paymentId && apiKey) {
      // 1. If transaction has been submitted to blockchain, complete it
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
        // 2. If not developer approved, approve it
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
      return res.status(200).json(payload);
    }
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
