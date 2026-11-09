// Vercel Serverless Function: POST /api/pi/verify
// Verifies user session with official Pi Network API (GET https://api.minepi.com/v2/me)

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

    const { accessToken, username } = body;

    if (!accessToken) {
      if (res && typeof res.status === 'function') {
        return res.status(400).json({ success: false, message: 'Missing accessToken' });
      }
      return new Response(JSON.stringify({ success: false, message: 'Missing accessToken' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call official Pi Network API to verify accessToken
    const piRes = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (piRes.ok) {
      const piUser = await piRes.json();
      const verifiedUsername = piUser?.username || username || 'unknown';
      console.log(`Pi Auth verified for @${verifiedUsername}`);
      
      const payload = {
        success: true,
        username: verifiedUsername,
        uid: piUser?.uid,
        verified: true
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errorText = await piRes.text().catch(() => '');
      console.error(`[PI AUTH FAILED] Status: ${piRes.status} - ${errorText}`);
      const payload = { success: false, error: 'Pi Auth verification failed with Pi Server' };

      if (res && typeof res.status === 'function') {
        return res.status(piRes.status || 401).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: piRes.status || 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err: any) {
    console.error('Error in /api/pi/verify:', err?.message || err);
    const payload = { success: false, error: err?.message || 'Internal server error' };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(payload);
    }
    return new Response(JSON.stringify(payload), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try { body = await req.json(); } catch (e) {}

    const { accessToken, username } = body;
    if (!accessToken) {
      return Response.json({ success: false, message: 'Missing accessToken' }, { status: 400 });
    }

    const piRes = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (piRes.ok) {
      const piUser = await piRes.json();
      const verifiedUsername = piUser?.username || username || 'unknown';
      console.log(`Pi Auth verified for @${verifiedUsername}`);
      return Response.json({
        success: true,
        username: verifiedUsername,
        uid: piUser?.uid,
        verified: true
      });
    } else {
      const errorText = await piRes.text().catch(() => '');
      console.error(`[PI AUTH FAILED] Status: ${piRes.status} - ${errorText}`);
      return Response.json({ success: false, error: 'Pi Auth verification failed with Pi Server' }, { status: piRes.status || 401 });
    }
  } catch (err: any) {
    return Response.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
