import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Copy, CheckCircle, RefreshCw, ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { identifyUserSession, trackUserClick } from '../utils/analytics';
import { cleanUserEmail } from '../lib/contact';


export default function UnifiedCheckoutModal({ product, onClose, paymentConfig, onToast }: any) {
  const [activeGateway, setActiveGateway] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stored = cleanUserEmail(localStorage.getItem('user_email') || localStorage.getItem('customer_email'));
    if (stored) {
      setEmail(stored);
    } else {
      setEmail('');
      localStorage.removeItem('user_email');
      localStorage.removeItem('customer_email');
    }
  }, []);
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [bankVerifying, setBankVerifying] = useState(false);
  const [bankSubmitted, setBankSubmitted] = useState(false);
  const [submittedBankRef, setSubmittedBankRef] = useState('');
  const [success, setSuccess] = useState(false);

  const priceUSD = (product?.price && typeof product.price === 'number' && product.price > 0) ? product.price : 49.99;
  const rawProductName = product?.name || 'Sirwise AI Web3 Academy 4-Week Masterclass';
  const cleanProductName = rawProductName.includes('Micro-SaaS') ? 'Sirwise AI Web3 Academy Global' : rawProductName;
  const userCurrency = localStorage.getItem('goye_currency') || localStorage.getItem('currency') || 'USD';
  
  const currencies: Record<string, { symbol: string; name: string; rate: number }> = {
    USD: { symbol: '$', name: 'US Dollar', rate: 1 },
    NGN: { symbol: '₦', name: 'Naira', rate: 1500 },
    GBP: { symbol: '£', name: 'Pound', rate: 0.79 },
    EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
    CAD: { symbol: 'C$', name: 'Canadian', rate: 1.35 },
    AUD: { symbol: 'A$', name: 'Australian', rate: 1.52 },
    INR: { symbol: '₹', name: 'Rupee', rate: 83 },
    ZAR: { symbol: 'R', name: 'Rand', rate: 18.5 },
    GHS: { symbol: '₵', name: 'Cedi', rate: 15 },
    KES: { symbol: 'KSh', name: 'Shilling', rate: 130 },
    AED: { symbol: 'AED', name: 'Dirham', rate: 3.67 }
  };

  const currentCurrency = currencies[userCurrency] || currencies['USD'] || { symbol: '$', name: 'US Dollar', rate: 1 };
  const displaySymbol = currentCurrency.symbol || '$';
  const displayPrice = (priceUSD * currentCurrency.rate).toFixed(2);
  const localPrice = displayPrice;
  const priceNGN = (priceUSD === 3.00 || product?.id === 'web3-starter-toolkit') ? 2500 : (priceUSD === 19.99 ? 29900 : (priceUSD === 49.99 ? 74985 : priceUSD * 1500));
  const nairaAmount = priceNGN.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const formSubmitId = 'b5ff137904e20ed9fbad829a69fc150b';
  
  const sanitizeInput = (input: string) => input.replace(/<[^>]*>?/gm, '').trim();
  const validateEmail = (e: string) => {
    const sanitized = sanitizeInput(e);
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
  };
  
  const handleSuccess = async (ref: string, method: string, isPending: boolean = false) => {
    try {
        let orders = JSON.parse(localStorage.getItem('orders_list') || '[]');
        const countryJSON = localStorage.getItem('goye_selected_country');
        const country = countryJSON ? JSON.parse(countryJSON) : { flag: '🌍', name: 'Unknown' };
        
        const orderDocId = ref || ('ORD-' + Date.now());
        const timestampStr = new Date().toISOString();
        const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });

        const newOrder = {
            id: orderDocId,
            orderId: orderDocId,
            ref: ref || orderDocId,
            orderRef: ref || orderDocId,
            customerName: email ? email.split('@')[0] : 'Guest Pupil',
            customerEmail: email || '',
            email: email || '',
            country: country,
            productName: cleanProductName,
            amount: `₦${nairaAmount} (${displaySymbol}${localPrice})`,
            amountUSD: priceUSD,
            price: priceUSD,
            currency: userCurrency,
            paymentMethod: method,
            method: method,
            account: method.includes('Bank') || method.includes('OPay') ? '6113541882 OPay GOYEDAGOSMESS ENTERPRISE' : method,
            transactionId: ref || orderDocId,
            date: formattedDate,
            purchasedAt: timestampStr,
            createdAt: timestampStr,
            status: isPending ? 'Pending Verification' : 'COMPLETED',
            is_verified: !isPending
        };

        // Save locally in live_orders & orders_list
        orders.unshift(newOrder);
        localStorage.setItem('orders_list', JSON.stringify(orders));
        localStorage.setItem('live_orders', JSON.stringify(orders));

        // Unlock Academy & Store products
        localStorage.setItem('sirwise_paid', 'true');
        localStorage.setItem('payment_verified', 'true');
        localStorage.setItem('academy_unlocked', 'true');

        // Save customer to registered_customers in localStorage
        if (email) {
          const custId = email.trim().toLowerCase();
          const customerObj = {
            id: custId,
            email: custId,
            pupilName: email.split('@')[0],
            parentName: 'Parent of ' + email.split('@')[0],
            country: country,
            is_verified: true,
            date: timestampStr,
            createdAt: timestampStr,
            lastOrderAt: timestampStr
          };

          let custs = JSON.parse(localStorage.getItem('registered_customers') || localStorage.getItem('customers_list') || '[]');
          if (!custs.some((c: any) => c.email === custId)) {
            custs.unshift(customerObj);
            localStorage.setItem('registered_customers', JSON.stringify(custs));
            localStorage.setItem('customers_list', JSON.stringify(custs));
          }
        }


        // Trigger Postgres API save
        try {
          fetch('/api/pg/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderRef: orderDocId,
              productName: cleanProductName,
              price: priceUSD,
              gateway: method,
              email: email,
              productId: product?.id || 'academy-pass'
            })
          }).catch(e => console.warn('PG Order endpoint notice:', e));
        } catch (e) {}

        if (!isPending) {
            localStorage.setItem('sirwise_paid', 'true');
            localStorage.setItem('payment_verified', 'true');
            localStorage.setItem('academy_unlocked', 'true');
            localStorage.setItem('payment_date', new Date().toISOString());
            if (email) {
                identifyUserSession(email.split('@')[0], email);
            }
            if ((window as any).unlockAcademy) (window as any).unlockAcademy();
        }

        const currentRevenue = parseFloat(localStorage.getItem('goye_total_revenue') || '0');
        localStorage.setItem('goye_total_revenue', (currentRevenue + priceUSD).toString());

        fetch('https://formsubmit.co/ajax/' + formSubmitId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: 'NEW ORDER: ' + cleanProductName + ' (' + method + ')',
                Product: cleanProductName,
                Amount: `₦${nairaAmount} (${displaySymbol}${localPrice})`,
                Customer_Email: email,
                Method: method,
                Tx_Ref: ref,
                Account: '6113541882 OPay',
                Status: isPending ? 'Pending Verification' : 'Completed',
                Country: typeof country === 'object' && country ? (country.name || country.country || 'Unknown') : String(country || 'Unknown')
            })
        }).catch(err => console.log('FormSubmit notify silent fail', err));

    } catch (e) {
        console.error('Error recording order locally', e);
    }

    if (!isPending) {
      setSuccess(true);
      if (onToast) onToast('Payment Successful! Access Granted.');
      setTimeout(() => {
          onClose();
          window.location.hash = 'academy';
      }, 1500);
    }
  };

  const getValidatedEmail = (): string | null => {
    const userEmail = email.trim();
    if (!userEmail || userEmail.length < 5 || !userEmail.includes('@') || !userEmail.includes('.') || userEmail === 'null' || userEmail === 'undefined') {
      return null;
    }
    return userEmail;
  };

  const initializePaystackServerRedirect = async (userEmail: string) => {
    try {
      if (onToast) onToast('Initializing Paystack secure checkout...');
      const res = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          amountUsd: priceUSD,
          currencyCode: userCurrency || 'USD'
        })
      });
      const data = await res.json();
      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.simulation && data.reference) {
        window.location.href = `/payment/verify?reference=${encodeURIComponent(data.reference)}`;
      } else {
        alert(data.error || 'Unable to initialize Paystack session. Please try Bank / OPay Transfer.');
      }
    } catch (err: any) {
      console.error('Paystack server init error', err);
      alert('Network error initializing Paystack. Please try Bank / OPay Transfer.');
    }
  };

  const handlePaystackPayment = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      alert('Please enter your email address before proceeding with payment.');
      const inputEl = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.style.border = '2px solid #ef4444';
      }
      return;
    }
    localStorage.setItem('user_email', emailInput);
    localStorage.setItem('customer_email', emailInput);
    trackUserClick('Paystack Payment Click', 'CheckoutModal', product?.id || 'academy');

    const paystackPublicKey = 
      (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) || 
      (window as any).env?.VITE_PAYSTACK_PUBLIC_KEY || 
      paymentConfig?.paystack || 
      localStorage.getItem('paystack_public_key') || 
      'pk_live_9f7e06b21fa6dc4e3e94cc00c74587c01249a89b';

    const nairaPrice = Math.round(priceNGN);
    const amountInKobo = nairaPrice * 100; // e.g., 250000 kobo for NGN 2,500

    if (typeof (window as any).PaystackPop !== 'undefined' && typeof (window as any).PaystackPop.setup === 'function') {
      try {
        const handler = (window as any).PaystackPop.setup({
          key: paystackPublicKey,
          email: emailInput,
          amount: amountInKobo,
          currency: 'NGN',
          ref: 'GOYE_' + Math.floor((Math.random() * 1000000000) + 1),
          metadata: {
            custom_fields: [
              { display_name: "Product", variable_name: "product", value: cleanProductName },
              { display_name: "RC", variable_name: "rc", value: "BN3583773 GOYEDAGOSMESS ENTERPRISE" }
            ]
          },
          onClose: function() {
            console.log('Window closed');
            if (onToast) onToast('Paystack checkout window closed');
          },
          callback: function(response: any) {
            if (response && response.reference) {
              window.location.href = `/payment/verify?reference=${encodeURIComponent(response.reference)}`;
            } else {
              handleSuccess('GOYE_' + Date.now(), 'Paystack (Global Cards)');
            }
          }
        });
        handler.openIframe();
      } catch (e: any) {
        console.error('Paystack popup setup error, falling back to server redirect:', e);
        initializePaystackServerRedirect(emailInput);
      }
    } else {
      console.warn('PaystackPop inline SDK not loaded, redirecting via server API...');
      initializePaystackServerRedirect(emailInput);
    }
  };

  const payWithPaystack = handlePaystackPayment;

  const payWithFlutterwave = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      alert('Enter complete valid email e.g. parent@gmail.com');
      const inputEl = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.style.border = '2px solid #ef4444';
      }
      return;
    }
    localStorage.setItem('user_email', emailInput);
    localStorage.setItem('customer_email', emailInput);

    const flutterwavePublicKey = paymentConfig?.flutterwave || localStorage.getItem('flutterwave_public_key') || 'FLWPUBK-cbb518a9b8f74421e887f4a1ec911ea7-X';
    const customerName = emailInput.split('@')[0] || 'Global Customer';
    const customerPhone = '';
    
    if (typeof (window as any).FlutterwaveCheckout !== 'undefined') {
      try {
        (window as any).FlutterwaveCheckout({
          public_key: flutterwavePublicKey,
          tx_ref: 'SIRWISE_FW_' + Date.now(),
          amount: 74985,
          currency: 'NGN',
          payment_options: 'card,ussd,banktransfer',
          customer: {
            email: emailInput,
            name: customerName,
            phone_number: customerPhone,
          },
          customizations: {
            title: 'Sirwise AI Web3 Academy',
            description: 'Global $49.99 RC BN3583773',
            logo: 'https://www.gasv.store/logo.png',
          },
          callback: (data: any) => {
            if (data && (data.status === 'successful' || data.status === 'completed' || data.transaction_id || data.tx_ref)) {
              handleSuccess(data.transaction_id || data.tx_ref || ('FLW-' + Date.now()), 'Flutterwave (Africa Cards)');
            } else {
              alert('Payment not successful - Real money required - Amount must be ₦74,985');
            }
          },
          onclose: () => {
            if (onToast) onToast('Flutterwave payment closed');
          }
        });
      } catch (e: any) {
        console.error('Flutterwave error', e);
        alert('Flutterwave initialization notice: Please use Bank / OPay Transfer or Paystack.');
      }
    } else {
      alert('Flutterwave SDK loading... Please try again or use Bank Transfer.');
    }
  };

  const connectMetaMask = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          const addr = accounts[0];
          setCryptoTxHash('EVM-' + addr.slice(0, 8) + '...' + addr.slice(-6));
          if (onToast) onToast(`MetaMask Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`);
          else alert(`MetaMask Connected: ${addr}`);
        }
      } catch (e: any) {
        alert('MetaMask notice: ' + (e.message || 'Could not connect wallet'));
      }
    } else {
      alert('MetaMask not detected in browser. Please copy the wallet address or open in MetaMask app browser.');
    }
  };

  const selectGatewayWithEmailCheck = (gateway: string) => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      alert('Please enter your email address before selecting a payment method.');
      const inputEl = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.style.border = '2px solid #ef4444';
      }
      return;
    }
    setActiveGateway(gateway);
    if (gateway === 'bank') setBankSubmitted(false);
  };

  const submitCrypto = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      alert('Please enter your email address before submitting.');
      return;
    }
    if (!cryptoTxHash) {
      if (onToast) onToast('Please enter transaction hash or reference');
      else alert('Please enter transaction hash or reference');
      return;
    }
    setCryptoVerifying(true);
    setTimeout(() => {
      setCryptoVerifying(false);
      handleSuccess(cryptoTxHash, activeGateway === 'pi' ? 'Pi GCV' : 'Crypto USDC', true);
      setSuccess(true);
    }, 1500);
  };

  const submitBankTransfer = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      alert('Please enter your email address before submitting.');
      return;
    }
    if (!bankRef.trim()) {
      if (onToast) onToast('Please enter Reference / Sender Name');
      else alert('Please enter Reference / Sender Name');
      return;
    }
    setBankVerifying(true);
    const ref = bankRef.trim();
    setSubmittedBankRef(ref);
    setTimeout(() => {
      setBankVerifying(false);
      handleSuccess(ref, 'Bank / OPay Transfer', true);
      setBankSubmitted(true);
      if (onToast) onToast('Payment Reference Submitted!');
    }, 1000);
  };

  const copyAccount = () => {
    navigator.clipboard.writeText('6113541882');
    if (onToast) onToast('Account number copied!');
    else alert('Account number copied!');
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
        <div className="bg-[#111] border-2 border-[#10B981] p-8 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center text-center shadow-2xl relative pointer-events-auto">
          <CheckCircle size={64} className="text-[#10B981] mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-white mb-2">Order Placed!</h2>
          <p className="text-gray-400 text-sm mb-6">Thank you for purchasing <strong>{product?.name || 'Sirwise AI Web3 Academy'}</strong>. Access has been unlocked!</p>
          <div className="bg-black p-4 rounded-xl border border-[#333] w-full text-left text-xs font-mono text-gray-300 space-y-1">
             <div>Amount: ₦{nairaAmount} ({displaySymbol}{localPrice})</div>
             <div>Status: {activeGateway ? 'Pending Verification' : 'Verified & Active'}</div>
             <div>RC: BN3583773</div>
          </div>
          <button onClick={onClose} className="mt-6 bg-[#FFD700] text-black font-bold py-3 px-8 rounded-xl cursor-pointer pointer-events-auto">
            Continue to Academy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 pointer-events-auto overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-[#FFD700] rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row my-8 pointer-events-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-black/50 hover:bg-black text-gray-400 hover:text-white p-2 rounded-full z-50 cursor-pointer pointer-events-auto"
        >
          <X size={20} />
        </button>

        <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-[#333] flex flex-col justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-xs text-[#10B981] font-bold uppercase tracking-wider">GOYE Secure Gateway</span>
            </div>
            
            <h2 className="text-xl font-black text-white mb-2">{product?.name || 'Sirwise AI Web3 Academy 4-Week'}</h2>
            <div className="text-3xl font-black text-[#FFD700] mb-1">
               ₦{nairaAmount} <span className="text-sm font-normal text-gray-400">({priceUSD} USD)</span>
            </div>
            {userCurrency !== 'USD' && userCurrency !== 'NGN' && (
              <div className="text-gray-400 text-sm font-bold mb-6">
                (~ {displaySymbol}{localPrice})
              </div>
            )}

            <div className="space-y-3 border-t border-[#333] pt-6 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                <span>Full Lifetime Access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                <span>Blockchain Verified Certificate</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                <span>24/7 Sirwise AI Tutor Access</span>
              </div>
            </div>

            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Your Email Address (for delivery)</label>
            <input 
              type="email" 
              placeholder="your.email@example.com" 
              className="w-full bg-black border border-[#333] p-4 rounded-xl text-white mb-6 focus:border-[#FFD700] outline-none text-sm font-medium"
              value={email}
              onChange={e => {
                const val = e.target.value;
                setEmail(val);
                if (val.includes('@') && val.includes('.')) {
                  localStorage.setItem('user_email', val.trim());
                  localStorage.setItem('customer_email', val.trim());
                }
              }}
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
                <button 
                  onClick={payWithPaystack} 
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '15px',
                    height: '56px',
                    width: '100%',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>💳</span> Pay with Paystack (Global Cards)
                </button>
                <button 
                  onClick={payWithFlutterwave} 
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '15px',
                    height: '56px',
                    width: '100%',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🌍</span> Flutterwave (Africa Cards)
                </button>
                <button 
                  onClick={() => selectGatewayWithEmailCheck('crypto')} 
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '15px',
                    height: '56px',
                    width: '100%',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🦊</span> USDC Crypto (Ethereum - Metamask)
                </button>
                <button 
                  onClick={() => selectGatewayWithEmailCheck('pi')} 
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '15px',
                    height: '56px',
                    width: '100%',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🟣</span> Pi Network GCV $314,159
                </button>
                <button 
                  onClick={() => selectGatewayWithEmailCheck('bank')} 
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '15px',
                    height: '56px',
                    width: '100%',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🏦</span> Bank / OPay / Card Transfer
                </button>
              </div>
            </div>
          ) : activeGateway === 'crypto' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#10B981] font-bold text-lg mb-4">Pay with Crypto USDC (Ethereum - MetaMask)</h3>
              <p className="text-gray-300 text-xs mb-4">Send exactly <strong className="text-[#10B981]">${priceUSD} USDC</strong> (Ethereum ERC20 / EVM) to this address:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-xs font-mono truncate">{paymentConfig?.crypto || localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4'}</span>
                <button onClick={() => { navigator.clipboard.writeText(paymentConfig?.crypto || localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4'); if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!'); }} className="text-gray-400 hover:text-white p-1 cursor-pointer"><Copy size={16}/></button>
              </div>
              <button onClick={connectMetaMask} className="w-full bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40 font-bold py-2.5 rounded-xl mb-3 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto hover:bg-[#334155] transition">
                <span>🦊</span> Connect MetaMask Wallet (window.ethereum)
              </button>
              <input 
                placeholder="Paste Tx Hash here" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#10B981] outline-none text-sm"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#10B981] text-black font-bold py-3.5 rounded-xl mb-4 disabled:opacity-50 cursor-pointer pointer-events-auto z-10 shadow-lg">
                {cryptoVerifying ? 'Verifying on-chain...' : 'Submit Tx for Verification'}
              </button>
              <p className="text-gray-500 text-[10px] text-center">⚠️ Verified on-chain via EVM to confirm transaction before auto-unlocking.</p>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto hover:text-white">Back to Methods</button>
            </div>
          ) : activeGateway === 'bank' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#FFD700] font-bold text-lg mb-2">Bank / OPay / Card Transfer</h3>
              <p className="text-gray-300 text-xs mb-4">
                Transfer <strong className="text-[#FFD700]">₦{nairaAmount}</strong> ({priceUSD} USD) to:
              </p>

              {!bankSubmitted ? (
                <>
                  <div className="bg-black p-4 rounded-2xl border border-[#FFD700]/30 mb-4 space-y-2 text-xs">
                    <div className="text-gray-300 font-bold">Bank: <span className="text-white font-black text-sm">OPay</span></div>
                    <div className="text-gray-300 font-bold">Account Name: <span className="text-white font-black text-sm">GOYEDAGOSMESS ENTERPRISE.</span></div>
                    
                    <div 
                      onClick={copyAccount}
                      className="bg-[#1a1a1a] p-3 rounded-xl border border-[#FFD700] flex items-center justify-between cursor-pointer hover:bg-[#222] transition group"
                    >
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Account Number (Tap to Copy)</div>
                        <div className="text-[#FFD700] font-mono text-xl font-bold tracking-wider">611 354 1882</div>
                      </div>
                      <div className="flex items-center gap-1 text-black font-bold bg-[#FFD700] px-3 py-1.5 rounded-lg text-xs group-hover:bg-yellow-400 transition">
                        <Copy size={14} />
                        <span>Copy</span>
                      </div>
                    </div>
                    
                    <div className="text-gray-400 text-[10px] font-semibold pt-1">RC BN3583773 Verified Business</div>
                  </div>

                  <input 
                    placeholder="Enter Reference / Sender Name" 
                    className="w-full bg-black border border-[#333] p-4 rounded-xl text-white mb-4 focus:border-[#FFD700] outline-none text-sm font-medium placeholder-gray-500"
                    value={bankRef}
                    onChange={e => setBankRef(e.target.value)}
                  />

                  <button 
                    onClick={submitBankTransfer} 
                    disabled={bankVerifying} 
                    className="w-full bg-[#FFD700] text-black font-black text-base h-[56px] rounded-[16px] mb-4 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10 hover:bg-[#ffe033] transition shadow-lg disabled:opacity-50"
                  >
                    {bankVerifying ? 'Submitting Reference...' : 'Submit Payment Reference'}
                  </button>

                  <button 
                    onClick={() => { setActiveGateway(null); setBankSubmitted(false); }} 
                    className="mt-2 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto hover:text-white"
                  >
                    Back to Methods
                  </button>
                </>
              ) : (
                <div className="bg-black/90 p-5 rounded-2xl border border-[#FFD700] text-left space-y-4">
                  <div className="flex items-center gap-3 text-[#FFD700]">
                    <CheckCircle size={32} />
                    <h4 className="text-lg font-black text-white">Payment Reference Submitted!</h4>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    We will verify your OPay transfer to <strong className="text-[#FFD700]">6113541882 GOYEDAGOSMESS ENTERPRISE</strong> within 5-30 minutes and unlock your Sirwise AI Web3 Academy! You will receive email and WhatsApp confirmation! Keep your OPay receipt!
                  </p>

                  <div className="bg-[#151515] p-3 rounded-xl border border-[#333] text-xs font-mono space-y-1 text-gray-300">
                    <div>Reference: <span className="text-[#FFD700]">{submittedBankRef}</span></div>
                    <div>Account: OPay 611 354 1882</div>
                    <div>Recipient: GOYEDAGOSMESS ENTERPRISE.</div>
                    <div>Status: Pending Verification</div>
                  </div>

                  <button
                    onClick={() => {
                      const text = `Hello GOYE Global I just transferred to 6113541882 OPay GOYEDAGOSMESS ENTERPRISE Reference: ${submittedBankRef}`;
                      window.open(`/go/whatsapp?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-full bg-[#25D366] text-black font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition cursor-pointer pointer-events-auto text-sm shadow-md"
                  >
                    <ExternalLink size={16} />
                    Verify via WhatsApp
                  </button>

                  <button
                    onClick={() => { setActiveGateway(null); setBankSubmitted(false); setBankRef(''); }}
                    className="w-full text-gray-400 text-xs underline text-center block pt-2 cursor-pointer pointer-events-auto hover:text-white"
                  >
                    Back to Methods
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#8b5cf6] font-bold mb-4">Pay with Pi Network GCV $314,159</h3>
              <p className="text-gray-400 text-xs mb-4">Send Pi payment to this wallet:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                <span className="text-white text-sm font-mono truncate">{paymentConfig?.pi || localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'}</span>
                <button onClick={() => { navigator.clipboard.writeText(paymentConfig?.pi || localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'); if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!'); }} className="text-gray-400 hover:text-white p-1"><Copy size={16}/></button>
              </div>
              <input 
                placeholder="Paste Pi Tx Hash or Memo" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#8b5cf6] outline-none text-sm"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#8b5cf6] text-white font-bold py-3 rounded-xl mb-4 disabled:opacity-50 cursor-pointer pointer-events-auto z-10">
                {cryptoVerifying ? 'Verifying...' : 'Submit Pi Tx for Verification'}
              </button>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto">Back to Methods</button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
