import React from 'react';

export interface ProductPriceDisplayProps {
  usdPrice?: number;
  piPrice?: number;
  currency?: string;
}

export function ProductPriceDisplay({ usdPrice = 45, piPrice }: ProductPriceDisplayProps) {
  const displayPi = piPrice ?? (Math.max(1, Math.round((usdPrice / 30) * 2) / 2));

  return (
    <div className="flex flex-col gap-1 my-2">
      <span className="text-2xl font-extrabold text-[#FFD700]">
        {displayPi} Pi
      </span>
      <span className="text-xs text-zinc-400 font-medium">
        Official Pi Network Payment
      </span>
    </div>
  );
}

export default ProductPriceDisplay;
