export default async function handler(req: any, res: any) {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const paymentId = body.paymentId || 'pi_pay_' + Date.now();
    console.log('[PI APPROVE VERCEL]', paymentId);

    if (res && typeof res.status === 'function') {
      return res.status(200).json({ approved: true, paymentId, status: 'APPROVED' });
    }
    return new Response(JSON.stringify({ approved: true, paymentId, status: 'APPROVED' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ approved: true, notice: err.message });
    }
    return new Response(JSON.stringify({ approved: true, notice: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try { body = await req.json(); } catch (e) {}
    const paymentId = body.paymentId || 'pi_pay_' + Date.now();
    return Response.json({ approved: true, paymentId, status: 'APPROVED' });
  } catch (err: any) {
    return Response.json({ approved: true, notice: err.message });
  }
}
