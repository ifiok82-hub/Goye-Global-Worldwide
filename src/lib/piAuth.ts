// src/lib/piAuth.ts - Pi Network Auth via App Studio backend
// Docs: https://developers.minepi.com/docs/authenticate-user/Authentication
declare global { interface Window { Pi: any; } }

const APP_STUDIO_LOGIN = 'https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login';

// sessionToken is kept in memory only - never in localStorage
let sessionToken: string | null = null;
let currentUser: { uid: string; username: string } | null = null;

export function getSessionToken() { return sessionToken; }
export function getCurrentUser() { return currentUser; }
export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (piPrice && piPrice > 0) return piPrice;
  if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
  if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
  return 2;
}

// STEP 1 - Sign in, in the browser
export async function loginWithPi(): Promise<{ uid: string; username: string } | null> {
  try {
    if (typeof window === 'undefined' || !window.Pi) {
      alert('Please open this site in Pi Browser to sign in with Pi');
      return null;
    }
    // Await Pi.init fully, version 2.0, NO sandbox param - detected automatically
    await window.Pi.init({ version: '2.0' });

    // STEP 1 - Only ask for username. Keep accessToken, ignore uid/username beside it.
    const auth = await window.Pi.authenticate(['username'], (payment: any) => {
      console.log('Incomplete payment found', payment);
    });
    if (!auth?.accessToken) return null;

    // STEP 2 - Exchange accessToken with App Studio. One exchange per sign-in.
    // Never call /v2/me yourself. App Studio checks token against Pi Platform.
    const res = await fetch(APP_STUDIO_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: auth.accessToken })
    });
    if (!res.ok) {
      console.error('App Studio login failed', await res.text());
      return null;
    }
    const data = await res.json();
    // STEP 2 result - ONLY this identity is trusted
    // { sessionToken, user: { uid, username } }
    sessionToken = data.sessionToken || null;
    currentUser = data.user || null;

    if (currentUser?.username) {
      // Store ONLY trusted username for display. Never store browser uid/username.
      localStorage.setItem('pi_username_trusted', currentUser.username);
      localStorage.setItem('pi_uid_trusted', currentUser.uid);
      // Keep a flag so refresh can restore display, but sessionToken stays in memory
      sessionStorage.setItem('pi_has_session', '1');
    }
    return currentUser;
  } catch (err) {
    console.error('loginWithPi failed', err);
    return null;
  }
}

export function logoutPi() {
  sessionToken = null;
  currentUser = null;
  localStorage.removeItem('pi_username_trusted');
  localStorage.removeItem('pi_uid_trusted');
  sessionStorage.removeItem('pi_has_session');
}

// STEP 3 - Auto-login on load / in App Studio / Pi Browser
export function autoLoginWithPi() {
  if (typeof window === 'undefined') return;
  const isPi = !!(window as any).Pi || navigator.userAgent.includes('PiBrowser') || window.self !== window.top;
  if (!isPi) return;
  // If we already have trusted username displayed, don't re-auth automatically on every load
  // App Studio verification needs a fresh sign-in, so only auto-auth if no session flag
  if (sessionStorage.getItem('pi_has_session')) return;
  setTimeout(() => { loginWithPi(); }, 800);
}
