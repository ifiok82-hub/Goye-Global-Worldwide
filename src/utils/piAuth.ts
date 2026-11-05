/**
 * Pi Network Authentication Client Module
 * Reference: https://pi-apps.github.io/pi-sdk-docs/quick-start/genai/Authentication
 */

declare global {
  interface Window {
    Pi?: any;
  }
}

export interface PiUser {
  uid: string;
  username: string;
  role?: string;
  accessToken?: string;
}

export interface PiAuthResponse {
  success: boolean;
  user?: PiUser;
  sessionToken?: string;
  error?: string;
}

/**
 * Ensures the Pi SDK is loaded and initialized.
 * Awaits Pi.init({ version: "2.0" }) fully before continuing.
 * Does not pass sandbox parameter (auto-detected now by Pi SDK).
 */
export async function initializePiSDK(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // If Pi object is not yet loaded, wait up to 3 seconds for script
  if (!window.Pi) {
    let waited = 0;
    while (!window.Pi && waited < 3000) {
      await new Promise((r) => setTimeout(r, 100));
      waited += 100;
    }
  }

  if (!window.Pi) {
    console.warn('Pi SDK not detected on window.');
    return false;
  }

  try {
    // Await Pi.init fully before calling Pi.authenticate
    await window.Pi.init({ version: "2.0" });
    return true;
  } catch (err) {
    console.warn('Pi.init error (may have already initialized):', err);
    return true;
  }
}

/**
 * Handle incomplete payments callback as required by Pi SDK.
 */
function onIncompletePaymentFound(payment: any) {
  console.log('Pi SDK onIncompletePaymentFound callback received:', payment);
  // Can be forwarded to server payment completion endpoint if present
}

/**
 * STEP 1 & STEP 2: Authenticate user in Pi Browser and exchange accessToken with backend.
 */
export async function signInWithPi(onProgress?: (status: string) => void): Promise<PiAuthResponse> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Cannot authenticate in SSR environment' };
  }

  try {
    if (onProgress) onProgress('Initializing Pi Network SDK...');
    const ready = await initializePiSDK();
    if (!ready || !window.Pi) {
      return { 
        success: false, 
        error: 'Pi Network SDK is not available. Please open inside the official Pi Browser.' 
      };
    }

    if (onProgress) onProgress('Requesting Pi Pioneer authorization...');
    
    // STEP 1 - Sign user in via Pi.authenticate
    const scopes = ['username'];
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

    if (!authResult || !authResult.accessToken) {
      return { 
        success: false, 
        error: 'Pi authentication did not return a valid access token.' 
      };
    }

    const { accessToken } = authResult;
    // Log safe diagnostic information without exposing accessToken
    console.log('🔑 Obtained Pi accessToken from Pi.authenticate()');

    // STEP 2 - Send the accessToken to server to perform App Studio token exchange
    if (onProgress) onProgress('Exchanging credential with App Studio...');
    const response = await fetch('/api/auth/pi-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Authentication failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.user?.uid || !data.user?.username) {
      throw new Error(data.error || 'Invalid or incomplete identity received from App Studio.');
    }

    const sessionToken = data.sessionToken;
    const authenticatedUser: PiUser = {
      uid: data.user.uid,
      username: data.user.username,
      role: 'user',
      accessToken,
    };

    // Store session token and authenticated Pioneer identity in localStorage
    localStorage.setItem('pi_session_token', sessionToken);
    localStorage.setItem('pi_username', authenticatedUser.username);
    localStorage.setItem('user_email', `${authenticatedUser.username.toLowerCase()}@pi.network`);
    localStorage.setItem('customer_email', `${authenticatedUser.username.toLowerCase()}@pi.network`);

    if (onProgress) onProgress('Authentication successful!');
    return {
      success: true,
      user: authenticatedUser,
      sessionToken,
    };
  } catch (err: any) {
    console.error('signInWithPi error:', err?.message || err);
    return {
      success: false,
      error: err.message || 'Pi sign-in could not be completed',
    };
  }
}

/**
 * Checks whether user currently has an authenticated Pi session.
 */
export function getSavedPiSession(): { username: string; sessionToken: string } | null {
  if (typeof window === 'undefined') return null;
  const sessionToken = localStorage.getItem('pi_session_token');
  const username = localStorage.getItem('pi_username');
  if (sessionToken && username) {
    return { username, sessionToken };
  }
  return null;
}
