// Vercel Serverless Function: POST /api/pi/me
// Verifies Pi user accessToken against https://api.minepi.com/v2/me

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, endpoint: '/api/pi/me' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const authHeader = req.headers?.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const accessToken = (body.accessToken || bearerToken || '').trim();

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing accessToken' });
    }

    const piRes = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const text = await piRes.text().catch(() => '');
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!piRes.ok) {
      return res.status(piRes.status).json({
        authenticated: false,
        error: data?.error_message || data?.error || `Pi /v2/me failed (${piRes.status})`,
        data
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        uid: data.uid || '',
        username: data.username || ''
      },
      data
    });
  } catch (e: any) {
    console.error('PI ME VERIFY EXCEPTION', e);
    return res.status(500).json({ authenticated: false, error: e?.message || 'Auth verification failed' });
  }
}
