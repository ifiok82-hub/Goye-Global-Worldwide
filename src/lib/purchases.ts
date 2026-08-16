export interface PurchasedProduct {
  productId: string;
  productName: string;
  purchasedAt: string;
  paymentMethod: string;
  txHash?: string;
  amountUsd: number;
  downloadUrl?: string;
  fileFormat?: string;
  unlockedContent?: string;
}

const STORAGE_KEY = 'goye_purchased_digital_products';

export function getPurchasedProducts(): PurchasedProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading purchased products', e);
    return [];
  }
}

export function isProductPurchased(productId: string): boolean {
  if (!productId) return false;
  const purchases = getPurchasedProducts();
  return purchases.some(p => p.productId === productId || productId.includes(p.productId) || p.productId.includes(productId));
}

export function recordPurchase(purchase: PurchasedProduct) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPurchasedProducts();
    if (!existing.some(p => p.productId === purchase.productId)) {
      const updated = [purchase, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('goye_purchases_updated'));
    }
  } catch (e) {
    console.error('Error saving purchase', e);
  }
}
