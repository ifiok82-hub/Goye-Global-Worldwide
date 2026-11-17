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

  const piHosts = ['minepi.com', 'pinet.com', 'piappengine.com', 'pi.app'];
  try {
    const hostname = window.location.hostname || '';
    if (piHosts.some((host) => hostname.includes(host))) {
      return true;
    }
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
      .then(() => window.Pi.init({ version: '2.0', sandbox: true }))
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

function getIncompleteEndpoint(): string {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || origin === 'https://gasv.store') {
      return '/api/pi/incomplete';
    }
  }
  return 'https://gasv.store/api/pi/incomplete';
}

// STEP 1 - Sign in, in the browser
export async function loginWithPi(): Promise<{ uid: string; username: string } | null> {
  if (inFlightAuthPromise) return inFlightAuthPromise;

  inFlightAuthPromise = (async () => {
    try {
      if (typeof window === 'undefined' || !window.Pi || !isPiEnvironment()) {
        alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
        return null;
      }

      // Ensure Pi.init runs only once cleanly (Testnet sandbox: true)
      await ensurePiInit();

      const onIncompletePayment = async (payment: any) => {
        console.log('Incomplete payment found:', payment);
        if (payment && payment.identifier) {
          try {
            await fetch(getIncompleteEndpoint(), {
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
          alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
          return null;
        }
        throw e;
      }

      if (!auth?.accessToken) return null;

      // STEP 2 - Exchange accessToken with App Studio. One exchange per sign-in.
      const res = await fetch(APP_STUDIO_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken })
      });

      if (!res.ok) {
        console.error('App Studio login failed', await res.text().catch(() => ''));
        if (auth.user?.username) {
          currentUser = { uid: auth.user.uid || '', username: auth.user.username };
          localStorage.setItem('pi_username_trusted', currentUser.username);
          localStorage.setItem('pi_uid_trusted', currentUser.uid || '');
          sessionStorage.setItem('pi_has_session', '1');
          window.dispatchEvent(new Event('piAuthChanged'));
          return currentUser;
        }
        return null;
      }

      const data = await res.json();
      sessionToken = data.sessionToken || null;
      currentUser = data.user || null;

      if (currentUser?.username) {
        localStorage.setItem('pi_username_trusted', currentUser.username);
        localStorage.setItem('pi_uid_trusted', currentUser.uid || '');
        sessionStorage.setItem('pi_has_session', '1');
        window.dispatchEvent(new Event('piAuthChanged'));
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
    window.dispatchEvent(new Event('piAuthChanged'));
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
