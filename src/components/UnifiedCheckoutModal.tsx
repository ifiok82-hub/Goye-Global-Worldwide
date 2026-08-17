import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Globe, X, Copy, QrCode, ChevronRight, Lock } from 'lucide-react';

interface UnifiedCheckoutModalProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UnifiedCheckoutModal({ product, onClose, onSuccess }: UnifiedCheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [verified, setVerified] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

  const paystackKey = localStorage.getItem('paystack_live_key') || '';
  const flutterwaveKey = localStorage.getItem('flutterwave_live_key') || '';
  const cryptoWallet = localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4e71';
  const cryptoNetwork = localStorage.getItem('crypto_network') || 'Polygon';
  const piWallet = localStorage.getItem('pi_wallet') || '';
  const formSubmitId = localStorage.getItem('formsubmit_id') || 'b5ff137904e20ed9fbad829a69fc150b';
  const bankDetails = localStorage.getItem('bank_details') || '';

  const ngnPrice = Math.round(product.price * 1600);

  const handleSuccess = (ref: string, gateway: string, isManual = false) => {
    setOrderRef(ref);
    setVerified(true);
    
    const order = {
      ref,
      productId: product.id,
      productName: product.name,
      price: product.price,
      email,
      fullName,
      method: gateway,
      date: new Date().toISOString()
    };
    
    if (isManual) {
      const pending = JSON.parse(localStorage.getItem('goye_pending_orders') || '[]');
      localStorage.setItem('goye_pending_orders', JSON.stringify([order, ...pending]));
    } else {
      const paid = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
      localStorage.setItem('goye_purchased_digital_products', JSON.stringify([order, ...paid]));
      
      // Save order to PostgreSQL database
      fetch('/api/pg/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: ref,
          productName: product.name,
          price: product.price,
          gateway,
          email,
          productId: product.id || product.name.toLowerCase().replace(/\s+/g, '-')
        })
      }).catch(err => console.error('Failed to sync order to DB', err));
    }

    // --- Referral Logic Start ---
    const activeRef = localStorage.getItem('active_referral');
    if (activeRef) {
      const refSales = JSON.parse(localStorage.getItem('referral_sales_list') || '[]');
      const commUsd = product.price * 0.20;
      refSales.unshift({
         id: order.ref,
         action: `Sale: ${product.name}`,
         user: email.split('@')[0] + '...',
         date: new Date().toLocaleDateString(),
         amount: `+$${commUsd.toFixed(2)}`
      });
      localStorage.setItem('referral_sales_list', JSON.stringify(refSales));
      
      const currentSalesCount = parseInt(localStorage.getItem('referral_sales') || '0', 10);
      localStorage.setItem('referral_sales', (currentSalesCount + 1).toString());
      
      const currentBalance = parseFloat(localStorage.getItem('referral_balance') || '0');
      localStorage.setItem('referral_balance', (currentBalance + commUsd).toString());
    }
    // --- Referral Logic End ---

    if (formSubmitId) {
      fetch(`https://formsubmit.co/ajax/${formSubmitId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `⚡ NEW ORDER: ${product.name} ($${product.price}) - ${gateway} - Ref ${ref}`,
          email,
          amountUsd: `$${product.price}`,
          amountNgn: `₦${ngnPrice}`,
          customerName: fullName,
          product: product.name,
          method: gateway,
          reference: ref
        })
      }).catch(e => console.error(e));
    }
  };

  const manualVerify = (gateway: string, msg: string) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      handleSuccess(`GOYE-${Date.now().toString().slice(-6)}`, gateway, true);
    }, 1500);
  };

  const payWithPaystack = () => {
    if (!paystackKey) return alert('Paystack not configured by admin yet.');
    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      email: email,
      amount: ngnPrice * 100, // NGN in kobo
      currency: 'NGN',
      ref: `GOYE-PS-${Date.now()}`,
      callback: (response: any) => handleSuccess(response.reference, 'Paystack', false),
      onClose: () => alert('Payment cancelled')
    });
    handler.openIframe();
  };

  const payWithFlutterwave = () => {
    if (!flutterwaveKey) return alert('Flutterwave not configured by admin yet.');
    (window as any).FlutterwaveCheckout({
      public_key: flutterwaveKey,
      tx_ref: `GOYE-FW-${Date.now()}`,
      amount: ngnPrice,
      currency: 'NGN',
      payment_options: 'card, mobilemoney, ussd',
      customer: { email, name: fullName },
      customizations: { title: 'GOYE Store Global', description: `Payment for ${product.name}` },
      callback: (data: any) => handleSuccess(data.tx_ref || data.transaction_id, 'Flutterwave', false),
      onclose: () => alert('Payment cancelled')
    });
  };

  useEffect(() => {
    const loadScript = (src: string) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadScript('https://js.paystack.co/v1/inline.js');
    loadScript('https://checkout.flutterwave.com/v3.js');
  }, []);

  if (pendingVerification) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-yellow-500/30 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
          <h2 className="text-2xl font-black text-[#FFD700] mb-2">⏳ Pending Verification</h2>
          <p className="text-sm text-gray-400 mb-6">Your transaction is being verified on the blockchain/bank. You will receive an email with your product access link once confirmed.</p>
          <button onClick={onClose} className="w-full bg-[#222] hover:bg-[#333] text-white font-bold py-4 rounded-xl transition">
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-green-500/30 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Payment Complete</h2>
          <p className="text-sm text-gray-400 mb-6">Your order has been recorded successfully.</p>
          <div className="bg-black p-4 rounded-xl border border-white/5 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Order Ref:</p>
            <p className="font-mono text-[#FFD700] text-sm break-all">{orderRef}</p>
          </div>
          <button onClick={onSuccess} className="w-full py-3 bg-[#FFD700] text-black font-bold uppercase rounded-xl hover:bg-yellow-500 transition">
            Access My Downloads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl shadow-yellow-500/5 my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black p-2 rounded-full z-10 transition">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 text-[#FFD700] mb-2 font-black tracking-widest text-sm uppercase">
              <Lock size={16} /> SECURE CHECKOUT
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
            <div className="text-xl font-black text-yellow-400">
              ${product.price} <span className="text-sm text-gray-500 font-normal">(~₦{ngnPrice.toLocaleString()})</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white focus:border-[#FFD700] focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Email Address REQUIRED</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white focus:border-[#FFD700] focus:outline-none transition"
                  placeholder="you@email.com"
                />
              </div>

              <button 
                onClick={() => { if (email.includes('@')) setStep(2); else alert('Valid email required for delivery'); }}
                className="w-full mt-4 py-4 bg-[#FFD700] hover:bg-yellow-500 text-black font-black tracking-widest uppercase rounded-xl transition flex justify-center items-center gap-2"
              >
                PAY <ChevronRight size={18}/>
              </button>
            </div>
          )}

          {step === 2 && !activeGateway && (
            <div className="space-y-3 animate-in slide-in-from-right-4">
              <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-widest leading-relaxed">
                Choose Payment - 5 Secure Methods - No PayPal<br/>
                <span className="text-[10px] text-yellow-400">(Use Paystack/Flutterwave for instant)</span>
              </p>
              
              <button onClick={payWithPaystack} className="w-full p-4 bg-black border border-white/10 rounded-xl hover:border-yellow-400 hover:bg-white/5 transition flex items-center justify-between group">
                <span className="font-bold text-white">Paystack</span>
                <ChevronRight className="text-gray-500 group-hover:text-yellow-400" size={16}/>
              </button>
              
              <button onClick={payWithFlutterwave} className="w-full p-4 bg-black border border-white/10 rounded-xl hover:border-yellow-400 hover:bg-white/5 transition flex items-center justify-between group">
                <span className="font-bold text-white">Flutterwave</span>
                <ChevronRight className="text-gray-500 group-hover:text-yellow-400" size={16}/>
              </button>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={() => setActiveGateway('crypto')} className="p-4 bg-[#2775CA]/10 border border-[#2775CA]/30 rounded-xl hover:bg-[#2775CA]/20 transition flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2775CA] flex items-center justify-center text-white font-bold text-xs">USDC</div>
                  <span className="text-xs font-bold text-white">Crypto</span>
                </button>
                <button onClick={() => setActiveGateway('pi')} className="p-4 bg-[#F4B41A]/10 border border-[#F4B41A]/30 rounded-xl hover:bg-[#F4B41A]/20 transition flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F4B41A] flex items-center justify-center text-black font-black text-xs border-2 border-white">π</div>
                  <span className="text-xs font-bold text-white">Pi Network</span>
                </button>
              </div>

              {bankDetails && (
                <button onClick={() => setActiveGateway('bank')} className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl hover:border-white/30 transition text-center text-sm font-bold text-gray-300">
                  Manual Bank Transfer (Payoneer)
                </button>
              )}
            </div>
          )}

          {activeGateway === 'crypto' && (
            <div style={{background:'#111', border:'2px solid #FFD700', borderRadius:'15px', padding:'20px', textAlign:'center'}}>
              <h3 style={{color:'#FFD700'}}>🪙 Crypto Payment - Manual Verification</h3>
              <p style={{color:'#ccc', fontSize:'13px', marginTop:'10px'}}>Send exact amount to wallet below, then paste TX Hash:</p>
              
              <div style={{background:'#000', borderRadius:'10px', padding:'12px', margin:'15px 0', wordBreak:'break-all'}}>
                <p style={{color:'#888', fontSize:'11px'}}>USDC Wallet ({cryptoNetwork}) - Copy:</p>
                <p style={{color:'#FFD700', fontSize:'12px', fontWeight:'bold'}}>{cryptoWallet}</p>
                <p style={{color:'#888', fontSize:'11px', marginTop:'8px'}}>Amount: ${product.price} USDC</p>
                <p style={{color:'#888', fontSize:'11px'}}>Network: {cryptoNetwork} - Low fee!</p>
              </div>

              <p style={{color:'#fff', fontSize:'12px', textAlign:'left', marginBottom:'5px'}}>Paste Transaction Hash (TxID):</p>
              <input 
                value={cryptoTxHash}
                onChange={e=>setCryptoTxHash(e.target.value)}
                placeholder="0xabc123... transaction hash from Trust Wallet / MetaMask"
                style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #333', background:'#000', color:'#fff', fontSize:'12px'}}
              />
              
              <div style={{display:'flex', gap:'10px', marginTop:'15px', flexDirection: 'column'}}>
                <button 
                  onClick={()=>{
                    if(!cryptoTxHash || cryptoTxHash.length<5){ alert('Paste valid Tx Hash from your wallet!'); return; }
                    setCryptoVerifying(true);
                    fetch('https://formsubmit.co/ajax/' + formSubmitId, {
                      method:'POST',
                      headers:{'Content-Type':'application/json'},
                      body:JSON.stringify({
                        _subject:`CRYPTO PAYMENT VERIFY - ${product.name} - ${cryptoTxHash}`,
                        Product: product.name,
                        Price: product.price,
                        TxHash: cryptoTxHash,
                        Email: email,
                        OrderRef: 'GOYE-'+Math.floor(100000+Math.random()*900000),
                        Status: 'PENDING VERIFICATION - Check blockchain!'
                      })
                    }).catch(console.error);
                    setTimeout(() => {
                      alert('✅ Tx Hash submitted! We verify on blockchain within 30 mins. You get download link via email after verification. Order pending. RC BN3583773');
                      setCryptoVerifying(false);
                      setPendingVerification(true);
                    }, 1500);
                  }}
                  style={{background:'#FFD700', color:'#000', border:'none', width:'100%', padding:'12px', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: cryptoVerifying ? 0.7 : 1}}
                  disabled={cryptoVerifying}
                >
                  {cryptoVerifying ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Verifying...</>
                  ) : 'Submit Tx for Verification'}
                </button>
                <button onClick={()=>setActiveGateway('paystack')} style={{background:'#222', color:'#fff', border:'none', padding:'12px', borderRadius:'12px', cursor:'pointer'}}>Pay with Paystack Instead</button>
              </div>

              <p style={{color:'#666', fontSize:'10px', marginTop:'15px'}}>⚠️ No auto-access for crypto! We verify on-chain to prevent fake payments. Use Paystack/Flutterwave for instant access!</p>
              <p style={{color:'#10B981', fontSize:'11px', marginTop:'8px'}}>Need help? WhatsApp: Type GOYE → We help verify!</p>
            </div>
          )}

          {activeGateway === 'pi' && (
            <div style={{background:'#111', border:'2px solid #FFD700', borderRadius:'15px', padding:'20px', textAlign:'center'}}>
              <h3 style={{color:'#FFD700'}}>π Pi Network Payment</h3>
              <p style={{color:'#ccc', fontSize:'13px', marginTop:'10px'}}>Send exact amount to wallet below, then paste TX Hash:</p>
              
              <div style={{background:'#000', borderRadius:'10px', padding:'12px', margin:'15px 0', wordBreak:'break-all'}}>
                <p style={{color:'#888', fontSize:'11px'}}>Admin Pi Wallet - Copy:</p>
                <p style={{color:'#FFD700', fontSize:'12px', fontWeight:'bold'}}>{piWallet || 'Not Set'}</p>
                <p style={{color:'#888', fontSize:'11px', marginTop:'8px'}}>Amount: ${product.price} ≈ {((product.price) / 314159).toFixed(7)} Pi</p>
                <p style={{color:'#888', fontSize:'11px'}}>Global Consensus Value: $314,159/Pi</p>
              </div>

              <p style={{color:'#fff', fontSize:'12px', textAlign:'left', marginBottom:'5px'}}>Paste Transaction Hash:</p>
              <input 
                value={cryptoTxHash}
                onChange={e=>setCryptoTxHash(e.target.value)}
                placeholder="Pi Network Tx Hash"
                style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #333', background:'#000', color:'#fff', fontSize:'12px'}}
              />
              
              <div style={{display:'flex', gap:'10px', marginTop:'15px', flexDirection: 'column'}}>
                <button 
                  onClick={()=>{
                    if(!cryptoTxHash || cryptoTxHash.length<5){ alert('Paste valid Tx Hash!'); return; }
                    setCryptoVerifying(true);
                    fetch('https://formsubmit.co/ajax/' + formSubmitId, {
                      method:'POST',
                      headers:{'Content-Type':'application/json'},
                      body:JSON.stringify({
                        _subject:`PI PAYMENT VERIFY - ${product.name} - ${cryptoTxHash}`,
                        Product: product.name,
                        Price: product.price,
                        TxHash: cryptoTxHash,
                        Email: email,
                        OrderRef: 'GOYE-'+Math.floor(100000+Math.random()*900000),
                        Status: 'PENDING VERIFICATION - Check blockchain!'
                      })
                    }).catch(console.error);
                    setTimeout(() => {
                      alert('✅ Tx Hash submitted! We verify on blockchain within 30 mins. You get download link via email after verification. Order pending. RC BN3583773');
                      setCryptoVerifying(false);
                      setPendingVerification(true);
                    }, 1500);
                  }}
                  style={{background:'#FFD700', color:'#000', border:'none', width:'100%', padding:'12px', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: cryptoVerifying ? 0.7 : 1}}
                  disabled={cryptoVerifying}
                >
                  {cryptoVerifying ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Verifying...</>
                  ) : 'Submit Tx for Verification'}
                </button>
              </div>
              <p style={{color:'#666', fontSize:'10px', marginTop:'15px'}}>⚠️ No auto-access for Pi! We verify on-chain to prevent fake payments.</p>
            </div>
          )}

          {activeGateway === 'bank' && (
            <div style={{background:'#111', border:'2px solid #FFD700', borderRadius:'15px', padding:'20px', textAlign:'center'}}>
              <h3 style={{color:'#FFD700'}}>🏦 Bank Transfer Payment</h3>
              <p className="text-xs text-gray-400 mb-4">Transfer ${product.price} (~₦{ngnPrice.toLocaleString()}) to the following account:</p>
              <pre className="text-xs text-left text-gray-300 bg-black p-4 rounded-xl border border-white/5 whitespace-pre-wrap font-mono mb-4 overflow-y-auto max-h-40">
                {bankDetails}
              </pre>
              <p className="text-[10px] text-gray-500 mb-4">Include your email in the transfer reference if possible.</p>
              
              <button 
                  onClick={()=>{
                    setCryptoVerifying(true);
                    fetch('https://formsubmit.co/ajax/' + formSubmitId, {
                      method:'POST',
                      headers:{'Content-Type':'application/json'},
                      body:JSON.stringify({
                        _subject:`BANK PAYMENT VERIFY - ${product.name}`,
                        Product: product.name,
                        Price: product.price,
                        Email: email,
                        OrderRef: 'GOYE-'+Math.floor(100000+Math.random()*900000),
                        Status: 'PENDING VERIFICATION - Bank Transfer'
                      })
                    }).catch(console.error);
                    setTimeout(() => {
                      alert('✅ Payment submitted! We verify within 24 hours. You get download link via email after verification. RC BN3583773');
                      setCryptoVerifying(false);
                      setPendingVerification(true);
                    }, 1500);
                  }}
                  style={{background:'#FFD700', color:'#000', border:'none', width:'100%', padding:'12px', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: cryptoVerifying ? 0.7 : 1}}
                  disabled={cryptoVerifying}
                >
                  {cryptoVerifying ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Submitting...</>
                  ) : 'I HAVE PAID (MANUAL VERIFY)'}
              </button>
            </div>
          )}

          {activeGateway && (
            <button onClick={() => setActiveGateway(null)} className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-white transition">
              ← Back to payment methods
            </button>
          )}
          
          <div className="mt-6 border-t border-[#333] pt-4 text-center">
            <p className="text-[#FFD700] text-xs font-bold mb-2">📷 Don't want to type link next time?</p>
            <p className="text-gray-400 text-[10px]">Scan this QR to return instantly!</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store&color=000000&bgcolor=FFFFFF&qzone=1&margin=10&format=png&ecc=H" alt="GOYE QR" className="w-16 h-16 mx-auto mt-2 border border-[#FFD700] rounded-lg bg-white p-1" />
          </div>

        </div>
      </div>
    </div>
  );
}
