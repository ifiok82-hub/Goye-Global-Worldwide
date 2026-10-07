import React from 'react';
import { CLIENT_PROCESS } from '../data/goyeServices';
import { Search, MapPin, Code, Rocket, TrendingUp, CheckCircle2 } from 'lucide-react';

export const GoyeClientProcess: React.FC = () => {
  const icons = [
    <Search size={22} className="text-cyan-400" />,
    <MapPin size={22} className="text-blue-400" />,
    <Code size={22} className="text-purple-400" />,
    <Rocket size={22} className="text-amber-400" />,
    <TrendingUp size={22} className="text-emerald-400" />
  ];

  return (
    <section id="process" className="py-20 bg-slate-950 text-white relative border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
            Structured Client Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Our 5-Step Process
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            A clear, transparent project lifecycle from initial inquiry to go-live deployment and scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {CLIENT_PROCESS.map((item, idx) => (
            <div
              key={item.step}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl relative transition space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors">
                  {item.step}
                </span>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {icons[idx]}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
