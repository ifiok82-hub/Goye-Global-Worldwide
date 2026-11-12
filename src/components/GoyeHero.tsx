import React from 'react';
import { ArrowRight, Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { loginWithPi } from '../lib/piAuth';
import ProductGradientImage from './ProductGradientImage';

interface GoyeHeroProps {
  onOpenTripwire?: () => void;
  onOpenLeadMagnet?: () => void;
  onPurchaseAcademy?: () => void;
}

export const GoyeHero: React.FC<GoyeHeroProps> = ({ 
  onOpenTripwire,
  onOpenLeadMagnet,
  onPurchaseAcademy 
}) => {
  const isAcademyPaid = typeof window !== 'undefined' && (
    localStorage.getItem('sirwise_paid') === 'true' ||
    localStorage.getItem('payment_verified') === 'true' ||
    localStorage.getItem('paid_academy_bundle') === 'verified'
  );

  const handleScrollToAcademy = () => {
    const el = document.getElementById('academy-dashboard') || document.getElementById('specializations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAction = async () => {
    if (isAcademyPaid) {
      handleScrollToAcademy();
      return;
    }

    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.createPayment === 'function') {
      const auth = await loginWithPi();
      if (!auth) return;

      try {
        const paymentData = {
          amount: 2,
          memo: 'Sirwise AI Web3 Academy (8 Modules)',
          metadata: { productId: 'academy_bundle', piPrice: 2 }
        };
        const callbacks = {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
              });
            } catch (e) {}
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            try {
              await fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid, productId: 'academy_bundle', amount: 2 })
              });
              localStorage.setItem('sirwise_paid', 'true');
              localStorage.setItem('academy_full_unlocked', 'true');
              window.location.reload();
            } catch (e) {}
          },
          onCancel: (paymentId: string) => console.log('Payment cancelled:', paymentId),
          onError: (err: any) => console.error('Payment error:', err)
        };
        await (window as any).Pi.createPayment(paymentData, callbacks);
        return;
      } catch (e) {
        console.error('Pi createPayment exception in GoyeHero:', e);
      }
    }

    if (onPurchaseAcademy) {
      onPurchaseAcademy();
    } else {
      handleScrollToAcademy();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black text-white pt-8 pb-12">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Pass Promotion & Micro-offer */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[11px] font-black py-1.5 px-5 rounded-full mx-auto inline-flex items-center gap-2 uppercase tracking-widest shadow-sm">
              <Award size={13} className="text-[#FFD700]" />
              <span>ACCREDITED GLOBAL E-LEARNING & DIGITAL ASSETS</span>
            </div>
            
            <button 
              type="button"
              style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
              onClick={onOpenTripwire || onOpenLeadMagnet}
              className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs sm:text-sm py-4 px-8 rounded-2xl mx-auto flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.35)] transition active:scale-95 cursor-pointer border-2 border-yellow-200"
            >
              <span>Get the AI Starter & Global Travel Pass for 1 Pi</span>
              <ArrowRight size={15} />
            </button>
          </div>
          
          {/* Brand Heading */}
          <div className="inline-block w-full mb-8">
            <h1 className="text-[#FFD700] text-[40px] sm:text-[60px] md:text-[68px] font-black tracking-tight mb-2 leading-none uppercase select-none">
              SIRWISE AI WEB3<br/>ACADEMY
            </h1>
          </div>
          
          {/* Featured Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto mt-10">
            
            {/* Track 1: AI Training & Prompt Engineering */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                <div className="p-3">
                  <div className="relative w-full rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <ProductGradientImage
                      src="/images/specializations/ai_training_solutions_1791357439223.jpg"
                      alt="AI Training & Solutions"
                      category="AI"
                      title="AI Training & Solutions"
                      height="220px"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
                      🔒 LOCKED ACCESS
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <h3 className="text-white font-black text-base uppercase tracking-tight group-hover:text-[#FFD700] transition-colors">
                    AI Training & Solutions
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    Master ChatGPT, Claude, custom GPT agents, and high-impact automated business workflows.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  type="button"
                  style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                  onClick={handleAction} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10 border-2 border-yellow-300"
                >
                  <span>{isAcademyPaid ? '✅ ACCESS NOW' : '🔒 LOCK - 2 Pi'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Track 2: DeFi Yield Farming & Risk Management */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                <div className="p-3">
                  <div className="relative w-full rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <ProductGradientImage
                      src="/images/specializations/defi_yield_farming_1791357364300.jpg"
                      alt="DeFi Yield Farming"
                      category="WEB3"
                      title="DeFi Yield Farming"
                      height="220px"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
                      🔒 LOCKED ACCESS
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <h3 className="text-white font-black text-base uppercase tracking-tight group-hover:text-[#FFD700] transition-colors">
                    DeFi Yield Farming
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    Deep dive into automated market makers, liquidity provisioning, and institutional APY mechanics.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  type="button"
                  style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                  onClick={handleAction} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10 border-2 border-yellow-300"
                >
                  <span>{isAcademyPaid ? '✅ ACCESS NOW' : '🔒 LOCK - 2 Pi'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Track 3: Smart Contract Development & Architecture */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                <div className="p-3">
                  <div className="relative w-full rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <ProductGradientImage
                      src="/images/specializations/smart_contract_solidity_1791357396617.jpg"
                      alt="Smart Contract Development"
                      category="WEB3"
                      title="Smart Contract Development"
                      height="220px"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black text-[#FFD700] border border-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider z-10 shadow-md">
                      🔒 LOCKED ACCESS
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <h3 className="text-white font-black text-base uppercase tracking-tight group-hover:text-[#FFD700] transition-colors">
                    Smart Contract Development
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    Build production-ready Solidity smart contracts, ERC-20 tokens, and verifiable staking systems.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  type="button"
                  style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                  onClick={handleAction} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3.5 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10 border-2 border-yellow-300"
                >
                  <span>{isAcademyPaid ? '✅ ACCESS NOW' : '🔒 LOCK - 2 Pi'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
