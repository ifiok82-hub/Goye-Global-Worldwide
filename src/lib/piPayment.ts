import {
  ensurePiInit,
  ensurePiAuthForPayment,
  handleIncompletePiPayment,
  isPiEnvironment
} from './piAuth';

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
          alert('Approve network error: ' + (networkErr?.message || String(networkErr)));
        }
        throw networkErr;
      }
    } else {
      console.error(`${path} network error`, networkErr);
      if (path === '/api/pi/approve') {
        alert('Approve network error: ' + (networkErr?.message || String(networkErr)));
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
      if (res.status === 404 || msg.includes('No payment found') || msg.includes('Payment expired')) {
        clearStoredPaymentIds();
        alert('This payment expired or app key mismatch occurred. Please tap LOCK again or check PI_API_KEY in Vercel.');
      } else {
        alert('Approve failed: ' + msg);
      }
    } else if (path === '/api/pi/complete') {
      console.error('Complete failed:', res.status, data);
      alert('Complete failed: ' + msg);
    }
    throw err;
  }

  return data;
}

export async function startPiPayment(
  product: PiPaymentProduct,
  onCompleted?: (txid?: string) => void
): Promise<boolean> {
  console.log('LOCK tapped', product);

  if (typeof window === 'undefined' || !(window as any).Pi || !isPiEnvironment()) {
    alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
    return false;
  }

  clearStoredPaymentIds();
  approvingRef.current = false;

  try {
    await ensurePiInit();

    const authUser = await ensurePiAuthForPayment();
    if (!authUser || !authUser.username) {
      alert('Please sign in with Pi first inside Pi Browser.');
      return false;
    }

    // Ensure Pi SDK has incomplete callback primed if user restarted app mid-payment
    void handleIncompletePiPayment;

    const amount = Number(product.piPrice) > 0 ? Number(product.piPrice) : 1;

    await (window as any).Pi.createPayment(
      {
        amount,
        memo: `${product.title} (${amount} Pi)`,
        metadata: { productId: product.id, piPrice: amount, uid: authUser.uid }
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          if (approvingRef.current) return;
          approvingRef.current = true;
          console.log('APPROVE fresh paymentId', paymentId);
          try {
            await postPiBackend('/api/pi/approve', { paymentId });
          } catch (err) {
            approvingRef.current = false;
            throw err;
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          try {
            await postPiBackend('/api/pi/complete', {
              paymentId,
              txid,
              productId: product.id,
              amount
            });
            localStorage.setItem(`paid_${product.id}`, 'true');
            if (product.id === 'sirwise-academy-full' || product.id === 'academy_bundle') {
              localStorage.setItem('sirwise_paid', 'true');
              localStorage.setItem('paid_academy_bundle', 'true');
              window.dispatchEvent(new Event('academyPaidAccess'));
            }
            if (onCompleted) {
              onCompleted(txid);
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
          console.error('Pi SDK onError:', err);
          const msg = String(err?.message || err);
          if (msg.includes('No payment found') || msg.includes('Payment expired')) {
            clearStoredPaymentIds();
            alert('This payment expired. Please tap LOCK again for a new payment.');
            return;
          }
          if (msg.includes('timed out') || msg.includes('host')) {
            alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
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
      alert('This payment expired. Please tap LOCK again for a new payment.');
      return false;
    }
    if (msg.includes('timed out') || msg.includes('host')) {
      alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
      return false;
    }
    alert('Pi payment error: ' + msg);
    return false;
  }
}

export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
