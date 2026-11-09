// Pi Network Authentication Utility
// Verifies accessToken with Pi Server through backend /api/pi/verify
// and communicates with Pi App Studio parent window via postMessage

declare global {
  interface Window {
    Pi?: any;
  }
}

export async function loginWithPi() {
  if (typeof window === 'undefined' || !window.Pi) {
    alert("Open in Pi Browser to Login with Pi");
    return null;
  }
  
  // Ensure Pi.init is called before authenticate
  try {
    window.Pi.init({ version: "2.0", sandbox: false });
  } catch (initErr) {
    console.warn("Pi init before authenticate note:", initErr);
  }

  try {
    const onIncompletePayment = (payment: any) => { 
      console.log("Incomplete payment detected:", payment); 
    };

    const auth = await window.Pi.authenticate(['username', 'payments'], onIncompletePayment);
    console.log("Pi Auth Success:", auth.user?.username);

    // 1. Send to backend to verify with Pi Server
    try {
      const res = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accessToken: auth.accessToken, 
          username: auth.user?.username 
        })
      });
      const data = await res.json().catch(() => ({}));
      console.log("Pi Auth verification backend response:", data);
    } catch (netErr) {
      console.error("Backend verification network error:", netErr);
    }

    // 2. SEND TO APP STUDIO IFRAME PARENT - REQUIRED FOR PI APP STUDIO VERIFICATION
    try {
      if (typeof window !== 'undefined') {
        // Send to parent window (when loaded inside Pi App Studio verification iframe)
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'PI_AUTH_SUCCESS', accessToken: auth.accessToken, username: auth.user?.username }, '*');
          window.parent.postMessage({ type: 'pi-auth', token: auth.accessToken, username: auth.user?.username }, '*');
          window.parent.postMessage({ type: 'APP_STUDIO_AUTH', accessToken: auth.accessToken }, '*');
        }
        // Also broadcast to current window
        window.postMessage({ type: 'PI_AUTH_SUCCESS', accessToken: auth.accessToken, username: auth.user?.username }, '*');
        window.postMessage({ type: 'pi-auth', token: auth.accessToken, username: auth.user?.username }, '*');
        window.postMessage({ type: 'APP_STUDIO_AUTH', accessToken: auth.accessToken }, '*');
      }
    } catch (msgErr) {
      console.warn("postMessage to App Studio error:", msgErr);
    }

    // 3. Store in localStorage
    if (auth.accessToken) {
      localStorage.setItem('pi_accessToken', auth.accessToken);
    }
    if (auth.user?.username) {
      localStorage.setItem('pi_username', auth.user.username);
    }

    return auth;
  } catch (err: any) {
    console.error("Pi authentication error:", err);
    alert(err?.message || "Pi Authentication failed. Please try again in Pi Browser.");
    return null;
  }
}
