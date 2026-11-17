import { startPiPayment } from '../lib/piPayment';

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
  'uk-care-pathway': { piPrice: 3 },
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
      productName: product.name || product.title,
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
  } catch {
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
  const piAmount = getPiPrice(product);
  await startPiPayment(
    {
      id: product.id,
      title: product.title || product.name || 'GOYE Digital Access',
      piPrice: piAmount
    },
    async (txid?: string) => {
      const ref = txid || 'PI-' + Date.now();
      await verifyPayment(product, ref, 'Pi Network', userEmail);
      if (callbacks.onSuccess) callbacks.onSuccess(ref);
      alert('🎉 Pi Payment Verified! Access Granted.');
      window.location.reload();
    }
  );
}
