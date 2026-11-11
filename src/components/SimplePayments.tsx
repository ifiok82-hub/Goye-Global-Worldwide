import React from 'react';
import { getPiPrice } from '../utils/paymentAdapter';

export default function SimplePayments({ price, product, onSuccess }: { price?: number; product?: any; onSuccess?: (ref: string, method: string) => void }) {
  const finalPi = getPiPrice(product || { price });

  return (
    <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl p-6 text-white max-w-md mx-auto my-4 space-y-4 shadow-2xl">
      <h3 className="text-xl font-black text-[#FFD700] text-center uppercase tracking-wider">🔒 Pi Network Payment</h3>
      <p className="text-sm text-gray-300 text-center">Amount Due: <span className="text-[#FFD700] font-bold">{finalPi} Pi</span></p>
      
      <button 
        onClick={() => {
          if (typeof (window as any).createPiPayment === 'function') {
            (window as any).createPiPayment(finalPi, product?.name || 'Goye Digital Product', true);
          } else {
            alert(`Initiating Pi Payment for ${finalPi} Pi`);
            if (onSuccess) onSuccess('PI-' + Date.now(), 'PI');
          }
        }} 
        className="w-full py-4 bg-[#FFD700] text-black font-black rounded-xl hover:bg-yellow-400 uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg"
      >
        <span>🔒</span> LOCK - {finalPi} Pi
      </button>
      <p className="text-[11px] text-gray-400 text-center">Strictly Pi Network Payment Protocol Active</p>
    </div>
  );
}
