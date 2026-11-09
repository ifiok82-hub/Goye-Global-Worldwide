// src/lib/piAuth.ts - V4 - LISTEN for App Studio request + ANSWER
declare global { interface Window { Pi: any; } }

export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (piPrice && piPrice > 0) return piPrice;
  if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
  if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
  return 2;
}

function sendTokenToAppStudio(accessToken: string, username: string) {
  if (!accessToken) return;
  // Send in EVERY format + with event.source reply if needed
  const msgs: any[] = [
    { type: 'PI_AUTH_SUCCESS', accessToken, username },
    { type: 'pi-auth-success', accessToken, username },
    { type: 'PI_AUTH', accessToken, username },
    { type: 'pi-auth', accessToken, username },
    { type: 'APP_STUDIO_AUTH', accessToken, username },
    { type: 'SET_PI_ACCESS_TOKEN', accessToken, username },
    { type: 'pi-app-studio-auth', accessToken, username },
    { type: 'PI_ACCESS_TOKEN', accessToken, username, token: accessToken },
    { type: 'pi-access-token', token: accessToken, username },
  ];
  msgs.forEach(m => {
    try { window.parent.postMessage(m, '*'); } catch(e) {}
    try { window.top?.postMessage(m, '*'); } catch(e) {}
  });
}

// --- LISTENER - THIS IS WHAT WAS MISSING ---
let listenerAdded = false;
export function startAppStudioListener() {
  if (listenerAdded) return;
  listenerAdded = true;
  window.addEventListener('message', (event: any) => {
    const data = event.data;
    if (!data) return;
    const str = JSON.stringify(data).toLowerCase();
    // If App Studio asks for token in ANY wording, answer it
    if (str.includes('token') || str.includes('auth') || str.includes('pi') || str.includes('verify') || str.includes('studio')) {
      const token = localStorage.getItem('pi_accessToken') || '';
      const user = localStorage.getItem('pi_username') || '';
      if (token) {
        // Reply directly to whoever asked
        try { event.source?.postMessage({ type: 'PI_AUTH_SUCCESS', accessToken: token, username: user }, '*'); } catch(e) {}
        sendTokenToAppStudio(token, user);
        console.log('[Pi] Answered App Studio request for token:', user);
      }
    }
  });
  console.log('[Pi] App Studio listener started');
}

export async function loginWithPi(): Promise<any | null> {
  try {
    startAppStudioListener();
    if (typeof window === 'undefined' || !window.Pi) {
      alert('Please open in Pi Browser to sign in with Pi');
      return null;
    }
    window.Pi.init({ version: '2.0', sandbox: false });
    const auth = await window.Pi.authenticate(['username', 'payments'], (p: any) => {});
    if (!auth?.accessToken) return null;
    const uname = auth.user?.username || '';
    localStorage.setItem('pi_accessToken', auth.accessToken);
    if (uname) localStorage.setItem('pi_username', uname);
    // Send immediately + send again every 1 sec for 20 sec
    sendTokenToAppStudio(auth.accessToken, uname);
    let c = 0;
    const iv = setInterval(() => {
      sendTokenToAppStudio(auth.accessToken, uname);
      c++; if (c > 20) clearInterval(iv);
    }, 1000);
    // Verify with backend, then send again
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
  startAppStudioListener();
  if (typeof window === 'undefined') return;
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
