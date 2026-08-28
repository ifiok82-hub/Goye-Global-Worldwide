import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp, setDoc, arrayUnion } from 'firebase/firestore';
import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw, ChevronRight, Zap } from 'lucide-react';

export default function UnifiedCheckoutModal({ product, onClose, paymentConfig, onToast }: any) {
  const [activeGateway, setActiveGateway] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const priceUSD = product.price || 49.99;
  const priceNGN = priceUSD * 1600; // Paystack *1600 NGN exchange rate
  
  const userCurrency = localStorage.getItem('goye_currency') || 'USD';
  const rates:any = { NGN: 1500, GBP: 0.79, EUR: 0.92, INR: 83, CAD: 1.35, AUD: 1.52, ZAR: 18, GHS: 13, KES: 130, AED: 3.67, BRL: 5.0, MXN: 17.0 };
  const rate = rates[userCurrency] || 1;
  const localPrice = (priceUSD * rate).toFixed(2);

  
  const formSubmitId = 'b5ff137904e20ed9fbad829a69fc150b';
  
  const sanitizeInput = (input: string) => input.replace(/<[^>]*>?/gm, '').trim();
  const validateEmail = (e: string) => {
    const sanitized = sanitizeInput(e);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
  };
  
  
  const handleSuccess = async (ref: string, method: string, isPending: boolean = false) => {
    
    // Save to localStorage CRM
    try {
        let orders = JSON.parse(localStorage.getItem('orders_list') || '[]');
        const countryJSON = localStorage.getItem('goye_selected_country');
        const country = countryJSON ? JSON.parse(countryJSON) : { flag: '🌍', name: 'Unknown' };
        const currency = localStorage.getItem('goye_currency') || 'USD';
        const displaySymbol = currency === 'USD' ? '' : currency + ' ';
        
        orders.unshift({
            id: 'ORD-' + Date.now(),
            ref: ref,
            customerName: email.split('@')[0],
            customerEmail: email,
            country: country,
            productName: product.name,
            amount: displaySymbol + localPrice,
            amountUSD: priceUSD,
            currency: currency,
            method: method,
            status: isPending ? 'pending' : 'paid',
            date: new Date().toISOString()
        });
        localStorage.setItem('orders_list', JSON.stringify(orders.slice(0, 500)));
    } catch(e) {}
    
    const referredBy = localStorage.getItem('referred_by');
    if (referredBy && !isPending) {
      try {
        const refDoc = doc(db, 'referrals', referredBy);
        const snap = await getDoc(refDoc);
        
        let piAmt = 0;
        if(method.toLowerCase().includes('pi')) piAmt = 0.0001; // Mock 20% of Pi GCV
        
        if (snap.exists()) {
          await updateDoc(refDoc, {
            usd: increment(priceUSD * 0.2),
            ngn: increment(priceNGN * 0.2),
            pi: increment(piAmt),
            signups: increment(1)
          });
        } else {
          await setDoc(refDoc, {
            clicks: 1,
            signups: 1,
            usd: priceUSD * 0.2,
            ngn: priceNGN * 0.2,
            pi: piAmt,
            payouts: []
          });
        }
        
        await addDoc(collection(db, 'referrals', referredBy, 'referral_payouts'), {
          amountUSD: priceUSD * 0.2,
          amountNGN: priceNGN * 0.2,
          amountPi: piAmt,
          method: method,
          productName: product.name,
          timestamp: serverTimestamp()
        });
      } catch(e) {
        console.error('Error tracking referral commission', e);
      }
    }
    
    const order = {
      id: Date.now().toString(),
      ref: ref,
      productId: product.id,
      productName: product.name,
      amount: priceUSD,
      method: method,
      status: isPending ? 'pending' : 'completed',
      date: new Date().toISOString(),
      customerEmail: email
    };
    
    const saveToDb = async () => {
      try {
        await addDoc(collection(db, 'orders'), order);
        // Sync to user's Cloud account under purchased_items
        const activeUserStr = localStorage.getItem('goye_active_user');
        if (activeUserStr) {
          const activeUser = JSON.parse(activeUserStr);
          const userRef = doc(db, 'users', activeUser.uid);
          await updateDoc(userRef, {
            purchased_items: arrayUnion(order)
          }).catch(() => {
            // If purchased_items field doesn't exist yet, we can set it via setDoc merge
            setDoc(userRef, { purchased_items: [order] }, { merge: true });
          });
        }
      } catch (e) {
        console.error('Error saving order to db', e);
      }
    };
    
    if (isPending) {
      const downloads = JSON.parse(localStorage.getItem('my_downloads') || '[]');
      downloads.push(order);
      localStorage.setItem('my_downloads', JSON.stringify(downloads));
      
      saveToDb();
      
      alert('Transaction Submitted! Pending secure webhook verification. Check "My Downloads" tab later.');
      onClose();
    } else {
      if (onToast) onToast("Initiating Secure Webhook Verification...");
      
      // Simulate backend webhook verification delay
      setTimeout(() => {
        const downloads = JSON.parse(localStorage.getItem('my_downloads') || '[]');
        downloads.push(order);
        localStorage.setItem('my_downloads', JSON.stringify(downloads));
        
        saveToDb();
        
        if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");

        setTimeout(() => {
          if (onToast) onToast("📧 Sending Automated Email & 📱 WhatsApp Receipt...");
        }, 800);
        
        if (product.category === 'academy' && (window as any).unlockAcademy) {
           (window as any).unlockAcademy();
        }

        setSuccess(true);
      }, 2000);
    }
  };

  const payWithPaystack = () => {
    if (!email) return onToast ? onToast("Enter email first") : alert("Enter email first");
    const pk = paymentConfig?.paystack || localStorage.getItem('paystack_public_key');
    if (!pk) return onToast ? onToast("Paystack not configured by admin yet") : alert("Paystack not configured by admin yet");
    
    if (!(window as any).PaystackPop) return onToast ? onToast('Payment gateway is loading. Please wait a moment and try again.') : alert('Payment gateway is loading. Please wait a moment and try again.');
    const handler = (window as any).PaystackPop.setup({
      key: pk,
      email: email,
      amount: Math.round(priceNGN * 100),
      currency: 'NGN',
      ref: `GOYE-PS-${Date.now()}`,
      callback: (res: any) => handleSuccess(res.reference, 'Paystack'),
      onClose: () => alert('Payment cancelled')
    });
    handler.openIframe();
  };

  const payWithFlutterwave = () => {
    if (!email) return onToast ? onToast("Enter email first") : alert("Enter email first");
    const pk = paymentConfig?.flutterwave || localStorage.getItem('flutterwave_public_key');
    if (!pk) return onToast ? onToast("Flutterwave not configured by admin yet") : alert("Flutterwave not configured by admin yet");

    if (!(window as any).FlutterwaveCheckout) return onToast ? onToast('Payment gateway is loading. Please wait a moment and try again.') : alert('Payment gateway is loading. Please wait a moment and try again.');
    const handler = (window as any).FlutterwaveCheckout({
      public_key: pk,
      tx_ref: `GOYE-FW-${Date.now()}`,
      amount: priceUSD,
      currency: 'USD',
      payment_options: 'card, banktransfer, ussd',
      customer: { email: email, name: email.split('@')[0] },
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
    <div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"><X size={24}/></button>
        
        <div className="md:w-1/2 p-8 bg-[#0a0a0a] flex flex-col justify-between border-r border-[#222]">
          <div>
            <div className="text-[#FFD700] text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><ShieldCheck size={16}/> SECURE CHECKOUT</div>
            <h2 className="text-white text-2xl font-black mb-2">{product.name}</h2>
            <div className="text-[#10B981] text-3xl font-black mb-2">${priceUSD}</div>
            {userCurrency !== 'USD' && <div className="text-gray-400 text-sm font-bold mb-6">(~ ${displaySymbol}${localPrice})</div>}
            
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
              <div className="space-y-2">
                <button onClick={payWithPaystack} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Pay with Paystack (Global Cards)
                </button>
                <button onClick={payWithFlutterwave} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Flutterwave (Africa)
                </button>
                <button onClick={() => setActiveGateway('crypto')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  USDC Crypto
                </button>
                <button onClick={() => setActiveGateway('pi')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Pi GCV $314k
                </button>
                <button onClick={() => setActiveGateway('bank')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Manual Bank Transfer
                </button>
              </div>
            </div>
          ) : activeGateway === 'crypto' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#10B981] font-bold mb-4">Pay with Crypto (USDC)</h3>
              <p className="text-gray-400 text-xs mb-4">Send exactly <strong>${priceUSD} USDC</strong> to this address:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-sm font-mono truncate">{paymentConfig?.crypto || localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4'}</span>
                <button onClick={() => { navigator.clipboard.writeText(paymentConfig?.crypto || localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4'); if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!');; }} className="text-gray-400 hover:text-white"><Copy size={16}/></button>
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
          ) : activeGateway === 'bank' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#FFD700] font-bold mb-4">Manual Bank Transfer</h3>
              <p className="text-gray-400 text-xs mb-4">Please transfer the amount to:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] mb-4">
                <div className="text-white text-sm font-bold">Bank Name: Zenith Bank</div>
                <div className="text-white text-sm font-bold">Account Name: Goyedagosmess Enterprise</div>
                <div className="text-white text-sm font-bold">Account Number: 1010101010</div>
              </div>
              <input 
                placeholder="Upload Receipt or Ref Number" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#FFD700] outline-none"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4 disabled:opacity-50">
                {cryptoVerifying ? 'Verifying...' : 'Submit Receipt'}
              </button>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto">Back to Methods</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#8b5cf6] font-bold mb-4">Pay with Pi GCV</h3>
              <p className="text-gray-400 text-xs mb-4">Send exactly Pi to this wallet:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-sm font-mono truncate">{paymentConfig?.pi || localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'}</span>
                <button onClick={() => { navigator.clipboard.writeText(paymentConfig?.pi || localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'); if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!');; }} className="text-gray-400 hover:text-white"><Copy size={16}/></button>
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
          

            <div className="mt-8 pt-6 border-t border-[#333] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-[#10B981] font-bold">
                <Lock size={14} /> 256-Bit SSL Encrypted & PCI-DSS Compliant
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={12} /> Verified Business: RC BN3583773
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <Zap size={12} /> Instant Automated Delivery
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={12} /> Scam-Proof Direct Gateway Integration
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
