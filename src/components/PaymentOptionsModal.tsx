import React, { useState } from 'react';
import { getPiPrice } from '../utils/paymentAdapter';
import { loginWithPi } from '../lib/piAuth';

interface PaymentOptionsModalProps {
  onClose: () => void;
  product?: any;
}

export const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({ onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const productName = product?.name || 'Sirwise AI Web3 Academy Full - 8 Modules';
  const piPrice = product?.piPrice !== undefined ? product.piPrice : getPiPrice(product);

  const handlePiPay = async () => {
    setLoading(true);
    const auth = await loginWithPi();
    if (!auth) {
      setLoading(false);
      return;
    }

    const win = window as any;
    if (win.Pi && win.Pi.createPayment) {
      try {
        await win.Pi.createPayment({
          amount: piPrice,
          memo: productName,
          metadata: { productId: product?.id || 'product', piPrice }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, productId: product?.id })
            }).catch(() => {});
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, productId: product?.id, amount: piPrice })
            }).catch(() => {});
            if (product?.id) {
              localStorage.setItem(`paid_${product.id}`, 'true');
            }
            localStorage.setItem('sirwise_paid', 'true');
            localStorage.setItem('payment_verified', 'true');
            alert('🎉 Payment Verified! Access Unlocked.');
            window.location.reload();
          },
          onCancel: (id: string) => console.log('Cancelled', id),
          onError: (err: any) => console.error('Error', err)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      alert('Open in Pi Browser to Pay with Pi');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 99999
    }}>
      <div style={{
        background: '#0e0e0e',
        color: '#fff',
        padding: '28px',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        border: '2px solid #FFD700',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
      }}>
        <div style={{ display: 'inline-block', background: '#000', color: '#FFD700', border: '1px solid #FFD700', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', marginBottom: '14px' }}>
          🔒 LOCKED ACCESS
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>
          {productName}
        </h2>

        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFD700', margin: '0 0 24px 0' }}>
          {piPrice} Pi
        </p>

        <button
          onClick={handlePiPay}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: '#FFD700',
            color: '#000',
            fontWeight: '900',
            fontSize: '15px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          {loading ? 'Processing...' : `🔒 LOCK - ${piPrice} Pi`}
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: '#222',
            color: '#888',
            fontWeight: 'bold',
            fontSize: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
