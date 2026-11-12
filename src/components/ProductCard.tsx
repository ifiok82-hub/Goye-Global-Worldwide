import React, { useState } from 'react';
import { loginWithPi, toPi } from '../lib/piAuth';
import ProductGradientImage from './ProductGradientImage';

export interface ProductItem {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  piPrice?: number;
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
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return (
      localStorage.getItem(`paid_${product.id}`) !== 'true' &&
      localStorage.getItem(`paid_${product.slug}`) !== 'true' &&
      localStorage.getItem(`unlocked_${product.id}`) !== 'true'
    );
  });

  const productSlug = product.slug || product.id;
  const imgSrc = product.preview_image || (productSlug ? `/images/old/${productSlug}.jpg` : product.image);
  const finalPiPrice = product.piPrice !== undefined ? product.piPrice : 2;
  const prodName = product.name || product.title || 'Digital Product';

  const handleAction = async () => {
    if (!isLocked) {
      if (product.downloadUrl) {
        window.location.href = product.downloadUrl;
      } else if (onSelect) {
        onSelect(product);
      }
      return;
    }

    const auth = await loginWithPi();
    if (!auth) return;

    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: finalPiPrice,
          memo: prodName,
          metadata: {
            productId: product.id,
            productName: prodName,
            piPrice: finalPiPrice
          }
        };

        await (window as any).Pi.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, productId: product.id })
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
                body: JSON.stringify({ paymentId, txid, productId: product.id, amount: finalPiPrice })
              });
              if (res.ok) {
                localStorage.setItem(`paid_${product.id}`, 'true');
                if (product.slug) localStorage.setItem(`paid_${product.slug}`, 'true');
                setIsLocked(false);
              }
            } catch (err) {
              console.error('Completion error:', err);
              localStorage.setItem(`paid_${product.id}`, 'true');
              setIsLocked(false);
            }
          },
          onCancel: (paymentId: string) => {
            console.log('Payment cancelled', paymentId);
          },
          onError: (error: any) => {
            console.error('Pi Payment error', error);
          }
        });
      } catch (e) {
        console.error('Pi Payment failed', e);
      }
    } else {
      alert('Open in Pi Browser to Pay with Pi');
    }
  };

  return (
    <div className="bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between border border-zinc-800 shadow-xl">
      {/* 1. Image with LOCKED ACCESS Badge */}
      <div className="relative w-full rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4">
        <ProductGradientImage
          src={imgSrc}
          alt={prodName}
          category={product.category}
          title={prodName}
          height="220px"
        />

        {/* Badge: Strictly 🔒 LOCKED ACCESS */}
        <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
          {isLocked ? '🔒 LOCKED ACCESS' : '✅ ACCESS GRANTED'}
        </div>
      </div>

      {/* 2. Title */}
      <h3 className="text-white font-black text-base uppercase tracking-tight mb-4 line-clamp-2">
        {prodName}
      </h3>

      {/* 3. Button: Click directly triggers Pi payment */}
      <button
        type="button"
        style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
        onClick={handleAction}
        className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
      >
        <span>{isLocked ? `🔒 LOCK - ${finalPiPrice} Pi` : '✅ ACCESS NOW / DOWNLOAD'}</span>
      </button>
    </div>
  );
};

export default ProductCard;
