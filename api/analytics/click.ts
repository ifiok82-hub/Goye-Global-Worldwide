import app from '../../server.ts';

export default function handler(req: any, res: any) {
  if (app && typeof app === 'function') {
    return app(req, res);
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      totalClicks: 0,
      count: 0
    });
  }

  return res.status(200).json({
    success: true,
    totalClicks: 0,
    count: 0,
    clicks: []
  });
}
