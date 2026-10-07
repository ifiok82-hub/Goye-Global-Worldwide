import React from 'react';
import { CORE_CATEGORIES, GOYE_SERVICES, GoyeService } from '../data/goyeServices';
import { Layers, Bot, TrendingUp, Globe, Code, MessageSquare, Zap, Target, Search, Sparkles, ArrowRight, Check } from 'lucide-react';

interface GoyeServicesSectionProps {
  onSelectService: (serviceSlug: string) => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const GoyeServicesSection: React.FC<GoyeServicesSectionProps> = ({
  onSelectService,
  onRequestQuote
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe size={20} className="text-cyan-400" />;
      case 'Code': return <Code size={20} className="text-cyan-400" />;
      case 'Bot': return <Bot size={20} className="text-purple-400" />;
      case 'Zap': return <Zap size={20} className="text-purple-400" />;
      case 'MessageSquare': return <MessageSquare size={20} className="text-purple-400" />;
      case 'Target': return <Target size={20} className="text-amber-400" />;
      case 'Search': return <Search size={20} className="text-amber-400" />;
      case 'Sparkles': return <Sparkles size={20} className="text-amber-400" />;
      default: return <Layers size={20} className="text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <span>Core B2B Digital Capabilities</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Build. Automate. <span className="text-cyan-400">Grow.</span>
          </h2>
          
          <p className="text-base text-gray-300">
            Select a service category below to explore technical capabilities or request a customized quotation.
          </p>
        </div>

        {/* 3 Core Category Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CORE_CATEGORIES.map((cat) => {
            const isBuild = cat.id === 'BUILD';
            const isAutomate = cat.id === 'AUTOMATE';
            const borderStyle = isBuild 
              ? 'border-cyan-500/40 hover:border-cyan-400' 
              : isAutomate 
              ? 'border-purple-500/40 hover:border-purple-400' 
              : 'border-amber-500/40 hover:border-amber-400';

            const badgeBg = isBuild
              ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
              : isAutomate
              ? 'bg-purple-950 text-purple-400 border-purple-800'
              : 'bg-amber-950 text-amber-400 border-amber-800';

            const ctaBtn = isBuild
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
              : isAutomate
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white'
              : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950';

            return (
              <div
                key={cat.id}
                className={`bg-slate-900/90 rounded-3xl p-8 border ${borderStyle} transition-all duration-300 shadow-xl flex flex-col justify-between`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${badgeBg}`}>
                      {cat.badge}
                    </span>
                    <span className="text-2xl font-black text-slate-700">{cat.id}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-sm font-semibold text-gray-300 mb-4">
                      {cat.headline}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                      Includes & Deliverables:
                    </p>
                    <ul className="space-y-2">
                      {cat.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => onRequestQuote(cat.title)}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${ctaBtn}`}
                  >
                    <span>{cat.cta}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Individual Service Cards Grid */}
        <div className="pt-12 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black uppercase text-white tracking-tight">
              Detailed Solution Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Select any specific service below to view full problem-solution scope, target client fit, and process steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOYE_SERVICES.map((serv: GoyeService) => (
              <div
                key={serv.id}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getIcon(serv.iconName)}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      {serv.category}
                    </span>
                    <h4 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {serv.title}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {serv.tagline}
                  </p>
                </div>

                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => onSelectService(serv.slug)}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>View Service Scope</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
