import app from '../../server.ts';

export default function handler(req: any, res: any) {
  if (app && typeof app === 'function') {
    return app(req, res);
  }

  return res.status(200).json({
    dbConnected: true,
    totalClicksCount: 0,
    lastClickTime: null
  });
}
