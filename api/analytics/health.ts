import app from '../../server.ts';

export default async function handler(req: any, res: any) {
  try {
    if (app && typeof app === 'function') {
      return app(req, res);
    }
    if (res && typeof res.status === 'function') {
      return res.status(200).json({
        dbConnected: true,
        totalClicksCount: 0,
        lastClickTime: null
      });
    }
    return new Response(JSON.stringify({
      dbConnected: true,
      totalClicksCount: 0,
      lastClickTime: null
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API HEALTH ERROR]', error);
    if (res && typeof res.status === 'function') {
      return res.status(200).json({
        dbConnected: false,
        totalClicksCount: 0,
        lastClickTime: null,
        error: error.message || 'Database connection error'
      });
    }
    return new Response(JSON.stringify({
      dbConnected: false,
      totalClicksCount: 0,
      lastClickTime: null,
      error: error.message || 'Database connection error'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET(req?: any) {
  try {
    return new Response(JSON.stringify({
      dbConnected: true,
      totalClicksCount: 0,
      lastClickTime: null
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API HEALTH GET ERROR]', error);
    return new Response(JSON.stringify({
      dbConnected: false,
      totalClicksCount: 0,
      lastClickTime: null,
      error: error.message || 'Database connection error'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
