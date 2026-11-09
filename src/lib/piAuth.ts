// Pi Network Authentication Utility
// Verifies accessToken with Pi Server through backend /api/pi/verify

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
  
  try {
    const onIncompletePayment = (payment: any) => { 
      console.log("Incomplete payment detected:", payment); 
    };

    const auth = await window.Pi.authenticate(['username', 'payments'], onIncompletePayment);
    console.log("Pi Auth Success:", auth.user?.username);

    // CRITICAL: Send token to backend for Pi to detect and verify it with Pi Network Server
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
