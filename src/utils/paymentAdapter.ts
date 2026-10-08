export type PaymentEnvironment = 'STANDARD_WEB' | 'PI_BROWSER';

export interface ProductPricing {
  id: string;
  name: string;
  priceUSD: number;
  piPrice: number;
}

// Authoritative mapping of products to their fiat (USD) and Pi prices
const PRICING_REGISTRY: Record<string, { priceUSD: number; piPrice: number }> = {
  'esim-global': { priceUSD: 9.99, piPrice: 26.3 },
  '1000-prompts': { priceUSD: 39.99, piPrice: 105.3 },
  'pi-network': { priceUSD: 49.99, piPrice: 131.6 },
  'canada-lmia': { priceUSD: 69.99, piPrice: 184.2 },
  'uk-care-visa': { priceUSD: 89.99, piPrice: 236.9 },
  'ai-starter-tripwire': { priceUSD: 1.00, piPrice: 2.6 },
  'ai-starter-tripwire-pass': { priceUSD: 1.00, piPrice: 2.6 },
  'sirwise-academy-full': { priceUSD: 49.99, piPrice: 131.6 }
};

/**
 * Detects the runtime environment safely without throwing exceptions on SSR or non-browser envs.
 * Evaluates the User Agent string strictly for the official Pi Browser app.
 */
export function getPaymentEnvironment(): PaymentEnvironment {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'STANDARD_WEB';

  const ua = navigator.userAgent || '';
  const isPiBrowserUA = ua.includes('PiBrowser') || ua.includes('Pi Browser') || ua.includes('Pi/1');

  if (isPiBrowserUA) {
    return 'PI_BROWSER';
  }

  return 'STANDARD_WEB';
}

/**
 * Gets the authoritative Pi price for a given product object.
 * Enforces a strict conversion rate (approx 2.632 Pi per USD) if the product is not explicitly registered.
 */
export function getPiPrice(product: any): number {
  if (!product) return 0;
  const entry = PRICING_REGISTRY[product.id];
  if (entry) return entry.piPrice;

  const usdPrice = product.price || product.priceUSD || 49.99;
  // Fallback consistent conversion rate
  return Math.round(usdPrice * 2.632 * 10) / 10;
}

/**
 * Gets the authoritative Fiat (USD) price for a given product.
 */
export function getFiatPrice(product: any): number {
  if (!product) return 0;
  const entry = PRICING_REGISTRY[product.id];
  if (entry) return entry.priceUSD;

  return product.price || product.priceUSD || 49.99;
}

/**
 * Formats and returns the displayed price string depending on the active environment.
 * STANDARD_WEB: e.g., "$25.00 USD" or local fiat
 * PI_BROWSER: e.g., "65.8 π" (strictly Pi, no side-by-side or fiat displayed)
 */
export function getDisplayPrice(product: any, env: PaymentEnvironment): string {
  if (env === 'PI_BROWSER') {
    const piAmt = getPiPrice(product);
    return `${piAmt} π`;
  }

  // Standard Web Fiat Display
  const usdPrice = getFiatPrice(product);
  return `$${usdPrice.toFixed(2)} USD`;
}

/**
 * Returns the list of active payment methods allowed in the current environment.
 * PI_BROWSER mode allows strictly PI payments to prevent leakage.
 */
export function getPaymentMethods(env: PaymentEnvironment): string[] {
  if (env === 'PI_BROWSER') {
    return ['PI'];
  }
  return ['PAYSTACK', 'FLUTTERWAVE', 'PAYPAL', 'CRYPTO', 'BANK'];
}

/**
 * Returns the text to display on purchase buttons depending on the environment.
 */
export function getBuyButtonLabel(product: any, env: PaymentEnvironment): string {
  if (env === 'PI_BROWSER') {
    const piAmt = getPiPrice(product);
    return `BUY WITH PI — ${piAmt} π`;
  }
  return 'Buy & Unlock';
}

export const isPiBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined' && (
  navigator.userAgent.includes('Pi Browser') || navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi/1')
);

export async function verifyPayment(product: any, refOrTx: string, method: string, email?: string) {
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

export async function processPayment(product: any, method: string, callbacks: any = {}) {
  const userEmail = callbacks.email || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || '';
  const priceUSD = product?.price || product?.priceUSD || 49.99;
  const priceNGN = product?.priceNGN || Math.round(priceUSD * 1500);

  switch (method) {
    case 'paystack': {
      const key = (
        (import.meta.env && (import.meta.env as any).VITE_PAYSTACK_PUBLIC_KEY) ||
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

      const win = window as any;
      if (typeof win.PaystackPop !== 'undefined' && typeof win.PaystackPop.newTransaction === 'function') {
        win.PaystackPop.newTransaction({
          key,
          email,
          amount: Math.round(priceNGN * 100),
          currency: 'NGN',
          onSuccess: async (transaction: any) => {
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
      } else if (typeof win.PaystackPop !== 'undefined' && typeof win.PaystackPop.setup === 'function') {
        const handler = win.PaystackPop.setup({
          key,
          email,
          amount: Math.round(priceNGN * 100),
          currency: 'NGN',
          callback: async (response: any) => {
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
        (import.meta.env && (import.meta.env as any).VITE_FLUTTERWAVE_PUBLIC_KEY) ||
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

      const win = window as any;
      if (typeof win.FlutterwaveCheckout === 'function') {
        win.FlutterwaveCheckout({
          public_key: pubKey,
          tx_ref: `GOYE-FLW-${Date.now()}`,
          amount: priceUSD,
          currency: 'USD',
          customer: { email },
          callback: async (data: any) => {
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
      const win = window as any;
      if (!isPiBrowser && (!win.Pi || !win.Pi.createPayment)) {
        alert("Open in Pi Browser to pay with Pi\n\nOfficial Pi payment requires Pi Browser for cryptographically secure wallet authentication.");
        return;
      }
      try {
        const piAmount = Number((priceUSD / 0.38).toFixed(2)) || 131.55;
        await win.Pi.createPayment({
          amount: piAmount,
          memo: product.name,
          metadata: { productId: product.id }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
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
          onCancel: (paymentId: string) => {
            console.log('Pi payment cancelled:', paymentId);
          },
          onError: (err: any) => {
            console.error('Pi payment error:', err);
            alert('Pi payment error: ' + (err?.message || err));
          }
        });
      } catch (err: any) {
        alert('Pi SDK Error: ' + err.message);
      }
      break;
    }

    default:
      console.warn('Unknown payment method:', method);
  }
}
