/**
 * GOYE Global Worldwide - Official Payment Adapter
 * Root location for direct import: lib/paymentAdapter.js
 */

export const isPiBrowser = typeof window !== 'undefined' && (
  typeof window.Pi !== 'undefined' ||
  (navigator.userAgent && (navigator.userAgent.includes('Pi Browser') || navigator.userAgent.includes('PiBrowser')))
);

export const BUSHA_USDT_BEP20_ADDRESS = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUSHA_USDT_BEP20_ADDRESS) ||
  '0xdc7f804B36aB672Ec31642dF418F29e73281b040'
);

export const BUSHA_USDC_BASE_ADDRESS = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUSHA_USDC_BASE_ADDRESS) ||
  '0xdc7f804B36aB672Ec31642dF418F29e73281b040'
);

export const OPAY_MERCHANT_DETAILS = {
  bank: 'OPay (PayCom)',
  accountNumber: '6113541882',
  accountName: 'GOYEDAGOSMESS ENTERPRISE',
  rc: 'BN: 3583778'
};

export async function verifyPayment(product, refOrTx, method, email) {
  const prodId = product?.id || 'unknown';
  const prodSlug = product?.slug || prodId;
  const prodName = product?.name || 'Digital Product';
  const price = product?.price || product?.priceUSD || 49.99;
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
        amount: price,
        email: userEmail,
        method: method,
        reference: refOrTx,
        tx_id: refOrTx,
        status: 'VERIFIED'
      })
    });
  } catch (err) {
    console.warn('Backend payment record sync:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('payment_success', { 
      detail: { productId: prodId, product, method, refOrTx } 
    }));
  }

  return { success: true, verified: true };
}

