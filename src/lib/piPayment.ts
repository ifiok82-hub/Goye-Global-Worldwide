import { ensurePiInit, isPiEnvironment } from './piAuth';

export interface PiPaymentProduct {
  id: string;
  title: string;
  piPrice: number;
}

export async function startPiPayment(
  product: PiPaymentProduct,
  onCompleted?: () => void
): Promise<boolean> {
  console.log('LOCK tapped', product);
  alert('LOCK tapped - opening Pi payment...');

  if (typeof window === 'undefined' || !(window as any).Pi || !isPiEnvironment()) {
    alert('Please open https://gasv.store inside Pi Browser app to pay with Pi');
    return false;
  }

  try {
    await ensurePiInit();
    const auth = await Promise.race([
      (window as any).Pi.authenticate(['username', 'payments'], async (payment: any) => {
        if (payment && payment.identifier) {
          try {
            await fetch('/api/pi/incomplete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment })
            });
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
        onReadyForServerApproval: (paymentId: string) =>
          fetch('/api/pi/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          }),
        onReadyForServerCompletion: (paymentId: string, txid: string) =>
          fetch('/api/pi/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, productId: product.id, amount: product.piPrice })
          }).then((res) => {
            if (res.ok) {
              localStorage.setItem(`paid_${product.id}`, 'true');
              if (onCompleted) {
                onCompleted();
              } else {
                window.location.reload();
              }
            }
          }),
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
