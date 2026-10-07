import React from 'react';
import { GOYE_SERVICES, GoyeService } from '../data/goyeServices';
import { GoyeLeadForm } from './GoyeLeadForm';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Users, Layers, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';

interface GoyeServiceDetailPageProps {
  serviceSlug: string;
  onBack: () => void;
  onOpenConsultation: () => void;
}

export const GoyeServiceDetailPage: React.FC<GoyeServiceDetailPageProps> = ({
  serviceSlug,
  onBack,
  onOpenConsultation
}) => {
  const service: GoyeService | undefined = GOYE_SERVICES.find(s => s.slug === serviceSlug) || GOYE_SERVICES[0];

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition"
        >
          <ArrowLeft size={16} />
          <span>Back to All Services</span>
        </button>

        {/* Hero Header */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-black uppercase tracking-widest border border-cyan-800">
            <span>GOYE DIGITAL • {service.category} Solution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
            {service.tagline}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:from-cyan-400 transition"
            >
              Request a Customized Quote
            </button>

            <a
              href={`https://wa.me/2348000000000?text=Hello%20GOYE%20DIGITAL,%20I%20am%20interested%20in%20your%20${encodeURIComponent(service.title)}%20service.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-950 border border-emerald-600/50 text-emerald-400 font-bold text-xs flex items-center gap-2 hover:bg-emerald-900 transition"
            >
              <MessageSquare size={16} />
              <span>Discuss via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase">
              <AlertTriangle size={18} />
              <span>The Problem</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {service.problem}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
              <Lightbulb size={18} />
              <span>The GOYE DIGITAL Solution</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {service.solution}
            </p>
          </div>
        </div>

        {/* What is Included & Who it is for */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Includes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-cyan-400" />
              <span>What is Included</span>
            </h3>

            <ul className="space-y-2.5">
              {service.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who it is for */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <Users size={20} className="text-purple-400" />
              <span>Who It Is For</span>
            </h3>

            <ul className="space-y-2.5">
              {service.forWho.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* How the Process Works (5 Steps) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Execution Blueprint</span>
            <h3 className="text-2xl font-black uppercase text-white">How The Process Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
            {service.processSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-black text-xs block">{step.title}</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies Placeholder (Genuine status) */}
        <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
          <h4 className="text-sm font-bold uppercase text-gray-400">Project Case Studies</h4>
          <p className="text-xs text-gray-300">
            Case studies coming soon. We publish verified technical breakdowns after client sign-off.
          </p>
        </div>

        {/* Embedded Lead Form */}
        <div className="pt-4">
          <GoyeLeadForm initialService={service.title} />
        </div>

      </div>
    </div>
  );
};
