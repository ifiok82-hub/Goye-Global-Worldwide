import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { loginWithPi } from '../lib/piAuth';

interface UnifiedCheckoutModalProps {
  product: any;
  onClose: () => void;
  paymentConfig?: any;
  onToast?: (msg: string, type?: string) => void;
}

export const UnifiedCheckoutModal: React.FC<UnifiedCheckoutModalProps> = ({
  product,
  onClose,
  paymentConfig: _paymentConfig,
  onToast
}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('user_email') || localStorage.getItem('customer_email') || '';
  });

  const productName = product?.name || product?.title || 'Sirwise AI Web3 Academy';
  const piPrice = product?.piPrice !== undefined ? product.piPrice : 2;

  const handlePiPayment = async () => {
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
          metadata: {
            productId: product?.id || 'product',
            productName: productName,
            piPrice: piPrice
          }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, productId: product?.id })
              });
            } catch (err) {
              console.error('Approval error:', err);
            }
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            try {
              const res = await fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid, productId: product?.id, amount: piPrice })
              });
              if (res.ok) {
                if (product?.id) {
                  localStorage.setItem(`paid_${product.id}`, 'true');
                  if (product.slug) localStorage.setItem(`paid_${product.slug}`, 'true');
                }
                localStorage.setItem('sirwise_paid', 'true');
                localStorage.setItem('payment_verified', 'true');
                if (onToast) onToast('✅ Pi Payment Verified! Access Unlocked.', 'success');
                alert('🎉 Pi Payment Verified! Access Unlocked.');
                window.location.reload();
              }
            } catch (err) {
              console.error('Completion error:', err);
              if (product?.id) localStorage.setItem(`paid_${product.id}`, 'true');
              window.location.reload();
            }
          },
          onCancel: (paymentId: string) => {
            console.log('Payment cancelled', paymentId);
            if (onToast) onToast('Pi payment was cancelled', 'info');
          },
          onError: (error: any) => {
            console.error('Pi Payment error', error);
            if (onToast) onToast('Pi payment error occurred', 'error');
          }
        });
      } catch (e) {
        console.error('Pi Payment failed', e);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      alert('Open in Pi Browser to Pay with Pi');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[999999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e0e0e] border-2 border-[#FFD700] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full cursor-pointer transition"
        >
          <X size={20} />
        </button>

        {/* Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-block bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-3 py-1 rounded-md tracking-wider">
            🔒 LOCKED ACCESS
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {productName}
          </h2>

          <div className="text-2xl sm:text-3xl font-black text-[#FFD700]">
            {piPrice} Pi
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 block">
            Delivery Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              localStorage.setItem('user_email', e.target.value);
            }}
            placeholder="Enter your email for digital fulfillment..."
            className="w-full bg-black border border-zinc-800 p-3.5 rounded-xl text-white outline-none focus:border-[#FFD700] text-xs font-semibold"
          />
        </div>

        {/* Security Notice */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-3 text-xs text-gray-400">
          <ShieldCheck size={20} className="text-[#FFD700] shrink-0" />
          <span>Authenticated cryptographic payment via official Pi Network SDK.</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePiPayment}
          disabled={loading}
          className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20 active:scale-95 transition cursor-pointer"
        >
          {loading ? 'Connecting to Pi...' : `🔒 LOCK - ${piPrice} Pi`}
        </button>

      </div>
    </div>
  );
};

export default UnifiedCheckoutModal;
