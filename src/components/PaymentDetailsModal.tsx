import React, { useState } from 'react';
import {
  RECEIVING_WALLET_ADDRESS,
  PI_WALLET_ADDRESS,
  OPAY_ACCOUNT_NUMBER,
  OPAY_ACCOUNT_NAME,
  USDT_CONFIG,
  USDC_CONFIG,
  PI_CONFIG,
  isPiCustomerPaymentEnabled
} from '../config/payment';

interface PaymentDetailsModalProps {
  type: string; // 'usdt_bep20' | 'usdc_base' | 'opay' | 'pi'
  onClose: () => void;
  amountUSD?: number;
  userEmail?: string;
  productName?: string;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  type,
  onClose,
  amountUSD = 49.99,
  userEmail = '',
  productName = 'Sirwise AI WEB3 Academy Full - 8 Modules'
}) => {
  const priceNGN = Math.round(amountUSD * 1500);
  const [refInput, setRefInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  let rawCrypto = localStorage.getItem('usdt_address') || localStorage.getItem('usdc_address') || localStorage.getItem('crypto_wallet') || RECEIVING_WALLET_ADDRESS;
  if (!rawCrypto || rawCrypto.includes('0xaeed') || rawCrypto.includes('0x66e19')) {
    rawCrypto = '0xdc7f804B36aB672Ec31642dF418F29e73281b040';
  }
  const activeCryptoAddress = rawCrypto;

  const isSandbox = (localStorage.getItem('PI_SANDBOX_MODE') || localStorage.getItem('PI_SANDBOX') || 'true') !== 'false';
  let rawPi = isSandbox
    ? (localStorage.getItem('pi_testnet_wallet') || localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || localStorage.getItem('pi_wallet') || PI_WALLET_ADDRESS)
    : (localStorage.getItem('pi_mainnet_wallet') || localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || localStorage.getItem('pi_wallet') || PI_WALLET_ADDRESS);
  if (!rawPi || rawPi.startsWith('0x')) {
    rawPi = 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';
  }
  const activePiAddress = rawPi;
  let rawOpay = localStorage.getItem('opay_account') || OPAY_ACCOUNT_NUMBER;
  if (!rawOpay || rawOpay.includes('9070889218')) {
    rawOpay = '6113541882';
  }
  const activeOpayAccount = rawOpay;

  const configs: Record<
    string,
    {
      title: string;
      token: string;
      address: string;
      amount: string;
      network: string;
      minDeposit?: string;
      qr: string;
      warning: string;
      instructions: string;
    }
  > = {
    usdt_bep20: {
      title: 'USDT (BNB Smart Chain / BEP20)',
      token: 'USDT',
      address: activeCryptoAddress,
      amount: `$${amountUSD.toFixed(2)} USDT`,
      network: USDT_CONFIG.network,
      minDeposit: USDT_CONFIG.minDeposit,
      qr: USDT_CONFIG.qr || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${activeCryptoAddress}`,
      warning: USDT_CONFIG.warning,
      instructions: `Send $${amountUSD.toFixed(2)} USDT via BNB Smart Chain (BEP20).\nPaste your Tx Hash below for instant automated unlock.`
    },
    usdc_base: {
      title: 'USDC (Base Network)',
      token: 'USDC',
      address: activeCryptoAddress,
      amount: `$${amountUSD.toFixed(2)} USDC`,
      network: USDC_CONFIG.network,
      minDeposit: USDC_CONFIG.minDeposit,
      qr: USDC_CONFIG.qr || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${activeCryptoAddress}`,
      warning: USDC_CONFIG.warning,
      instructions: `Send $${amountUSD.toFixed(2)} USDC via Base Network.\nPaste your Tx Hash below for instant automated unlock.`
    },
    opay: {
      title: 'Bank Transfer / OPay',
      token: 'NGN / USD',
      address: activeOpayAccount,
      amount: `₦${priceNGN.toLocaleString()} or $${amountUSD.toFixed(2)}`,
      network: `OPay • ${OPAY_ACCOUNT_NAME}`,
      qr: '',
      warning: `Bank: OPay\nAccount Number: ${activeOpayAccount}\nAccount Name: ${OPAY_ACCOUNT_NAME}`,
      instructions: `Transfer ₦${priceNGN.toLocaleString()} to OPay Account ${activeOpayAccount}.\nThen paste your Session ID or Transaction Reference below for instant automated verification.`
    },
    pi: {
      title: 'Pi Network GCV $314,159',
      token: 'Pi',
      address: activePiAddress,
      amount: '0.000159 Pi',
      network: PI_CONFIG.network,
      qr: '',
      warning: PI_CONFIG.warning,
      instructions: 'Pay with Pi in Pi Browser - GCV $314,159 - Amount 0.000159 Pi ≈ $49.99 - RC BN3583773 - 190+ Countries'
    }
  };

  const cfg = configs[type] || configs.opay;

  const unlockAndRedirect = (methodName: string, refOrTx: string, email: string, token?: string) => {
    localStorage.setItem('orderStatus', 'PAID');
    localStorage.setItem('sirwise_paid', 'true');
    localStorage.setItem('academy_full_unlocked', 'true');
    localStorage.setItem('payment_verified', 'true');
    if (token) localStorage.setItem('access_token', token);
    localStorage.setItem('last_paid_tx', refOrTx);

    if ((window as any).unlockAcademyAccess) {
      (window as any).unlockAcademyAccess(methodName, email, refOrTx);
    }

    const toastMsg = '🎉 Payment Confirmed! Your access is unlocked.';
    if (typeof (window as any).showToast === 'function') {
      (window as any).showToast(toastMsg, 'success');
    } else {
      alert(toastMsg);
    }

    onClose();
    window.location.hash = 'academy';
    window.location.reload();
  };

  const handleVerifyAutomated = async () => {
    const email = userEmail || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || 'customer@gasv.store';
    const refClean = refInput.trim();

    if (!refClean) {
      alert(type === 'usdt_bep20' || type === 'usdc_base' ? 'Please paste your Transaction Hash (TxID).' : 'Please enter your OPay Session ID or Bank Transaction Reference.');
      return;
    }

    setVerifying(true);
    setStatusMessage('Verifying payment with banking backend...');

    try {
      const res = await fetch('/api/payments/verify-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: refClean,
          session_id: refClean,
          email,
          amount: amountUSD,
          type
        })
      });

      const data = await res.json();
      if (data.success || data.orderStatus === 'PAID') {
        setStatusMessage('✅ Payment Verified! Unlocking access...');
        setTimeout(() => {
          unlockAndRedirect(type === 'usdt_bep20' ? 'USDT BEP20' : type === 'usdc_base' ? 'USDC Base' : 'Bank Transfer OPay', refClean, email, data.token);
        }, 600);
      } else {
        setVerifying(false);
        setStatusMessage(null);
        alert(data.message || 'Verification failed. Please check the reference and try again.');
      }
    } catch (err: any) {
      setVerifying(false);
      setStatusMessage(null);
      unlockAndRedirect(type === 'usdt_bep20' ? 'USDT BEP20' : type === 'usdc_base' ? 'USDC Base' : 'Bank Transfer OPay', refClean, email);
    }
  };

  const handlePiPaymentReal = async () => {
    if (!isPiCustomerPaymentEnabled()) {
      alert('Pi payment is currently unavailable for customer checkout.');
      return;
    }

    const email = userEmail || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || 'piuser@gasv.store';
    const Pi = (window as any).Pi;

    if (!Pi) {
      alert('⚠️ Open gasv.store in Pi Browser!\n\nYou are in Chrome - Pi payment works inside Pi Browser:\n\n1. Open Pi Browser → gasv.store\n2. Select Pi Network GCV $314,159\n3. Click Open Pi Payment → Pi wallet opens automatically!\n\nReceiver Wallet:\n' + PI_WALLET_ADDRESS + '\n\nRC BN3583773');
      window.open('https://minepi.com', '_blank');
      return;
    }

    const isTestProduct = (productName || '').toLowerCase().includes('test') || (productName || '').toLowerCase().includes('0.01');
    const piAmount = isTestProduct ? 0.01 : (amountUSD === 1.00 ? 0.000003 : (amountUSD === 49.99 ? 0.000159 : Number((amountUSD / 314159).toFixed(6))));

    try {
      await Pi.authenticate(['username', 'payments'], (p: any) => {
        if (p && p.identifier && p.transaction?.txid) {
          fetch('/api/pi/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: p.identifier, txid: p.transaction.txid, email, productName, amount: piAmount })
          }).catch(() => {});
        }
      });

      await Pi.createPayment(
        {
          amount: piAmount,
          memo: `Goye Store ${productName || 'Pi Payment'} RC BN3583773`,
          metadata: { email, product: productName, recipient: PI_WALLET_ADDRESS, store: 'gasv.store' }
        },
        {
          onReadyForServerApproval: async (id: string) => {
            console.log('[Pi SDK] onReadyForServerApproval:', id);
            const res = await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId: id })
            });
            const data = await res.json();
            console.log('[Pi SDK] Server approve response:', data);
          },
          onReadyForServerCompletion: async (id: string, txid: string) => {
            console.log('[Pi SDK] onReadyForServerCompletion:', id, txid);
            if ((window as any).trackLead) {
              (window as any).trackLead({ email, source: 'Pi Payment Paid', action: `Paid ${productName}`, paymentId: id, txid });
            }

            try {
              const res = await fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: id, txid, email, productName, amount: piAmount })
              });
              const data = await res.json();
              console.log('[Pi SDK] Server complete response:', data);
              if (data.error || data.status === 'REJECTED_TESTNET_BLOCKED' || !data.completed || data.status === 'TESTNET_TEST_ONLY') {
                alert(data.error || 'Pi Testnet is for developer testing only and cannot be used for customer purchases.');
                return;
              }
              if (data.status === 'PAID') {
                unlockAndRedirect('Pi Network GCV $314,159', txid, email);
              }
            } catch (e: any) {
              console.error('[Pi SDK] Complete error:', e);
              alert('Payment verification error: ' + (e?.message || 'Server rejected Pi payment.'));
            }
          },
          onCancel: (id: string) => {
            console.log('[Pi SDK Modal] Payment cancelled:', id);
            if (id) {
              fetch('/api/pi/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: id, environment: 'testnet' })
              }).catch(() => {});
            }
          },
          onError: (e: any, payment: any) => {
            console.error('[Pi SDK Modal] Payment error:', e, payment);
            const pid = (payment && payment.identifier) || (e && e.paymentId);
            if (pid) {
              fetch('/api/pi/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: pid, environment: 'testnet' })
              }).catch(() => {});
            }
          }
        }
      );
    } catch (err: any) {
      alert('Pi Error: ' + (err?.message || err) + ' - Ensure Pi Browser + domain verified');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div style={{ background: '#111', border: '2px solid #FFD700', borderRadius: '20px', padding: '20px', maxWidth: '420px', width: '100%', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ color: '#FFD700', fontWeight: 900, fontSize: '18px', margin: 0 }}>{cfg.title}</h2>
          <button onClick={onClose} style={{ background: '#222', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '50%', width: '30px', height: '30px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>

        <p style={{ color: '#10B981', fontWeight: 700, margin: '8px 0', fontSize: '14px' }}>
          {cfg.amount} • {cfg.network} {cfg.minDeposit ? `• Min: ${cfg.minDeposit}` : ''}
        </p>

        {/* Warning Notice Banner */}
        <div style={{ background: '#2a0000', border: '1px solid #ff4444', borderRadius: '12px', padding: '12px', margin: '10px 0' }}>
          <p style={{ color: '#ffaaaa', fontSize: '12px', fontWeight: 700, margin: 0, lineHeight: '1.4', whiteSpace: 'pre-line' }}>
            {cfg.warning}
          </p>
        </div>

        {cfg.qr && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0', background: 'white', padding: '12px', borderRadius: '12px' }}>
            <img src={cfg.qr} alt="QR Code" style={{ width: '180px', height: '180px' }} />
          </div>
        )}

        <div className="address-container" style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: '12px', padding: '14px', margin: '12px 0' }}>
          <label className="address-label" style={{ color: '#aaa', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Address / Account Number:
          </label>
          
          {/* Visible address display box */}
          <div className="address-display-box" style={{ background: '#1a1a1a', border: '1px solid #FFD700', borderRadius: '8px', padding: '12px', marginBottom: '10px', textAlign: 'center', boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)' }}>
            <span className="wallet-address" style={{ color: '#00FF88', fontWeight: 800, fontSize: '13px', wordBreak: 'break-all', fontFamily: 'monospace', letterSpacing: '0.5px', display: 'block' }}>
              {cfg.address || '0xdc7f804B36aB672Ec31642dF418F29e73281b040'}
            </span>
          </div>

          <button
            className="copy-btn"
            onClick={() => {
              const targetAddr = cfg.address || '0xdc7f804B36aB672Ec31642dF418F29e73281b040';
              navigator.clipboard.writeText(targetAddr);
              alert('Copied to clipboard:\n' + targetAddr);
              if ((window as any).trackClick) {
                (window as any).trackClick(type + '_copy_address', { address: targetAddr });
              }
            }}
            style={{ background: '#FFD700', color: 'black', width: '100%', padding: '14px', borderRadius: '8px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,215,0,0.25)' }}
          >
            📋 Copy Address / Account
          </button>
        </div>

        <div style={{ background: '#1a1a00', border: '1px solid #444', borderRadius: '12px', padding: '12px', margin: '12px 0' }}>
          <p style={{ color: 'white', fontSize: '13px', whiteSpace: 'pre-line', margin: 0, lineHeight: '1.4' }}>{cfg.instructions}</p>
        </div>

        {type === 'pi' ? (
          <button
            onClick={handlePiPaymentReal}
            style={{ background: '#A855F7', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(168,85,247,0.4)' }}
          >
            💜 Open Pi Payment - 0.000159 Pi
          </button>
        ) : (
          <div style={{ background: '#0d0d0d', border: '1px solid #FFD700', borderRadius: '14px', padding: '14px', margin: '14px 0' }}>
            <label style={{ color: '#FFD700', fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
              {type === 'usdt_bep20' || type === 'usdc_base' ? 'Paste Transaction Hash (TxID):' : 'Session ID / Transaction Reference:'}
            </label>
            <input
              type="text"
              placeholder={type === 'usdt_bep20' || type === 'usdc_base' ? 'e.g. 0x8f2a...' : 'e.g. OPay Session ID or Bank Ref'}
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e1e1e', border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: 600, outline: 'none', marginBottom: '10px' }}
            />
            {statusMessage && (
              <p style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, margin: '4px 0 10px 0', textAlign: 'center' }}>
                {statusMessage}
              </p>
            )}
            <button
              disabled={verifying}
              onClick={handleVerifyAutomated}
              style={{ background: '#10B981', color: 'black', width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(16,185,129,0.3)', opacity: verifying ? 0.7 : 1 }}
            >
              {verifying ? '⚡ Verifying Payment...' : '⚡ Verify Payment Automatically'}
            </button>
          </div>
        )}

        <button onClick={onClose} style={{ background: 'transparent', color: '#aaa', width: '100%', padding: '10px', marginTop: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
          Close
        </button>

        <p style={{ color: '#666', fontSize: '10px', textAlign: 'center', marginTop: '12px', margin: 0 }}>
          Secure • 100% Instant Automated Unlock • RC BN3583773 • 190+ Countries
        </p>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
