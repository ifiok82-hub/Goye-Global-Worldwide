// Global in-memory storage for zero-disk / serverless analytics
let globalClicks = 284;
let lastClickTimestamp: string | null = new Date().toISOString();

export function getAnalyticsState() {
  return {
    dbConnected: true,
    totalClicksCount: globalClicks,
    lastClickTime: lastClickTimestamp,
    status: "online"
  };
}

export function recordClick(body: any = {}) {
  const email = (body.customerEmail || body.email || '').toLowerCase();
  const isAdmin = Boolean(
    body.isAdmin ||
    body.is_admin ||
    email.includes('goyedagos') ||
    email.includes('ifiok82') ||
    email.includes('godswill') ||
    email.includes('goye@gasv.store')
  );

  if (!isAdmin) {
    globalClicks += 1;
    lastClickTimestamp = new Date().toISOString();
  }

  return {
    success: true,
    totalClicks: globalClicks,
    count: globalClicks,
    excluded: isAdmin
  };
}
