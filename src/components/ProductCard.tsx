import React, { useState } from 'react';
import { loginWithPi, toPi } from '../lib/piAuth';

export interface ProductItem {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  piPrice?: number;
  price?: number;
  priceUSD?: number;
  priceNGN?: number;
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
  const finalPiPrice = toPi(product.priceNGN, product.priceUSD || product.price, product.piPrice);

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
          memo: product.name || product.title || 'Digital Product',
          metadata: {
            productId: product.id,
            productName: product.name || product.title,
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
      {/* 1. Image */}
      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
        {imgSrc && !imageFailed ? (
          <img
            src={imgSrc}
            alt={product.name || product.title || 'Product'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[#FFD700] font-black text-xs uppercase p-4 text-center">
            {product.name || product.title}
          </div>
        )}
      </div>

      {/* 2. Title */}
      <h3 className="text-white font-black text-base uppercase tracking-tight mb-4 line-clamp-2">
        {product.name || product.title}
      </h3>

      {/* 3. Button: 🔒 LOCK - {finalPiPrice} Pi */}
      <button
        onClick={handleAction}
        className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
      >
        <span>🔒 LOCK - {finalPiPrice} Pi</span>
      </button>
    </div>
  );
};

export default ProductCard;
