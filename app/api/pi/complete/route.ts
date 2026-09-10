export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    if (!paymentId || !txid) return Response.json({ completed: false, error: 'paymentId and txid are required' }, { status: 400 });

    const apiKey = process.env.PI_VALIDATION_KEY;
    if (!apiKey) return Response.json({ completed: false, error: 'PI_VALIDATION_KEY is not configured' }, { status: 500 });

    const response = await fetch(`https://api.testnet.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`, {
      method: 'POST',
      headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ txid }),
      cache: 'no-store'
    });
    const data = await response.json();
    return Response.json({ ...data, completed: response.ok && Boolean(data.transaction?.txid || data.txid), paymentId, txid }, { status: response.ok ? 200 : response.status });
  } catch (error) {
    return Response.json({ completed: false, error: error instanceof Error ? error.message : 'Completion failed' }, { status: 500 });
  }
}
