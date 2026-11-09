// src/lib/piAuth.ts - AUTO Pi Converter + AUTO Auth for App Studio
declare global { interface Window { Pi: any; } }

// --- AUTO PI CONVERTER ---
// 1 Pi = $30 for Goye pricing (so Academy is 1-2 Pi, not 0.00008 Pi with GCV)
// If you use GCV $314,159, ₦40,000 becomes 0.00008 Pi - useless. So we use $30 = 1 Pi
export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (piPrice && piPrice > 0) return piPrice;
  if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
  if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
  return 2; // default Academy price
}

function sendToAppStudio(accessToken: string, username: string) {
  const payloads = [
    { type: 'PI_AUTH_SUCCESS', accessToken, username },
    { type: 'pi-auth', accessToken, username },
    { type: 'APP_STUDIO_AUTH', accessToken, username },
    { type: 'PI_AUTH', accessToken, username },
    // This is the one App Studio actually listens for:
    { type: 'pi-auth-success', token: accessToken, username, user: { username } },
  ];
  payloads.forEach(p => {
    try { window.parent.postMessage(p, '*'); } catch(e) {}
    try { window.top?.postMessage(p, '*'); } catch(e) {}
    try { window.postMessage(p, '*'); } catch(e) {}
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

    // 1. Send to App Studio IMMEDIATELY - before backend, so it detects you
    sendToAppStudio(auth.accessToken, auth.user?.username || '');

    // 2. Verify with your backend
    try {
      const res = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken })
      });
      const verified = await res.json();
      if (verified?.username) {
        localStorage.setItem('pi_accessToken', auth.accessToken);
        localStorage.setItem('pi_username', verified.username);
        sendToAppStudio(auth.accessToken, verified.username);
        return verified;
      }
    } catch(e) {}

    // Fallback - even if backend fails, save username from Pi SDK
    const uname = auth.user?.username || '';
    if (uname) {
      localStorage.setItem('pi_accessToken', auth.accessToken);
      localStorage.setItem('pi_username', uname);
      sendToAppStudio(auth.accessToken, uname);
      return { username: uname };
    }
    return null;
  } catch (err) {
    console.error('loginWithPi failed', err);
    return null;
  }
}

// --- AUTO LOGIN on page load inside Pi Browser / App Studio ---
export function autoLoginWithPi() {
  if (typeof window === 'undefined') return;
  // Only auto-run inside Pi Browser or App Studio iframe
  const isPi = !!(window as any).Pi || navigator.userAgent.includes('PiBrowser') || window.self !== window.top;
  if (!isPi) return;
  if (localStorage.getItem('pi_username')) {
    // Already signed in - re-send token to App Studio so it shows your username
    const token = localStorage.getItem('pi_accessToken') || '';
    const user = localStorage.getItem('pi_username') || '';
    if (token) sendToAppStudio(token, user);
    return;
  }
  // Auto try login after 1 second - no button tap needed
  setTimeout(() => { loginWithPi(); }, 1000);
}
