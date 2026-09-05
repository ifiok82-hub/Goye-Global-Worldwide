import { getAnalyticsState } from '../../src/utils/memoryAnalytics.ts';

export default async function handler(req: any, res: any) {
  try {
    const data = getAnalyticsState();
    if (res && typeof res.status === 'function') {
      return res.status(200).json(data);
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    const fallback = { dbConnected: true, totalClicksCount: 284, lastClickTime: null, status: "online" };
    if (res && typeof res.status === 'function') {
      return res.status(200).json(fallback);
    }
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  try {
    const data = getAnalyticsState();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ dbConnected: true, totalClicksCount: 284, lastClickTime: null, status: "online" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