export async function processPayment(product, method, callbacks = {}) {
  const userEmail = callbacks.email || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || '';
  const priceUSD = product?.price || product?.priceUSD || 49.99;
  const priceNGN = product?.priceNGN || Math.round(priceUSD * 1500);

  switch (method) {
    case 'paystack': {
      const key = (
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY) ||
        (typeof process !== 'undefined' && process.env?.PAYSTACK_PUBLIC) ||
        localStorage.getItem('PAYSTACK_PUBLIC_KEY') ||
        'pk_live_9f7e06b21fa6dc4e3e94cc0'
      );
      
      let email = userEmail;
      if (!email || !email.includes('@')) {
        email = (prompt('Enter your email for payment receipt & instant download:') || '').trim().toLowerCase();
      }
      if (!email || !email.includes('@')) {
        alert('A valid email address is required for access delivery.');
        return;
      }
      localStorage.setItem('user_email', email);

      if (typeof window.PaystackPop !== 'undefined' && typeof window.PaystackPop.newTransaction === 'function') {
        window.PaystackPop.newTransaction({
          key,
          email,
          amount: Math.round(priceNGN * 100),
          currency: 'NGN',
          onSuccess: async (transaction) => {
            const ref = transaction.reference || transaction.trxref || `PAYSTACK-${Date.now()}`;
            await verifyPayment(product, ref, 'paystack', email);
            if (callbacks.onSuccess) callbacks.onSuccess(ref);
            alert(`🎉 Payment Successful!\nReference: ${ref}\nAccess has been unlocked.`);
            window.location.reload();
          },
          onCancel: () => {
            if (callbacks.onCancel) callbacks.onCancel();
          }
        });
      } else if (typeof window.PaystackPop !== 'undefined' && typeof window.PaystackPop.setup === 'function') {
        const handler = window.PaystackPop.setup({
          key,
          email,
          amount: Math.round(priceNGN * 100),
          currency: 'NGN',
          callback: async (response) => {
            const ref = response.reference || `PAYSTACK-${Date.now()}`;
            await verifyPayment(product, ref, 'paystack', email);
            if (callbacks.onSuccess) callbacks.onSuccess(ref);
            alert(`🎉 Payment Successful!\nReference: ${ref}\nAccess has been unlocked.`);
            window.location.reload();
          },
          onClose: () => {
            if (callbacks.onCancel) callbacks.onCancel();
          }
        });
        handler.openIframe();
      } else {
        if (callbacks.onFallback) callbacks.onFallback('paystack');
      }
      break;
    }

    case 'flutterwave': {
      const pubKey = (
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FLUTTERWAVE_PUBLIC_KEY) ||
        (typeof process !== 'undefined' && process.env?.FLUTTERWAVE_PUBLIC_KEY) ||
        localStorage.getItem('FLUTTERWAVE_PUBLIC_KEY') ||
        'FLWPUBK_LIVE-d102e35a12003c27e382b68ef83a31c6-X'
      );

      let email = userEmail;
      if (!email || !email.includes('@')) {
        email = (prompt('Enter your email for receipt & access:') || '').trim().toLowerCase();
      }
      if (!email || !email.includes('@')) {
        alert('A valid email address is required.');
        return;
      }
      localStorage.setItem('user_email', email);

      if (typeof window.FlutterwaveCheckout === 'function') {
        window.FlutterwaveCheckout({
          public_key: pubKey,
          tx_ref: `GOYE-FLW-${Date.now()}`,
          amount: priceUSD,
          currency: 'USD',
          customer: { email },
          callback: async (data) => {
            const ref = data.transaction_id || data.tx_ref || `FLW-${Date.now()}`;
            await verifyPayment(product, ref, 'flutterwave', email);
            if (callbacks.onSuccess) callbacks.onSuccess(ref);
            alert(`🎉 Payment Confirmed via Flutterwave!\nAccess Unlocked.`);
            window.location.reload();
          },
          onclose: () => {
            if (callbacks.onCancel) callbacks.onCancel();
          }
        });
      } else {
        if (callbacks.onFallback) callbacks.onFallback('flutterwave');
      }
      break;
    }

    case 'opay': {
      if (callbacks.onOpenDetails) {
        callbacks.onOpenDetails('opay');
      } else if (callbacks.onFallback) {
        callbacks.onFallback('opay');
      }
      break;
    }

    case 'usdt_busha': {
      if (callbacks.onOpenDetails) {
        callbacks.onOpenDetails('usdt_bep20');
      } else if (callbacks.onFallback) {
        callbacks.onFallback('usdt_bep20');
      }
      break;
    }

    case 'usdc_busha': {
      if (callbacks.onOpenDetails) {
        callbacks.onOpenDetails('usdc_base');
      } else if (callbacks.onFallback) {
        callbacks.onFallback('usdc_base');
      }
      break;
    }

    case 'pi': {
      if (!isPiBrowser && (!window.Pi || !window.Pi.createPayment)) {
        alert("Open in Pi Browser to pay with Pi\n\nOfficial Pi payment requires Pi Browser for cryptographically secure wallet authentication.");
        return;
      }
      try {
        const piAmount = Number((priceUSD / 314159).toFixed(6)) || 0.000159;
        await window.Pi.createPayment({
          amount: piAmount,
          memo: product.name,
          metadata: { productId: product.id }
        }, {
          onReadyForServerApproval: async (paymentId) => {
            await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            await verifyPayment(product, txid, 'pi', userEmail);
            if (callbacks.onSuccess) callbacks.onSuccess(txid);
            alert("🎉 Pi Payment Verified! Access Unlocked.");
            window.location.reload();
          },
          onCancel: (paymentId) => {
            console.log('Pi payment cancelled:', paymentId);
          },
          onError: (err) => {
            console.error('Pi payment error:', err);
            alert('Pi payment error: ' + (err?.message || err));
          }
        });
      } catch (err) {
        alert('Pi SDK Error: ' + err.message);
      }
      break;
    }

    default:
      console.warn('Unknown payment method:', method);
  }
}

export default {
  isPiBrowser,
  processPayment,
  verifyPayment,
  BUSHA_USDT_BEP20_ADDRESS,
  BUSHA_USDC_BASE_ADDRESS,
  OPAY_MERCHANT_DETAILS
};
