import { PI_APP_ID, handleIncompletePiPayment } from './piAuth';

export const API_BASE = 'https://gasv.store';

export interface PiPaymentProduct {
  id: string;
  title: string;
  piPrice: number;
}

export interface PiPaymentLifecycleOptions {
  onCancel?: (paymentId: string) => void;
  onError?: (error: any) => void;
}

export const isPayingRef = { current: false };
isPayingRef.current = false;

export function clearStoredPaymentIds() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('paymentId');
    localStorage.removeItem('pi_payment_id');
    localStorage.removeItem('last_payment_id');
    sessionStorage.removeItem('paymentId');
    sessionStorage.removeItem('pi_payment_id');
    sessionStorage.removeItem('last_payment_id');
  } catch {}
}

// Clear any stale paymentId immediately when module loads
clearStoredPaymentIds();

function getApiUrl(path: '/api/pi/approve' | '/api/pi/complete'): string {
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

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 20000
): Promise<{ ok: boolean; status: number; data: any; rawText: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const rawText = await res.text().catch(() => '');
    let data: any = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = {};
      }
    }
    return { ok: res.ok, status: res.status, data, rawText };
  } finally {
    clearTimeout(timer);
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

export async function startPiPayment(
  product: PiPaymentProduct,
  onCompleted?: (txid?: string) => void,
  options?: PiPaymentLifecycleOptions
): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).Pi) {
    alert('Pi SDK not loaded - please open https://gasv.store inside Pi Browser, not Chrome');
    return false;
  }

  if (isPayingRef.current) {
    alert('Payment already in progress - close Pi Browser and reopen');
    isPayingRef.current = false;
    return false;
  }

  isPayingRef.current = true;
  const safetyResetTimer = setTimeout(() => {
    isPayingRef.current = false;
  }, 30000);

  clearStoredPaymentIds();

  let errorAlertShown = false;
  const approvedPaymentIds = new Set<string>();

  try {
    console.log('STEP 1 Pi.init');
    await (window as any).Pi.init({ version: '2.0', sandbox: true }); // Testnet - DO NOT CHANGE to false
    console.log('STEP 1 Pi.init - DONE');

    console.log('STEP 2 Pi.authenticate - START');
    const auth = await (window as any).Pi.authenticate(
      ['username', 'payments'],
      handleIncompletePiPayment
    );
    const username = auth?.user?.username || '';
    console.log('STEP 2 Pi.authenticate - DONE', username);

    if (!auth || !auth.accessToken || !username) {
      clearTimeout(safetyResetTimer);
      isPayingRef.current = false;
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

    console.log('STEP 3 Pi.createPayment - START', {
      productId: product.id,
      amount,
      appId: PI_APP_ID,
    });

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
          if (!paymentId) {
            throw new Error('Missing paymentId from Pi SDK');
          }
          if (approvedPaymentIds.has(paymentId)) {
            console.warn('STEP 4 APPROVE - SKIPPED duplicate callback for', paymentId);
            return;
          }
          approvedPaymentIds.add(paymentId);

          const approveUrl = getApiUrl('/api/pi/approve');
          const startedAt = Date.now();
          console.log('STEP 4 APPROVE - START', { paymentId, approveUrl });

          try {
            const { ok, status, data, rawText } = await fetchJsonWithTimeout(
              approveUrl,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({ paymentId }),
              },
              20000
            );

            console.log('STEP 4 APPROVE - DONE', {
              status,
              ms: Date.now() - startedAt,
              data,
            });

            if (!ok) {
              const serverMsg =
                data?.error ||
                data?.message ||
                (rawText ? rawText.slice(0, 140) : '') ||
                `HTTP ${status}`;
              const err: any = new Error(serverMsg);
              err.status = status;
              throw err;
            }
          } catch (e: any) {
            console.error('STEP 4 APPROVE - FAILED', {
              paymentId,
              ms: Date.now() - startedAt,
              name: e?.name,
              status: e?.status,
              message: e?.message || String(e),
            });

            const msg = String(e?.message || e || '');
            const status = e?.status;

            if (!errorAlertShown) {
              errorAlertShown = true;
              if (e?.name === 'AbortError') {
                alert('Approve timed out after 20s waiting for server. Please tap LOCK again.');
              } else if (status === 404 || rStatusIs404OrMismatch(msg)) {
                alert('Key mismatch or expired (404) - close Pi Browser and tap LOCK once for fresh payment');
              } else if (msg.includes('KEY MISMATCH')) {
                alert(msg);
              } else {
                alert(`Approve failed (${status || 'network'}): ${msg || 'Tap LOCK again.'}`);
              }
            }
            throw e;
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const completeUrl = getApiUrl('/api/pi/complete');
          const startedAt = Date.now();
          console.log('STEP 5 COMPLETE - START', { paymentId, txid, completeUrl });

          try {
            const { ok, status, data, rawText } = await fetchJsonWithTimeout(
              completeUrl,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({ paymentId, txid }),
              },
              20000
            );

            console.log('STEP 5 COMPLETE - DONE', {
              status,
              ms: Date.now() - startedAt,
              data,
            });

            if (!ok) {
              const serverMsg =
                data?.error ||
                data?.message ||
                (rawText ? rawText.slice(0, 140) : '') ||
                `HTTP ${status}`;
              throw new Error(serverMsg);
            }

            try {
              localStorage.setItem(`unlocked_${product.id}`, 'true');
              localStorage.setItem(`paid_${product.id}`, 'true');
              localStorage.setItem(`paid_service_${product.id}`, 'true');
              if (product.id === 'sirwise-academy-full' || product.id === 'academy_bundle') {
                localStorage.setItem('sirwise_paid', 'true');
                localStorage.setItem('payment_verified', 'true');
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
          } catch (e: any) {
            console.error('STEP 5 COMPLETE - FAILED', e);
            if (!errorAlertShown) {
              errorAlertShown = true;
              alert(`Payment completion failed: ${e?.message || 'Please contact support with your TxID.'}`);
            }
            throw e;
          } finally {
            clearTimeout(safetyResetTimer);
            clearStoredPaymentIds();
            isPayingRef.current = false;
          }
        },
        onCancel: (paymentId: string) => {
          clearTimeout(safetyResetTimer);
          clearStoredPaymentIds();
          isPayingRef.current = false;
          console.log('Payment cancelled', paymentId);
          if (options?.onCancel) options.onCancel(paymentId);
        },
        onError: (error: any, payment: any) => {
          clearTimeout(safetyResetTimer);
          clearStoredPaymentIds();
          isPayingRef.current = false;
          console.error('Pi payment error', error, payment);
          if (options?.onError) options.onError(error);
          if (errorAlertShown) return;
          errorAlertShown = true;
          const msg = String(error?.message || '');
          if (rStatusIs404OrMismatch(msg)) {
            alert('Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment');
            return;
          }
          alert('Payment error: ' + (msg || 'Please close Pi Browser and tap LOCK once'));
        },
      }
    );

    console.log('STEP 3 Pi.createPayment - HANDOFF OPEN');
    return true;
  } catch (err: any) {
    clearTimeout(safetyResetTimer);
    clearStoredPaymentIds();
    isPayingRef.current = false;
    console.error('Pi payment error:', err);
    if (!errorAlertShown) {
      errorAlertShown = true;
      const msg = String(err?.message || err || '');
      if (rStatusIs404OrMismatch(msg)) {
        alert('Key mismatch or expired - close Pi Browser and tap LOCK once for fresh payment');
      } else if (msg) {
        alert('Payment error: ' + msg);
      } else {
        alert('Payment failed to start - please tap LOCK again');
      }
    }
    if (options?.onError) options.onError(err);
    return false;
  }
}

export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
