import React from 'react';
import { Lock, MessageSquare, Mail, Globe, ShieldCheck, Heart, QrCode } from 'lucide-react';

interface GoyeFooterProps {
  setTab: (tab: string) => void;
  onOpenConsultation?: () => void;
  onOpenAdminLogin: () => void;
}

export const GoyeFooter: React.FC<GoyeFooterProps> = ({
  setTab,
  onOpenAdminLogin
}) => {
  const handleNav = (tabKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setTab(tabKey);
    window.location.hash = tabKey;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] text-gray-400 text-xs border-t border-[#FFD700]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Us */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD700] flex items-center justify-center font-black text-black text-lg shadow-lg">
                🌎
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight">
                  GOYE <span className="text-[#FFD700]">STORE</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFD700]/80 -mt-1">
                  Sirwise AI WEB3 Academy
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <p className="font-bold text-white text-[11px] uppercase tracking-wider text-[#FFD700]">
                About Us
              </p>
              <p>
                Goyedagosmess Enterprise BN: 3583878 is parent company of Goye Store and Sirwise AI WEB3 Academy.
              </p>
            </div>

            <div className="space-y-1 text-[11px] font-mono text-gray-400 pt-1">
              <p>Website: <a href="https://gasv.store" className="text-[#FFD700] hover:underline">https://gasv.store</a></p>
              <p>Email: <a href="mailto:goyedagosmessenterprise@gmail.com" className="text-[#FFD700] hover:underline">goyedagosmessenterprise@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/2348033584736" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">+2348033584736</a></p>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform Menu</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={(e) => handleNav('home', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Sirwise AI Classroom
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('specializations', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Certified Specializations
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('courses', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Certified Courses
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('services', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Global Store & eSIM ($9)
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('verify', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Verify Certificate
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('contact', e)} className="hover:text-[#FFD700] font-bold text-left transition cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages Menu */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Compliance & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="/terms" 
                  onClick={(e) => handleNav('terms', e)}
                  className="hover:text-[#FFD700] font-bold block transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/privacy" 
                  onClick={(e) => handleNav('privacy', e)}
                  className="hover:text-[#FFD700] font-bold block transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/refund" 
                  onClick={(e) => handleNav('refund', e)}
                  className="hover:text-[#FFD700] font-bold block transition"
                >
                  Refund Policy
                </a>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-gray-400 leading-relaxed">
              Global e-learning, digital products, and certified technology specializations.
            </div>
          </div>

          {/* Accepted Gateways & QR */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Accepted Gateways</h4>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#111] border border-gray-800 text-[10px] font-black text-gray-300 px-2.5 py-1 rounded">OPay</span>
              <span className="bg-[#111] border border-gray-800 text-[10px] font-black text-gray-300 px-2.5 py-1 rounded">Paystack</span>
              <span className="bg-[#111] border border-gray-800 text-[10px] font-black text-gray-300 px-2.5 py-1 rounded">Flutterwave</span>
              <span className="bg-[#111] border border-gray-800 text-[10px] font-black text-gray-300 px-2.5 py-1 rounded">PayPal</span>
              <span className="bg-[#111] border border-[#FFD700]/30 text-[10px] font-black text-[#FFD700] px-2.5 py-1 rounded">Pi Network</span>
              <span className="bg-[#111] border border-gray-800 text-[10px] font-black text-[#00FF88] px-2.5 py-1 rounded">USDT / USDC</span>
            </div>

            {/* Support Box */}
            <div className="bg-gradient-to-br from-[#111] to-[#1a1400] border border-[#FFD700]/40 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <h4 className="text-[10px] font-black uppercase text-[#FFD700] flex items-center gap-1">
                <QrCode size={12} />
                <span>Verified OPay & WhatsApp Support</span>
              </h4>
              <p className="text-[10px] text-gray-300 font-mono">
                +2348033584736
              </p>
            </div>
          </div>

        </div>

        {/* Legal Menu Line */}
        <div className="pt-6 border-t border-zinc-900 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-gray-300">
            <a 
              href="/terms" 
              onClick={(e) => handleNav('terms', e)} 
              className="hover:text-[#FFD700] transition"
            >
              Terms
            </a>
            <span className="text-zinc-700">|</span>
            <a 
              href="/privacy" 
              onClick={(e) => handleNav('privacy', e)} 
              className="hover:text-[#FFD700] transition"
            >
              Privacy
            </a>
            <span className="text-zinc-700">|</span>
            <a 
              href="/refund" 
              onClick={(e) => handleNav('refund', e)} 
              className="hover:text-[#FFD700] transition"
            >
              Refund
            </a>
          </div>
        </div>

        {/* Exact Mandatory Footer String Requested by User */}
        <div className="pt-4 border-t border-[#FFD700]/10 flex flex-col items-center justify-between gap-4 text-[11px] text-gray-400 text-center">
          <p className="leading-relaxed max-w-5xl font-medium text-gray-300">
            © 2026 Goyedagosmess Enterprise BN: 3583878 | Goye Store | Sirwise AI WEB3 Academy | goyedagosmessenterprise@gmail.com | WhatsApp +2348033584736 | https://gasv.store
          </p>

          <div className="flex items-center gap-4 text-[10px] text-gray-600">
            <button
              onClick={onOpenAdminLogin}
              className="text-zinc-700 hover:text-[#FFD700] transition flex items-center gap-1 cursor-pointer"
              title="Admin Access"
            >
              <Lock size={10} />
              <span>Admin Access</span>
            </button>
            <span>•</span>
            <span>https://gasv.store</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
