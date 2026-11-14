import { isPiEnvironment } from './piAuth';

export const API_BASE = 'https://gasv.store';

export interface PiPaymentProduct {
  id: string;
  title: string;
  piPrice: number;
}

function getBackendUrls(path: string): string[] {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return [path];
  }
  return [`${API_BASE}${path}`, path];
}

export async function postPiBackend(
  path: '/api/pi/approve' | '/api/pi/complete' | '/api/pi/incomplete',
  payload: Record<string, any>
): Promise<any> {
  const urls = getBackendUrls(path);
  let lastError: any = null;

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || data?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      return data;
    } catch (e: any) {
      lastError = e;
      console.error(`${path} fetch failed (${url}):`, e);
    }
  }

  if (path === '/api/pi/approve') {
    console.error('Approve fetch failed', lastError);
    alert('Approve failed - check Vercel Logs: ' + (lastError?.message || String(lastError)));
  } else if (path === '/api/pi/complete') {
    console.error('Complete fetch failed', lastError);
    alert('Complete failed - check Vercel Logs: ' + (lastError?.message || String(lastError)));
  }

  throw lastError || new Error(`Failed request to ${path}`);
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

  try {
    // Force Mainnet (sandbox: false) for all customer payments
    await (window as any).Pi.init({ version: '2.0', sandbox: false });

    const auth = await Promise.race([
      (window as any).Pi.authenticate(['username', 'payments'], async (payment: any) => {
        if (payment && payment.identifier) {
          try {
            await postPiBackend('/api/pi/incomplete', { payment });
          } catch {}
        }
      }),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Pi authentication timed out waiting for Pi Browser host.')), 15000)
      )
    ]);

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
          await postPiBackend('/api/pi/approve', { paymentId });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
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
        },
        onCancel: (paymentId: string) => console.log('Pi cancelled', paymentId),
        onError: (err: any) => {
          console.error(err);
          alert('Pi payment error: ' + (err?.message || String(err)));
        }
      }
    );
    return true;
  } catch (err: any) {
    console.error('Pi payment error:', err);
    alert('Pi payment error: ' + (err?.message || String(err)));
    return false;
  }
}

// src/lib/piPayment.ts - Pi Payment with Server Approval
export async function payWithPi(piPrice: number, productName: string, productId: string): Promise<boolean> {
  return startPiPayment({ id: productId, title: productName, piPrice });
}
