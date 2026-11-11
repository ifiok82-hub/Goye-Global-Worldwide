import React from 'react';
import { GOYE_SERVICES, GoyeService } from '../data/goyeServices';
import { Layers, Bot, Globe, Code, MessageSquare, Zap, Target, Search, Sparkles } from 'lucide-react';
import { loginWithPi } from '../lib/piAuth';

interface GoyeServicesSectionProps {
  onSelectService: (serviceSlug: string) => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const GoyeServicesSection: React.FC<GoyeServicesSectionProps> = ({
  onSelectService,
  onRequestQuote: _onRequestQuote
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe size={28} className="text-[#FFD700]" />;
      case 'Code': return <Code size={28} className="text-[#FFD700]" />;
      case 'Bot': return <Bot size={28} className="text-[#FFD700]" />;
      case 'Zap': return <Zap size={28} className="text-[#FFD700]" />;
      case 'MessageSquare': return <MessageSquare size={28} className="text-[#FFD700]" />;
      case 'Target': return <Target size={28} className="text-[#FFD700]" />;
      case 'Search': return <Search size={28} className="text-[#FFD700]" />;
      case 'Sparkles': return <Sparkles size={28} className="text-[#FFD700]" />;
      default: return <Layers size={28} className="text-[#FFD700]" />;
    }
  };

  const handleAction = async (serv: GoyeService) => {
    const isUnlocked = localStorage.getItem(`paid_service_${serv.id}`) === 'true';
    if (isUnlocked) {
      onSelectService(serv.slug);
      return;
    }

    const auth = await loginWithPi();
    if (!auth) return;

    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      try {
        const paymentData = {
          amount: 2,
          memo: serv.title,
          metadata: {
            productId: serv.id,
            productName: serv.title,
            piPrice: 2
          }
        };

        await (window as any).Pi.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, productId: serv.id })
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
                body: JSON.stringify({ paymentId, txid, productId: serv.id, amount: 2 })
              });
              if (res.ok) {
                localStorage.setItem(`paid_service_${serv.id}`, 'true');
                window.location.reload();
              }
            } catch (err) {
              console.error('Completion error:', err);
              localStorage.setItem(`paid_service_${serv.id}`, 'true');
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
      onSelectService(serv.slug);
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
            <span>GOYE DIGITAL · B2B SOLUTIONS</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Build. Automate. <span className="text-[#FFD700]">Grow.</span>
          </h2>
        </div>

        {/* Detailed Service Cards Grid - SHOW ONLY Image/Icon + Title + Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GOYE_SERVICES.map((serv: GoyeService) => {
            const isUnlocked = typeof window !== 'undefined' && localStorage.getItem(`paid_service_${serv.id}`) === 'true';

            return (
              <div
                key={serv.id}
                className="bg-[#0e0e0e] rounded-2xl p-5 flex flex-col justify-between border border-zinc-800 shadow-xl"
              >
                {/* 1. Image/Icon Container with LOCKED ACCESS Badge */}
                <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    {getIcon(serv.iconName)}
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
                    {isUnlocked ? '✅ ACCESS GRANTED' : '🔒 LOCKED ACCESS'}
                  </div>
                </div>

                {/* 2. Title */}
                <h3 className="text-white font-black text-base uppercase tracking-tight mb-4 line-clamp-2">
                  {serv.title}
                </h3>

                {/* 3. Button: 🔒 LOCK - 2 Pi */}
                <button
                  type="button"
                  onClick={() => handleAction(serv)}
                  className="w-full font-black uppercase text-xs tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-95 shadow-md flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20"
                >
                  <span>{isUnlocked ? '✅ ACCESS NOW / DOWNLOAD' : '🔒 LOCK - 2 Pi'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
