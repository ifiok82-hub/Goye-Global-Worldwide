export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { paymentId } = req.body || {};
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });
    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
