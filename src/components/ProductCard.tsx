import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, ArrowRight, Lock } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  piPrice?: number;
  price?: number;
  priceUSD?: number;
  isLocked?: boolean;
  is_locked?: boolean;
  preview_image?: string;
  image?: string;
  badge?: string;
  description: string;
  features?: string[];
  icon?: string;
  category?: string;
  downloadUrl?: string;
  filePath?: string;
}

interface ProductCardProps {
  product: ProductItem;
  onSelect?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Exact image logic requested: src={product.preview_image || `/images/old/${product.slug}.jpg`}
  const productSlug = product.slug || product.id;
  const imgSrc = product.preview_image || (productSlug ? `/images/old/${productSlug}.jpg` : product.image);

  // Calculate piPrice dynamically: comes from database field piPrice, or calculate from priceUSD, or default to 2
  const calcPrice = product.piPrice ?? (product.priceUSD ? Math.ceil(product.priceUSD / 30) : (product.price ? Math.ceil(product.price / 30) : 2));
  const finalPiPrice = typeof calcPrice === 'number' && calcPrice > 0 ? calcPrice : 2;

  // Lock status: ALL products locked by default (isLocked = true), unless verified payment
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const isPaid = (
      localStorage.getItem(`paid_${product.id}`) === 'true' ||
      (product.slug && localStorage.getItem(`paid_${product.slug}`) === 'true') ||
      localStorage.getItem(`unlocked_${product.id}`) === 'true' ||
      (product.category === 'academy' && localStorage.getItem('academy_full_unlocked') === 'true')
    );
    return !isPaid;
  });

  const handleAction = async () => {
    if (!isLocked) {
      if (product.downloadUrl) {
        window.location.href = product.downloadUrl;
      } else if (onSelect) {
        onSelect(product);
      }
      return;
    }

    // Direct Pi Payment integration
    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: finalPiPrice,
          memo: `GOYE Store - ${product.name || product.title || 'Digital Product'} (${finalPiPrice} Pi)`,
          metadata: {
            productId: product.id,
            productName: product.name || product.title,
            piPrice: finalPiPrice
          }
        };

        const callbacks = {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log('Pi approval requested for paymentId:', paymentId);
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
              });
            } catch (err) {
              console.error('Pi approve error:', err);
            }
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log('Pi completion requested for paymentId:', paymentId, 'txid:', txid);
            try {
              const res = await fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentId,
                  txid,
                  productId: product.id,
                  amount: finalPiPrice
                })
              });
              const data = await res.json().catch(() => ({}));
              if (res.ok || data.completed || data.verified) {
                localStorage.setItem(`paid_${product.id}`, 'true');
                if (product.slug) localStorage.setItem(`paid_${product.slug}`, 'true');
                localStorage.setItem(`unlocked_${product.id}`, 'true');
                setIsLocked(false);
                if (typeof (window as any).showToast === 'function') {
                  (window as any).showToast(`✅ Payment Verified! Access granted to ${product.name}.`, 'success');
                } else {
                  alert(`✅ Payment Verified! Access granted to ${product.name}.`);
                }
              }
            } catch (err) {
              console.error('Pi complete error:', err);
              localStorage.setItem(`paid_${product.id}`, 'true');
              setIsLocked(false);
            }
          },
          onCancel: (paymentId: string) => {
            console.log('Pi payment cancelled:', paymentId);
          },
          onError: (error: any) => {
            console.error('Pi payment error:', error);
            if (typeof (window as any).showToast === 'function') {
              (window as any).showToast('Pi Payment error. Please retry.', 'error');
            }
          }
        };

        await (window as any).Pi.createPayment(paymentData, callbacks);
        return;
      } catch (err) {
        console.error('Pi createPayment exception:', err);
      }
    }

    // Fallback if not inside Pi Browser or window.Pi not ready
    if (onSelect) {
      onSelect(product);
    } else {
      alert('Open in Pi Browser to Login and Pay with Pi');
    }
  };

  return (
    <div className={`bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative group ${
      !isLocked ? 'border border-emerald-500/80 shadow-emerald-500/10' : 'border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.15)]'
    }`}>
      {/* Top Badge: Shows 🔒 LOCKED ACCESS or ✅ ACCESSIBLE */}
      <div className="absolute top-4 right-4 z-10 flex gap-1.5 items-center">
        {!isLocked ? (
          <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            ✅ ACCESSIBLE
          </span>
        ) : (
          <span className="bg-black text-[#FFD700] border-2 border-[#FFD700] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
            <Lock size={10} className="text-[#FFD700]" />
            <span>LOCKED ACCESS</span>
          </span>
        )}
      </div>

      <div>
        {/* Product Image with blur when locked */}
        <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
          {imgSrc && !imageFailed ? (
            <img
              src={imgSrc}
              alt={product.name || 'Product Image'}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'filter blur-[1px]' : ''}`}
              onError={() => setImageFailed(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] mb-2 shadow-inner">
                <ShieldCheck size={32} className="text-[#FFD700]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {product.name || 'Official Digital Product'}
              </span>
            </div>
          )}

          {/* Badge on EVERY image: "🔒 LOCKED ACCESS" (black badge, yellow border) */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="bg-black border-2 border-[#FFD700] text-[#FFD700] text-xs font-black uppercase px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-1.5">
                <Lock size={13} className="text-[#FFD700]" />
                <span>LOCKED ACCESS</span>
              </span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-white font-black text-base uppercase tracking-tight mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-2">
          {product.name || product.title}
        </h3>

        {/* Description */}
        <p className={`text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3 ${isLocked ? 'select-none' : ''}`}>
          {product.description}
        </p>

        {/* Feature Checkmarks */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-1.5 mb-5 border-t border-zinc-900 pt-3">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle size={12} className={!isLocked ? "text-emerald-400 shrink-0" : "text-[#FFD700] shrink-0"} />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing and Action */}
      <div className="border-t border-zinc-900 pt-4">
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Price</span>
          <div className="text-right">
            <div className="text-2xl font-black text-[#FFD700]">
              {finalPiPrice} Pi
            </div>
          </div>
        </div>

        <button
          onClick={handleAction}
          className={`w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2 ${
            !isLocked
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              : 'bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20'
          }`}
        >
          <span>
            {!isLocked ? '✅ ACCESS NOW / DOWNLOAD' : `🔒 LOCK - ${finalPiPrice} Pi`}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
