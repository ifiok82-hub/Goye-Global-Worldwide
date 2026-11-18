import React, { useState } from 'react';
import { getPiPrice } from '../utils/paymentAdapter';
import { startPiPayment } from '../lib/piPayment';

export default function SimplePayments({
  price,
  product,
  onSuccess,
}: {
  price?: number;
  product?: any;
  onSuccess?: (ref: string, method: string) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const finalPi = getPiPrice(product || { piPrice: price, price });
  const productId = product?.id || 'goye-digital-product';
  const productTitle = product?.name || product?.title || 'Goye Digital Product';

  const handlePay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (processing) return;
    setProcessing(true);
    try {
      await startPiPayment(
        { id: productId, title: productTitle, piPrice: finalPi },
        (txid) => {
          setProcessing(false);
          if (onSuccess) onSuccess(txid || 'PI-' + Date.now(), 'PI');
        },
        {
          onCancel: () => setProcessing(false),
          onError: () => setProcessing(false),
        }
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl p-6 text-white max-w-md mx-auto my-4 space-y-4 shadow-2xl">
      <h3 className="text-xl font-black text-[#FFD700] text-center uppercase tracking-wider">🔒 Pi Network Payment</h3>
      <p className="text-sm text-gray-300 text-center">
        Amount Due: <span className="text-[#FFD700] font-bold">{finalPi} Pi</span>
      </p>

      <button
        type="button"
        disabled={processing}
        style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto', cursor: 'pointer' }}
        onClick={handlePay}
        className="w-full py-4 bg-[#FFD700] text-black font-black rounded-xl hover:bg-yellow-400 uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60"
      >
        <span>🔒</span> {processing ? 'Connecting to Pi...' : `LOCK - ${finalPi} Pi`}
      </button>
      <p className="text-[11px] text-gray-400 text-center">Strictly Pi Network Payment Protocol Active</p>
    </div>
  );
}
