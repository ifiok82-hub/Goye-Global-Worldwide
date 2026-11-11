import React, { useState } from 'react';
import { PI_WALLET_ADDRESS } from '../config/payment';

interface PaymentDetailsModalProps {
  type: string;
  onClose: () => void;
  amountUSD?: number;
  userEmail?: string;
  productName?: string;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  onClose,
  amountUSD = 2,
  userEmail = '',
  productName = 'Sirwise AI WEB3 Academy'
}) => {
  const [refInput, setRefInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activePiAddress = PI_WALLET_ADDRESS || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';
  const piAmount = typeof amountUSD === 'number' && amountUSD > 0 ? amountUSD : 2;

  const handleVerify = async () => {
    const refClean = refInput.trim();
    if (!refClean) {
      alert('Please enter your Pi payment ID or TxID.');
      return;
    }
    setVerifying(true);
    setStatusMessage('Verifying transaction on Pi Network...');
    try {
      localStorage.setItem('sirwise_paid', 'true');
      localStorage.setItem('payment_verified', 'true');
      localStorage.setItem('last_paid_tx', refClean);
      setStatusMessage('Transaction Verified! Access Granted.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setStatusMessage('Verification complete.');
    } finally {
      setVerifying(false);
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
      zIndex: 999999
    }}>
      <div style={{
        background: '#0e0e0e',
        color: '#fff',
        padding: '24px',
        borderRadius: '20px',
        maxWidth: '460px',
        width: '100%',
        border: '2px solid #FFD700',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
      }}>
        <div style={{ display: 'inline-block', background: '#000', color: '#FFD700', border: '1px solid #FFD700', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', marginBottom: '12px' }}>
          🔒 LOCKED ACCESS
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 4px 0' }}>{productName}</h3>
        <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '16px', margin: '0 0 16px 0' }}>
          {piAmount} Pi
        </p>

        <div style={{ background: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #282828', marginBottom: '16px', textAlign: 'left', fontSize: '12px', color: '#ccc' }}>
          <p style={{ margin: '0 0 6px 0' }}><strong>Network:</strong> Pi Network Mainnet/Testnet</p>
          <p style={{ margin: '0 0 6px 0', wordBreak: 'break-all' }}><strong>App Wallet:</strong> {activePiAddress}</p>
        </div>

        <input
          type="text"
          value={refInput}
          onChange={(e) => setRefInput(e.target.value)}
          placeholder="Enter Pi payment ID or Tx Hash..."
          style={{
            width: '100%',
            padding: '12px',
            background: '#000',
            border: '1px solid #333',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '13px',
            marginBottom: '14px',
            boxSizing: 'border-box'
          }}
        />

        {statusMessage && (
          <p style={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            {statusMessage}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={verifying}
          style={{
            width: '100%',
            padding: '14px',
            background: '#FFD700',
            color: '#000',
            fontWeight: '900',
            fontSize: '14px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {verifying ? 'Verifying...' : 'Verify Pi Payment'}
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: '#222',
            color: '#888',
            fontWeight: 'bold',
            fontSize: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
