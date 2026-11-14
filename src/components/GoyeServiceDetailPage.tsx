import React from 'react';
import { GOYE_SERVICES, GoyeService } from '../data/goyeServices';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { startPiPayment } from '../lib/piPayment';

interface GoyeServiceDetailPageProps {
  serviceSlug: string;
  onBack: () => void;
  onOpenConsultation: () => void;
}

export const GoyeServiceDetailPage: React.FC<GoyeServiceDetailPageProps> = ({
  serviceSlug,
  onBack,
  onOpenConsultation: _onOpenConsultation
}) => {
  const service: GoyeService = GOYE_SERVICES.find(s => s.slug === serviceSlug) || GOYE_SERVICES[0];
  const isUnlocked = typeof window !== 'undefined' && localStorage.getItem(`paid_service_${service.id}`) === 'true';

  const handleAction = async () => {
    if (isUnlocked) {
      alert('Access already unlocked for ' + service.title);
      return;
    }

    await startPiPayment(
      {
        id: service.id,
        title: service.title,
        piPrice: 2
      },
      () => {
        localStorage.setItem(`paid_service_${service.id}`, 'true');
        window.location.reload();
      }
    );
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[#FFD700] hover:text-yellow-400 text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to All Services</span>
        </button>

        {/* Card: SHOW ONLY Image + Title + Button */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* 1. Image with LOCKED ACCESS Badge */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
            <div className="text-center p-6 space-y-2">
              <span className="text-4xl">💼</span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{service.category} Solution</p>
            </div>

            <div className="absolute top-4 left-4 bg-black text-[#FFD700] border border-[#FFD700] text-xs font-black uppercase px-3 py-1.5 rounded-md tracking-wider z-10 shadow-md">
              {isUnlocked ? '✅ ACCESS GRANTED' : '🔒 LOCKED ACCESS'}
            </div>
          </div>

          {/* 2. Title */}
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            {service.title}
          </h1>

          {/* 3. Button: 🔒 LOCK - 2 Pi */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleAction}
              className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg bg-[#FFD700] hover:bg-yellow-400 text-black shadow-yellow-500/20 active:scale-95 transition cursor-pointer"
            >
              {isUnlocked ? '✅ ACCESS NOW / DOWNLOAD' : '🔒 LOCK - 2 Pi'}
            </button>

            <a
              href={`https://wa.me/2348033584736?text=Hello%20GOYE%20DIGITAL,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-gray-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
            >
              <MessageSquare size={14} className="text-[#25D366]" />
              <span>Contact Support via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoyeServiceDetailPage;
