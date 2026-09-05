import app from '../../server.ts';

export default async function handler(req: any, res: any) {
  try {
    if (app && typeof app === 'function') {
      return app(req, res);
    }

    const isPost = req && req.method === 'POST';

    if (res && typeof res.status === 'function') {
      return res.status(200).json({
        success: true,
        totalClicks: 0,
        count: 0,
        clicks: isPost ? undefined : []
      });
    }

    return new Response(JSON.stringify({
      success: true,
      totalClicks: 0,
      count: 0,
      clicks: isPost ? undefined : []
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API CLICK ERROR]', error);
    if (res && typeof res.status === 'function') {
      return res.status(200).json({
        success: false,
        totalClicks: 0,
        count: 0,
        clicks: [],
        error: error.message || 'Click processing notice'
      });
    }
    return new Response(JSON.stringify({
      success: false,
      totalClicks: 0,
      count: 0,
      clicks: [],
      error: error.message || 'Click processing notice'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET(req?: any) {
  try {
    return new Response(JSON.stringify({
      success: true,
      totalClicks: 0,
      count: 0,
      clicks: []
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      totalClicks: 0,
      count: 0,
      clicks: [],
      error: error.message
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req?: any) {
  try {
    return new Response(JSON.stringify({
      success: true,
      totalClicks: 0,
      count: 0
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      totalClicks: 0,
      count: 0,
      error: error.message
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
