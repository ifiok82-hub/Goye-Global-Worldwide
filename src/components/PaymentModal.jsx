import { useState } from 'react';
import { startPiPayment } from '../lib/piPayment';

export default function PaymentModal({ piPrice = 2, onClose = () => {} }) {
  const [loading, setLoading] = useState(false);

  const handlePiPay = async () => {
    setLoading(true);
    try {
      await startPiPayment(
        {
          id: 'goye_store_modal',
          title: 'Goye Store - Pi Payment',
          piPrice
        },
        () => {
          localStorage.setItem('sirwise_paid', 'true');
          localStorage.setItem('payment_verified', 'true');
          alert('🎉 Pi Payment Verified! Access Unlocked.');
          window.location.reload();
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#111',
      color: '#fff',
      padding: '24px',
      borderRadius: '16px',
      maxWidth: '440px',
      width: '100%',
      border: '2px solid #FFD700',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
    }}>
      <div style={{ display: 'inline-block', background: '#000', color: '#FFD700', border: '1px solid #FFD700', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', marginBottom: '12px' }}>
        🔒 LOCKED ACCESS
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>
        Pay with Pi Network
      </h2>

      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700', margin: '0 0 20px 0' }}>
        Amount: {piPrice} Pi
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
          color: '#aaa',
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
  );
}
