import { isPiCustomerPaymentEnabled } from '../config/payment';

export const GCV_RATE = 314159;

export interface CurrencyInfo {
  symbol: string;
  name: string;
  rate: number;
}

export const FX_RATES: Record<string, CurrencyInfo> = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  NGN: { symbol: '₦', name: 'Naira', rate: 1600 },
  GBP: { symbol: '£', name: 'Pound', rate: 0.78 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  ZAR: { symbol: 'R', name: 'South African Rand', rate: 18.2 }
};

export function formatPriceDisplay(usdPrice: number, curr?: string, mode?: string) {
  const isPiEnabled = isPiCustomerPaymentEnabled();
  const selectedCurr = (curr || (typeof window !== 'undefined' ? localStorage.getItem('goye_currency') : 'USD') || 'USD');
  const effectiveCurr = (!isPiEnabled && selectedCurr === 'PI') ? 'USD' : selectedCurr;
  const selectedMode = mode || (typeof window !== 'undefined' ? localStorage.getItem('goye_curr_mode') : 'fiat') || 'fiat';

  const numericUsd = typeof usdPrice === 'number' && !isNaN(usdPrice) && usdPrice > 0 ? usdPrice : 39.99;
  const piAmount = (numericUsd / GCV_RATE).toFixed(6).replace(/\.?0+$/, '') || '0.000001';
  const currInfo = FX_RATES[effectiveCurr] || { symbol: '$', name: 'US Dollar', rate: 1 };
  
  const fiatVal = numericUsd * currInfo.rate;
  const formattedFiat = effectiveCurr === 'NGN' 
    ? `₦${Math.round(fiatVal).toLocaleString('en-US')}` 
    : `${currInfo.symbol}${fiatVal.toFixed(2)}`;

  const usdStr = `$${numericUsd.toFixed(2)}`;
  const ngnStr = `₦${Math.round(numericUsd * 1600).toLocaleString('en-US')}`;

  if (isPiEnabled && (effectiveCurr === 'PI' || selectedMode === 'pi')) {
    return {
      main: `${piAmount} Pi GCV`,
      sub: `≈ ${usdStr} USD (${formattedFiat})`,
      piAmount,
      formattedFiat,
      usdStr,
      ngnStr
    };
  } else if (effectiveCurr === 'USD') {
    return {
      main: usdStr,
      sub: isPiEnabled ? `≈ ${piAmount} Pi GCV • ${ngnStr}` : `≈ ${ngnStr}`,
      piAmount,
      formattedFiat,
      usdStr,
      ngnStr
    };
  } else if (effectiveCurr === 'NGN') {
    return {
      main: ngnStr,
      sub: isPiEnabled ? `≈ ${usdStr} USD • ${piAmount} Pi GCV` : `≈ ${usdStr} USD`,
      piAmount,
      formattedFiat,
      usdStr,
      ngnStr
    };
  } else {
    return {
      main: `${formattedFiat} ${effectiveCurr}`,
      sub: isPiEnabled ? `≈ ${usdStr} USD • ${piAmount} Pi GCV` : `≈ ${usdStr} USD • ${ngnStr}`,
      piAmount,
      formattedFiat,
      usdStr,
      ngnStr
    };
  }
}
