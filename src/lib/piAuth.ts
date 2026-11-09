// src/lib/piAuth.ts
declare global {
  interface Window {
    Pi: any;
  }
}

function postToParent(data: any) {
  try {
    window.parent.postMessage(data, '*');
    window.top?.postMessage(data, '*');
  } catch (e) {}
}

export async function loginWithPi(): Promise<any | null> {
  try {
    if (typeof window === 'undefined' || !window.Pi) {
      alert('Please open this site in Pi Browser to pay with Pi');
      window.open('https://minepi.com', '_blank');
      return null;
    }

    // Init Pi SDK - MUST be mainnet, not sandbox
    window.Pi.init({ version: '2.0', sandbox: false });

    // 1. Authenticate
    const auth = await window.Pi.authenticate(['username', 'payments'], (payment: any) => {
      console.log('Incomplete payment', payment);
    });

    if (!auth || !auth.accessToken) return null;

    // 2. Verify with YOUR backend -> backend calls api.minepi.com/v2/me
    const res = await fetch('/api/pi/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: auth.accessToken })
    });

    const verified = await res.json();
    if (!verified || !verified.username) {
      console.error('Pi verify failed', verified);
      return null;
    }

    // 3. Save + Tell App Studio
    localStorage.setItem('pi_accessToken', auth.accessToken);
    localStorage.setItem('pi_username', verified.username);

    const msg = { type: 'PI_AUTH_SUCCESS', username: verified.username, accessToken: auth.accessToken };
    postToParent(msg);
    postToParent({ type: 'pi-auth', ...msg });
    postToParent({ type: 'APP_STUDIO_AUTH', ...msg });

    return verified;
  } catch (err) {
    console.error('loginWithPi failed', err);
    return null;
  }
}
