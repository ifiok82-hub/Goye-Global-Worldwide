import React, { useState } from 'react';

interface PaymentOptionsModalProps {
  onClose: () => void;
  product?: any;
}

export const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({ onClose, product }) => {
  const [selected, setSelected] = useState('paystack');
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

  const getValidPaystackKey = (): string | null => {
    let key = (
      localStorage.getItem('paystack_public_key') ||
      (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) ||
      (window as any).env?.VITE_PAYSTACK_PUBLIC_KEY ||
      ''
    ).trim();

    const isValidFormat = (k: string) => (k.startsWith('pk_live_') || k.startsWith('pk_test_')) && k.length >= 32;

    if (isValidFormat(key)) {
      return key;
    }

    const inputKey = prompt(
      '🔑 Paystack Public Key Required:\n\nPlease enter your Paystack Public Key from paystack.com Dashboard (Settings -> API Keys & Webhooks):\n(Must start with pk_live_ or pk_test_)',
      key
    );

    if (inputKey) {
      const cleanKey = inputKey.trim();
      if (isValidFormat(cleanKey)) {
        localStorage.setItem('paystack_public_key', cleanKey);
        return cleanKey;
      }
    }

    return null;
  };

  const handlePaystack = () => {
    const userEmail = getEmail();
    if (!userEmail) return;

    if ((window as any).trackClick) {
      (window as any).trackClick('paystack_checkout_click', { amount: priceUSD, email: userEmail });
    }

    const paystackKey = getValidPaystackKey();

    if (!paystackKey) {
      alert('Paystack Public Key not configured or invalid.\n\nSwitching to Bank / OPay Transfer & Flutterwave options...');
      handleBank();
      return;
    }

    if (typeof (window as any).PaystackPop === 'undefined') {
      alert('Paystack loading... Please check your connection and try again.');
      return;
    }

    try {
      const handler = (window as any).PaystackPop.setup({
        key: paystackKey,
        email: userEmail,
        amount: priceNGN * 100, // in kobo
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
          
          if ((window as any).unlockAcademyAccess) {
            (window as any).unlockAcademyAccess('Paystack', userEmail, ref);
          }
          onClose();
          window.location.hash = 'academy';
          window.location.reload();
        }
      });
      handler.openIframe();
    } catch (err) {
      console.error('Paystack error:', err);
      alert('Paystack error. Switching to Bank / OPay Transfer...');
      handleBank();
    }
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
    const addr = '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96';
    navigator.clipboard.writeText(addr);
    if ((window as any).trackClick) {
      (window as any).trackClick('usdt_bep20_click', { address: addr });
    }
    alert(`🟡 USDT BEP20 (BNB Smart Chain)\n\nAddress Copied:\n${addr}\n\nAmount: $${priceUSD} USDT\nNetwork: BEP20 (BSC)\n\nAfter payment, send your Tx Hash + email to goyedagosmess@gmail.com for instant manual verification.\nRC BN3583773`);
  };

  const handleUSDC = () => {
    const addr = '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96';
    navigator.clipboard.writeText(addr);
    if ((window as any).trackClick) {
      (window as any).trackClick('usdc_base_click', { address: addr });
    }
    alert(`🔵 USDC (Base Network / BSC)\n\nAddress Copied:\n${addr}\n\nAmount: $${priceUSD} USDC\nNetwork: Base / BSC\n\nSend Tx Hash + email to goyedagosmess@gmail.com\nRC BN3583773`);
  };

  const handlePi = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('pi_gcv_click', { gcv: '$314,159' });
    }
    if ((window as any).Pi) {
      (window as any).Pi.createPayment(
        {
          amount: 0.000159,
          memo: `Goye Store Global - ${productName} - RC BN3583773`,
          metadata: { product: productName, price: priceUSD.toString() }
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            }).catch(() => {});
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            }).then(() => {
              alert('🎉 Pi Payment Success! TX: ' + txid + '\nAcademy Unlocked!');
              localStorage.setItem('sirwise_paid', 'true');
              localStorage.setItem('academy_unlocked', 'true');
              localStorage.setItem('payment_verified', 'true');
              onClose();
              window.location.hash = 'academy';
              window.location.reload();
            });
          },
          onCancel: () => alert('Pi Payment Cancelled'),
          onError: (e: any) => alert('Pi Error: ' + JSON.stringify(e))
        }
      );
    } else {
      alert(`💜 Pay with Pi GCV ($314,159)\n\nPlease open www.gasv.store in Pi Browser to execute instant Pi payments.\n\nTransfer to Pi Username: @SirwiseGoye\nAmount: 0.000159 Pi ≈ $49.99\n\nRC BN3583773`);
      window.open('https://minepi.com', '_blank');
    }
  };

  const handleBank = () => {
    if ((window as any).trackClick) {
      (window as any).trackClick('bank_transfer_click', {});
    }
    alert(`🏦 Bank Transfer / OPay\n\nBank: OPay\nAccount Number: 6113541882\nAccount Name: GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE\nAmount: ₦${priceNGN.toLocaleString()} or $${priceUSD}\n\nAfter transfer, send proof + your email to:\nEmail: goyedagosmess@gmail.com\nWhatsApp: +2348162811195\nRC BN3583773 - Instant Unlock within 5 mins`);
  };

  const handlePayNow = () => {
    if (selected === 'paystack') handlePaystack();
    else if (selected === 'flutterwave') handleFlutterwave();
    else if (selected === 'usdt') handleUSDT();
    else if (selected === 'usdc') handleUSDC();
    else if (selected === 'pi') handlePi();
    else if (selected === 'bank') handleBank();
  };

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
          <span style={{ color: '#ccc', fontSize: '12px', display: 'block', marginTop: '2px' }}>≈ ₦{priceNGN.toLocaleString()} • ≈ 0.000159 Pi GCV ($314,159)</span>
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
                <div style={{ color: '#888', fontSize: '11px' }}>0x66e19089f...ffe96</div>
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
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>🔵 USDC (Base / BSC)</div>
                <div style={{ color: '#888', fontSize: '11px' }}>0x66e19089f...ffe96</div>
              </div>
            </div>
            <span style={{ background: '#2775CA', color: 'white', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>CRYPTO</span>
          </label>

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
