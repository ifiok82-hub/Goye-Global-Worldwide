import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle, Clock, ShieldCheck, ArrowRight, MessageSquare, Star, Award } from 'lucide-react';
import { SPECIALIZATIONS, Specialization } from '../data/specializations';

interface ServicesPageProps {
  onSelectService: (service: Specialization) => void;
  onNavigateTab: (tab: string) => void;
  onPurchaseProduct?: (product: any) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSelectService,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'WEB3', 'AI', 'Design & Branding', 'Marketing', 'Digital Operations', 'Academy'];

  const filtered = SPECIALIZATIONS.filter((s) => {
    const matchesCategory = activeCategory === 'ALL' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.fullOverview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-[#0a0a0a] border-2 border-[#FFD700] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/40 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <Award size={13} className="text-[#FFD700]" />
            PROFESSIONAL SERVICES & CERTIFIED SPECIALIZATIONS
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Official Services Catalog
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            All 13 certified specializations by Goye Store & Sirwise AI WEB3 Academy. Professional soft copy deliverables, AI solutions, Web3 smart contract architectures, and academic certifications fulfilled within 24-72 hours via Email and WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://wa.me/2348033584736?text=Hello%20Goye%20Store%20Support%2C%20I%20have%20an%20inquiry%20regarding%20your%20digital%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg"
            >
              <MessageSquare size={14} />
              <span>Direct WhatsApp Inquiry</span>
            </a>
            <button
              onClick={() => onNavigateTab('verify')}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <ShieldCheck size={14} className="text-[#FFD700]" />
              <span>Verify Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search specializations, AI, smart contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/70 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FFD700] text-black shadow-md font-black'
                  : 'bg-zinc-900/80 text-gray-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List with 400x300 Images */}
      <div className="space-y-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-[#0c0c0c] border border-zinc-800 hover:border-[#FFD700]/70 rounded-3xl p-5 sm:p-6 transition shadow-xl hover:shadow-yellow-500/5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Left Col: 400x300 Image (rounded 16px, shadow) */}
            <div className="lg:col-span-4">
              <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-black/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                    {service.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black/85 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                    #{service.number}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Col: Details & Deliverables */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {service.category}
                </span>
                <span className="text-zinc-600">•</span>
                <div className="flex items-center text-[#FFD700] text-xs">
                  <Star size={11} className="fill-[#FFD700]" />
                  <span className="ml-1 font-bold text-white text-[11px]">{service.rating.toFixed(2)}</span>
                  <span className="text-gray-500 text-[10px] ml-1">({service.ratingCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                {service.title}
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {service.fullOverview}
              </p>

              {/* Deliverables tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                  Key Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {service.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-400">
                      <CheckCircle size={12} className="text-[#FFD700] shrink-0 mt-0.5" />
                      <span className="truncate">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-gray-500 pt-1">
                <strong>Target Audience:</strong> {service.whoIsItFor}
              </div>
            </div>

            {/* Right Col: Pricing & CTA */}
            <div className="lg:col-span-3 bg-black/80 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-center lg:text-right">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Tuition / Service Fee
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ₦{service.priceNGN.toLocaleString('en-US')}
                </div>
                <div className="text-xs text-[#FFD700] font-bold">
                  ~ ${service.priceUSD} USD
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-center lg:justify-end gap-1 mt-1">
                  <Clock size={11} />
                  <span>{service.turnaround}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-yellow-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Specialization</span>
                  <ArrowRight size={14} />
                </button>

                <a
                  href={`https://wa.me/2348033584736?text=Hi%20Goye%20Store!%20I%20want%20to%20order%20Service%20%23${service.number}%3A%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-[#25D366] text-xs font-bold py-2.5 rounded-xl border border-zinc-800 transition"
                >
                  <MessageSquare size={13} />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
