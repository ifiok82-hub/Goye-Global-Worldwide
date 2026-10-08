import React, { useState } from 'react';
import { Globe, Menu, X, Lock } from 'lucide-react';

export const Header = ({ 
  currentTab = 'home', 
  setTab = () => {}, 
  onOpenAdminLogin = () => {}, 
  logoTapCount 
}) => {
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'academy', label: 'Sirwise Academy' },
    { id: 'specializations', label: 'Specializations' },
    { id: 'courses', label: 'Courses' },
    { id: 'services', label: 'Store & eSIM' },
    { id: 'verify', label: 'Verify Certificate' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    setTab(id);
    if (window.location.hash !== `#${id}`) {
      window.location.hash = id;
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    if (logoTapCount) {
      logoTapCount.current = (logoTapCount.current || 0) + 1;
      if (logoTapCount.current >= 5) {
        logoTapCount.current = 0;
        onOpenAdminLogin();
      }
    }
    handleNavClick('home');
  };

  return (
    <header className="bg-[#000000] border-b border-[#FFD700]/30 text-white sticky top-0 z-[9990] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with 5-Tap Admin Action & onError Fallback */}
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer group select-none">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="GOYE Store Sirwise AI WEB3 Academy Logo"
                className="h-12 w-auto max-w-[160px] object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFD700] via-yellow-500 to-[#FFA500] p-0.5 shadow-lg shadow-yellow-500/20">
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-black text-[#FFD700]">
                    <Globe className="text-[#FFD700]" size={22} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-[#FFD700] uppercase">
                    SIRWISE AI • WEB3 • ACADEMY
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 -mt-1">
                    GOYE STORE GLOBAL
                  </span>
                </div>
              </div>
            )}

            {/* Subtle Brand Text next to Logo image */}
            {!logoError && (
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-[#FFD700] transition-colors leading-tight">
                  GOYE <span className="text-[#FFD700]">STORE</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">
                  SIRWISE AI • WEB3 • ACADEMY
                </span>
              </div>
            )}
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

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('services')}
              className="hidden sm:flex items-center gap-1.5 bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition active:scale-95 cursor-pointer"
            >
              <span>eSIM ($9) & Store</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-[#FFD700] hover:bg-zinc-900 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-zinc-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                currentTab === link.id
                  ? 'bg-[#FFD700] text-black font-black'
                  : 'text-gray-300 hover:bg-zinc-900 hover:text-[#FFD700]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-[#FFD700] font-mono text-[11px]">gasv.store</span>
            <button
              onClick={onOpenAdminLogin}
              className="text-zinc-500 hover:text-[#FFD700] flex items-center gap-1 text-[11px]"
            >
              <Lock size={12} /> Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
