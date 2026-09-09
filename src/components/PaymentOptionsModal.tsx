import React, { useState } from 'react';

interface PaymentOptionsModalProps {
  onClose: () => void;
}

export const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({ onClose }) => {
  const [selected, setSelected] = useState('pi');

  const handlePayNow = () => {
    if (selected === 'pi') {
      if ((window as any).Pi) {
        (window as any).Pi.createPayment(
          {
            amount: 0.000159,
            memo: "Goye Store Global Sirwise AI WEB3 Academy Full - 8 Modules",
            metadata: { type: "academy-full" }
          },
          {
            onReadyForServerApproval: (paymentId: string) => {
              fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
              });
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
              fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid })
              }).then(() => {
                alert('Pi Payment Success! Full Academy Unlocked!');
                onClose();
              });
            },
            onCancel: () => alert('Pi Payment Cancelled'),
            onError: (e: any) => alert('Pi Error: ' + e)
          }
        );
      } else {
        alert('Open in Pi Browser to Pay with Pi! gasv.store - Pi GCV $314,159 - RC BN3583773');
        window.open('https://minepi.com', '_blank');
      }
    } else if (selected === 'bank') {
      alert('Bank Transfer Details:\nBank: [Your Bank]\nAccount: [Number]\nName: GOYE STORE GLOBAL\nAmount: ₦75,000\nAfter transfer send proof to goyedagosmess@gmail.com with your email. RC BN3583773 - 190+ Countries');
    } else if (selected === 'usdt') {
      alert('USDT Payment:\nAddress TRC20: [Your USDT Address]\nAmount: $49.99\nAfter payment send TXID to goyedagosmess@gmail.com');
    } else if (selected === 'card') {
      window.open('https://paystack.com/pay/goye-academy-4999', '_blank') || alert('Card payment link - Contact goyedagosmess@gmail.com - RC BN3583773');
    } else if (selected === 'paypal') {
      window.open('https://paypal.me/goyeacademy/49.99', '_blank');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}>
      <div style={{ background: '#111', border: '2px solid #FFD700', borderRadius: '16px', padding: '20px', maxWidth: '420px', width: '100%' }}>
        <h2 style={{ color: '#FFD700', fontWeight: 900, fontSize: '20px' }}>🎓 Upgrade to Full Academy</h2>
        <p style={{ color: 'white', margin: '8px 0' }}>8 Modules • Certificate • RC BN3583773 • 190+ Countries • Lifetime Access</p>
        <p style={{ color: '#10B981', fontWeight: 900, fontSize: '18px', margin: '12px 0' }}>$49.99 • ≈0.000159 Pi GCV $314,159 • ₦75,000</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          <label style={{ border: selected === 'pi' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'pi' ? '#1a1a00' : 'black', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment_option" checked={selected === 'pi'} onChange={() => setSelected('pi')} />
            <span style={{ color: 'white', fontWeight: 700 }}>💜 Pay with Pi - Pi Browser - GCV $314,159</span>
          </label>
          <label style={{ border: selected === 'card' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'card' ? '#1a1a00' : 'black', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment_option" checked={selected === 'card'} onChange={() => setSelected('card')} />
            <span style={{ color: 'white', fontWeight: 700 }}>💳 Pay with Card - Visa/Mastercard $49.99</span>
          </label>
          <label style={{ border: selected === 'bank' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'bank' ? '#1a1a00' : 'black', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment_option" checked={selected === 'bank'} onChange={() => setSelected('bank')} />
            <span style={{ color: 'white', fontWeight: 700 }}>🏦 Bank Transfer - Naira ₦75,000</span>
          </label>
          <label style={{ border: selected === 'usdt' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'usdt' ? '#1a1a00' : 'black', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment_option" checked={selected === 'usdt'} onChange={() => setSelected('usdt')} />
            <span style={{ color: 'white', fontWeight: 700 }}>₮ USDT - TRC20/BEP20 $49.99</span>
          </label>
          <label style={{ border: selected === 'paypal' ? '2px solid #FFD700' : '1px solid #333', borderRadius: '12px', padding: '12px', cursor: 'pointer', background: selected === 'paypal' ? '#1a1a00' : 'black', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment_option" checked={selected === 'paypal'} onChange={() => setSelected('paypal')} />
            <span style={{ color: 'white', fontWeight: 700 }}>🅿️ PayPal - $49.99</span>
          </label>
        </div>

        <button 
          onClick={handlePayNow} 
          style={{ background: '#FFD700', color: 'black', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '16px', marginTop: '16px', cursor: 'pointer', border: 'none' }}
        >
          Pay Now - {selected === 'pi' ? 'Pi' : selected === 'bank' ? 'Bank Transfer' : selected === 'usdt' ? 'USDT' : selected === 'card' ? 'Card' : 'PayPal'} - $49.99
        </button>

        <button onClick={onClose} style={{ background: 'transparent', color: 'white', width: '100%', padding: '10px', marginTop: '8px', cursor: 'pointer', border: 'none' }}>Close</button>
        <p style={{ color: '#888', fontSize: '11px', marginTop: '12px', textAlign: 'center' }}>Secure payment • Instant access • RC BN3583773 • goyedagosmess@gmail.com • 190+ Countries</p>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
