import app from '../server.ts';

export default async function handler(req: any, res: any) {
  try {
    if (app && typeof app === 'function') {
      return app(req, res);
    }
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ status: 'ok', serverless: true });
    }
    return new Response(JSON.stringify({ status: 'ok', serverless: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[SERVERLESS INDEX ERROR]', error);
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ status: 'degraded', error: error.message });
    }
    return new Response(JSON.stringify({ status: 'degraded', error: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
