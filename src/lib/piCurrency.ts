// src/lib/piCurrency.ts - Universal Pi Currency Conversion

export const PI_RATE = 30; // 1 Pi = $30
export const NAIRA_PER_USD = 1500; // ₦1,500 = $1

export function toPi(naira?: number, usd?: number, piPrice?: number): number {
  if (typeof piPrice === 'number' && piPrice > 0) return piPrice;
  if (typeof usd === 'number' && usd > 0) return Math.max(1, Math.ceil(usd / PI_RATE));
  if (typeof naira === 'number' && naira > 0) return Math.max(1, Math.ceil((naira / NAIRA_PER_USD) / PI_RATE));
  return 2;
}

export function convertPriceString(text: string): string | null {
  if (!text) return null;
  // If already expressed in Pi or π, do not convert
  if (/(\bpi\b|π)/i.test(text)) return null;

  // Check for Naira: ₦ or NGN
  const nairaMatch = text.match(/(?:₦|NGN)\s*([0-9,]+(?:\.[0-9]+)?)/i);
  if (nairaMatch) {
    const amount = parseFloat(nairaMatch[1].replace(/,/g, ''));
    if (!isNaN(amount) && amount > 0) {
      return `${toPi(amount)} Pi`;
    }
  }

  // Check for USD: $ or USD
  const usdMatch = text.match(/(?:\$|USD)\s*([0-9,]+(?:\.[0-9]+)?)/i);
  if (usdMatch) {
    const amount = parseFloat(usdMatch[1].replace(/,/g, ''));
    if (!isNaN(amount) && amount > 0) {
      return `${toPi(undefined, amount)} Pi`;
    }
  }

  return null;
}
