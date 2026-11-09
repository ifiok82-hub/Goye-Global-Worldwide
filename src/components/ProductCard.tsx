import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { loginWithPi } from '../lib/piAuth';

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
  description?: string;
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

  // Exact image logic
  const productSlug = product.slug || product.id;
  const imgSrc = product.preview_image || (product.slug ? `/images/old/${productSlug}.jpg` : product.image);

  // Calculate piPrice dynamically - comes from database field piPrice, or calculate from priceUSD, or default to 2
  const calcPiPrice = product.piPrice ?? (product.priceUSD ? Math.ceil(product.priceUSD / 30) : (product.price ? Math.ceil(product.price / 30) : 2));
  const finalPiPrice = typeof calcPiPrice === 'number' && calcPiPrice > 0 ? calcPiPrice : 2;

  // Lock status: ALL products locked by default, unless verified payment
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const isPaid = (
      localStorage.getItem(`paid_${product.id}`) === 'true' ||
      localStorage.getItem(`paid_${product.slug}`) === 'true' ||
      localStorage.getItem(`unlocked_${product.id}`) === 'true' ||
      (product.category === 'academy' && localStorage.getItem('academy_full_unlocked') === 'true')
    );
    return !isPaid;
  });

  const handleAction = async () => {
    // If already unlocked, go to download / access
    if (!isLocked) {
      if (product.downloadUrl) {
        window.location.href = product.downloadUrl;
      } else if (onSelect) {
        onSelect(product);
      }
      return;
    }

    // 1. Authenticate with Pi and verify token with Pi Server FIRST
    const auth = await loginWithPi();
    if (!auth) return;

    // 2. Direct Pi Payment integration
    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: finalPiPrice,
          memo: product.name || product.title || 'Digital Product',
          metadata: {
            productId: product.id,
            productName: product.name || product.title,
            piPrice: finalPiPrice
          }
        };

        await (window as any).Pi.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, productId: product.id })
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, productId: product.id })
            });
            if (res.ok) {
              localStorage.setItem(`paid_${product.id}`, 'true');
              if (product.slug) localStorage.setItem(`paid_${product.slug}`, 'true');
              setIsLocked(false);
            }
          },
          onCancel: (paymentId: string) => {
            console.log('Payment cancelled', paymentId);
          },
          onError: (error: any) => {
            console.error('Pi Payment Error', error);
          }
        });
      } catch (e) {
        console.error('Pi Payment failed', e);
      }
    }
  };

  return (
    <div className="bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative group border border-zinc-800">
      <div>
        <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
          {imgSrc && !imageFailed ? (
            <img
              src={imgSrc}
              alt={product.name || 'Product Image'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
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
        </div>

        <h3 className="text-white font-black text-base uppercase tracking-tight mb-2 line-clamp-2">
          {product.name || product.title}
        </h3>
      </div>

      <div className="pt-4">
        <button
          onClick={handleAction}
          className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
        >
          <span>🔒 LOCK - {finalPiPrice} Pi</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
