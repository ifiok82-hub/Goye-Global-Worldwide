import { isPiEnvironment } from '../lib/piAuth';
import { postPiBackend } from '../lib/piPayment';

export type PaymentEnvironment = 'STANDARD_WEB' | 'PI_BROWSER';

export interface ProductPricing {
  id: string;
  name: string;
  piPrice: number;
}

const PRICING_REGISTRY: Record<string, { piPrice: number }> = {
  'esim-global': { piPrice: 0.5 },
  '1000-prompts': { piPrice: 1 },
  'pi-network': { piPrice: 1.5 },
  'canada-lmia': { piPrice: 2 },
  'uk-care-visa': { piPrice: 3 },
  'ai-starter-tripwire': { piPrice: 1 },
  'ai-starter-tripwire-pass': { piPrice: 1 },
  'sirwise-academy-full': { piPrice: 2 }
};

export function getPaymentEnvironment(): PaymentEnvironment {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'STANDARD_WEB';
  const ua = navigator.userAgent || '';
  const isPiBrowserUA = ua.includes('PiBrowser') || ua.includes('Pi Browser') || ua.includes('Pi/1');
  if (isPiBrowserUA) {
    return 'PI_BROWSER';
  }
  return 'STANDARD_WEB';
}

export function getPiPrice(product: any): number {
  if (!product) return 2;
  if (typeof product.piPrice === 'number') return product.piPrice;
  const entry = PRICING_REGISTRY[product.id];
  if (entry) return entry.piPrice;
  return 2;
}

export function getFiatPrice(product: any): number {
  if (!product) return 2;
  return getPiPrice(product);
}

export function getDisplayPrice(product: any, _env?: PaymentEnvironment): string {
  const piAmt = getPiPrice(product);
  return `${piAmt} Pi`;
}

export function getPaymentMethods(_env?: PaymentEnvironment): string[] {
  return ['PI'];
}

export function getBuyButtonLabel(product: any, _env?: PaymentEnvironment): string {
  const piAmt = getPiPrice(product);
  return `🔒 LOCK - ${piAmt} Pi`;
}

export async function verifyPayment(product: any, txHash: string, method: string, email: string): Promise<boolean> {
  try {
    const verifiedOrder = {
      orderId: txHash,
      productId: product.id,
      productName: product.name,
      amount: getPiPrice(product),
      method: method || 'Pi Network',
      email: email,
      status: 'VERIFIED',
      date: new Date().toISOString()
    };
    const stored = JSON.parse(localStorage.getItem('live_orders') || '[]');
    stored.unshift(verifiedOrder);
    localStorage.setItem('live_orders', JSON.stringify(stored));
    localStorage.setItem(`paid_${product.id}`, 'true');
    return true;
  } catch (e) {
    return false;
  }
}

export async function processPayment(
  product: any,
  _method: string,
  userEmail: string,
  callbacks: {
    onSuccess?: (ref: string) => void;
    onCancel?: () => void;
    onFallback?: (channel: string) => void;
    onOpenDetails?: (channel: string) => void;
  }
) {
  const win = window as any;
  if (!win.Pi || !win.Pi.createPayment || !isPiEnvironment()) {
    alert("Open in Pi Browser to pay with Pi");
    return;
  }
  try {
    await win.Pi.init({ version: '2.0', sandbox: false });
    const piAmount = getPiPrice(product);
    let approvedOnce = false;
    await win.Pi.createPayment({
      amount: piAmount,
      memo: product.name,
      metadata: { productId: product.id, piPrice: piAmount }
    }, {
      onReadyForServerApproval: async (paymentId: string) => {
        if (approvedOnce) return;
        approvedOnce = true;
        console.log('APPROVE fresh paymentId', paymentId);
        await postPiBackend('/api/pi/approve', { paymentId, productId: product.id });
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        approvedOnce = false;
        await postPiBackend('/api/pi/complete', { paymentId, txid, productId: product.id, amount: piAmount });
        await verifyPayment(product, txid, 'Pi Network', userEmail);
        if (callbacks.onSuccess) callbacks.onSuccess(txid);
        alert("🎉 Pi Payment Verified! Access Unlocked.");
        window.location.reload();
      },
      onCancel: (paymentId: string) => {
        approvedOnce = false;
        console.log('Pi payment cancelled:', paymentId);
        if (callbacks.onCancel) callbacks.onCancel();
      },
      onError: (err: any) => {
        approvedOnce = false;
        console.error('Pi payment error:', err);
        const msg = String(err?.message || err);
        if (msg.includes('No payment found') || msg.includes('Payment expired')) {
          localStorage.removeItem('paymentId');
          localStorage.removeItem('pi_payment_id');
          alert('This payment expired. Please close and tap LOCK again for a new payment.');
        }
      }
    });
  } catch (err: any) {
    alert('Pi SDK Error: ' + err.message);
  }
}
