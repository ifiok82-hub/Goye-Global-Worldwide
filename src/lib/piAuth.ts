// src/lib/piAuth.ts - Pi Network Authentication (Pi Browser + Sandbox aware)
// Docs: https://developers.minepi.com/docs/authenticate-user/Authentication

declare global {
  interface Window {
    Pi?: any;
  }
}

export const PI_APP_ID = 'piappstudio-QVT1FNbDcNvVGzNMN-1f2LWG9MHQ5pUr';
const API_BASE = 'https://gasv.store';

let sessionToken: string | null = null;
let currentUser: { uid: string; username: string } | null = null;
let sessionAuthenticated = false;
let piInitPromise: Promise<void> | null = null;
let inFlightAuthPromise: Promise<{ uid: string; username: string } | null> | null = null;

export function isPiEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (/PiBrowser|Pi Browser|Pi\/1/i.test(ua)) return true;

  // Native Pi WebView bridge check
  if ((window as any).__PI__ || (window as any).ReactNativeWebView) return true;

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
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem('PI_API_KEY');
    localStorage.removeItem('pi_api_key');
    localStorage.removeItem('pi_payment_id');
    localStorage.removeItem('paymentId');
    localStorage.removeItem('last_payment_id');
    sessionStorage.removeItem('pi_payment_id');
    sessionStorage.removeItem('paymentId');
  } catch {}
  if (!window.Pi) return false;
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
    const username = localStorage.getItem('pi_username') || localStorage.getItem('pi_username_trusted');
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

function getPiApiUrl(path: '/api/pi/me' | '/api/pi/incomplete'): string {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'gasv.store' ||
      hostname === 'www.gasv.store' ||
      origin === API_BASE
    ) {
      return path;
    }
  }
  return `${API_BASE}${path}`;
}

export async function handleIncompletePiPayment(payment: any): Promise<void> {
  if (!payment || !payment.identifier) return;
  const url = getPiApiUrl('/api/pi/incomplete');
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment })
    });
  } catch (e) {
    console.error('Error reporting incomplete payment:', e);
  }
}

export async function loginWithPi(options?: { silent?: boolean }): Promise<{ uid: string; username: string } | null> {
  if (inFlightAuthPromise) return inFlightAuthPromise;

  const silent = options?.silent === true;

  inFlightAuthPromise = (async () => {
    try {
      if (typeof window === 'undefined' || !window.Pi || !isPiEnvironment()) {
        if (!silent) {
          alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
        }
        return null;
      }

      await ensurePiInit();

      let auth: any = null;
      try {
        auth = await Promise.race([
          window.Pi.authenticate(['username', 'payments'], handleIncompletePiPayment),
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Pi authentication timed out waiting for Pi Browser host.')), 45000)
          )
        ]);
      } catch (e: any) {
        console.warn('Pi authenticate error:', e);
        if (!silent) {
          const msg = String(e?.message || e);
          if (msg.includes('timed out') || msg.includes('host')) {
            alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
          }
        }
        return null;
      }

      if (!auth?.accessToken && !auth?.user?.username) {
        return null;
      }

      // Verify accessToken against Pi /v2/me via our backend
      let verifiedUser: { uid: string; username: string } | null = null;
      if (auth.accessToken) {
        sessionToken = auth.accessToken;
        try {
          const meRes = await fetch(getPiApiUrl('/api/pi/me'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: auth.accessToken })
          });
          if (meRes.ok) {
            const meData = await meRes.json().catch(() => null);
            if (meData?.user?.username) {
              verifiedUser = {
                uid: meData.user.uid || auth.user?.uid || '',
                username: meData.user.username
              };
            }
          }
        } catch (err) {
          console.warn('Pi /api/pi/me check warning:', err);
        }
      }

      if (!verifiedUser && auth.user?.username) {
        verifiedUser = { uid: auth.user.uid || '', username: auth.user.username };
      }

      if (verifiedUser?.username) {
        currentUser = verifiedUser;
        sessionAuthenticated = true;
        if (auth.accessToken) localStorage.setItem('pi_access_token', auth.accessToken);
        localStorage.setItem('pi_username', verifiedUser.username);
        localStorage.setItem('pi_username_trusted', verifiedUser.username);
        localStorage.setItem('pi_uid_trusted', verifiedUser.uid || '');
        sessionStorage.setItem('pi_has_session', '1');
        window.dispatchEvent(new Event('piAuthChanged'));
      }

      return verifiedUser;
    } catch (err) {
      console.error('loginWithPi failed', err);
      return null;
    } finally {
      inFlightAuthPromise = null;
    }
  })();

  return inFlightAuthPromise;
}

// Reuses authenticated JS session before payment so clicking LOCK never spawns duplicate prompts
export async function ensurePiAuthForPayment(): Promise<{ uid: string; username: string } | null> {
  if (sessionAuthenticated && currentUser?.username) {
    return currentUser;
  }
  return loginWithPi({ silent: false });
}

export function logoutPi() {
  sessionToken = null;
  currentUser = null;
  sessionAuthenticated = false;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pi_access_token');
    localStorage.removeItem('pi_username');
    localStorage.removeItem('pi_username_trusted');
    localStorage.removeItem('pi_uid_trusted');
    sessionStorage.removeItem('pi_has_session');
    window.dispatchEvent(new Event('piAuthChanged'));
  }
}

export function autoLoginWithPi() {
  if (typeof window === 'undefined') return;
  if (!isPiEnvironment()) return;
  if (!window.Pi) return;
  if (sessionAuthenticated) return;
  setTimeout(() => {
    loginWithPi({ silent: true });
  }, 600);
}
