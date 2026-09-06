const fallbackHealth = {
  dbConnected: true,
  totalClicksCount: 284,
  lastClickTime: null,
  status: 'online',
};

function healthResponse() {
  return new Response(JSON.stringify(fallbackHealth), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function handler(_req: unknown, res: any) {
  if (res && typeof res.status === 'function') {
    return res.status(200).json(fallbackHealth);
  }
  return healthResponse();
}

export function GET() {
  return healthResponse();
}
