import React from 'react';
import { ArrowRight, Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface GoyeHeroProps {
  onOpenTripwire?: () => void;
  onOpenLeadMagnet?: () => void;
}

export const GoyeHero: React.FC<GoyeHeroProps> = ({ 
  onOpenTripwire,
  onOpenLeadMagnet 
}) => {
  const handleScrollToAcademy = () => {
    const el = document.getElementById('academy-dashboard') || document.getElementById('specializations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
              onClick={onOpenTripwire || onOpenLeadMagnet}
              className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs sm:text-sm py-4 px-8 rounded-2xl mx-auto flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.35)] transition active:scale-95 cursor-pointer border-2 border-yellow-200"
            >
              <span>Get the AI Starter & Global Travel Pass for $1 / 0.000003 Pi</span>
              <ArrowRight size={15} />
            </button>
          </div>
          
          {/* Brand Heading */}
          <div className="inline-block w-full mb-8">
            <h1 className="text-[#FFD700] text-[40px] sm:text-[60px] md:text-[68px] font-black tracking-tight mb-2 leading-none uppercase select-none">
              SIRWISE AI WEB3<br/>ACADEMY
            </h1>
            <h2 className="text-white text-lg sm:text-2xl font-bold uppercase tracking-widest leading-none mt-1">
              GOYE Global Worldwide
            </h2>
            <p className="text-[#FFD700] text-xs font-bold mt-2 font-mono">
              gasv.store • goyedagosmessenterprise@gmail.com
            </p>
          </div>
          
          {/* Hero Coursera / Binance Academy Featured Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto mt-10">
            
            {/* Track 1: AI Training & Prompt Engineering */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                {/* 400x300 Image rounded 16px with shadow */}
                <div className="p-3">
                  <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <img 
                      src="/images/specializations/ai_training_solutions_1791357439223.jpg"
                      alt="GOYE Store Sirwise AI WEB3 Academy Artificial Intelligence AI Training & Solutions"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                      UDEMY BESTSELLER
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-[#FFD700]">
                      <Star size={12} className="fill-[#FFD700]" />
                      <span className="ml-1 font-bold text-white text-xs">4.96</span>
                      <span className="text-gray-500 text-[11px] ml-1">(3,120 learners)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      All Levels
                    </span>
                  </div>

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
                  onClick={handleScrollToAcademy} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10"
                >
                  <span>Start Learning</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Track 2: DeFi Yield Farming & Risk Management */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                <div className="p-3">
                  <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <img 
                      src="/images/specializations/defi_yield_farming_1791357364300.jpg"
                      alt="GOYE Store Sirwise AI WEB3 Academy DeFi Yield Farming"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#00FF88] border border-emerald-500/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                      BINANCE ACADEMY STANDARD
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-[#FFD700]">
                      <Star size={12} className="fill-[#FFD700]" />
                      <span className="ml-1 font-bold text-white text-xs">4.91</span>
                      <span className="text-gray-500 text-[11px] ml-1">(1,670 learners)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Intermediate
                    </span>
                  </div>

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
                  onClick={handleScrollToAcademy} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10"
                >
                  <span>Start Learning</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Track 3: Smart Contract Development & Architecture */}
            <div className="group bg-[#0e0e0e] hover:bg-[#131313] rounded-2xl border border-zinc-800 hover:border-[#FFD700] transition duration-300 flex flex-col justify-between shadow-xl overflow-hidden">
              <div>
                <div className="p-3">
                  <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                    <img 
                      src="/images/specializations/smart_contract_solidity_1791357396617.jpg"
                      alt="GOYE Store Sirwise AI WEB3 Academy Smart Contract Development"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                      COURSERA VERIFIED
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-[#FFD700]">
                      <Star size={12} className="fill-[#FFD700]" />
                      <span className="ml-1 font-bold text-white text-xs">4.96</span>
                      <span className="text-gray-500 text-[11px] ml-1">(2,150 learners)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Developer
                    </span>
                  </div>

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
                  onClick={handleScrollToAcademy} 
                  className="bg-[#FFD700] text-black hover:bg-yellow-400 text-xs font-black uppercase tracking-wider w-full py-3 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10"
                >
                  <span>Start Learning</span>
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
