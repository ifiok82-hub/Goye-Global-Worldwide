import React, { useState } from 'react';
import { SPECIALIZATIONS, Specialization } from '../data/specializations';
import { loginWithPi } from '../lib/piAuth';

interface ServicesPageProps {
  onBack?: () => void;
  onSelectService: (service: Specialization) => void;
  onNavigateTab?: (newTab: string) => void;
  onPurchaseProduct?: (prod: any) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onBack,
  onSelectService,
  onNavigateTab,
  onPurchaseProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'WEB3', 'AI', 'Design & Branding', 'Marketing', 'Digital Operations', 'Academy'];

  const filtered = selectedCategory === 'ALL'
    ? SPECIALIZATIONS
    : SPECIALIZATIONS.filter(s => s.category === selectedCategory);

  const handleAction = async (service: Specialization) => {
    const isUnlocked = localStorage.getItem(`paid_${service.id}`) === 'true' || localStorage.getItem(`unlocked_${service.id}`) === 'true';
    if (isUnlocked) {
      onSelectService(service);
      return;
    }

    const auth = await loginWithPi();
    if (!auth) return;

    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: service.piPrice,
          memo: service.title,
          metadata: {
            productId: service.id,
            productName: service.title,
            piPrice: service.piPrice
          }
        };

        await (window as any).Pi.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, productId: service.id })
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
                body: JSON.stringify({ paymentId, txid, productId: service.id, amount: service.piPrice })
              });
              if (res.ok) {
                localStorage.setItem(`paid_${service.id}`, 'true');
                window.location.reload();
              }
            } catch (err) {
              console.error('Completion error:', err);
              localStorage.setItem(`paid_${service.id}`, 'true');
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
        console.error('Pi Payment failed', e);
      }
    } else {
      onSelectService(service);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          All Certified Specializations
        </h1>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FFD700] text-black shadow-lg shadow-yellow-500/20 font-black'
                : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: SHOW ONLY Image + Title + Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => {
          const isUnlocked = typeof window !== 'undefined' && (
            localStorage.getItem(`paid_${service.id}`) === 'true' ||
            localStorage.getItem(`unlocked_${service.id}`) === 'true'
          );

          return (
            <div
              key={service.id}
              className="bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between border border-zinc-800 shadow-xl"
            >
              {/* 1. Image with LOCKED ACCESS Badge */}
              <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt || service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
                  {isUnlocked ? '✅ ACCESS GRANTED' : '🔒 LOCKED ACCESS'}
                </div>
              </div>

              {/* 2. Title */}
              <h3 className="text-white font-black text-base uppercase tracking-tight mb-4 line-clamp-2">
                {service.title}
              </h3>

              {/* 3. Button */}
              <button
                type="button"
                onClick={() => handleAction(service)}
                className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
              >
                <span>{isUnlocked ? '✅ ACCESS NOW / DOWNLOAD' : `🔒 LOCK - ${service.piPrice} Pi`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
