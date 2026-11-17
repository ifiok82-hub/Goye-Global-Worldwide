import { PI_APP_ID, handleIncompletePiPayment, isPiEnvironment } from './piAuth';

export const API_BASE = 'https://gasv.store';

export interface PiPaymentProduct {
  id: string;
  title: string;
  piPrice: number;
}

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

export async function startPiPayment(
  product: PiPaymentProduct,
  onCompleted?: (txid?: string) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  clearStoredPaymentIds();

  console.log('STEP 1 Pi.init');
  if (!(window as any).Pi) {
    alert('Please open inside Pi Browser');
    return false;
  }
  if (!isPiEnvironment()) {
    alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
    return false;
  }

  try {
    await (window as any).Pi.init({ version: '2.0', sandbox: true }); // Testnet - DO NOT CHANGE to false

    console.log('STEP 2 Pi.authenticate - START');
    const auth = await (window as any).Pi.authenticate(
      ['username', 'payments'],
      handleIncompletePiPayment
    );
    const username = auth?.user?.username || '';
    console.log('STEP 2 Pi.authenticate - DONE', username);

    if (!auth || !auth.accessToken || !username) {
      alert('Pi login failed - please tap LOCK again');
      return false;
    }

    try {
      localStorage.setItem('pi_access_token', auth.accessToken);
      localStorage.setItem('pi_username', username);
      localStorage.setItem('pi_username_trusted', username);
      localStorage.setItem('pi_uid_trusted', auth.user?.uid || '');
      sessionStorage.setItem('pi_has_session', '1');
      window.dispatchEvent(new Event('piAuthChanged'));
    } catch {}

    const amount = Number(product.piPrice) > 0 ? Number(product.piPrice) : 1;

    console.log('STEP 3 Pi.createPayment - START');
    await (window as any).Pi.createPayment(
      {
        amount,
        memo: `${product.title} (${amount} Pi)`,
        metadata: {
          productId: product.id,
          piPrice: amount,
          uid: auth.user?.uid || '',
          appId: PI_APP_ID,
        },
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log('STEP 4 APPROVE - START', paymentId);
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          try {
            const r = await fetch(`${API_BASE}/api/pi/approve`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`,
              },
              body: JSON.stringify({ paymentId }),
              signal: controller.signal,
            });
            const data = await r.json().catch(() => ({}));
            console.log('STEP 4 APPROVE - DONE', r.status, data);
            if (!r.ok) {
              throw new Error(data?.error || 'Approve failed');
            }
          } catch (e: any) {
            console.error('APPROVE FAILED', e);
            const msg = String(e?.message || e || '');
            if (rStatusIs404OrMismatch(msg)) {
              alert('Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment');
            } else if (msg.includes('KEY MISMATCH')) {
              alert(msg);
            } else {
              alert('Approve failed - backend did not respond in time. Tap LOCK again.');
            }
            throw e;
          } finally {
            clearTimeout(timer);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log('STEP 5 COMPLETE', paymentId, txid);
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          try {
            const r = await fetch(`${API_BASE}/api/pi/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid }),
              signal: controller.signal,
            });
            const data = await r.json().catch(() => ({}));
            if (!r.ok) {
              throw new Error(data?.error || 'Complete failed');
            }
            try {
              localStorage.setItem(`unlocked_${product.id}`, 'true');
              localStorage.setItem(`paid_${product.id}`, 'true');
              if (product.id === 'sirwise-academy-full' || product.id === 'academy_bundle') {
                localStorage.setItem('sirwise_paid', 'true');
                localStorage.setItem('paid_academy_bundle', 'true');
                window.dispatchEvent(new Event('academyPaidAccess'));
              }
            } catch {}
            alert('✅ Payment Successful! Access unlocked.');
            if (onCompleted) {
              onCompleted(txid);
            } else {
              window.location.reload();
            }
          } finally {
            clearTimeout(timer);
          }
        },
        onCancel: (paymentId: string) => {
          clearStoredPaymentIds();
          console.log('Payment cancelled', paymentId);
        },
        onError: (error: any, payment: any) => {
          clearStoredPaymentIds();
          console.error('Pi payment error', error, payment);
          const msg = String(error?.message || '');
          if (rStatusIs404OrMismatch(msg)) {
            alert('Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment');
            return;
          }
          alert('Payment error: ' + (msg || 'Please close Pi Browser and tap LOCK once'));
        },
      }
    );
    return true;
  } catch (err: any) {
    clearStoredPaymentIds();
    console.error('Pi payment error:', err);
    const msg = String(err?.message || err || '');
    if (rStatusIs404OrMismatch(msg)) {
      alert('Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment');
    } else if (msg && !msg.includes('Approve failed')) {
      alert('Payment error: ' + msg);
    }
    return false;
  }
}

function rStatusIs404OrMismatch(msg: string): boolean {
  const lower = String(msg || '').toLowerCase();
  return (
    lower.includes('404') ||
    lower.includes('payment_not_found') ||
    lower.includes('no payment found') ||
    lower.includes('payment expired') ||
    lower.includes('key mismatch or expired')
  );
}

export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
