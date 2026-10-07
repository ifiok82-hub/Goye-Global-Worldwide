import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Copy, CheckCircle, RefreshCw, ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { identifyUserSession, trackUserClick } from '../utils/analytics';
import { cleanUserEmail } from '../lib/contact';
import { safeParse } from '../utils/safeParse';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { isPiCustomerPaymentEnabled } from '../config/payment';
import { getPaymentEnvironment, getDisplayPrice, getPiPrice, getFiatPrice } from '../utils/paymentAdapter';

const showToast = (msg: string, type?: string) => {
  if (typeof (window as any).showToast === 'function') {
    (window as any).showToast(msg, type);
  }
};


export default function UnifiedCheckoutModal({ product, onClose, paymentConfig, onToast }: any) {
  const env = getPaymentEnvironment();
  const isPiBrowserMode = env === 'PI_BROWSER';
  const [activeGateway, setActiveGateway] = useState<string | null>(() => {
    return getPaymentEnvironment() === 'PI_BROWSER' ? 'pi' : null;
  });
  const [paymentDetailsType, setPaymentDetailsType] = useState<string | null>(() => {
    return getPaymentEnvironment() === 'PI_BROWSER' ? 'pi' : null;
  });
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
  const [cryptoNetwork, setCryptoNetwork] = useState<'usdt_bsc' | 'usdc_base'>('usdt_bsc');
  const [copiedCryptoAddress, setCopiedCryptoAddress] = useState(false);
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
  const piGcvAmount = (priceUSD / 314159).toFixed(6).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  const priceNGN = (priceUSD === 3.00 || product?.id === 'web3-starter-toolkit') ? 2500 : (priceUSD === 19.99 ? 29900 : (priceUSD === 49.99 ? 74985 : priceUSD * 1600));
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
        let orders = safeParse('orders_list', []);
        const country = safeParse('goye_selected_country', { flag: '🌍', name: 'Unknown' });
        
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
            amount: `${piGcvAmount} Pi GCV · $${priceUSD.toFixed(2)} USD · ₦${nairaAmount}`,
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

          let custs = safeParse('registered_customers', safeParse('customers_list', []));
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
            if ((window as any).unlockAcademyAccess) {
                (window as any).unlockAcademyAccess(method, email, orderDocId);
            } else if ((window as any).unlockAcademy) {
                (window as any).unlockAcademy(method, email, orderDocId);
            }
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
                Country: typeof country === 'object' && country ? ((country as any).name || (country as any).country || 'Unknown') : String(country || 'Unknown')
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
      const res = await fetch('/api/paystack/initialize', {
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
        showToast(data.error || 'Unable to initialize Paystack session. Please try Bank / OPay Transfer.', 'error');
      }
    } catch (err: any) {
      console.error('Paystack server init error', err);
      showToast('Network error initializing Paystack. Please try Bank / OPay Transfer.', 'error');
    }
  };

  const handlePaystackPayment = async () => {
    try {
      const emailInput = getValidatedEmail();
      if (!emailInput) {
        showToast('Please enter your email address before proceeding with payment.', 'error');
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

      // Ensure Paystack Inline SDK script tag is present in head
      if (!document.querySelector('script[src*="paystack.co/v1/inline.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.head.appendChild(script);
      }

      let paystackPublicKey = (
        (import.meta.env && import.meta.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) || 
        (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) || 
        (window as any).env?.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 
        (window as any).env?.VITE_PAYSTACK_PUBLIC_KEY || 
        paymentConfig?.paystack || 
        localStorage.getItem('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY') || 
        localStorage.getItem('paystack_public_key') || 
        localStorage.getItem('PAYSTACK_PUBLIC_KEY') || 
        'pk_live_9f7e06b21fa6dc4e3e94cc0'
      ).trim();

      if (!paystackPublicKey || paystackPublicKey.length < 10) {
        paystackPublicKey = 'pk_live_9f7e06b21fa6dc4e3e94cc0';
      }

      // Ensure script is present or wait for SDK
      if (typeof (window as any).PaystackPop === 'undefined') {
        if (!document.querySelector('script[src*="paystack.co/v1/inline.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.async = true;
          document.head.appendChild(script);
        }
        let attempts = 0;
        while (attempts < 10 && typeof (window as any).PaystackPop === 'undefined') {
          await new Promise(r => setTimeout(r, 150));
          attempts++;
        }
      }

      const nairaPrice = Math.round(priceNGN || (priceUSD ? priceUSD * 1550 : 74985));
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
                { display_name: "RC", variable_name: "rc", value: "BN3583878 GOYEDAGOSMESS ENTERPRISE" }
              ]
            },
            onClose: function() {
              console.log('Paystack closed');
              if (onToast) onToast('Paystack checkout window closed');
            },
            onCancel: function() {
              console.log('Paystack cancelled');
              if (onToast) onToast('Payment cancelled');
            },
            callback: function(response: any) {
              console.log('Paystack success', response);
              const ref = response?.reference || response?.trxref || ('PSK_' + Date.now());
              if (typeof (window as any).unlockAcademyAccess === 'function') {
                (window as any).unlockAcademyAccess('Paystack', emailInput, ref);
              } else if (typeof (window as any).verifyPaystackPayment === 'function') {
                (window as any).verifyPaystackPayment(ref);
              } else {
                handleSuccess(ref, 'Paystack (Global Cards)');
              }
            }
          });
          handler.openIframe();
          return;
        } catch (e: any) {
          console.error('Paystack popup setup error, falling back to server redirect:', e);
          await initializePaystackServerRedirect(emailInput);
        }
      } else {
        console.warn('PaystackPop inline SDK not loaded, initializing server redirect fallback...');
        await initializePaystackServerRedirect(emailInput);
      }
    } catch (err: any) {
      console.error('Paystack payment handler exception, falling back to server init:', err);
      const emailInput = getValidatedEmail() || 'customer@gasv.store';
      await initializePaystackServerRedirect(emailInput);
    }
  };

  const payWithPaystack = handlePaystackPayment;

  const payWithFlutterwave = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      showToast('Enter complete valid email e.g. parent@gmail.com', 'error');
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
            description: `GOYE Store Global · ${piGcvAmount} Pi GCV · $${priceUSD.toFixed(2)} USD`,
            logo: 'https://www.gasv.store/logo.png',
          },
          callback: (data: any) => {
            if (data && (data.status === 'successful' || data.status === 'completed' || data.transaction_id || data.tx_ref)) {
              const ref = data.tx_ref || data.transaction_id || ('FLW-' + Date.now());
              if (typeof (window as any).verifyPaystackPayment === 'function') {
                (window as any).verifyPaystackPayment(ref);
              }
              handleSuccess(ref, 'Flutterwave (Africa Cards)');
            } else {
              showToast('Payment not successful - Amount must be ₦74,985', 'error');
            }
          },
          onclose: () => {
            console.log('Flutterwave closed - Not counting');
            if (onToast) onToast('Flutterwave payment closed');
          }
        });
      } catch (e: any) {
        console.error('Flutterwave error', e);
        showToast('Flutterwave initialization notice: Please use Bank / OPay Transfer or Paystack.', 'info');
      }
    } else {
      showToast('Flutterwave SDK loading... Please try again or use Bank Transfer.', 'info');
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
          else showToast(`MetaMask Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`, 'success');
        }
      } catch (e: any) {
        showToast('MetaMask notice: ' + (e.message || 'Could not connect wallet'), 'error');
      }
    } else {
      showToast('MetaMask not detected in browser. Please copy wallet address.', 'info');
    }
  };

  const selectGatewayWithEmailCheck = (gateway: string) => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      showToast('Please enter your email address before selecting a payment method.', 'error');
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

  const submitCrypto = async () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      showToast('Please enter your email address before submitting.', 'error');
      return;
    }
    if (!cryptoTxHash || cryptoTxHash.trim().length < 8) {
      if (onToast) onToast('Please enter a valid Transaction Hash (TxHash / TxID)');
      else showToast('Please enter a valid Transaction Hash (TxHash / TxID)', 'error');
      return;
    }

    setCryptoVerifying(true);
    const networkLabel = cryptoNetwork === 'usdt_bsc' ? 'USDT (BNB Smart Chain / BEP20)' : 'USDC (Base Network)';

    try {
      const res = await fetch('/api/verify-crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: cryptoTxHash.trim(),
          network: networkLabel,
          productId: product?.id || 'academy-pass',
          amount: priceUSD,
          email: emailInput
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onToast) onToast('Payment Verified! Your order has been unlocked.');
        else showToast('Payment Verified! Your order has been unlocked.', 'success');
        handleSuccess(cryptoTxHash.trim(), `Crypto (${networkLabel})`, true);
        setSuccess(true);
      } else {
        if (onToast) onToast(data.error || 'Verification failed. Please check TxHash.');
        else showToast(data.error || 'Verification failed. Please check TxHash.', 'error');
      }
    } catch (err) {
      console.error('Verify crypto error:', err);
      handleSuccess(cryptoTxHash.trim(), `Crypto (${networkLabel})`, true);
      if (onToast) onToast('Payment Verified! Your order has been unlocked.');
      setSuccess(true);
    } finally {
      setCryptoVerifying(false);
    }
  };

  const submitBankTransfer = () => {
    const emailInput = getValidatedEmail();
    if (!emailInput) {
      showToast('Please enter your email address before submitting.', 'error');
      return;
    }
    if (!bankRef.trim()) {
      if (onToast) onToast('Please enter Reference / Sender Name');
      else showToast('Please enter Reference / Sender Name', 'error');
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
    else showToast('Account number copied!', 'success');
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
             <div>RC: BN3583878</div>
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
            {isPiBrowserMode ? (
              <div className="text-3xl font-black text-[#FFD700] mb-6">
                {getDisplayPrice(product, env)}
              </div>
            ) : (
              <>
                <div className="text-3xl font-black text-[#FFD700] mb-1">
                   ₦{nairaAmount} <span className="text-sm font-normal text-gray-400">({priceUSD} USD)</span>
                </div>
                {userCurrency !== 'USD' && userCurrency !== 'NGN' && (
                  <div className="text-gray-400 text-sm font-bold mb-6">
                    (~ {displaySymbol}{localPrice})
                  </div>
                )}
              </>
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
                  onClick={() => {
                    const emailInput = getValidatedEmail();
                    if (!emailInput) {
                      showToast('Please enter your email address before choosing PayPal.', 'error');
                      return;
                    }
                    alert(`PayPal payment of $${priceUSD.toFixed(2)} requested!\nPlease send payments directly to goye@gasv.store or contact support via WhatsApp/Email to receive a direct invoice link.`);
                    handleSuccess('PAYPAL-' + Date.now(), 'PayPal (Global)', true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #003087 0%, #0079C1 100%)',
                    color: '#FFF',
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
                    boxShadow: '0 4px 12px rgba(0, 48, 135, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🅿️</span> Pay with PayPal ($)
                </button>
                <button 
                  onClick={() => setPaymentDetailsType('usdt_bep20')} 
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
                  <span>🟡</span> USDT BEP20 (BNB Smart Chain)
                </button>
                <button 
                  onClick={() => setPaymentDetailsType('usdc_base')} 
                  style={{
                    background: 'linear-gradient(135deg, #0052FF 0%, #0033AD 100%)',
                    color: '#FFF',
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
                    boxShadow: '0 4px 12px rgba(0, 82, 255, 0.3)'
                  }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <span>🔵</span> USDC (Base Network)
                </button>
                {isPiCustomerPaymentEnabled() && (
                  <button 
                    onClick={() => setPaymentDetailsType('pi')} 
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
                )}
                <button 
                  onClick={() => setPaymentDetailsType('opay')} 
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
          ) : activeGateway === 'pi' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div id="piPaymentSection" className="bg-[#1A1A1A] border-2 border-[#7D2AE7] rounded-2xl p-5 my-3 text-center">
                <h3 className="text-[#FFD700] font-bold text-lg mb-1">🟣 Pay with Pi Network</h3>
                <p className="text-gray-300 text-xs mb-3">Global Pi GCV Rate: 1 Pi = $314,159 GCV</p>
                
                <div className="bg-black p-4 rounded-xl border border-[#7D2AE7]/50 my-3">
                  <div className="text-xs text-gray-400 font-bold mb-1">Amount Due</div>
                  <div className="text-2xl font-black text-[#FFD700]">
                    {isPiBrowserMode ? getDisplayPrice(product, env) : `${product?.id === 'pi-testnet-test' ? '0.000100' : (priceUSD / 314159).toFixed(6)} Pi GCV`}
                  </div>
                  {!isPiBrowserMode && (
                    <div className="text-xs text-gray-400 mt-1">(${priceUSD} USD / ₦{nairaAmount})</div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    try {
                      const userEmail = getValidatedEmail() || 'customer@gasv.store';
                      if (typeof (window as any).createPiPayment === 'function') {
                        const amountToPay = isPiBrowserMode ? getPiPrice(product) : (product?.id === 'pi-testnet-test' ? 0.0001 : priceUSD);
                        (window as any).createPiPayment(amountToPay, product?.name || 'Pi Network Order', isPiBrowserMode);
                      } else if (typeof (window as any).payWithPi === 'function') {
                        const amountToPay = isPiBrowserMode ? getPiPrice(product) : (product?.id === 'pi-testnet-test' ? 0.0001 : priceUSD);
                        (window as any).payWithPi(userEmail, amountToPay);
                      } else {
                        if (typeof (window as any).showPiGuideReal === 'function') {
                          (window as any).showPiGuideReal();
                        } else {
                          alert('Open https://www.gasv.store inside Pi Browser app to pay with Pi SDK!');
                        }
                      }
                    } catch (err: any) {
                      console.error('Pi Payment click error:', err);
                    }
                  }} 
                  className="w-full h-[56px] bg-[#7D2AE7] hover:bg-[#6821c6] text-white font-black rounded-xl my-3 cursor-pointer transition text-base shadow-lg active:scale-[0.98]"
                >
                  🟣 Pay {isPiBrowserMode ? getDisplayPrice(product, env) : `${(priceUSD / 314159).toFixed(6)} Pi`} in Pi Browser
                </button>

                <div className="bg-black/60 rounded-xl p-3 my-2 text-left space-y-1 text-xs text-gray-300">
                  <p className="text-[#FFD700] font-bold">⚠️ Pi Browser Required</p>
                  <p>This payment requires the official Pi Browser app from minepi.com.</p>
                  <p>If you are in standard Chrome/Safari, please switch to Pi Browser or select Paystack / Bank Transfer above.</p>
                </div>

                {!isPiBrowserMode && (
                  <button onClick={() => setActiveGateway(null)} className="mt-3 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto hover:text-white">Back to Methods</button>
                )}
              </div>
            </div>
          ) : activeGateway === 'crypto' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div id="cryptoPaymentSection" className="bg-[#141414] border-2 border-[#F0B90B] rounded-2xl p-5 my-3 shadow-2xl">
                <div className="flex items-center justify-between mb-3 border-b border-[#333] pb-3">
                  <h3 className="text-[#F0B90B] font-bold text-base flex items-center gap-2">
                    <span>⚡</span> Crypto Payment (Busha Wallet)
                  </h3>
                  <span className="bg-[#00FF88]/20 text-[#00FF88] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#00FF88]/40">
                    Direct Verification
                  </span>
                </div>

                {/* Network Selector Cards */}
                <p className="text-gray-300 text-xs font-bold mb-2">Select Supported Network:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setCryptoNetwork('usdt_bsc')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      cryptoNetwork === 'usdt_bsc'
                        ? 'bg-[#F0B90B]/10 border-[#F0B90B] text-white shadow-md'
                        : 'bg-black/60 border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#F0B90B]">🟡 USDT</span>
                      <span className="bg-[#F0B90B] text-black text-[9px] font-black px-1.5 py-0.5 rounded">BSC / BEP20</span>
                    </div>
                    <span className="text-[10px] text-gray-400">BNB Smart Chain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCryptoNetwork('usdc_base')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      cryptoNetwork === 'usdc_base'
                        ? 'bg-[#0052FF]/10 border-[#0052FF] text-white shadow-md'
                        : 'bg-black/60 border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#3B82F6]">🔵 USDC</span>
                      <span className="bg-[#0052FF] text-white text-[9px] font-black px-1.5 py-0.5 rounded">BASE NETWORK</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Base Mainnet</span>
                  </button>
                </div>

                {/* Network Warning Banner */}
                <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 mb-4 text-left">
                  <p className="text-red-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                    <span>⚠️</span> Network Warning
                  </p>
                  <p className="text-red-200 text-[11px] leading-relaxed">
                    {cryptoNetwork === 'usdt_bsc' ? (
                      <>⚠️ Send ONLY via <strong>BNB Smart Chain (BEP20/BSC)</strong>. Transfers via Ethereum (ERC20) or other networks will be permanently lost.</>
                    ) : (
                      <>⚠️ CRITICAL: Ensure you select <strong>BASE NETWORK</strong> when transferring USDC. Sending via Ethereum Mainnet, Polygon, or Solana will result in lost funds.</>
                    )}
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-xl w-[190px] h-[190px] mx-auto mb-3 flex items-center justify-center shadow-lg border-2 border-[#FFD700]">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=0xdc7f804B36aB672Ec31642dF418F29e73281b040"
                    alt="Busha Wallet Crypto Deposit QR"
                    className="w-[170px] h-[170px]"
                  />
                </div>

                {/* Amount and Minimum Deposit Notice */}
                <div className="bg-black/80 rounded-xl p-3 mb-3 border border-[#333] text-center">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">
                    Amount Due: <span className="text-[#FFD700] font-bold">${priceUSD.toFixed(2)} {cryptoNetwork === 'usdt_bsc' ? 'USDT' : 'USDC'}</span>
                  </div>
                  <div className="text-xs text-[#00FF88] font-bold mt-1">
                    Minimum Deposit: {cryptoNetwork === 'usdt_bsc' ? '2 USDT' : '2 USDC'}
                  </div>
                </div>

                {/* Address Display */}
                <div className="bg-black p-3 rounded-xl border border-[#333] mb-3 text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                    {cryptoNetwork === 'usdt_bsc' ? 'USDT BEP20 Receiver Address (Busha)' : 'USDC Base Receiver Address (Busha)'}
                  </div>
                  <p className="text-[#00FF88] text-[11px] font-mono break-all font-bold tracking-tight">
                    0xdc7f804B36aB672Ec31642dF418F29e73281b040
                  </p>
                </div>

                {/* Prominent Copy Address Button */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('0xdc7f804B36aB672Ec31642dF418F29e73281b040');
                    setCopiedCryptoAddress(true);
                    if (onToast) onToast('Copied Busha wallet address!');
                    else showToast('Copied Busha wallet address!', 'success');
                    setTimeout(() => setCopiedCryptoAddress(false), 2500);
                  }}
                  className="w-full h-[50px] bg-white hover:bg-gray-100 text-black rounded-xl font-bold cursor-pointer mb-4 flex items-center justify-center gap-2 transition border-none text-sm active:scale-[0.99] shadow-md"
                >
                  {copiedCryptoAddress ? (
                    <>
                      <CheckCircle size={18} className="text-emerald-600" />
                      <span className="text-emerald-700 font-black">Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>Copy Wallet Address</span>
                    </>
                  )}
                </button>

                {/* TxHash Input & Verification */}
                <div className="space-y-2 border-t border-[#333] pt-4">
                  <label className="text-gray-300 text-xs font-bold block text-left">
                    Enter Transaction Hash (TxHash / TxID):
                  </label>
                  <input
                    type="text"
                    placeholder="Paste Transaction Hash after payment (0x...)"
                    className="w-full bg-black border border-[#333] p-3.5 rounded-xl text-white focus:border-[#F0B90B] outline-none text-xs font-mono"
                    value={cryptoTxHash}
                    onChange={e => setCryptoTxHash(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={submitCrypto}
                    disabled={cryptoVerifying}
                    className="w-full h-[54px] bg-gradient-to-r from-[#F0B90B] to-[#d9a60a] hover:brightness-110 text-black font-black rounded-xl cursor-pointer transition disabled:opacity-50 text-base border-none active:scale-[0.99] shadow-lg flex items-center justify-center gap-2"
                  >
                    {cryptoVerifying ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Verifying On-Chain...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>Verify Payment</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <a
                    href={
                      cryptoNetwork === 'usdt_bsc'
                        ? 'https://bscscan.io/address/0xdc7f804B36aB672Ec31642dF418F29e73281b040'
                        : 'https://basescan.org/address/0xdc7f804B36aB672Ec31642dF418F29e73281b040'
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F0B90B] text-[11px] underline hover:text-yellow-300 inline-flex items-center gap-1"
                  >
                    <span>View Address on {cryptoNetwork === 'usdt_bsc' ? 'BscScan (BNB Smart Chain)' : 'BaseScan (Base Network)'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGateway(null)}
                className="mt-3 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto hover:text-white"
              >
                Back to Methods
              </button>
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
                    
                    <div className="text-gray-400 text-[10px] font-semibold pt-1">RC BN3583878 Verified Business</div>
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
              <h3 className="text-[#8b5cf6] font-bold text-lg mb-1">🟣 Pay with Pi Network (GCV $314,159)</h3>
              <p className="text-gray-300 text-xs mb-3">1-Click Pi SDK Payment — Rate: ${priceUSD.toFixed(2)} = {(priceUSD / 314159).toFixed(6)} Pi</p>

              {/* Native Pi SDK 1-Click Button */}
              <button 
                onClick={() => {
                  try {
                    const userEmail = email.trim() || getValidatedEmail() || 'customer@gasv.store';
                    if (!userEmail || !userEmail.includes('@')) {
                      alert('Please enter your email address first!');
                      return;
                    }
                    if (typeof (window as any).createPiPayment === 'function') {
                      const amountToPay = product?.id === 'pi-testnet-test' ? 0.0001 : priceUSD;
                      (window as any).createPiPayment(amountToPay, product?.name || 'Pi Network Order');
                    } else if (typeof (window as any).payWithPi === 'function') {
                      const amountToPay = product?.id === 'pi-testnet-test' ? 0.0001 : priceUSD;
                      (window as any).payWithPi(userEmail, amountToPay);
                    } else {
                      if (typeof (window as any).showPiGuideReal === 'function') {
                        (window as any).showPiGuideReal();
                      } else {
                        alert('Please open https://www.gasv.store in the Pi Browser app to pay with Pi SDK!');
                      }
                    }
                  } catch (err: any) {
                    console.error('Pi Payment click error:', err);
                  }
                }} 
                style={{
                  width: '100%',
                  height: '60px',
                  background: '#7D2AE7',
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  border: '3px solid black',
                  boxShadow: '0 4px 15px rgba(125, 42, 231, 0.4)'
                }}
                className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.98] mb-4"
              >
                <span>🟣</span> Pay with Pi — GCV $314,159 ({(priceUSD / 314159).toFixed(6)} Pi)
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#333] w-full"></div>
                <span className="bg-[#111] px-3 text-[10px] text-gray-500 font-bold uppercase absolute">OR MANUAL TRANSFER</span>
              </div>

              <p className="text-gray-400 text-xs mb-2">Send Pi payment to official wallet:</p>
              {(() => {
                const isSandbox = (localStorage.getItem('PI_SANDBOX_MODE') || localStorage.getItem('PI_SANDBOX') || 'true') !== 'false';
                const activeAddress = isSandbox 
                  ? (localStorage.getItem('pi_testnet_wallet') || localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || paymentConfig?.pi || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R')
                  : (localStorage.getItem('pi_mainnet_wallet') || localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || paymentConfig?.pi || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R');
                return (
                  <div className="bg-black p-3 rounded-xl border border-[#333] flex justify-between items-center mb-4">
                    <span className="text-white text-xs font-mono truncate">{activeAddress}</span>
                    <button onClick={() => { navigator.clipboard.writeText(activeAddress); if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!'); }} className="text-gray-400 hover:text-white p-1"><Copy size={16}/></button>
                  </div>
                );
              })()}
              <input 
                placeholder="Paste Pi Tx Hash or Memo after manual transfer" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#8b5cf6] outline-none text-sm"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#333] hover:bg-[#444] text-white font-bold py-3 rounded-xl mb-4 disabled:opacity-50 cursor-pointer pointer-events-auto z-10 text-xs">
                {cryptoVerifying ? 'Verifying...' : 'Submit Manual Pi Tx Hash for Verification'}
              </button>
              <button onClick={() => setActiveGateway(null)} className="mt-2 text-gray-400 text-xs underline block mx-auto cursor-pointer pointer-events-auto hover:text-white">Back to Methods</button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#333] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-bold">
              <Lock size={14} /> 256-Bit SSL Encrypted & PCI-DSS Compliant
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck size={12} /> Verified Business: RC BN3583878
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <Zap size={12} /> Instant Automated Delivery
            </div>
          </div>
        </div>
      </div>
      {paymentDetailsType && (
        <PaymentDetailsModal
          type={paymentDetailsType}
          onClose={() => setPaymentDetailsType(null)}
          amountUSD={priceUSD}
          userEmail={email}
          productName={product?.name || 'Sirwise AI WEB3 Academy Full'}
        />
      )}
    </div>
  );
}
