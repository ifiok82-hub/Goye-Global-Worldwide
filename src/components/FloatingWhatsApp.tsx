import React from 'react';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = "https://wa.me/2348033584736?text=Hello%20Goye%20Store%20Support!%20I%20am%20inquiring%20about%20your%20digital%20services.";

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 group">
      <span className="hidden sm:inline-block bg-black/90 text-white border border-[#25D366]/40 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg group-hover:block transition animate-in fade-in">
        WhatsApp Live (+2348033584736)
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact support on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-emerald-400 text-black flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-200 relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black animate-pulse" />
        <MessageSquare size={26} className="fill-black" />
      </a>
    </aside>
  );
};
