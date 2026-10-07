import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  price: number;
  priceUSD?: number;
  priceNGN?: number;
  preview_image?: string;
  image?: string;
  badge?: string;
  description: string;
  features?: string[];
  icon?: string;
  category?: string;
}

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Exact image logic requested: src={product.preview_image || `/images/old/${product.slug}.jpg`}
  const productSlug = product.slug || product.id;
  const imgSrc = product.preview_image || (productSlug ? `/images/old/${productSlug}.jpg` : product.image);
  const priceUSD = product.priceUSD || product.price || 0;
  const priceNGN = product.priceNGN || Math.round(priceUSD * 1500);

  // Lock status: locked by default until verified purchase
  const isPaid = typeof window !== 'undefined' && (
    localStorage.getItem(`paid_${product.id}`) === 'true' ||
    (product.slug && localStorage.getItem(`paid_${product.slug}`) === 'true') ||
    (product.category === 'academy' && localStorage.getItem('academy_full_unlocked') === 'true')
  );

  return (
    <div className={`bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative group ${
      isPaid ? 'border border-emerald-500/80 shadow-emerald-500/10' : 'border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.15)]'
    }`}>
      {/* Top Badge: Shows 🔒 LOCKED or ✅ UNLOCKED */}
      <div className="absolute top-4 right-4 z-10 flex gap-1.5 items-center">
        {isPaid ? (
          <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            ✅ UNLOCKED
          </span>
        ) : (
          <span className="bg-black/90 text-[#FFD700] border border-[#FFD700] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
            🔒 LOCKED
          </span>
        )}
      </div>

      <div>
        {/* Product Image with onError fallback to yellow shield icon but keep card visible */}
        <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
          {imgSrc && !imageFailed ? (
            <img
              src={imgSrc}
              alt={product.name || 'Product Image'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

          {!isPaid && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <span className="bg-black/85 border border-[#FFD700] text-[#FFD700] text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                🔒 LOCKED ACCESS
              </span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-white font-black text-base uppercase tracking-tight mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-2">
          {product.name || product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Feature Checkmarks */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-1.5 mb-5 border-t border-zinc-900 pt-3">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle size={12} className={isPaid ? "text-emerald-400 shrink-0" : "text-[#FFD700] shrink-0"} />
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
              ${priceUSD.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              ~ ₦{priceNGN.toLocaleString('en-US')} NGN
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(product)}
          className={`w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2 ${
            isPaid
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              : 'bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20'
          }`}
        >
          <span>
            {isPaid ? '✅ UNLOCKED & DOWNLOAD' : `🔒 UNLOCK & DOWNLOAD — $${priceUSD.toFixed(2)}`}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
