import { isPiEnvironment } from './piAuth';

export const API_BASE = 'https://gasv.store';

// Guard so approve is called ONLY ONCE per payment
const approvingRef = { current: false };

function clearStoredPaymentIds() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('paymentId');
    localStorage.removeItem('pi_payment_id');
    localStorage.removeItem('last_payment_id');
    sessionStorage.removeItem('paymentId');
    sessionStorage.removeItem('pi_payment_id');
  } catch {}
}

export interface PiPaymentProduct {
  id: string;
  title: string;
  piPrice: number;
}

function getBackendUrl(path: string): string {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || origin === API_BASE) {
      return path;
    }
  }
  return `${API_BASE}${path}`;
}

export async function postPiBackend(
  path: '/api/pi/approve' | '/api/pi/complete' | '/api/pi/incomplete',
  payload: Record<string, any>
): Promise<any> {
  const url = getBackendUrl(path);
  let res: Response;

  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkErr: any) {
    // Only fall back to same-origin relative path on genuine network error from cross-origin host
    if (url !== path) {
      try {
        res = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        console.error(`${path} network error`, networkErr);
        if (path === '/api/pi/approve') {
          alert('Approve failed - check Vercel Logs: ' + (networkErr?.message || String(networkErr)));
        }
        throw networkErr;
      }
    } else {
      console.error(`${path} network error`, networkErr);
      if (path === '/api/pi/approve') {
        alert('Approve failed - check Vercel Logs: ' + (networkErr?.message || String(networkErr)));
      }
      throw networkErr;
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error_message || data?.error || data?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    if (path === '/api/pi/approve') {
      console.error('Approve failed:', res.status, data);
      if (msg.includes('No payment found') || msg.includes('Payment expired') || res.status === 404) {
        clearStoredPaymentIds();
        alert('This payment expired. Please close and tap LOCK again for a new payment.');
      } else {
        alert('Approve failed - check Vercel Logs: ' + msg);
      }
    } else if (path === '/api/pi/complete') {
      console.error('Complete failed:', res.status, data);
      alert('Complete failed - check Vercel Logs: ' + msg);
    }
    throw err;
  }

  return data;
}

export async function startPiPayment(
  product: PiPaymentProduct,
  onCompleted?: () => void
): Promise<boolean> {
  console.log('LOCK tapped', product);

  if (typeof window === 'undefined' || !(window as any).Pi || !isPiEnvironment()) {
    alert('Please open https://gasv.store inside Pi Browser app to pay with Pi');
    return false;
  }

  clearStoredPaymentIds();
  approvingRef.current = false;

  try {
    // Mainnet only
    await (window as any).Pi.init({ version: '2.0', sandbox: false });

    const onIncompletePayment = async (payment: any) => {
      if (payment && payment.identifier) {
        try {
          await postPiBackend('/api/pi/incomplete', { payment });
        } catch {}
      }
    };

    let auth: any = null;
    try {
      auth = await Promise.race([
        (window as any).Pi.authenticate(['username', 'payments'], onIncompletePayment),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Pi authentication timed out waiting for Pi Browser host.')), 15000)
        )
      ]);
    } catch (e: any) {
      if (String(e?.message || e).includes('timed out') || String(e?.message || e).includes('host')) {
        alert('Please open this app from Pi Browser > Pi Apps > GOYE Store (goyestoreuwg6251.pinet.com), not from gasv.store directly. Pi payment only works inside Pi App Platform.');
        window.location.href = 'https://goyestoreuwg6251.pinet.com';
        return false;
      }
      throw e;
    }

    if (!auth || !auth.user) {
      alert('Please sign in with Pi first');
      return false;
    }

    await (window as any).Pi.createPayment(
      {
        amount: product.piPrice,
        memo: `${product.title} (${product.piPrice} Pi)`,
        metadata: { productId: product.id, piPrice: product.piPrice }
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          if (approvingRef.current) return;
          approvingRef.current = true;
          console.log('APPROVE fresh paymentId', paymentId);
          await postPiBackend('/api/pi/approve', { paymentId });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          try {
            await postPiBackend('/api/pi/complete', {
              paymentId,
              txid,
              productId: product.id,
              amount: product.piPrice
            });
            localStorage.setItem(`paid_${product.id}`, 'true');
            if (onCompleted) {
              onCompleted();
            } else {
              window.location.reload();
            }
          } finally {
            approvingRef.current = false;
          }
        },
        onCancel: (paymentId: string) => {
          approvingRef.current = false;
          clearStoredPaymentIds();
          console.log('Pi cancelled', paymentId);
        },
        onError: (err: any) => {
          approvingRef.current = false;
          console.error(err);
          const msg = String(err?.message || err);
          if (msg.includes('No payment found') || msg.includes('Payment expired')) {
            clearStoredPaymentIds();
            alert('This payment expired. Please close and tap LOCK again for a new payment.');
            return;
          }
          if (msg.includes('timed out') || msg.includes('host')) {
            alert('Please open this app from Pi Browser > Pi Apps > GOYE Store (goyestoreuwg6251.pinet.com), not from gasv.store directly. Pi payment only works inside Pi App Platform.');
            window.location.href = 'https://goyestoreuwg6251.pinet.com';
            return;
          }
          alert('Pi payment error: ' + msg);
        }
      }
    );
    return true;
  } catch (err: any) {
    approvingRef.current = false;
    console.error('Pi payment error:', err);
    const msg = String(err?.message || err);
    if (msg.includes('No payment found') || msg.includes('Payment expired')) {
      clearStoredPaymentIds();
      alert('This payment expired. Please close and tap LOCK again for a new payment.');
      return false;
    }
    if (msg.includes('timed out') || msg.includes('host')) {
      alert('Please open this app from Pi Browser > Pi Apps > GOYE Store (goyestoreuwg6251.pinet.com), not from gasv.store directly. Pi payment only works inside Pi App Platform.');
      window.location.href = 'https://goyestoreuwg6251.pinet.com';
      return false;
    }
    alert('Pi payment error: ' + msg);
    return false;
  }
}

// src/lib/piPayment.ts - Pi Payment with Server Approval
export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
