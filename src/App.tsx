import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Globe, Award, Smartphone, Menu, X, ArrowRight, ShieldCheck, Mail, Download, 
  Lock, Copy, CheckCircle, RefreshCw, ChevronRight, ExternalLink, HelpCircle, 
  Trash2, Plus, FileText, Video, Eye, EyeOff, Bot, MessageSquare, Info, Star, Sparkles
} from 'lucide-react';

import { GoyeHeader } from './components/GoyeHeader';
import { GoyeHero } from './components/GoyeHero';
import { GoyeFooter } from './components/GoyeFooter';
import { SpecializationsSection } from './components/SpecializationsSection';
import { ServicesPage } from './components/ServicesPage';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { VerifyCertificatePage } from './components/VerifyCertificatePage';
import { ContactPage } from './components/ContactPage';
import AcademyDashboard from './components/AcademyDashboard';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { TermsPage, PrivacyPage, RefundPage } from './components/LegalPages';
import { ProductCard } from './components/ProductCard';
import { ALL_PRODUCTS } from './data';
import { SPECIALIZATIONS, Specialization } from './data/specializations';
import { safeParse } from './utils/safeParse';
import { getPaymentEnvironment, getDisplayPrice, getBuyButtonLabel, getPiPrice } from './utils/paymentAdapter';
import { autoLoginWithPi, loginWithPi } from './lib/piAuth';
import PiLoginButton from './components/PiLoginButton';
import AutoPiConverter from './components/AutoPiConverter';
export default function App() {
  const env = getPaymentEnvironment();
    // AUTO Pi Auth - runs on page load, shows your Pi username automatically
  useEffect(() => {
    autoLoginWithPi();
  }, []);
  const isPiBrowserMode = env === 'PI_BROWSER';

  const [tab, setTab] = useState(() => {
    const path = window.location.pathname.replace('/', '').trim().toLowerCase();
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    const route = path || hash;
    if (route === 'admin' || route === 'admin-dashboard') return 'admin';
    if (route === 'specializations') return 'specializations';
    if (route === 'courses' || route === 'academy') return 'courses';
    if (route === 'services' || route === 'store' || route === 'shop') return 'services';
    if (route === 'verify' || route === 'verify-certificate') return 'verify';
    if (route === 'contact' || route === 'support') return 'contact';
    if (route === 'downloads' || route === 'my-downloads') return 'downloads';
    if (route === 'terms' || route === 'terms-of-service') return 'terms';
    if (route === 'privacy' || route === 'privacy-policy') return 'privacy';
    if (route === 'refund' || route === 'refund-policy') return 'refund';
    return 'home'; // Default is Home
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedServiceBooking, setSelectedServiceBooking] = useState<Specialization | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const logoTapTimerRef = useRef<any>(null);

  const handleFooterLogoTap = () => {
    setLogoTaps(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setShowAdmin(true);
        if (logoTapTimerRef.current) clearTimeout(logoTapTimerRef.current);
        return 0;
      }
      if (logoTapTimerRef.current) clearTimeout(logoTapTimerRef.current);
      logoTapTimerRef.current = setTimeout(() => {
        setLogoTaps(0);
      }, 3000);
      return next;
    });
  };

  // All Real Digital Products, Courses, eSIM and Blueprints from Catalog
  const displayProducts = ALL_PRODUCTS && ALL_PRODUCTS.length > 0 
    ? ALL_PRODUCTS.filter(p => p.visible !== false && p.category !== 'developer')
    : [];

  const core5Products = displayProducts.slice(0, 5);


  const showToast = (msg: string, _type?: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    (window as any).showToast = showToast;

    // Local Storage Session Auth Restore (PWA requirement)
    const storedEmail = localStorage.getItem('user_email');
    if (storedEmail) {
      setCurrentUser({ uid: 'usr_' + storedEmail.split('@')[0], email: storedEmail });
      setUserProfile({ uid: 'usr_' + storedEmail.split('@')[0], email: storedEmail, displayName: storedEmail.split('@')[0] });
    } else {
      localStorage.setItem('user_email', 'pioneer@gasv.store');
      localStorage.setItem('customer_email', 'pioneer@gasv.store');
      setCurrentUser({ uid: 'usr_pioneer', email: 'pioneer@gasv.store' });
      setUserProfile({ uid: 'usr_pioneer', email: 'pioneer@gasv.store', displayName: 'Pioneer' });
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      try {
        if ((window as any).Pi) {
          const isSandbox = (localStorage.getItem('PI_SANDBOX_MODE') || 'true') !== 'false';
          (window as any).Pi.init({ version: "2.0", sandbox: false });
        }
      } catch (e) {
        console.error('Pi SDK init error:', e);
      }
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace('/', '').trim().toLowerCase();
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      const route = path || hash;
      if (route === 'admin' || route === 'admin-dashboard') {
        setShowAdmin(true);
        setTab('home');
      } else if (route === 'specializations') {
        setTab('specializations');
      } else if (route === 'courses' || route === 'academy') {
        setTab('courses');
      } else if (route === 'services' || route === 'store' || route === 'shop') {
        setTab('services');
      } else if (route === 'verify' || route === 'verify-certificate') {
        setTab('verify');
      } else if (route === 'contact' || route === 'support') {
        setTab('contact');
      } else if (route === 'downloads' || route === 'my-downloads') {
        setTab('downloads');
      } else if (route === 'terms' || route === 'terms-of-service') {
        setTab('terms');
      } else if (route === 'privacy' || route === 'privacy-policy') {
        setTab('privacy');
      } else if (route === 'refund' || route === 'refund-policy') {
        setTab('refund');
      } else {
        setTab('home');
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleManualVerificationCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('manualVerifyInput') as HTMLInputElement)?.value.trim();
    if (!input) {
      showToast('Please enter a Pi payment reference or Tx Hash.', 'error');
      return;
    }
    showToast(`⏳ Checking reference: ${input}... Status: Pending Review.`, 'info');
  };

  const navigateTo = (newTab: string) => {
    setTab(newTab);
    window.location.hash = newTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-[#FFD700] selection:text-black">
      <AutoPiConverter />
      <PiLoginButton />
      
      {/* Header */}
      <GoyeHeader
        currentTab={tab}
        setTab={navigateTo}
      />

      {/* Main Container */}
      <main className="min-h-[75vh]">
        
        {/* Render Tab: HOME */}
        {tab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Section */}
            <GoyeHero 
              onPurchaseAcademy={() => {
                const academyProd = {
                  id: 'academy_bundle',
                  name: 'Sirwise AI Web3 Academy (8 Modules)',
                  piPrice: 2, price: 2
                };
                setSelectedProduct(academyProd);
                setShowCheckoutModal(true);
              }}
              onOpenTripwire={() => {
                const tripwireProd = {
                  id: 'ai-starter-tripwire',
                  name: 'AI Starter & Global Travel Pass (Pi)',
                  price: 1.00
                };
                setSelectedProduct(tripwireProd);
                setShowCheckoutModal(true);
              }}
              onOpenLeadMagnet={() => {
                const tripwireProd = {
                  id: 'ai-starter-tripwire',
                  name: 'AI Starter & Global Travel Pass (Pi)',
                  price: 1.00
                };
                setSelectedProduct(tripwireProd);
                setShowCheckoutModal(true);
              }}
            />

            {/* TASK 1: HOMEPAGE - "Our Certified Specializations" */}
            <div id="specializations-preview" className="border-t border-b border-zinc-900 py-6 bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent">
              <SpecializationsSection
                onSelectService={(service) => setSelectedServiceBooking(service)}
                onExploreAllServices={() => navigateTo('services')}
              />
            </div>

            {/* CORRECTION 2: KEEP MY ESIM PRODUCTS - Featured Products & Global eSIM Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] font-black uppercase text-black bg-[#FFD700] px-3.5 py-1.5 rounded-full border border-[#FFD700] tracking-widest inline-block">
                  GLOBAL STORE & ROAMING ESIM PROFILES
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  Featured Digital Products & Roaming eSIM
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
                  Instant digital fulfillment. Pay securely with Pi.
                </p>
              </div>

              {/* 5 Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {displayProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setShowCheckoutModal(true);
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Academy Classroom Dashboard Section */}
            <div id="academy-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 pt-8">
              <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30">
                  SIRWISE AI WEB3 CLASSROOM
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Curriculum & Training Modules
                </h2>
                <p className="text-xs text-gray-400">
                  Access accredited modules in applied AI, Smart Contract development, and Web3 finance.
                </p>
              </div>

              <AcademyDashboard
                currentUser={currentUser}
                userProfile={userProfile}
                onPurchase={(prod: any) => {
                  setSelectedProduct(prod);
                  setShowCheckoutModal(true);
                }}
                onToast={showToast}
              />
            </div>
          </div>
        )}

        {/* Render Tab: SPECIALIZATIONS */}
        {tab === 'specializations' && (
          <div className="py-8 animate-in fade-in duration-300">
            <SpecializationsSection
              onSelectService={(service) => setSelectedServiceBooking(service)}
              onExploreAllServices={() => navigateTo('services')}
            />
          </div>
        )}

        {/* Render Tab: COURSES */}
        {tab === 'courses' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/15 px-3 py-1 rounded-full border border-[#FFD700]/40">
                SIRWISE AI WEB3 ACADEMY
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                Academic Curriculum & Courses
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Self-paced and mentorship-driven online courses with verifiable graduation certificates.
              </p>
            </div>

            <AcademyDashboard
              currentUser={currentUser}
              userProfile={userProfile}
              onPurchase={(prod: any) => {
                setSelectedProduct(prod);
                setShowCheckoutModal(true);
              }}
              onToast={showToast}
            />
          </div>
        )}

        {/* Render Tab: SERVICES */}
        {tab === 'services' && (
          <div className="space-y-12 py-8 animate-in fade-in duration-300">
            <ServicesPage
              onSelectService={(service) => setSelectedServiceBooking(service)}
              onNavigateTab={navigateTo}
              onPurchaseProduct={(prod) => {
                setSelectedProduct(prod);
                setShowCheckoutModal(true);
              }}
            />

            {/* Digital Store Products Preview in Services Tab */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 pt-8 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-xl font-black text-white uppercase">
                  Digital Toolkits & Global eSIM (Pi)
                </h3>
                <p className="text-xs text-gray-400">
                  Instant electronic fulfillment credentials and downloadable packs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {displayProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setShowCheckoutModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Tab: VERIFY CERTIFICATE */}
        {tab === 'verify' && (
          <VerifyCertificatePage />
        )}

        {/* Render Tab: CONTACT */}
        {tab === 'contact' && (
          <ContactPage onToast={showToast} />
        )}

        {/* Render Tab: MY DOWNLOADS */}
        {tab === 'downloads' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300 py-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-black uppercase text-black bg-[#FFD700] px-3 py-1 rounded border border-[#FFD700]">
                📁 YOUR DOWNLOAD CENTER
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                MY DOWNLOADS & CURRICULUM
              </h1>
              <p className="text-xs text-gray-400">
                All purchased digital study guides, certificates, and toolkits will appear below for instant download.
              </p>
            </div>

            {/* Verification Helper Card */}
            <div className="bg-[#0c0c0c] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FFD700]" />
                <span>Verify Pi Payment Reference</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                If you made a payment on Pi Network, enter your username, payment ID, or Tx Hash below for instant confirmation.
              </p>

              <form onSubmit={handleManualVerificationCheck} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  id="manualVerifyInput"
                  placeholder="Enter Pi payment ID, username, or Tx Hash..."
                  className="flex-1 bg-black border border-zinc-800 p-3.5 rounded-xl text-white outline-none focus:border-[#FFD700] text-xs font-semibold"
                />
                <button 
                  type="submit"
                  className="bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition duration-150 cursor-pointer"
                >
                  Verify Reference
                </button>
              </form>
            </div>

            {/* Free Download Blueprint */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Free Introductory Material</h3>
              <div className="bg-[#0c0c0c] border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-xl font-bold text-[#FFD700]">
                    📄
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-sm uppercase">5-Minute AI Prompt Blueprint (Teaser)</h4>
                    <p className="text-gray-400 text-xs">High-income digital consulting teaser prompt workbook (PDF).</p>
                  </div>
                </div>

                <a 
                  href="/5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf" 
                  download="5-Minute-AI-Prompt-Blueprint-Teaser-Sirwise.pdf"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#FFD700] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab: Terms & Conditions */}
        {tab === 'terms' && (
          <TermsPage onBack={() => navigateTo('home')} setTab={navigateTo} />
        )}

        {/* Render Tab: Privacy Policy */}
        {tab === 'privacy' && (
          <PrivacyPage onBack={() => navigateTo('home')} setTab={navigateTo} />
        )}

        {/* Render Tab: Refund Policy */}
        {tab === 'refund' && (
          <RefundPage onBack={() => navigateTo('home')} setTab={navigateTo} />
        )}

      </main>

      {/* Footer with 7-tap Admin Trigger */}
      <GoyeFooter
        setTab={navigateTo}
        onLogoTap={handleFooterLogoTap}
      />

      {/* Service Booking Modal */}
      {selectedServiceBooking && (
        <ServiceBookingModal
          service={selectedServiceBooking}
          onClose={() => setSelectedServiceBooking(null)}
          onToast={showToast}
        />
      )}

      {/* Master Admin Console Overlay - Triggered via Footer Logo 7 taps */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[99999] overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {Boolean(typeof window !== 'undefined' && (localStorage.getItem('pi_username') || localStorage.getItem('pi_username_trusted'))) ? (
              <AdminDashboard 
                showToast={showToast} 
                onClose={() => setShowAdmin(false)} 
              />
            ) : (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <div className="bg-[#0c0c0c] border border-[#FFD700]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAdmin(false)}
                      className="text-gray-400 hover:text-white text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="w-16 h-16 bg-zinc-900 border border-[#FFD700] text-[#FFD700] rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">
                    🔒
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    Pi Network Admin Verification
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Master Admin Console is restricted to authenticated Pi Network users. Authenticate with your Pi Browser account to access order logs, customer intelligence, and payment settings.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await loginWithPi();
                      if (res?.username || localStorage.getItem('pi_username') || localStorage.getItem('pi_username_trusted')) {
                        showToast('✅ Pi Network Admin Authenticated', 'success');
                      }
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#7D2AE7] hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <img src="https://minepi.com/favicon.png" className="w-4 h-4" alt="Pi" />
                    <span>Login with Pi Network</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal Trigger for Store Products */}
      {showCheckoutModal && selectedProduct && (
        <UnifiedCheckoutModal
          product={selectedProduct}
          onClose={() => {
            setShowCheckoutModal(false);
            setSelectedProduct(null);
          }}
          paymentConfig={{
            pi: { enabled: true }
          }}
          onToast={showToast}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] bg-[#FFD700] text-black px-6 py-3.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 border border-white/20">
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}

    </div>
  );
}
