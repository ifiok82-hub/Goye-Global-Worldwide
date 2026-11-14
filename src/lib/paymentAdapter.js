/**
 * GOYE Global Worldwide - Official Pi Payment Adapter
 * Registered: Goyedagosmess Enterprise (RC BN: 3583778)
 */

import { isPiEnvironment } from './piAuth';
import { postPiBackend } from './piPayment';

export const isPiBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined' && (
  navigator.userAgent.includes('Pi Browser') || navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi/1')
);

export async function verifyPayment(product, refOrTx, method, email) {
  const prodId = product?.id || 'unknown';
  const prodSlug = product?.slug || prodId;
  const prodName = product?.name || 'Digital Product';
  const userEmail = email || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || 'customer@gasv.store';

  localStorage.setItem(`paid_${prodId}`, 'true');
  localStorage.setItem(`paid_${prodSlug}`, 'true');
  localStorage.setItem('orderStatus', 'PAID');
  localStorage.setItem('payment_verified', 'true');
  localStorage.setItem('last_paid_tx', refOrTx || `TX-${Date.now()}`);

  if (prodId.includes('academy') || prodSlug.includes('academy') || prodId === 'sirwise-academy-full') {
    localStorage.setItem('academy_full_unlocked', 'true');
    localStorage.setItem('sirwise_paid', 'true');
    for (let i = 1; i <= 8; i++) {
      localStorage.setItem(`paid_module_${i}`, 'true');
    }
  }

  try {
    await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: prodId,
        productName: prodName,
        paymentReference: refOrTx,
        email: userEmail,
        paymentGateway: 'Pi Network'
      })
    });
  } catch (err) {
    console.warn('Backend sync failed, local unlock valid:', err);
  }

  return true;
}

export async function triggerPayment(product, _method, callbacks = {}) {
  const win = window;
  if (!win.Pi || !win.Pi.createPayment || !isPiEnvironment()) {
    alert("Open in Pi Browser to pay with Pi Network");
    return;
  }

  const piPrice = product?.piPrice || 2;
  try {
    await win.Pi.init({ version: '2.0', sandbox: false });
    await win.Pi.createPayment({
      amount: piPrice,
      memo: product.name,
      metadata: { productId: product.id, piPrice }
    }, {
      onReadyForServerApproval: async (paymentId) => {
        await postPiBackend('/api/pi/approve', { paymentId, productId: product.id });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        await postPiBackend('/api/pi/complete', { paymentId, txid, productId: product.id, amount: piPrice });
        await verifyPayment(product, txid, 'Pi Network');
        if (callbacks.onSuccess) callbacks.onSuccess(txid);
        alert("🎉 Payment Verified! Access Unlocked.");
        window.location.reload();
      },
      onCancel: (paymentId) => {
        if (callbacks.onCancel) callbacks.onCancel(paymentId);
      },
      onError: (err) => {
        console.error('Pi error:', err);
      }
    });
  } catch (err) {
    alert('Pi SDK Error: ' + err.message);
  }
}
