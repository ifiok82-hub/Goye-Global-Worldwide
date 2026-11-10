import React from 'react';
import { toPi } from '../lib/piCurrency';

export interface PiPriceProps {
  naira?: number;
  usd?: number;
  piPrice?: number;
  className?: string;
}

export const PiPrice: React.FC<PiPriceProps> = ({ naira, usd, piPrice, className }) => {
  const amount = toPi(naira, usd, piPrice);
  return (
    <span className={className || 'text-[#FFD700] font-black'}>
      {amount} Pi
    </span>
  );
};

export default PiPrice;
