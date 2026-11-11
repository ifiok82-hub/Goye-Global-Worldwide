import { isPiCustomerPaymentEnabled } from '../config/payment';

export const GCV_RATE = 314159;
export const PI_RATE = 30;

export interface CurrencyInfo {
  symbol: string;
  name: string;
  rate: number;
}

export const FX_RATES: Record<string, CurrencyInfo> = {
  PI: { symbol: 'Pi', name: 'Pi Network', rate: 1 },
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  NGN: { symbol: 'Pi', name: 'Pi Network', rate: 1 },
  GBP: { symbol: '£', name: 'Pound', rate: 0.78 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  ZAR: { symbol: 'R', name: 'South African Rand', rate: 18.2 }
};

export function formatPriceDisplay(usdPrice: number, _curr?: string, _mode?: string) {
  const isPiEnabled = isPiCustomerPaymentEnabled();
  const numericUsd = typeof usdPrice === 'number' && !isNaN(usdPrice) && usdPrice > 0 ? usdPrice : 30;
  const piAmount = Math.max(0.5, Math.round((numericUsd / PI_RATE) * 2) / 2).toString();
  const usdStr = `${piAmount} Pi`;
  const ngnStr = `${piAmount} Pi`;
  const formattedFiat = `${piAmount} Pi`;

  return {
    main: `${piAmount} Pi`,
    sub: isPiEnabled ? `${piAmount} Pi` : `${piAmount} Pi`,
    piAmount,
    formattedFiat,
    usdStr,
    ngnStr
  };
}
