import {
  PI_APP_ID,
  ensurePiInit,
  ensurePiAuthForPayment,
  handleIncompletePiPayment,
  isPiEnvironment
} from './piAuth';

export const API_BASE = 'https://gasv.store';

// Guard so approve is called ONLY ONCE per payment
const approvingRef = { current: false };
const EXPIRED_OR_MISMATCH_MSG = 'Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment';

export function clearStoredPaymentIds() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('paymentId');
    localStorage.removeItem('pi_payment_id');
    localStorage.removeItem('last_payment_id');
    sessionStorage.removeItem('paymentId');
    sessionStorage.removeItem('pi_payment_id');
  } catch {}
}

// Clear any stale paymentId immediately when module loads
clearStoredPaymentIds();

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

function isNotFoundOrExpiredMessage(msg: string, status?: number): boolean {
  const lower = String(msg || '').toLowerCase();
  return (
    status === 404 ||
    lower.includes('404') ||
    lower.includes('payment_not_found') ||
    lower.includes('no payment found') ||
    lower.includes('payment expired') ||
    lower.includes('key mismatch or expired')
  );
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
        throw networkErr;
      }
    } else {
      console.error(`${path} network error`, networkErr);
      throw networkErr;
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const rawMsg = data?.error_message || data?.error || data?.message || `HTTP ${res.status}`;
    if (path === '/api/pi/approve') {
      console.error('Approve failed:', res.status, data);
      if (isNotFoundOrExpiredMessage(rawMsg, res.status)) {
        clearStoredPaymentIds();
        const err: any = new Error(EXPIRED_OR_MISMATCH_MSG);
        err.status = 404;
        throw err;
      }
    } else if (path === '/api/pi/complete') {
      console.error('Complete failed:', res.status, data);
    }
    const err: any = new Error(rawMsg);
    err.status = res.status;
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
  let errorAlertShown = false;

  const showPaymentErrorOnce = (err: any) => {
    if (errorAlertShown) return;
    errorAlertShown = true;
    const msg = String(err?.message || err || '');
    if (isNotFoundOrExpiredMessage(msg, err?.status)) {
      clearStoredPaymentIds();
      alert(EXPIRED_OR_MISMATCH_MSG);
      return;
    }
    if (msg.includes('KEY MISMATCH')) {
      alert(msg);
      return;
    }
    if (msg.includes('timed out') || msg.includes('host')) {
      alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
      return;
    }
    alert('Pi payment error: ' + msg);
  };

  try {
    await ensurePiInit();
    await (window as any).Pi.init({ version: '2.0', sandbox: true });

    const authUser = await ensurePiAuthForPayment();
    if (!authUser || !authUser.username) {
      alert('Please sign in with Pi first inside Pi Browser.');
      return false;
    }

    void handleIncompletePiPayment;

    const amount = Number(product.piPrice) > 0 ? Number(product.piPrice) : 1;

    await (window as any).Pi.createPayment(
      {
        amount,
        memo: `${product.title} (${amount} Pi)`,
        metadata: { productId: product.id, piPrice: amount, uid: authUser.uid, appId: PI_APP_ID }
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          if (approvingRef.current) return;
          approvingRef.current = true;
          console.log('APPROVE fresh paymentId', paymentId);
          try {
            await postPiBackend('/api/pi/approve', { paymentId });
          } catch (err: any) {
            approvingRef.current = false;
            showPaymentErrorOnce(err);
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
          } catch (err: any) {
            showPaymentErrorOnce(err);
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
          clearStoredPaymentIds();
          console.error('Pi SDK onError:', err);
          showPaymentErrorOnce(err);
        }
      }
    );
    return true;
  } catch (err: any) {
    approvingRef.current = false;
    clearStoredPaymentIds();
    console.error('Pi payment error:', err);
    showPaymentErrorOnce(err);
    return false;
  }
}

export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
