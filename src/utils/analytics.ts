// Visitor & Click Analytics Tracking Client Helper

export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem('goye_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('goye_session_id', sessionId);
  }
  return sessionId;
}

export async function trackUserClick(target: string, page: string = 'Home', productId: string = ''): Promise<void> {
  const sessionId = getAnonymousSessionId();
  const name = localStorage.getItem('user_name') || localStorage.getItem('customer_name') || '';
  const email = localStorage.getItem('user_email') || localStorage.getItem('customer_email') || '';

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        page,
        target,
        productId,
        customerName: name,
        customerEmail: email,
        referrer: document.referrer || 'Direct'
      })
    });
  } catch (err) {
    console.warn('Silent analytics track warning:', err);
  }
}

export async function identifyUserSession(customerName: string, customerEmail: string): Promise<void> {
  const sessionId = getAnonymousSessionId();
  if (!customerEmail) return;

  try {
    await fetch('/api/analytics/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        customerName,
        customerEmail
      })
    });
  } catch (err) {
    console.warn('Silent analytics identify warning:', err);
  }
}
