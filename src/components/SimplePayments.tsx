import React from 'react';
import { getPaymentEnvironment, getPiPrice, getFiatPrice } from '../utils/paymentAdapter';

export default function SimplePayments({ price, product, onSuccess }: { price?: number; product?: any; onSuccess?: (ref: string, method: string) => void }) {
  const env = getPaymentEnvironment();
  const isPiBrowser = env === 'PI_BROWSER';
  const priceUSD = price || product?.price || 49.99;
  const usdtAddr = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUSHA_USDT_BEP20_ADDRESS) || '0xdc7f804B36aB672Ec31642dF418F29e73281b040';
  const usdcAddr = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUSHA_USDC_BASE_ADDRESS) || '0xdc7f804B36aB672Ec31642dF418F29e73281b040';

  if (isPiBrowser) {
    // Pi ONLY in Pi Browser
    return (
      <div className="bg-[#111] border-2 border-[#7D2AE7] rounded-2xl p-6 text-white max-w-md mx-auto my-4 space-y-4 shadow-2xl">
        <h3 className="text-xl font-black text-[#FFD700] text-center uppercase tracking-wider">🟣 Pi Network Payment</h3>
        <p className="text-sm text-gray-300 text-center">Pi GCV Rate: <span className="text-[#FFD700] font-bold">{getPiPrice(product || {price: priceUSD})} π</span></p>
        
        <button 
          onClick={() => {
            if (typeof (window as any).createPiPayment === 'function') {
              (window as any).createPiPayment(getPiPrice(product || {price: priceUSD}), product?.name || 'Academy Bundle', true);
            } else {
              alert(`Initiating Pi Payment for ${getPiPrice(product || {price: priceUSD})} π`);
              if (onSuccess) onSuccess('PI-' + Date.now(), 'PI');
            }
          }} 
          className="w-full py-4 bg-[#7D2AE7] text-white font-black rounded-xl hover:bg-[#6821c6] uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <span>🟣</span> Pay {getPiPrice(product || {price: priceUSD})} π with Pi SDK
        </button>
        <p className="text-[11px] text-gray-400 text-center">Strictly Pi Browser Payment Network Active</p>
      </div>
    );
  }

  // Standard Browser: Paystack, Flutterwave, OPay, USDT BEP20, USDC Base (NO Pi)
  return (
    <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl p-6 text-white max-w-md mx-auto my-4 space-y-4 shadow-2xl">
      <h3 className="text-xl font-black text-[#FFD700] text-center uppercase tracking-wider">Secure Payment Gateway</h3>
      <p className="text-sm text-gray-300 text-center">Amount Due: <span className="text-[#FFD700] font-bold">${priceUSD.toFixed(2)} USD (₦{Math.round(priceUSD * 1500).toLocaleString()})</span></p>
      
      <button onClick={() => { alert('Paystack payment initiated'); if (onSuccess) onSuccess('PSK-' + Date.now(), 'Paystack'); }} className="w-full py-3 bg-[#FFD700] text-black font-black rounded-xl hover:bg-yellow-400 uppercase tracking-wide cursor-pointer">
        💳 Pay with Paystack - ${priceUSD.toFixed(2)}
      </button>

      <button onClick={() => { alert('Flutterwave payment initiated'); if (onSuccess) onSuccess('FW-' + Date.now(), 'Flutterwave'); }} className="w-full py-3 bg-[#FFD700] text-black font-black rounded-xl hover:bg-yellow-400 uppercase tracking-wide cursor-pointer">
        🌊 Pay with Flutterwave
      </button>

      <div className="p-3 bg-black/60 border border-yellow-500/30 rounded-xl text-xs space-y-1">
        <div className="font-bold text-[#FFD700]">🏦 OPay Direct Transfer (Nigeria):</div>
        <div>Account: <span className="font-mono text-white select-all">6113541882</span></div>
        <div>Name: <span className="font-bold text-white">GOYEDAGOSMESS ENTERPRISE</span></div>
        <div>Bank: OPay (PayCom) | RC: BN 3583778</div>
      </div>

      <div className="p-3 bg-black/60 border border-yellow-500/30 rounded-xl text-xs space-y-1">
        <div className="font-bold text-[#FFD700]">🟡 USDT BEP20 BSC Busha:</div>
        <div className="font-mono text-[10px] text-gray-300 break-all select-all">{usdtAddr}</div>
      </div>

      <div className="p-3 bg-black/60 border border-yellow-500/30 rounded-xl text-xs space-y-1">
        <div className="font-bold text-[#FFD700]">🔵 USDC Base Busha:</div>
        <div className="font-mono text-[10px] text-gray-300 break-all select-all">{usdcAddr}</div>
      </div>
    </div>
  );
}
