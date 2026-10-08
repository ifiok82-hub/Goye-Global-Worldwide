import React, { useState, useEffect } from 'react';
import { Globe, Award, Download, Smartphone, Menu, X, ArrowRight, ShieldCheck, Mail, MessageSquare, Sparkles } from 'lucide-react';

interface GoyeHeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onOpenConsultation?: () => void;
  onOpenAdminLogin?: () => void;
  logoTapCount?: React.MutableRefObject<number>;
}

export const GoyeHeader: React.FC<GoyeHeaderProps> = ({
  currentTab,
  setTab,
  onOpenAdminLogin,
  logoTapCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      alert('PWA is already installed or your browser does not support quick installation. Click the 3 dots in your browser to Add to Home Screen.');
    }
  };

  const handleLogoClick = () => {
    if (logoTapCount) {
      logoTapCount.current += 1;
      const count = logoTapCount.current;
      if (count >= 5) {
        logoTapCount.current = 0;
        if (onOpenAdminLogin) {
          onOpenAdminLogin();
        }
      }
      setTimeout(() => {
        if (logoTapCount) logoTapCount.current = 0;
      }, 4000);
    }
    setTab('home');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'specializations', label: 'Specializations' },
    { id: 'courses', label: 'Courses' },
    { id: 'services', label: 'Services' },
    { id: 'verify', label: 'Verify Certificate' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setTab(id);
    window.location.hash = id;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-[#000000] border-b border-[#FFD700]/30 text-white sticky top-0 z-[9990] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with 5-Tap Admin Action */}
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer group select-none">
            <img
              src="/logo.png"
              alt="SIRWISE AI • WEB3 • ACADEMY"
              className="h-11 w-auto max-w-[140px] object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = document.getElementById('goye-header-text-logo');
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div id="goye-header-text-logo" className="hidden items-center gap-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFD700] via-yellow-500 to-[#FFA500] p-0.5 shadow-lg shadow-yellow-500/20">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-black text-[#FFD700]">
                  <Globe className="text-[#FFD700]" size={22} />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-[#FFD700] transition-colors leading-tight">
                GOYE <span className="text-[#FFD700]">STORE</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">
                SIRWISE AI • WEB3 • ACADEMY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id || (link.id === 'home' && currentTab === 'academy');
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFD700] text-black shadow-md shadow-yellow-500/20'
                      : 'text-gray-300 hover:text-[#FFD700] hover:bg-zinc-900/80 border border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons (Install PWA & WhatsApp) */}
          <div className="hidden sm:flex items-center gap-3">
            {isInstallable && (
              <button
                onClick={handleInstallApp}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-200 font-bold text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition cursor-pointer"
              >
                <Smartphone size={13} />
                <span>Install</span>
              </button>
            )}

            <a
              href="https://wa.me/2348033584736?text=Hello%20Goye%20Store%20Support!%20I%20am%20inquiring%20about%20your%20digital%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs shadow-md shadow-yellow-500/20 flex items-center gap-1.5 active:scale-95 transition"
            >
              <MessageSquare size={13} />
              <span>WhatsApp Live</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 text-[#FFD700] border border-zinc-800 hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-b border-[#FFD700]/30 px-4 py-6 space-y-3 animate-in fade-in duration-200">
          <div className="grid gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id || (link.id === 'home' && currentTab === 'academy');
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FFD700] text-black shadow-md'
                      : 'bg-zinc-900/60 text-gray-200 border border-zinc-800 hover:text-[#FFD700]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 grid gap-2">
            <a
              href="https://wa.me/2348033584736"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-xl bg-[#25D366] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              <span>WhatsApp: +2348033584736</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
