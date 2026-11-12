import React, { useState } from 'react';
import { SPECIALIZATIONS, Specialization } from '../data/specializations';
import { loginWithPi } from '../lib/piAuth';
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

  const handleAction = async (spec: Specialization) => {
    const isUnlocked = typeof window !== 'undefined' && (
      localStorage.getItem(`paid_${spec.id}`) === 'true' ||
      localStorage.getItem(`unlocked_${spec.id}`) === 'true'
    );

    if (isUnlocked) {
      onSelectService(spec);
      return;
    }

    const auth = await loginWithPi();
    if (!auth) return;

    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: spec.piPrice,
          memo: `Specialization: ${spec.title}`,
          metadata: {
            productId: spec.id,
            productName: spec.title,
            piPrice: spec.piPrice
          }
        };

        await (window as any).Pi.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, productId: spec.id })
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
                body: JSON.stringify({ paymentId, txid, productId: spec.id, amount: spec.piPrice })
              });
              if (res.ok) {
                localStorage.setItem(`paid_${spec.id}`, 'true');
                window.location.reload();
              }
            } catch (err) {
              console.error('Completion error:', err);
              localStorage.setItem(`paid_${spec.id}`, 'true');
              window.location.reload();
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
        console.error('Pi Payment error', e);
      }
    } else {
      onSelectService(spec);
    }
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
                <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
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
                style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                onClick={() => handleAction(spec)}
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
