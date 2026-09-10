export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) return Response.json({ approved: false, error: 'paymentId is required' }, { status: 400 });

    const apiKey = process.env.PI_VALIDATION_KEY;
    if (!apiKey) return Response.json({ approved: false, error: 'PI_VALIDATION_KEY is not configured' }, { status: 500 });

    const response = await fetch(`https://api.testnet.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`, {
      method: 'POST',
      headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const data = await response.json();
    return Response.json({ ...data, approved: response.ok && data.status !== 'cancelled' }, { status: response.ok ? 200 : response.status });
  } catch (error) {
    return Response.json({ approved: false, error: error instanceof Error ? error.message : 'Approval failed' }, { status: 500 });
  }
}
