import React from 'react';

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

  const configs: Record<string, { title: string; address: string; amount: string; network: string; qr: string; instructions: string }> = {
    usdt_bep20: {
      title: 'USDT BEP20 (BNB Smart Chain)',
      address: '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96',
      amount: `$${amountUSD.toFixed(2)} USDT`,
      network: 'BEP20 (BSC) - BNB Smart Chain',
      qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96`,
      instructions: `Send $${amountUSD.toFixed(2)} USDT via BEP20 network. After payment send Tx Hash + email to goyedagosmess@gmail.com for instant verification RC BN3583773`
    },
    usdc_base: {
      title: 'USDC (Base Network / BSC)',
      address: '0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96',
      amount: `$${amountUSD.toFixed(2)} USDC`,
      network: 'Base / BSC - Use Base Network for low fees',
      qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96`,
      instructions: `Send $${amountUSD.toFixed(2)} USDC via Base or BEP20. Send Tx Hash + email to goyedagosmess@gmail.com RC BN3583773`
    },
    opay: {
      title: 'Bank Transfer / OPay',
      address: '6113541882',
      amount: `₦${priceNGN.toLocaleString()} or $${amountUSD.toFixed(2)}`,
      network: 'OPay • GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE',
      qr: '',
      instructions: `Bank: OPay\nAccount Number: 6113541882\nAccount Name: GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE\nAmount: ₦${priceNGN.toLocaleString()} or $${amountUSD.toFixed(2)}\n\nAfter transfer send proof + your email to: goyedagosmess@gmail.com WhatsApp +2348162811195 RC BN3583773 Instant Unlock within 5 mins`
    },
    pi: {
      title: 'Pi Network GCV $314,159',
      address: '0.000159 Pi ≈ $49.99 (GCV $314,159)',
      amount: '0.000159 Pi',
      network: 'Pi Browser Only - MinePi',
      qr: '',
      instructions: 'Pay with Pi in Pi Browser - GCV $314,159 - Amount 0.000159 Pi ≈ $49.99 - RC BN3583773 - 190+ Countries'
    }
  };

  const cfg = configs[type] || configs.opay;

  const handlePiPaymentReal = async () => {
    const email = userEmail || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || 'piuser@gasv.store';
    const Pi = (window as any).Pi;
    if (!Pi) {
      alert('⚠️ Open gasv.store in Pi Browser!\n\nYou are in Chrome - Pi payment works only inside Pi Browser\n\n1. Download Pi Browser: minepi.com\n2. Open Pi Browser → gasv.store\n3. Select Pi Network GCV $314,159\n4. PROCEED WITH PAYMENT → Pi wallet opens\n\nAmount: 0.000159 Pi ≈ $49.99 GCV $314,159\nRC BN3583773\nOr use Paystack/Flutterwave/USDT/Bank - All working!');
      window.open('https://minepi.com', '_blank');
      return;
    }
    try {
      await Pi.authenticate(['username', 'payments'], (p: any) => {
        fetch('/api/pi/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: p.identifier, txid: p.transaction?.txid })
        }).catch(() => {});
      });
      await Pi.createPayment(
        {
          amount: 0.000159,
          memo: `Goye Store Global ${productName} RC BN3583773`,
          metadata: { email, product: productName }
        },
        {
          onReadyForServerApproval: (id: string) =>
            fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId: id })
            }),
          onReadyForServerCompletion: (id: string, txid: string) => {
            if ((window as any).trackLead) {
              (window as any).trackLead({ email, source: 'Pi GCV Paid', action: 'Paid Pi GCV $314,159', paymentId: id, txid });
            }
            alert('✅ Pi Payment Success! TXID:' + txid + ' Amount 0.000159 Pi ≈ $49.99 GCV $314,159 Email:' + email + ' Full Academy Unlocked! RC BN3583773');
            localStorage.setItem('academy_full_unlocked', 'true');
            localStorage.setItem('sirwise_paid', 'true');
            if ((window as any).unlockAcademyAccess) {
              (window as any).unlockAcademyAccess('Pi GCV', email, txid);
            }
            onClose();
            window.location.hash = 'academy';
            window.location.reload();
          },
          onCancel: (id: string) => alert('Pi Payment Cancelled ' + id),
          onError: (e: any, p: any) => alert('Pi Error:' + JSON.stringify(e) + ' Ensure domain gasv.store verified with validation-key.txt at develop.pi RC BN3583773')
        }
      );
    } catch (err: any) {
      alert('Pi Error:' + (err?.message || err) + ' - Ensure Pi Browser + domain verified');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div style={{ background: '#111', border: '2px solid #FFD700', borderRadius: '20px', padding: '20px', maxWidth: '400px', width: '100%', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ color: '#FFD700', fontWeight: 900, fontSize: '18px', margin: 0 }}>{cfg.title}</h2>
          <button onClick={onClose} style={{ background: '#222', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '50%', width: '30px', height: '30px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>
        
        <p style={{ color: '#10B981', fontWeight: 700, margin: '8px 0', fontSize: '14px' }}>{cfg.amount} • {cfg.network}</p>
        
        {cfg.qr && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', background: 'white', padding: '12px', borderRadius: '12px' }}>
            <img src={cfg.qr} alt="QR Code" style={{ width: '180px', height: '180px' }} />
          </div>
        )}
        
        <div style={{ background: 'black', border: '1px solid #333', borderRadius: '12px', padding: '12px', margin: '12px 0' }}>
          <p style={{ color: '#888', fontSize: '11px', margin: '0 0 4px 0' }}>Address / Account Number:</p>
          <p style={{ color: 'white', fontWeight: 700, wordBreak: 'break-all', fontSize: '13px', margin: 0 }}>{cfg.address}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(cfg.address);
              alert('Address Copied: ' + cfg.address);
              if ((window as any).trackClick) {
                (window as any).trackClick(type + '_copy_address', { address: cfg.address });
              }
            }}
            style={{ background: '#FFD700', color: 'black', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 900, marginTop: '8px', cursor: 'pointer', border: 'none' }}
          >
            📋 Copy Address / Account
          </button>
        </div>
        
        <div style={{ background: '#1a1a00', border: '1px solid #444', borderRadius: '12px', padding: '12px', margin: '12px 0' }}>
          <p style={{ color: 'white', fontSize: '13px', whiteSpace: 'pre-line', margin: 0, lineHeight: '1.4' }}>{cfg.instructions}</p>
        </div>

        {type === 'pi' ? (
          <button
            onClick={() => {
              onClose();
              handlePiPaymentReal();
            }}
            style={{ background: '#A855F7', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(168,85,247,0.4)' }}
          >
            💜 Open Pi Payment - 0.000159 Pi
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              alert(
                type === 'usdt_bep20'
                  ? 'USDT BEP20 (BNB Smart Chain)\n\nAddress Copied: 0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96\n\nAmount: $' + amountUSD.toFixed(2) + ' USDT\nNetwork: BEP20 (BSC)\n\nAfter payment send Tx Hash + email to goyedagosmess@gmail.com for instant manual verification. RC BN3583773'
                  : type === 'usdc_base'
                  ? 'USDC (Base Network / BSC)\n\nAddress Copied: 0x66e19089f1b2F87c92D98aF8657dA17Bf93ffe96\n\nAmount: $' + amountUSD.toFixed(2) + ' USDC\nNetwork: Base / BSC\n\nSend Tx Hash + email to goyedagosmess@gmail.com RC BN3583773'
                  : 'Bank Transfer / OPay\n\nBank: OPay\nAccount Number: 6113541882\nAccount Name: GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE\nAmount: ₦' + priceNGN.toLocaleString() + ' or $' + amountUSD.toFixed(2) + '\n\nAfter transfer send proof + email to goyedagosmess@gmail.com WhatsApp +2348162811195 RC BN3583773 Instant Unlock within 5 mins'
              );
            }}
            style={{ background: '#FFD700', color: 'black', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(255,215,0,0.4)' }}
          >
            ✅ I Have Paid - Send Proof to goyedagosmess@gmail.com
          </button>
        )}

        <button onClick={onClose} style={{ background: 'transparent', color: 'white', width: '100%', padding: '10px', marginTop: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
          Close
        </button>
        
        <p style={{ color: '#666', fontSize: '10px', textAlign: 'center', marginTop: '12px', margin: 0 }}>
          Secure • 100% SSL Encrypted • RC BN3583773 • goyedagosmess@gmail.com • 190+ Countries
        </p>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
