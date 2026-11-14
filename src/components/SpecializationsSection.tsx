import React, { useState } from 'react';
import { SPECIALIZATIONS, Specialization } from '../data/specializations';
import { startPiPayment } from '../lib/piPayment';
import ProductGradientImage from './ProductGradientImage';

interface SpecializationsSectionProps {
  onSelectService: (service: Specialization) => void;
  onNavigateTab?: (newTab: string) => void;
  onExploreAllServices?: () => void;
}

export const SpecializationsSection: React.FC<SpecializationsSectionProps> = ({
  onSelectService,
  onNavigateTab,
  onExploreAllServices
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const categories = ['ALL', 'WEB3', 'AI', 'Design & Branding', 'Marketing', 'Digital Operations', 'Academy'];

  const filteredSpecializations = selectedFilter === 'ALL'
    ? SPECIALIZATIONS
    : SPECIALIZATIONS.filter(s => s.category === selectedFilter);

  const handlePiPayment = (product: { id: string; title: string; piPrice: number }) => {
    startPiPayment(product);
  };

  return (
    <section id="specializations" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
          <span>GOYE STORE · SIRWISE AI WEB3 ACADEMY</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          Our Certified Specializations
        </h2>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-[#FFD700] text-black shadow-lg shadow-yellow-500/20 font-black'
                  : 'bg-zinc-900/90 text-gray-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Specializations Grid - Image + Title + Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecializations.map((spec) => {
          const isUnlocked = typeof window !== 'undefined' && (
            localStorage.getItem(`paid_${spec.id}`) === 'true' ||
            localStorage.getItem(`unlocked_${spec.id}`) === 'true'
          );

          return (
            <div
              key={spec.id}
              className="bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between border border-zinc-800 shadow-xl"
            >
              {/* 1. Image with LOCKED ACCESS Badge */}
              <div className="relative w-full rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4">
                <ProductGradientImage
                  src={spec.imageUrl}
                  alt={spec.imageAlt || spec.title}
                  category={spec.category}
                  title={spec.title}
                  height="220px"
                />

                {/* Badge: Strictly 🔒 LOCKED ACCESS */}
                <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md pointer-events-none">
                  {isUnlocked ? '✅ ACCESS GRANTED' : '🔒 LOCKED ACCESS'}
                </div>
              </div>

              {/* 2. Title */}
              <h3 className="text-white font-black text-base uppercase tracking-tight mb-4 line-clamp-2">
                {spec.title}
              </h3>

              {/* 3. Button */}
              <button
                type="button"
                style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto', cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isUnlocked) {
                    onSelectService(spec);
                  } else {
                    handlePiPayment({ id: spec.id, title: spec.title, piPrice: spec.piPrice });
                  }
                }}
                className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
              >
                <span>{isUnlocked ? '✅ ACCESS NOW / DOWNLOAD' : `🔒 LOCK - ${spec.piPrice} Pi`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpecializationsSection;
