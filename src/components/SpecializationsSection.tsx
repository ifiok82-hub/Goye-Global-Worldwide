import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Sparkles, Star, Users, Award, ShieldCheck } from 'lucide-react';
import { SPECIALIZATIONS, Specialization } from '../data/specializations';

interface SpecializationsSectionProps {
  onSelectService: (service: Specialization) => void;
  onExploreAllServices: () => void;
}

export const SpecializationsSection: React.FC<SpecializationsSectionProps> = ({
  onSelectService,
  onExploreAllServices
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const categories = ['ALL', 'WEB3', 'AI', 'Design & Branding', 'Marketing', 'Digital Operations', 'Academy'];

  const filteredSpecializations = selectedFilter === 'ALL'
    ? SPECIALIZATIONS
    : SPECIALIZATIONS.filter(s => s.category === selectedFilter);

  return (
    <section id="specializations" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header - Global Academy Standard */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
          <Award size={13} className="text-[#FFD700]" />
          <span>GOYE STORE · SIRWISE AI WEB3 ACADEMY</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          Our Certified Specializations
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Industry-aligned curricula and professional digital specializations designed to international Coursera, Binance Academy, and Udemy standards.
        </p>

        {/* Global Standard Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-gray-400 font-medium">
          <span className="flex items-center gap-1.5 text-gray-300">
            <ShieldCheck size={14} className="text-[#FFD700]" />
            Verifiable Blockchain QR Credentials
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <Sparkles size={14} className="text-[#FFD700]" />
            Hands-On Practical Syllabus
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <Clock size={14} className="text-[#FFD700]" />
            Fast 24-72h Verified Delivery
          </span>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
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

      {/* Specializations Grid - Coursera / Binance Academy / Udemy Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecializations.map((spec) => (
          <div
            key={spec.id}
            onClick={() => onSelectService(spec)}
            className="group bg-[#0e0e0e] hover:bg-[#141414] border border-zinc-800/90 hover:border-[#FFD700] rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xl hover:shadow-yellow-500/10 overflow-hidden"
          >
            <div>
              {/* 400x300 Image Container with rounded 16px and shadow */}
              <div className="p-3">
                <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800/80 bg-zinc-950">
                  <img
                    src={spec.imageUrl}
                    alt={spec.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category & Badge Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-black/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-black uppercase px-2.5 py-1 rounded-md">
                      {spec.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-black/85 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                      #{spec.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 pb-4 pt-1 space-y-3">
                {/* Rating & Learner Count */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-[#FFD700]">
                      <Star size={12} className="fill-[#FFD700]" />
                      <span className="ml-1 font-bold text-white text-xs">{spec.rating.toFixed(2)}</span>
                    </div>
                    <span className="text-gray-500 text-[11px]">({spec.ratingCount.toLocaleString()} learners)</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {spec.level}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-black text-base uppercase tracking-tight group-hover:text-[#FFD700] transition-colors leading-snug line-clamp-2">
                  {spec.title}
                </h3>

                {/* Short Description */}
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {spec.shortDesc}
                </p>

                {/* Deliverables snippet */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  {spec.deliverables.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                      <CheckCircle size={12} className="text-[#FFD700] shrink-0 mt-0.5" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Pricing & Action */}
            <div className="px-5 py-4 border-t border-zinc-900 bg-zinc-950/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase text-gray-500 font-bold">Standard Tuition</div>
                <div className="text-base font-black text-white flex items-baseline gap-1.5">
                  <span>₦{spec.priceNGN.toLocaleString('en-US')}</span>
                  <span className="text-[11px] font-bold text-[#FFD700]">(${spec.priceUSD})</span>
                </div>
              </div>

              <button
                type="button"
                className="bg-[#FFD700] group-hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-yellow-500/10 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>Enroll</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Button */}
      <div className="text-center pt-4">
        <button
          onClick={onExploreAllServices}
          className="inline-flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-xl shadow-yellow-500/20 transition active:scale-95 cursor-pointer border border-yellow-200"
        >
          <span>Explore All 13 Certified Specializations</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
};
