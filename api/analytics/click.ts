let totalClicks = 0;
let lastClickTime: string | null = null;

function isAdmin(body: Record<string, unknown>) {
  const email = String(body.customerEmail || body.email || '').toLowerCase();
  return Boolean(
    body.isAdmin ||
    body.is_admin ||
    email.includes('goyedagos') ||
    email.includes('ifiok82') ||
    email.includes('godswill') ||
    email === 'goye@gasv.store'
  );
}

function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getResult() {
  return { success: true, totalClicks, count: totalClicks, clicks: [] };
}

async function parseBody(req: Request) {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default async function handler(req: any, res: any) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (req.method === 'POST') {
    const result = recordClick(body);
    return res && typeof res.status === 'function' ? res.status(200).json(result) : json(result);
  }
  const result = getResult();
  return res && typeof res.status === 'function' ? res.status(200).json(result) : json(result);
}

function recordClick(body: Record<string, unknown>) {
  const excluded = isAdmin(body);
  if (!excluded) {
    totalClicks += 1;
    lastClickTime = new Date().toISOString();
  }
  return { success: true, totalClicks, count: totalClicks, excluded };
}

export function GET() {
  return json(getResult());
}

export async function POST(req: Request) {
  return json(recordClick(await parseBody(req)));
}
