// src/lib/piAuth.ts - V3 - Sends token to App Studio until it catches it
declare global { interface Window { Pi: any; } }

export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (piPrice && piPrice > 0) return piPrice;
  if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
  if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
  return 2;
}

// --- THE IMPORTANT PART: Send token to App Studio ---
function sendTokenToAppStudio(accessToken: string, username: string) {
  if (!accessToken) return;
  console.log('[Pi] Sending token to App Studio:', username);

  // All formats App Studio might listen for
  const messages: any[] = [
    { type: 'PI_AUTH_SUCCESS', accessToken, username },
    { type: 'pi-auth-success', accessToken, username },
    { type: 'pi-auth', accessToken, username },
    { type: 'PI_AUTH', accessToken, username },
    { type: 'APP_STUDIO_AUTH', accessToken, username },
    { type: 'pi-auth-success', token: accessToken, username, user: { username } },
    { accessToken, username, type: 'PI_AUTH_SUCCESS' },
  ];

  // Send NOW + every 500ms for 15 seconds, so App Studio cannot miss it
  let count = 0;
  const interval = setInterval(() => {
    messages.forEach(msg => {
      try { window.parent.postMessage(msg, '*'); } catch(e) {}
      try { window.top?.postMessage(msg, '*'); } catch(e) {}
      try { window.postMessage(msg, '*'); } catch(e) {}
    });
    count++;
    if (count > 30) clearInterval(interval);
  }, 500);

  // Also send once immediately
  messages.forEach(msg => {
    try { window.parent.postMessage(msg, '*'); } catch(e) {}
  });
}

export async function loginWithPi(): Promise<any | null> {
  try {
    if (typeof window === 'undefined' || !window.Pi) {
      alert('Please open in Pi Browser to sign in with Pi');
      return null;
    }
    window.Pi.init({ version: '2.0', sandbox: false });
    const auth = await window.Pi.authenticate(['username', 'payments'], (p: any) => {});
    if (!auth?.accessToken) return null;

    const uname = auth.user?.username || '';
    // 1. Save immediately
    localStorage.setItem('pi_accessToken', auth.accessToken);
    if (uname) localStorage.setItem('pi_username', uname);

    // 2. Send to App Studio IMMEDIATELY - before backend
    sendTokenToAppStudio(auth.accessToken, uname);

    // 3. Verify with backend - then send AGAIN with verified username
    try {
      const res = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken })
      });
      const verified = await res.json();
      if (verified?.username) {
        localStorage.setItem('pi_username', verified.username);
        sendTokenToAppStudio(auth.accessToken, verified.username);
        return verified;
      }
    } catch(e) {}

    if (uname) return { username: uname };
    return null;
  } catch (err) {
    console.error('loginWithPi failed', err);
    return null;
  }
}

export function autoLoginWithPi() {
  if (typeof window === 'undefined') return;
  // If we already have a token, re-send it to App Studio on every page load
  const token = localStorage.getItem('pi_accessToken');
  const user = localStorage.getItem('pi_username');
  if (token && user) {
    sendTokenToAppStudio(token, user);
    return;
  }
  const isPi = !!(window as any).Pi || navigator.userAgent.includes('PiBrowser') || window.self !== window.top;
  if (!isPi) return;
  setTimeout(() => { loginWithPi(); }, 1000);
}
