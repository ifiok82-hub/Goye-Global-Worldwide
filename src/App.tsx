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
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import AcademyDashboard from './components/AcademyDashboard';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { TermsPage, PrivacyPage, RefundPage } from './components/LegalPages';
import { ProductCard } from './components/ProductCard';
import { ALL_PRODUCTS } from './data';
import { SPECIALIZATIONS, Specialization } from './data/specializations';
import { safeParse } from './utils/safeParse';
import { getPaymentEnvironment, getDisplayPrice, getBuyButtonLabel, getPiPrice } from './utils/paymentAdapter';

export default function App() {
  const env = getPaymentEnvironment();
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
  const [isAdminAuth, setIsAdminAuth] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isVerifyingPass, setIsVerifyingPass] = useState(false);

  const logoTapCountRef = useRef(0);

  // 5 Core Digital Products (Restored with exact /images/old/ paths)
  const core5Products = [
    {
      id: 'esim-global',
      slug: 'esim-global-1gb',
      preview_image: '/images/old/esim-global-1gb.jpg',
      image: '/images/old/esim-global-1gb.jpg',
      name: 'GOYE eSIM Global 190 Countries 1GB',
      title: 'GOYE eSIM Global 190 Countries 1GB',
      icon: '🌐',
      price: 9.99,
      category: 'esim',
      badge: 'TRAVEL BESTSELLER ($9)',
      description: 'Global high-speed roaming eSIM valid in 190+ countries with 1GB 5G/4G data. Fast activation via WhatsApp QR within 60 seconds.',
      features: ['190+ Countries Included', 'Instant WhatsApp QR Delivery', 'Zero Roaming Fees']
    },
    {
      id: '1000-prompts',
      slug: 'ai-prompts-library-1000',
      preview_image: '/images/old/ai-prompts-library-1000.jpg',
      image: '/images/old/ai-prompts-library-1000.jpg',
      name: '1000 Viral AI Prompts Library',
      title: '1000 Viral AI Prompts Library',
      icon: '🤖',
      price: 39.99,
      category: 'prompts',
      badge: 'MONETIZATION TOOLKIT',
      description: '1000 Master AI Copy-Paste prompts for business, copywriting, social media, and automation that can earn $1000/month.',
      features: ['ChatGPT & Claude Optimized', 'Sales Copywriting Systems', 'Freelancing Scripts']
    },
    {
      id: 'pi-network',
      slug: 'pi-gcv-crash-course-314159',
      preview_image: '/images/old/pi-gcv-crash-course-314159.jpg',
      image: '/images/old/pi-gcv-crash-course-314159.jpg',
      name: 'Pi Network GCV Crash Course ($314,159)',
      title: 'Pi Network GCV Crash Course ($314,159)',
      icon: 'π',
      price: 49.99,
      category: 'academy',
      badge: 'GCV SPECIALIST',
      description: 'Complete crash course on Pi Network GCV commerce. Understand utility, secure wallet configurations, and peer-to-peer barter.',
      features: ['Pi GCV Economy Basics', 'Secure Pi Wallet Manuals', 'Global Consensus Value Standards']
    },
    {
      id: 'canada-lmia',
      slug: 'canada-lmia-500-employers',
      preview_image: '/images/old/canada-lmia-500-employers.jpg',
      image: '/images/old/canada-lmia-500-employers.jpg',
      name: 'Canada LMIA Jobs Database (500 Employers)',
      title: 'Canada LMIA Jobs Database (500 Employers)',
      icon: '🇨🇦',
      price: 69.99,
      category: 'contracts',
      badge: 'IMMIGRATION DIRECTORY',
      description: 'Verified spreadsheet of 500 active Canadian employers with approved LMIA status offering direct job visa sponsorships.',
      features: ['500 Verified Sponsors', 'Provincial Application Steps', 'Resume Optimization Format']
    },
    {
      id: 'uk-care-visa',
      slug: 'uk-care-worker-visa-blueprint-2026',
      preview_image: '/images/old/uk-care-worker-visa-blueprint-2026.jpg',
      image: '/images/old/uk-care-worker-visa-blueprint-2026.jpg',
      name: 'UK Care Worker Visa Blueprint 2026',
      title: 'UK Care Worker Visa Blueprint 2026',
      icon: '🇬🇧',
      price: 89.99,
      category: 'contracts',
      badge: 'RELOCATION PACK',
      description: 'Step-by-step master relocation blueprint, Certificate of Sponsorship (COS) directories, and professional cover letter formats.',
      features: ['COS Sponsor Checklist', 'ATS UK Format Resumes', 'Visa Interview Preparation Guide']
    }
  ];

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
    const handleRouteChange = () => {
      const path = window.location.pathname.replace('/', '').trim().toLowerCase();
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      const route = path || hash;
      if (route === 'admin' || route === 'admin-dashboard') {
        const authed = localStorage.getItem('isAdmin') === 'true';
        if (!authed) {
          setShowAdminLogin(true);
        }
        setTab('admin');
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

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = adminPassword.trim();
    if (cleanPass === 'GoyeBN3583878' || cleanPass === 'BN3583878' || cleanPass === 'GoyeBN3583878' || cleanPass === 'BN3583878') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('is_admin', 'true');
      localStorage.setItem('admin_token', 'gd_master_admin_session_' + Date.now());
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setTab('admin');
      window.location.hash = 'admin';
      showToast('🔑 Master Admin Access Unlocked!', 'success');
      setAdminPassword('');
    } else {
      showToast('❌ Incorrect Admin Password!', 'error');
    }
  };

  const handleManualVerificationCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('manualVerifyInput') as HTMLInputElement)?.value.trim();
    if (!input) {
      showToast('Please enter an OPay transaction reference or Tx Hash.', 'error');
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
      
      {/* Header */}
      <GoyeHeader
        currentTab={tab}
        setTab={navigateTo}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        logoTapCount={logoTapCountRef}
      />

      {/* Main Container */}
      <main className="min-h-[75vh]">
        
        {/* Render Tab: HOME */}
        {tab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Section */}
            <GoyeHero 
              onOpenTripwire={() => {
                const tripwireProd = {
                  id: 'ai-starter-tripwire',
                  name: 'AI Starter & Global Travel Pass ($1)',
                  price: 1.00
                };
                setSelectedProduct(tripwireProd);
                setShowCheckoutModal(true);
              }}
              onOpenLeadMagnet={() => {
                const tripwireProd = {
                  id: 'ai-starter-tripwire',
                  name: 'AI Starter & Global Travel Pass ($1)',
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
                  Instant digital fulfillment. Pay securely with Paystack, Flutterwave, PayPal, or direct OPay.
                </p>
              </div>

              {/* 5 Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {core5Products.map((prod) => (
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
                  Digital Toolkits & Global eSIM ($9)
                </h3>
                <p className="text-xs text-gray-400">
                  Instant electronic fulfillment credentials and downloadable packs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {core5Products.map((prod) => (
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
                <span>Verify OPay Payment Reference</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                If you made a transfer to OPay account <strong>6113541882</strong> (GOYEDAGOSMESS ENTERPRISE), enter your sender email, reference name, or Tx Hash below for instant confirmation.
              </p>

              <form onSubmit={handleManualVerificationCheck} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  id="manualVerifyInput"
                  placeholder="Enter OPay reference, sender name, or 0x Tx Hash..."
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

        {/* Render Tab: Admin Control Console */}
        {tab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            {isAdminAuth ? (
              <AdminDashboard showToast={showToast} />
            ) : (
              <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#0c0c0c] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-4">
                  <div className="w-14 h-14 bg-zinc-900 border border-[#FFD700] text-[#FFD700] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                    🔒
                  </div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tight">
                    Admin Portal Login
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Please enter the Master Admin Password to access order logs, service bookings, and payment settings.
                  </p>
                  <button 
                    onClick={() => setShowAdminLogin(true)} 
                    className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
                  >
                    Authenticate Admin Access
                  </button>
                </div>
              </div>
            )}
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

      {/* Footer */}
      <GoyeFooter
        setTab={navigateTo}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Service Booking Modal (TASK 2) */}
      {selectedServiceBooking && (
        <ServiceBookingModal
          service={selectedServiceBooking}
          onClose={() => setSelectedServiceBooking(null)}
          onToast={showToast}
        />
      )}

      {/* Admin Login Modal Triggered via Logo clicks or footer */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-[#FFD700]/40 rounded-2xl max-w-sm w-full p-6 text-white relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase text-black bg-[#FFD700] px-2.5 py-0.5 rounded">
                SECURITY ACCESS CONTROL
              </span>
              <h3 className="text-xl font-black text-white uppercase">Master Admin Password</h3>
              <p className="text-xs text-gray-400">Authenticate session for master admin console.</p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Goye password..."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingPass}
                className="w-full py-3.5 rounded-xl bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest transition cursor-pointer"
              >
                Verify Session Access
              </button>
            </form>
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
            paystack: localStorage.getItem('paystack_public_key') || 'pk_live_9f7e06b21fa6dc4e3e94cc0',
            flutterwave: localStorage.getItem('flutterwave_public_key') || 'FLWPUBK-cbb518a9b8f74421e887f4a1ec911ea7-X',
            crypto: '0xdc7f804B36aB672Ec31642dF418F29e73281b040',
            pi: 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'
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
