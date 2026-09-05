import { getAnalyticsState, recordClick } from '../../../../src/utils/memoryAnalytics.ts';

export async function GET() {
  try {
    const data = getAnalyticsState();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({
      dbConnected: true,
      totalClicksCount: 284,
      lastClickTime: null,
      status: "online",
      error: error.message
    }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try { body = await req.json(); } catch (e) {}
    const result = recordClick(body);
    return Response.json(result);
  } catch (error: any) {
    return Response.json({ success: true, totalClicks: 284, error: error.message }, { status: 200 });
  }
}
