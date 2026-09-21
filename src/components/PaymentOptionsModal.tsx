import React, { useState } from 'react';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { isPiCustomerPaymentEnabled } from '../config/payment';

interface PaymentOptionsModalProps {
  onClose: () => void;
  product?: any;
}

export const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({ onClose, product }) => {
  const [selected, setSelected] = useState('paystack');
  const [detailsType, setDetailsType] = useState<string | null>(null);
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('user_email') || localStorage.getItem('customer_email') || '';
  });
  const [txHash, setTxHash] = useState('');

  const productName = product?.name || 'Sirwise AI Web3 Academy Full - 8 Modules';
  const priceUSD = product?.price || 49.99;
  const priceNGN = Math.round(priceUSD * 1500);

  const getEmail = (): string | null => {
    let clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      clean = (prompt('Enter your email for payment receipt and instant access delivery:') || '').trim().toLowerCase();
      if (clean && clean.includes('@') && clean.includes('.')) {
        setEmail(clean);
        localStorage.setItem('user_email', clean);
        localStorage.setItem('customer_email', clean);
        return clean;
      }
      alert('Please enter a valid email address.');
      return null;
    }
    localStorage.setItem('user_email', clean);
    localStorage.setItem('customer_email', clean);
    return clean;
  };

  const getValidPaystackKey = (): string => {
    let key = (
      (import.meta.env && import.meta.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) ||
      (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) ||
      (window as any).env?.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      (window as any).env?.VITE_PAYSTACK_PUBLIC_KEY ||
      localStorage.getItem('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY') ||
      localStorage.getItem('PAYSTACK_PUBLIC_KEY') ||
      localStorage.getItem('paystack_public_key') ||
      'pk_live_9f7e06b21fa6dc4e3e94cc0'
    ).trim();

    return key && key.length >= 10 ? key : 'pk_live_9f7e06b21fa6dc4e3e94cc0';
  };

  const handlePaystackServerInit = async (userEmail: string) => {
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, amountUsd: priceUSD, currencyCode: 'USD' })
      });
      const data = await res.json();
      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        window.location.href = `/payment/verify?reference=goye-paystack-${Date.now()}`;
      }
    } catch (e) {
      window.location.href = `/payment/verify?reference=goye-paystack-${Date.now()}`;
    }
  };

  const handlePaystack = async () => {
    const userEmail = getEmail();
    if (!userEmail) return;

    if ((window as any).trackClick) {
      (window as any).trackClick('paystack_checkout_click', { amount: priceUSD, email: userEmail });
    }

    const paystackKey = getValidPaystackKey();

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

    if (typeof (window as any).PaystackPop !== 'undefined' && typeof (window as any).PaystackPop.setup === 'function') {
      try {
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: userEmail,
          amount: Math.round(priceNGN || (priceUSD ? priceUSD * 1550 : 74985)) * 100, // in kobo
          currency: 'NGN',
          ref: 'GOYE_' + Date.now(),
          onClose: () => alert('Paystack checkout closed.'),
          callback: (response: any) => {
            const ref = response.reference || response.trxref || ('PSK_' + Date.now());
            if ((window as any).trackLead) {
              (window as any).trackLead({ email: userEmail, source: 'Paystack Order', ref, amount: priceUSD });
            }
            alert(`🎉 Payment Successful!\nRef: ${ref}\n\nFull Academy Unlocked! RC BN3583773`);
            localStorage.setItem('sirwise_paid', 'true');
            localStorage.setItem('academy_unlocked', 'true');
            localStorage.setItem('payment_verified', 'true');
            if (typeof (window as any).unlockAcademyAccess === 'function') {
              (window as any).unlockAcademyAccess('Paystack', userEmail, ref);
            } else {
              window.location.hash = '#academy';
              window.location.reload();
            }
          }
        });
        handler.openIframe();
        return;
      } catch (err) {
        console.error('Paystack popup setup error:', err);
      }
    }

    handlePaystackServerInit(userEmail);
  };

  const handleFlutterwave = () => {
    const userEmail = getEmail();
    if (!userEmail) return;

    if ((window as any).trackClick) {
      (window as any).trackClick('flutterwave_checkout_click', { amount: priceUSD, email: userEmail });
    }

    if (typeof (window as any).FlutterwaveCheckout !== 'function') {
      alert('Flutterwave SDK loading... Please check connection.');
      return;
    }

    try {
      (window as any).FlutterwaveCheckout({
        public_key: 'FLWPUBK-cbb518a9b8f74421e887f4a1ec911ea7-X',
        tx_ref: 'GOYE_FW_' + Date.now(),
        amount: priceUSD,
        currency: 'USD',
        customer: {
          email: userEmail,
          name: userEmail.split('@')[0] || 'Goye Customer'
        },
        customizations: {
          title: productName,
          description: 'Goye Store Global - RC BN3583773',
          logo: 'https://gasv.store/logo.png'
        },
        callback: (data: any) => {
          const ref = data.transaction_id || data.tx_ref || ('FW_' + Date.now());
          alert(`🎉 Flutterwave Payment Successful! Ref: ${ref}\nFull Access Unlocked!`);
          localStorage.setItem('sirwise_paid', 'true');
          localStorage.setItem('academy_unlocked', 'true');
          localStorage.setItem('payment_verified', 'true');
          if ((window as any).unlockAcademyAccess) {
            (window as any).unlockAcademyAccess('Flutterwave', userEmail, ref);
          }
          onClose();
          window.location.hash = 'academy';
          window.location.reload();
        },
        onclose: () => alert('Flutterwave checkout closed.')
      });
    } catch (err) {
      console.error('Flutterwave error:', err);
      alert('Flutterwave error. Please try Paystack or Bank Transfer.');
    }
  };

  const handleUSDT = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('usdt_bep20_click', { address: '0xdc7f804B36aB672Ec31642dF418F29e73281b040' });
    }
    setDetailsType('usdt_bep20');
  };

  const handleUSDC = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('usdc_base_click', { address: '0xdc7f804B36aB672Ec31642dF418F29e73281b040' });
    }
    setDetailsType('usdc_base');
  };

  const handlePi = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('pi_gcv_click', { gcv: '$314,159' });
    }
    setDetailsType('pi');
  };

  const handleBank = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('bank_transfer_click', {});
    }
    setDetailsType('opay');
  };

  const handlePayNow = () => {
    if (selected === 'paystack') handlePaystack();
    else if (selected === 'flutterwave') handleFlutterwave();
    else if (selected === 'usdt') handleUSDT();
    else if (selected === 'usdc') handleUSDC();
    else if (selected === 'pi') handlePi();
    else if (selected === 'bank') handleBank();
  };

  if (detailsType) {
    return (
      <PaymentDetailsModal
        type={detailsType}
        onClose={() => setDetailsType(null)}
        amountUSD={priceUSD}
        userEmail={email}
        productName={productName}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}>
      <div style={{ background: '#111', border: '2px solid #FFD700', borderRadius: '20px', padding: '24px', maxWidth: '460px', width: '100%', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ color: '#FFD700', fontWeight: 900, fontSize: '20px', margin: 0 }}>🎓 Upgrade to Full Academy</h2>
          <button onClick={onClose} style={{ background: '#222', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '50%', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>

        <p style={{ color: 'white', margin: '4px 0 12px 0', fontSize: '13px' }}>
          8 Complete Modules • Certificate • RC BN3583773 • 190+ Countries • Lifetime Access
        </p>

        <div style={{ background: '#1a1a00', border: '1px solid #FFD700', padding: '12px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center' }}>
          <span style={{ color: '#FFD700', fontWeight: 900, fontSize: '20px' }}>${priceUSD} USD</span>
          <span style={{ color: '#ccc', fontSize: '12px', display: 'block', marginTop: '2px' }}>
            ≈ ₦{priceNGN.toLocaleString()} {isPiCustomerPaymentEnabled() ? '• ≈ 0.000159 Pi GCV ($314,159)' : ''}
          </span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Your Email for Access & Receipt:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your valid email address"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#000', border: '1px solid #444', color: 'white', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <p style={{ color: '#FFD700', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>CHOOSE PAYMENT METHOD:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            onClick={() => setSelected('paystack')}
            style={{ border: selected === 'paystack' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'paystack' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="radio" name="payment_option" checked={selected === 'paystack'} onChange={() => setSelected('paystack')} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>💳 Paystack (Global Cards)</div>
                <div style={{ color: '#888', fontSize: '11px' }}>Visa, Mastercard, Verve, Bank</div>
              </div>
            </div>
            <span style={{ background: '#00C3F8', color: 'black', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>INSTANT</span>
          </label>

          <label 
            onClick={() => setSelected('flutterwave')}
            style={{ border: selected === 'flutterwave' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'flutterwave' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="radio" name="payment_option" checked={selected === 'flutterwave'} onChange={() => setSelected('flutterwave')} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>🌊 Flutterwave</div>
                <div style={{ color: '#888', fontSize: '11px' }}>Cards, Mobile Money, Paypal, Transfer</div>
              </div>
            </div>
            <span style={{ background: '#FB9129', color: 'black', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>GLOBAL</span>
          </label>

          <label 
            onClick={() => setSelected('usdt')}
            style={{ border: selected === 'usdt' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'usdt' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="radio" name="payment_option" checked={selected === 'usdt'} onChange={() => setSelected('usdt')} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>🟡 USDT (BEP20 BSC)</div>
                <div style={{ color: '#888', fontSize: '11px' }}>0xdc7f804B...b040</div>
              </div>
            </div>
            <span style={{ background: '#26A17B', color: 'white', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>CRYPTO</span>
          </label>

          <label 
            onClick={() => setSelected('usdc')}
            style={{ border: selected === 'usdc' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'usdc' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="radio" name="payment_option" checked={selected === 'usdc'} onChange={() => setSelected('usdc')} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>🔵 USDC (Base Network)</div>
                <div style={{ color: '#888', fontSize: '11px' }}>0xdc7f804B...b040</div>
              </div>
            </div>
            <span style={{ background: '#2775CA', color: 'white', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>CRYPTO</span>
          </label>

          {isPiCustomerPaymentEnabled() && (
            <label 
              onClick={() => setSelected('pi')}
              style={{ border: selected === 'pi' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'pi' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="radio" name="payment_option" checked={selected === 'pi'} onChange={() => setSelected('pi')} />
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>💜 Pi Network GCV</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>0.000159 Pi ≈ $49.99 (GCV $314,159)</div>
                </div>
              </div>
              <span style={{ background: '#7A3ED6', color: 'white', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>PI BROWSER</span>
            </label>
          )}

          <label 
            onClick={() => setSelected('bank')}
            style={{ border: selected === 'bank' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'bank' ? '#222' : '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="radio" name="payment_option" checked={selected === 'bank'} onChange={() => setSelected('bank')} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>🏦 Bank / OPay Transfer</div>
                <div style={{ color: '#888', fontSize: '11px' }}>OPay 6113541882 • GOYE STORE</div>
              </div>
            </div>
            <span style={{ background: '#10B981', color: 'black', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>NAIRA</span>
          </label>
        </div>

        <button
          onClick={handlePayNow}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: 'black',
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            fontWeight: 900,
            fontSize: '16px',
            marginTop: '18px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
          }}
        >
          🚀 PROCEED WITH PAYMENT — ${priceUSD} USD
        </button>

        <button onClick={onClose} style={{ background: 'transparent', color: '#888', width: '100%', padding: '10px', marginTop: '6px', cursor: 'pointer', border: 'none', fontSize: '13px' }}>
          Cancel
        </button>

        <p style={{ color: '#666', fontSize: '10px', marginTop: '10px', textAlign: 'center' }}>
          100% SSL Encrypted • RC BN3583773 • goyedagosmess@gmail.com • 190+ Countries
        </p>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
