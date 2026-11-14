// src/lib/piAuth.ts - Pi Network Auth via App Studio backend
// Docs: https://developers.minepi.com/docs/authenticate-user/Authentication

declare global {
  interface Window {
    Pi?: any;
  }
}

const APP_STUDIO_LOGIN = 'https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login';

// sessionToken is kept in memory only - never in localStorage
let sessionToken: string | null = null;
let currentUser: { uid: string; username: string } | null = null;
let piInitPromise: Promise<void> | null = null;
let inFlightAuthPromise: Promise<{ uid: string; username: string } | null> | null = null;

export function isPiEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (/PiBrowser|Pi Browser|Pi\/1/i.test(ua)) return true;

  try {
    const piHosts = ['minepi.com', 'pinet.com', 'piappengine.com', 'pi.app'];
    const origins = window.location.ancestorOrigins ? Array.from(window.location.ancestorOrigins) : [];
    if (origins.some((origin) => piHosts.some((host) => origin.includes(host)))) {
      return true;
    }
    const ref = document.referrer || '';
    if (piHosts.some((host) => ref.includes(host))) {
      return true;
    }
  } catch {
    // Ignore cross-origin ancestor access errors
  }

  return false;
}

export async function ensurePiInit(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.Pi) return false;
  if (!piInitPromise) {
    piInitPromise = Promise.resolve()
      .then(() => window.Pi.init({ version: '2.0' }))
      .catch((err) => {
        piInitPromise = null;
        throw err;
      });
  }
  await piInitPromise;
  return true;
}

export function getSessionToken() {
  return sessionToken;
}

export function getCurrentUser() {
  if (currentUser) return currentUser;
  if (typeof window !== 'undefined') {
    const username = localStorage.getItem('pi_username_trusted');
    const uid = localStorage.getItem('pi_uid_trusted') || '';
    if (username) return { uid, username };
  }
  return null;
}

export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (piPrice && piPrice > 0) return piPrice;
  if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
  if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
  return 2;
}

// STEP 1 - Sign in, in the browser
export async function loginWithPi(): Promise<{ uid: string; username: string } | null> {
  if (inFlightAuthPromise) return inFlightAuthPromise;

  inFlightAuthPromise = (async () => {
    try {
      if (typeof window === 'undefined' || !window.Pi || !isPiEnvironment()) {
        return null;
      }

      // Ensure Pi.init runs only once cleanly
      await ensurePiInit();

      // STEP 1 - Extend Pi authentication with payments scope for U2A payments (one try only)
      const onIncompletePayment = async (payment: any) => {
        console.log('Incomplete payment found:', payment);
        if (payment && payment.identifier) {
          try {
            await fetch('/api/pi/incomplete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment })
            });
          } catch (e) {
            console.error('Error reporting incomplete payment:', e);
          }
        }
      };

      let auth: any = null;
      try {
        auth = await Promise.race([
          window.Pi.authenticate(['username', 'payments'], onIncompletePayment),
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Pi authentication timed out waiting for Pi Browser host.')), 15000)
          )
        ]);
      } catch (e: any) {
        if (String(e?.message || e).includes('timed out') || String(e?.message || e).includes('host')) {
          alert('Please open this app from Pi Browser > Pi Apps > GOYE Store (goyestoreuwg6251.pinet.com), not from gasv.store directly. Pi payment only works inside Pi App Platform.');
          window.location.href = 'https://goyestoreuwg6251.pinet.com';
          return null;
        }
        throw e;
      }

      if (!auth?.accessToken) return null;

      // STEP 2 - Exchange accessToken with App Studio. One exchange per sign-in.
      // Never call /v2/me yourself. App Studio checks token against Pi Platform.
      const res = await fetch(APP_STUDIO_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken })
      });

      if (!res.ok) {
        console.error('App Studio login failed', await res.text().catch(() => ''));
        if (auth.user?.username) {
          return { uid: auth.user.uid || '', username: auth.user.username };
        }
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
        localStorage.setItem('pi_uid_trusted', currentUser.uid || '');
        // Keep a flag so refresh can restore display, but sessionToken stays in memory
        sessionStorage.setItem('pi_has_session', '1');
      }

      return currentUser;
    } catch (err) {
      console.error('loginWithPi failed', err);
      return null;
    } finally {
      inFlightAuthPromise = null;
    }
  })();

  return inFlightAuthPromise;
}

export function logoutPi() {
  sessionToken = null;
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pi_username_trusted');
    localStorage.removeItem('pi_uid_trusted');
    sessionStorage.removeItem('pi_has_session');
  }
}

// STEP 3 - Auto-login on load ONLY inside real Pi Browser / Pi App Studio host
export function autoLoginWithPi() {
  if (typeof window === 'undefined') return;
  if (!isPiEnvironment()) return;
  if (!window.Pi) return;
  if (sessionStorage.getItem('pi_has_session')) return;
  setTimeout(() => {
    loginWithPi();
  }, 800);
}
