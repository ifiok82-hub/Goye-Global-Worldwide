const fs = require('fs');

const checkoutCode = `import React, { useState } from 'react';
import RealQRCode from './RealQRCode';
import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw, ChevronRight } from 'lucide-react';

export default function UnifiedCheckoutModal({ product, onClose }: any) {
  const [activeGateway, setActiveGateway] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const priceUSD = product.price || 49.99;
  const priceNGN = priceUSD * 1600; // Paystack *1600 NGN exchange rate
  
  const formSubmitId = 'b5ff137904e20ed9fbad829a69fc150b';
  
  const handleSuccess = (ref: string, method: string, isPending: boolean = false) => {
    const order = {
      id: Date.now(),
      ref: ref,
      productId: product.id,
      productName: product.name,
      amount: priceUSD,
      method: method,
      status: isPending ? 'pending' : 'completed',
      date: new Date().toLocaleString()
    };
    
    const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
    downloads.push(order);
    localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
    
    if (isPending) {
      alert('Transaction Submitted! Pending on-chain verification. Check "My Downloads" tab later.');
      onClose();
    } else {
      setSuccess(true);
    }
  };

  const payWithPaystack = () => {
    if (!email) return alert("Enter email first");
    const handler = (window as any).PaystackPop.setup({
      key: localStorage.getItem('paystack_public_key') || 'pk_test_dummy',
      email: email,
      amount: Math.round(priceNGN * 100),
      currency: 'NGN',
      ref: \`GOYE-PS-\${Date.now()}\`,
      callback: (res: any) => handleSuccess(res.reference, 'Paystack'),
      onClose: () => alert('Payment cancelled')
    });
    handler.openIframe();
  };

  const payWithFlutterwave = () => {
    if (!email) return alert("Enter email first");
    const handler = (window as any).FlutterwaveCheckout({
      public_key: localStorage.getItem('flutterwave_public_key') || 'FLWPUBK_TEST_dummy',
      tx_ref: \`GOYE-FW-\${Date.now()}\`,
      amount: priceUSD,
      currency: 'USD',
      payment_options: 'card, banktransfer, ussd',
      customer: { email, name: email.split('@')[0] },
      customizations: { title: 'GOYE Store', description: product.name },
      callback: (res: any) => handleSuccess(res.transaction_id, 'Flutterwave'),
      onclose: () => alert('Payment cancelled')
    });
  };

  const submitCrypto = () => {
    if (!cryptoTxHash) return alert("Paste valid Tx Hash!");
    setCryptoVerifying(true);
    fetch('https://formsubmit.co/ajax/' + formSubmitId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'New Crypto Payment',
        email,
        product: product.name,
        amount: priceUSD,
        txHash: cryptoTxHash
      })
    }).then(() => {
      setCryptoVerifying(false);
      handleSuccess(cryptoTxHash, 'Crypto', true); // Pending verification!
    });
  };

  if (success) return (
    <div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4">
      <div className="bg-[#111] border-2 border-[#FFD700] rounded-[20px] p-8 max-w-md w-full text-center">
        <CheckCircle className="text-[#10B981] mx-auto mb-4" size={60} />
        <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-400 text-sm mb-6">Your access has been granted instantly.</p>
        <button onClick={onClose} className="bg-[#FFD700] text-black w-full font-bold py-3 rounded-xl">Access Product</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"><X size={24}/></button>
        
        <div className="md:w-1/2 p-8 bg-[#0a0a0a] flex flex-col justify-between border-r border-[#222]">
          <div>
            <div className="text-[#FFD700] text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><ShieldCheck size={16}/> SECURE CHECKOUT</div>
            <h2 className="text-white text-2xl font-black mb-2">{product.name}</h2>
            <div className="text-[#10B981] text-3xl font-black mb-6">\${priceUSD}</div>
            
            <input 
              type="email" 
              placeholder="Enter your email for delivery" 
              className="w-full bg-black border border-[#333] p-4 rounded-xl text-white mb-6 focus:border-[#FFD700] outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            
            <p className="text-gray-400 text-xs leading-relaxed mb-4">You are purchasing a digital product. Instantly delivered to your email and downloads section.</p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-gray-500 text-xs font-bold uppercase">
            <Lock size={14}/> 100% SECURE <span className="text-[#333]">|</span> SSL ENCRYPTED
          </div>
        </div>
        
        <div className="md:w-1/2 p-8 bg-[#111]">
          {!activeGateway ? (
            <div>
              <p className="text-xs text-gray-400 text-center mb-6 uppercase tracking-widest font-bold">Choose Payment Method</p>
              <div className="space-y-3">
                <button onClick={payWithPaystack} className="w-full p-4 bg-black border border-[#333] rounded-xl hover:border-[#FFD700] hover:bg-white/5 transition flex items-center justify-between group">
                  <span className="font-bold text-white">Paystack (NGN \${priceNGN})</span>
                  <ChevronRight className="text-gray-500 group-hover:text-[#FFD700]" size={16}/>
                </button>
                <button onClick={payWithFlutterwave} className="w-full p-4 bg-black border border-[#333] rounded-xl hover:border-[#FFD700] hover:bg-white/5 transition flex items-center justify-between group">
                  <span className="font-bold text-white">Flutterwave (USD)</span>
                  <ChevronRight className="text-gray-500 group-hover:text-[#FFD700]" size={16}/>
                </button>
                <button onClick={() => alert('PayPal integration pending')} className="w-full p-4 bg-black border border-[#333] rounded-xl hover:border-[#FFD700] hover:bg-white/5 transition flex items-center justify-between group">
                  <span className="font-bold text-white">PayPal</span>
                  <ChevronRight className="text-gray-500 group-hover:text-[#FFD700]" size={16}/>
                </button>
                <button onClick={() => setActiveGateway('crypto')} className="w-full p-4 bg-black border border-[#333] rounded-xl hover:border-[#10B981] hover:bg-[#10B981]/5 transition flex items-center justify-between group">
                  <span className="font-bold text-[#10B981]">Crypto USDC</span>
                  <ChevronRight className="text-gray-500 group-hover:text-[#10B981]" size={16}/>
                </button>
                <button onClick={() => setActiveGateway('pi')} className="w-full p-4 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-xl hover:border-[#8b5cf6] transition flex items-center justify-between group">
                  <span className="font-bold text-[#8b5cf6]">Pi GCV $314k</span>
                  <ChevronRight className="text-[#8b5cf6]" size={16}/>
                </button>
              </div>
            </div>
          ) : activeGateway === 'crypto' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#10B981] font-bold mb-4">Pay with Crypto (USDC)</h3>
              <p className="text-gray-400 text-xs mb-4">Send exactly <strong>\${priceUSD} USDC</strong> to this address:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-sm font-mono truncate">0x123...CryptoAddress</span>
                <button className="text-gray-400 hover:text-white"><Copy size={16}/></button>
              </div>
              <input 
                placeholder="Paste Tx Hash here" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#10B981] outline-none"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#10B981] text-black font-bold py-3 rounded-xl mb-4 disabled:opacity-50">
                {cryptoVerifying ? 'Verifying...' : 'Submit Tx for Verification'}
              </button>
              <p className="text-gray-500 text-[10px] text-center">⚠️ No auto-access for crypto! We verify on-chain to prevent fake payments.</p>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto">Back to Methods</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#8b5cf6] font-bold mb-4">Pay with Pi GCV</h3>
              <p className="text-gray-400 text-xs mb-4">Send exactly Pi to this wallet:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-sm font-mono truncate">GCVWalletAddress...</span>
                <button className="text-gray-400 hover:text-white"><Copy size={16}/></button>
              </div>
              <input 
                placeholder="Paste Tx Hash here" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#8b5cf6] outline-none"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#8b5cf6] text-white font-bold py-3 rounded-xl mb-4 disabled:opacity-50">
                {cryptoVerifying ? 'Verifying...' : 'Submit Tx for Verification'}
              </button>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto">Back to Methods</button>
            </div>
          )}
          
          <div className="mt-8 border-t border-[#333] pt-4 text-center">
            <RealQRCode className="transform scale-75 origin-top mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', checkoutCode);
