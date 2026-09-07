import React from 'react';

export interface ProductPriceDisplayProps {
  usdPrice: number;
  currency?: string;
}

export function ProductPriceDisplay({ usdPrice, currency = 'PI' }: ProductPriceDisplayProps) {
  const GCV_RATE = 314159; // 1 Pi = $314,159
  const NGN_RATE = 1600;   // 1 USD = ₦1,600

  const calculatePrice = () => {
    switch (currency) {
      case 'PI': {
        const piVal = (usdPrice / GCV_RATE).toFixed(6);
        return { primary: `${piVal} Pi GCV`, secondary: `≈ $${usdPrice} USD` };
      }
      case 'NGN': {
        const ngnVal = (usdPrice * NGN_RATE).toLocaleString();
        return { primary: `₦${ngnVal}`, secondary: `≈ ${(usdPrice / GCV_RATE).toFixed(6)} Pi` };
      }
      case 'CAD': {
        return { primary: `C$${(usdPrice * 1.38).toFixed(2)}`, secondary: `≈ $${usdPrice} USD` };
      }
      case 'GBP': {
        return { primary: `£${(usdPrice * 0.78).toFixed(2)}`, secondary: `≈ $${usdPrice} USD` };
      }
      case 'EUR': {
        return { primary: `€${(usdPrice * 0.92).toFixed(2)}`, secondary: `≈ $${usdPrice} USD` };
      }
      case 'USD':
      default: {
        return { primary: `$${usdPrice}`, secondary: `≈ ${(usdPrice / GCV_RATE).toFixed(6)} Pi GCV` };
      }
    }
  };

  const price = calculatePrice();

  return (
    <div className="flex flex-col gap-1 my-2">
      <span className="text-2xl font-extrabold text-emerald-400">
        {price.primary}
      </span>
      <span className="text-xs text-zinc-400 font-medium">
        {price.secondary}
      </span>
    </div>
  );
}

export default ProductPriceDisplay;
