import AuthScreen from './components/AuthScreen';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { safeParse, safeGetNumber } from './utils/safeParse';
import { X, Globe, Zap, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, ShoppingCart, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, RefreshCw, Users, Activity, UserCircle , Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard, Camera, Mic, MoreHorizontal} from 'lucide-react';
import { ALL_PRODUCTS } from './data';
import { formatPriceDisplay } from './utils/currency';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import AcademyDashboard from './components/AcademyDashboard';
import EsimVideoModal from './components/EsimVideoModal';
import FreeLeadMagnetModal from './components/FreeLeadMagnetModal';
import PostPurchaseUpsellModal from './components/PostPurchaseUpsellModal';
import PaymentOptionsModal from './components/PaymentOptionsModal';

import ScanModal from './components/ScanModal';
import ReferralDashboardModal from './components/ReferralDashboardModal';
import VoiceModal from './components/VoiceModal';
import LanguageModal from './components/LanguageModal';
import AdminDashboard from './components/AdminDashboard';
import CurrencyModal, { CURRENCIES } from './components/CurrencyModal';
import ShareBlueprintSection from './components/ShareBlueprintSection';
import { Bell, User } from 'lucide-react';
import { GoyeLogo } from './components/GoyeLogo';
import SirwiseAITeacher from './components/SirwiseAITeacher';
import { trackUserClick } from './utils/analytics';
import { cleanUserEmail } from './lib/contact';


// Urgency Countdown Banner at top of gasv.store
const UrgencyCountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState(872); // ~14:32 ticking timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-gradient-to-r from-[#111] via-[#1a1400] to-[#111] border-b border-[#FFD700]/40 text-[#FFD700] text-xs font-bold py-2 px-4 text-center sticky top-0 z-[9990] backdrop-blur-md flex items-center justify-center gap-2 flex-wrap shadow-md">
      <span className="inline-flex items-center gap-1.5 bg-[#FFD700] text-black px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
        <Zap size={12} className="fill-black" /> LIVE
      </span>
      <span>⚡ Instant Auto-Delivery Active • 100% Verified SSL • Offer Expires in</span>
      <span className="font-mono text-white bg-black/80 px-2 py-0.5 rounded border border-[#FFD700] font-black text-xs">
        {timeFormatted}
      </span>
    </div>
  );
};

// Hero Section with Tripwire Offer
const HeroSection = ({ onLogoTap, onPlayVideo, onOpenLeadMagnet, onOpenTripwire }: any) => (
  <div className="bg-[#0a0a0a] border border-[#FFD700] rounded-[2rem] p-6 text-center mt-6 relative mx-4 pointer-events-auto">
    <div className="flex flex-col gap-3 mb-8">
      <div className="bg-[#FFD700] text-black text-[11px] font-bold py-2 px-5 rounded-full mx-auto inline-flex items-center gap-2">
        <span className="text-yellow-600">⚡</span> 100% DIGITAL PRODUCTS STORE
      </div>
      <button 
        onClick={onOpenTripwire || onOpenLeadMagnet}
        className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl mx-auto flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.4)] transition active:scale-95 cursor-pointer border border-yellow-200"
      >
        <span>⚡ Get the AI Starter & Global Travel Pass for $1 / 0.000003 Pi</span>
      </button>
    </div>
    
    <div onClick={onLogoTap} className="inline-block cursor-pointer w-full mb-8">
      <h1 className="text-[#FFD700] text-[42px] font-black tracking-tight mb-2 leading-none uppercase">SIRWISE AI WEB3<br/>ACADEMY</h1>
      <h2 className="text-white text-xl font-bold uppercase tracking-tight leading-none">GOYE Global Worldwide</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
        <div className="text-3xl mb-2">🤖</div>
        <h3 className="text-white font-bold mb-1">AI Mastery</h3>
        <p className="text-gray-400 text-xs mb-4">Master AI and machine learning for business</p>
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer">Start Learning</button>
      </div>
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
        <div className="text-3xl mb-2">💰</div>
        <h3 className="text-white font-bold mb-1">Crypto & DeFi</h3>
        <p className="text-gray-400 text-xs mb-4">Deep dive into decentralized finance and trading</p>
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer">Start Learning</button>
      </div>
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
        <div className="text-3xl mb-2">π</div>
        <h3 className="text-white font-bold mb-1">Pi Network GCV</h3>
        <p className="text-gray-400 text-xs mb-4">Understanding Pi Network at Global Consensus Value</p>
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer">Start Learning</button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  useEffect(() => {
    // 3. PERSISTENT LOCAL SESSION check
    const activeUserStr = localStorage.getItem("goye_active_user");
    if (activeUserStr) {
       try {
         const activeUser = JSON.parse(activeUserStr);
         if (activeUser && activeUser.contact) {
            setIsAuthenticated(true);
            setCurrentUser({ uid: activeUser.uid || 'local_' + activeUser.contact, email: activeUser.contact });
            setUserProfile(activeUser);
         } else {
            setIsAuthenticated(false);
         }
       } catch(e) {
         setIsAuthenticated(false);
       }
    } else {
       setIsAuthenticated(false);
    }
    setAuthLoading(false);
  }, []);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string, _type?: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  useEffect(() => {
    (window as any).showToast = showToast;
  }, []);

  const [tab, setTab] = useState(window.location.hash.replace('#', '') || 'home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showEsimVideoModal, setShowEsimVideoModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSirwiseBot, setShowSirwiseBot] = useState(false);
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTapCount, setAdminTapCount] = useState(0);
  const adminPressTimer = useRef<any>(null);

  const [paymentConfig, setPaymentConfig] = useState<any>({
    paystack: localStorage.getItem('paystack_public_key') || '',
    flutterwave: localStorage.getItem('flutterwave_public_key') || '',
    crypto: localStorage.getItem('crypto_wallet') || '0xdc7f804B36aB672Ec31642dF418F29e73281b040',
    pi: localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('PAYMENT_CONFIG');
      if (stored) {
        setPaymentConfig(safeParse('PAYMENT_CONFIG', {}));
      }
    } catch (e) {}
  }, []);



  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [products, setProducts] = useState(() => {
    const custom = safeParse('CUSTOM_PRODUCTS', []);
    const goyeProds = safeParse('goye_products', []);
    const digProds = safeParse('digital_products', []);
    
    const prodMap = new Map();
    // 1. Seed with default ALL_PRODUCTS (32+ items)
    ALL_PRODUCTS.forEach(p => prodMap.set(p.id, p));
    
    // 2. Merge local stored products if present
    [...custom, ...goyeProds, ...digProds].forEach((p: any) => {
      if (p && p.id) {
        const existing = prodMap.get(p.id) || {};
        prodMap.set(p.id, { ...existing, ...p });
      }
    });

    const finalProductList = Array.from(prodMap.values()).map(p => ({
      ...p,
      status: 'ACTIVE',
      visible: true,
      isDeleted: false,
      price: (!p.price || Number(p.price) <= 0) ? 1.00 : Number(p.price),
      downloadUrl: p.downloadUrl || p.filePath || (p.category === 'esim' || p.category === 'dubai' ? 'https://wa.me/2348033584736?text=Hi%20GOYE%20Store' : 'https://www.gasv.store/support'),
      filePath: p.filePath || p.downloadUrl || 'https://www.gasv.store/support'
    }));

    try {
      localStorage.setItem('CUSTOM_PRODUCTS', JSON.stringify(finalProductList));
      localStorage.setItem('goye_products', JSON.stringify(finalProductList));
      localStorage.setItem('digital_products', JSON.stringify(finalProductList));
    } catch (e) {}

    return finalProductList;
  });
  
  
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLeadMagnetModal, setShowLeadMagnetModal] = useState(false);
  const [showPostPurchaseUpsellModal, setShowPostPurchaseUpsellModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const goToAcademyPaywall = () => {
    console.log('Upgrade clicked - Opening Payment Options Modal');
    setShowPaymentModal(true);
  };

  const openUpgradeModal = () => {
    setShowPaymentModal(true);
  };

  const showConversionPageOverlay = (name: string, email: string) => {
    const existing = document.getElementById('conversionPage');
    if (existing) existing.remove();

    const conversionPage = document.createElement('div');
    conversionPage.id = 'conversionPage';
    conversionPage.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.96); z-index:999999; overflow-y:auto; padding:20px; font-family:sans-serif; backdrop-filter:blur(8px);';
    conversionPage.innerHTML = `
      <div style="max-width:520px; margin:20px auto; background:#111; border:2px solid #FFD700; border-radius:20px; padding:24px; box-shadow:0 0 40px rgba(255,215,0,0.3); text-align:left;">
        <div style="text-align:center; margin-bottom:16px;">
          <span style="background:#FFD700; color:black; font-weight:bold; font-size:11px; padding:4px 10px; border-radius:20px; text-transform:uppercase;">🎁 Free Blueprint Downloaded</span>
          <h2 style="color:#FFD700; text-align:center; margin:10px 0 4px 0; font-size:22px;">🎉 ${name || 'Entrepreneur'}, Your Blueprint is Downloading!</h2>
          <p style="color:#ccc; text-align:center; margin:0; font-size:13px;">You got <b>Teaser Prompt 1 of 50+</b> — Here is what 109 clients missed:</p>
        </div>

        <div style="background:#1A1A1A; padding:14px; border-radius:14px; margin:16px 0; border:1px solid #333;">
          <p style="color:#00FF88; font-size:13px; font-weight:bold; margin:0 0 6px 0; display:flex; align-items:center; gap:6px;">✅ Free: 1 Teaser Prompt (you have)</p>
          <p style="color:#FF6B6B; font-size:13px; font-weight:bold; margin:0; display:flex; align-items:center; gap:6px;">🔒 Locked: 49 More Prompts + Automation + Web3 Safety + Certificate (Academy Only)</p>
        </div>

        <div style="background:black; border:1px solid #FFD700; border-radius:14px; padding:14px; text-align:center; margin:16px 0;">
          <p style="color:#FFD700; font-weight:bold; font-size:13px; margin:0 0 10px 0;">▶️ Watch 90 Sec: What Academy Students Get</p>
          
          <div id="academyVideoContainer" style="background:black; border:2px dashed #FFD700; border-radius:16px; padding:0; overflow:hidden; position:relative; cursor:pointer; height:220px;" onclick="window.playAcademyVideo && window.playAcademyVideo()">
            <!-- Thumbnail + Play Button -->
            <div id="videoThumbnail" style="width:100%; height:100%; background: linear-gradient(135deg, #111 0%, #222 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; cursor:pointer;">
              <div style="width:70px; height:70px; background:#FFD700; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px #FFD700;">
                <span style="font-size:32px; margin-left:4px;">▶️</span>
              </div>
              <p style="color:#FFD700; font-weight:bold; margin:12px 0 4px 0; text-align:center;">Sirwise AI Web3 Academy Tour</p>
              <p style="color:#888; font-size:12px; text-align:center;">8 Global Modules • Certificate • $49.99 = ₦74,985</p>
              <p style="color:#00FF88; font-size:11px; margin-top:6px; font-weight:bold;">▶️ Tap to Play 90 Sec Tour</p>
            </div>
            
            <!-- Hidden Video Player - Shows on click -->
            <div id="videoPlayer" style="display:none; width:100%; height:100%;">
              <iframe id="academyVideoFrame" width="100%" height="100%" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="border-radius:16px;"></iframe>
            </div>
          </div>
        </div>

        <div style="background:linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding:20px; border-radius:16px; text-align:center; color:black;">
          <h3 style="color:black; margin:0; font-size:18px; font-weight:900;">Special For Blueprint Downloaders</h3>
          <p style="color:black; font-weight:bold; margin:6px 0; font-size:14px;">Sirwise AI Web3 Academy - 8 Modules - Lifetime $49.99 = ₦74,985</p>
          <p style="color:#222; font-size:11px; margin-bottom:12px;">109 tested free, top 10% upgraded — You are early</p>
          <input type="email" id="conversionEmail" value="${email}" placeholder="Enter your email to unlock" style="width:100%; height:48px; border-radius:10px; padding:12px; margin:0 0 10px 0; border:2px solid black; background:white; color:black; font-weight:bold; font-size:14px;" />
          <button id="unlockAcademyConversionBtn" onclick="window.goToPaywallFromConversion && window.goToPaywallFromConversion()" style="width:100%; height:56px; background:black; color:#FFD700; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer; border:none; transition:all 0.2s;">🚀 UNLOCK FULL ACADEMY NOW - $49.99</button>
          <p style="color:#111; font-size:10px; margin:10px 0 0 0; font-weight:600;">USDT BEP20 & USDC Base: 0xdc7f804B36aB672Ec31642dF418F29e73281b040 | OPay 6113541882 | Paystack | Flutterwave | Pi GCV $314,159</p>
        </div>

        <button onclick="document.getElementById('conversionPage')?.remove()" style="width:100%; margin-top:14px; background:#222; color:#ccc; height:44px; border-radius:12px; cursor:pointer; border:1px solid #333; font-size:13px; font-weight:bold;">Continue Browsing — I will upgrade later</button>
        <p style="color:#666; font-size:10px; text-align:center; margin:12px 0 0 0;">Official goyedagosmess@gmail.com | RC BN3583773 | www.gasv.store</p>
      </div>
    `;
    document.body.appendChild(conversionPage);
  };

  const goToPaywallFromConversion = () => {
    const emailInput = document.getElementById('conversionEmail') as HTMLInputElement;
    const email = emailInput?.value || localStorage.getItem('user_email') || '';
    if (email) {
      localStorage.setItem('user_email', email);
      localStorage.setItem('customer_email', email);
    }
    const conversionPage = document.getElementById('conversionPage');
    if (conversionPage) conversionPage.remove();

    goToAcademyPaywall();
  };

  const handleDownloadBlueprintClick = async () => {
    const name = localStorage.getItem('lead_name') || localStorage.getItem('user_name') || 'Entrepreneur';
    const email = (localStorage.getItem('user_email') || '').trim();
    if (!email.includes('@') || !email.includes('.')) {
      setShowLeadMagnetModal(true);
      return;
    }

    try {
      const a = document.createElement('a');
      a.href = 'https://www.gasv.store/downloads/5-minute-ai-prompt-blueprint.pdf';
      a.download = '5-Minute-AI-Prompt-Blueprint-TEASER-Sirwise.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('📁 Teaser Blueprint download started!');
    } catch (e) {
      window.open('https://www.gasv.store/downloads/5-minute-ai-prompt-blueprint.pdf', '_blank');
    }

    showConversionPageOverlay(name, email);
  };

  const playAcademyVideoFullscreen = () => {
    console.log('Play Academy Video clicked');
    const youtubeId = 'aircAruvnKk';
    const realVideoUrl = localStorage.getItem('academy_tour_video_url') || `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0&playsinline=1`;

    // Track video view
    try {
      let logs = safeParse('live_traffic_activity', []);
      logs.unshift({
        location: 'Video View',
        customer_name: localStorage.getItem('lead_name') || 'Guest',
        status: 'Watched 90 Sec Academy Tour',
        time: 'Just now',
        device: 'Mobile',
        product: 'Video Tour - Hot Lead'
      });
      localStorage.setItem('live_traffic_activity', JSON.stringify(logs.slice(0, 100)));
    } catch (e) {}

    const existing = document.getElementById('videoModalFullscreen');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'videoModalFullscreen';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999999; display:flex; align-items:center; justify-content:center; padding:20px;';
    modal.innerHTML = `
      <div style="width:100%; max-width:600px; background:#111; border:2px solid #FFD700; border-radius:20px; overflow:hidden; box-shadow:0 0 50px rgba(255,215,0,0.4);">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#FFD700;">
          <span style="color:black; font-weight:bold; font-size:14px;">Sirwise AI Web3 Academy Tour - 8 Modules</span>
          <button onclick="document.getElementById('videoModalFullscreen').remove()" style="background:black; color:#FFD700; border-radius:50%; width:32px; height:32px; font-weight:bold; cursor:pointer; border:none;">X</button>
        </div>
        <div style="position:relative; width:100%; height:0; padding-bottom:56.25%; background:black;">
          <iframe width="100%" height="100%" style="position:absolute; top:0; left:0;" src="${realVideoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div style="padding:16px; text-align:center; background:#111;">
          <p style="color:white; margin:0 0 12px 0; font-weight:bold; font-size:14px;">You watched 90 Sec — Unlock Full Academy Now?</p>
          <button onclick="document.getElementById('videoModalFullscreen').remove(); if(window.goToPaywallFromConversion){ window.goToPaywallFromConversion(); } else if(window.goToAcademyPaywall){ window.goToAcademyPaywall(); }" style="width:100%; height:55px; background:#FFD700; color:black; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer; border:none;">🚀 UNLOCK FULL ACADEMY $49.99 - After Video</button>
          <p style="color:#888; font-size:10px; margin-top:8px;">Official goyedagosmess@gmail.com RC BN3583773 USDT BEP20 0xdc7f804B36aB672Ec31642dF418F29e73281b040</p>
        </div>
      </div>
    `;
    modal.onclick = function(e){ if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
  };

  const unlockAcademyAccess = (method = 'Payment Verification', customerEmail = '', ref = '') => {
    try {
      localStorage.setItem('sirwise_paid', 'true');
      localStorage.setItem('payment_verified', 'true');
      localStorage.setItem('academy_unlocked', 'true');
      localStorage.setItem('is_enrolled', 'true');
      localStorage.setItem('payment_date', new Date().toISOString());

      const userEmail = cleanUserEmail(customerEmail || localStorage.getItem('user_email') || localStorage.getItem('lead_email') || '');
      if (userEmail) {
        localStorage.setItem('user_email', userEmail);
      }

      const localKey = `goye_academy_progress_${userEmail || 'guest'}`;
      localStorage.setItem(localKey, JSON.stringify({ isEnrolled: true, progress: [] }));

      // Close all sales modals / overlays
      const vidModal = document.getElementById('videoModalFullscreen');
      if (vidModal) vidModal.remove();

      const convModal = document.getElementById('conversionPageOverlay');
      if (convModal) convModal.remove();

      setShowLeadMagnetModal(false);

      // Dispatch custom event for real-time reactivity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('academyUnlocked', { detail: { method, email: userEmail, ref } }));
      }

      showToast('✅ Payment Verified! Full Academy Access Unlocked.', 'success');
    } catch (e) {
      console.error('Error unlocking academy:', e);
    }
  };

  const checkAcademyLeadsConversion = () => {
    try {
      const leads = safeParse('academy_leads', []);
      const freeCount = leads.filter((l: any) => l.product && String(l.product).includes('Free')).length;
      const paidOrders = safeParse('live_orders', []);
      const paidCount = paidOrders.length;
      const rate = freeCount > 0 ? ((paidCount / freeCount) * 100).toFixed(1) : '0.0';
      console.log(`Conversion: Free ${freeCount} Paid ${paidCount} Rate ${rate}% - Currently 109 free 0 paid = 0% - Need funnel fix`);

      const statsBanner = document.getElementById('conversionStats');
      if (statsBanner) {
        statsBanner.textContent = `Free Leads: ${freeCount} (109 tested) | Paid: ${paidCount} | Conversion Rate: ${rate}% — Goal: 10% = 11 sales $549.89`;
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackLead = (leadData: any) => {
        try {
          const lead = {
            ...leadData,
            id: leadData.id || Date.now(),
            date: leadData.date || new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
            timestamp: new Date().toISOString()
          };
          let adminLeads = safeParse('admin_leads', []);
          if (!Array.isArray(adminLeads)) adminLeads = [];
          adminLeads.unshift(lead);
          localStorage.setItem('admin_leads', JSON.stringify(adminLeads.slice(0, 500)));

          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
          }).catch(err => console.warn('Lead API error:', err));
          console.log('NEW LEAD TRACKED:', lead);
        } catch (e) {
          console.error('Error tracking lead:', e);
        }
      };

      (window as any).trackClick = (action: string, details: any = {}) => {
        try {
          const click = {
            action,
            details,
            id: Date.now(),
            date: new Date().toISOString(),
            page: window.location.hash || window.location.pathname || '/'
          };
          let adminClicks = safeParse('admin_clicks', []);
          if (!Array.isArray(adminClicks)) adminClicks = [];
          adminClicks.unshift(click);
          localStorage.setItem('admin_clicks', JSON.stringify(adminClicks.slice(0, 1000)));

          fetch('/api/clicks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(click)
          }).catch(err => console.warn('Click API error:', err));
          console.log('NEW CLICK TRACKED:', action, details);
        } catch (e) {
          console.error('Error tracking click:', e);
        }
      };

      (window as any).sendAutoReply = (email: string, name: string) => {
        if (!email || !email.includes('@')) return;
        const cleanEmail = email.trim();
        const cleanName = name?.trim() || 'Valued Customer';

        setTimeout(() => {
          alert(`🎉 AUTO REPLY SENT TO YOUR EMAIL (${cleanEmail}):\n\nHi ${cleanName}!\n\nThank you for choosing Goye Store Global & Sirwise AI WEB3 Academy (RC BN3583773)!\n\nYour 5-Minute AI Prompt Blueprint access is confirmed.\n\n⚡ SPECIAL OFFER: Upgrade to Full Academy - $49.99 (8 Modules, Blockchain Certificate, 190+ Countries)\n\nEnroll link: https://www.gasv.store/#shop\nSupport: goyedagosmess@gmail.com`);
        }, 300);

        try {
          const formData = new FormData();
          formData.append('email', cleanEmail);
          formData.append('name', cleanName);
          formData.append('_subject', 'Your Blueprint Access + Academy Upgrade Offer $49.99 - Goye Store Global');
          formData.append('_autoresponse', `Hi ${cleanName}!\n\nThank you for requesting The 5-Minute AI Prompt Blueprint for Entrepreneurs from Sirwise AI Web3 Academy (RC BN3583773).\n\nYour Blueprint download is ready!\n\n🚀 NEXT STEP: Upgrade to Full Academy ($49.99 USD / ₦75,000 / Pi GCV $314,159)\n- 8 Complete Modules (AI Copywriting, Web3, Pi Network, Automation)\n- Blockchain-Verified Certificate\n- Lifetime Community Access\n\nVisit: https://www.gasv.store/#shop\nPayment Methods: Paystack, Flutterwave, PayPal, USDC, Pi GCV\n\nContact: goyedagosmess@gmail.com\nWeb: https://www.gasv.store`);
          formData.append('_template', 'table');

          fetch('https://formsubmit.co/goyedagosmess@gmail.com', {
            method: 'POST',
            body: formData
          }).catch(err => console.warn('FormSubmit auto response network err:', err));
        } catch (e) {
          console.warn('FormSubmit auto reply exception:', e);
        }
      };

      (window as any).goToAcademyPaywall = goToAcademyPaywall;
      (window as any).goToPaywallFromConversion = goToPaywallFromConversion;
      (window as any).getFreeBlueprintAfterDownload = handleDownloadBlueprintClick;
      (window as any).checkAcademyLeadsConversion = checkAcademyLeadsConversion;
      (window as any).playAcademyVideo = playAcademyVideoFullscreen;
      (window as any).playAcademyVideoFullscreen = playAcademyVideoFullscreen;
      (window as any).unlockAcademyAccess = unlockAcademyAccess;
      (window as any).unlockAcademy = unlockAcademyAccess;
      (window as any).openUpgradeModal = openUpgradeModal;
    }

    const interval = setInterval(checkAcademyLeadsConversion, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-Trigger Lead Magnet (Timed or Exit Intent)
  useEffect(() => {
    const isCaptured = localStorage.getItem('sirwise_lead_captured') === 'true';
    if (!isCaptured) {
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem('lead_modal_dismissed')) {
          setShowLeadMagnetModal(true);
        }
      }, 3500);

      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10 && !sessionStorage.getItem('lead_modal_dismissed')) {
          setShowLeadMagnetModal(true);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
  const [currentCurrency, setCurrentCurrency] = useState(() => localStorage.getItem('goye_currency') || localStorage.getItem('goye_preferred_currency') || 'USD');
  const [currencyMode, setCurrencyMode] = useState(() => localStorage.getItem('goye_curr_mode') || 'pi');
  const [exchangeRates, setExchangeRates] = useState(CURRENCIES);

  useEffect(() => {
    const syncCurrency = () => {
      const c = localStorage.getItem('goye_currency') || 'USD';
      const m = localStorage.getItem('goye_curr_mode') || 'pi';
      setCurrentCurrency(c);
      setCurrencyMode(m);
    };
    window.addEventListener('storage', syncCurrency);
    return () => window.removeEventListener('storage', syncCurrency);
  }, []);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates(prev => prev.map(c => c.code !== 'PI' && data.rates[c.code] ? { ...c, rate: data.rates[c.code] } : c));
        }
      })
      .catch(e => console.warn('Currency API unavailable, using offline fallback rates.'));
  }, []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const trackReferral = () => {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        const d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        document.cookie = "referred_by=" + ref + ";expires=" + d.toUTCString() + ";path=/";
        localStorage.setItem('referred_by', ref);
      }
    };
    trackReferral();
  }, []);

  const [isAiTeacherOpen, setIsAiTeacherOpen] = useState(false);
  const userAccessStatus = purchasedItems.length > 0 ? 'paid' : 'free';

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail && !cleanUserEmail(savedEmail)) {
      localStorage.removeItem('user_email');
      localStorage.removeItem('customer_email');
    }
  }, []);


  useEffect(() => {
    // Analytics Page View Tracker
    const getFlagEmoji = (countryCode: string) => {
      if (!countryCode || countryCode.length !== 2) return '🌍';
      const code = countryCode.toUpperCase();
      try {
        return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + 127397));
      } catch {
        return '🌍';
      }
    };

    const getTrueLocation = async (): Promise<string> => {
      const isAdmin = localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_owner') === 'true' || localStorage.getItem('admin_device') === 'true';
      if (isAdmin) {
        return '🇳🇬 NG (Lagos)'; // True location for admin owner in Lagos
      }

      try {
        if (navigator.geolocation) {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                if (lat >= 6.0 && lat <= 7.0 && lon >= 3.0 && lon <= 4.0) {
                  resolve('🇳🇬 NG (Lagos)');
                  return;
                }
                try {
                  const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                  if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    const country = geoData.countryCode || 'NG';
                    const city = geoData.city || geoData.locality || geoData.principalSubdivision || 'Lagos';
                    const flag = getFlagEmoji(country);
                    resolve(`${flag} ${country} (${city})`);
                    return;
                  }
                } catch {}

                try {
                  const res = await fetch('https://ipapi.co/json/');
                  const data = await res.json();
                  const city = data.city || 'Unknown';
                  const country = data.country_code || 'NG';
                  const flag = getFlagEmoji(country);
                  resolve(`${flag} ${country} (${city})`);
                } catch {
                  resolve('🇳🇬 NG (Lagos)');
                }
              },
              async () => {
                try {
                  const res = await fetch('https://ipapi.co/json/');
                  const data = await res.json();
                  let city = data.city || 'Lagos';
                  const country = data.country_code || 'NG';
                  const flag = getFlagEmoji(country);
                  if (city === 'Ado-Odo' || city === 'Ilare' || city === 'Unknown') {
                    city = 'Lagos';
                  }
                  resolve(`${flag} ${country} (${city})`);
                } catch {
                  resolve('🇳🇬 NG (Lagos)');
                }
              },
              { timeout: 5000, enableHighAccuracy: true }
            );
          });
        } else {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          let city = data.city || 'Lagos';
          const country = data.country_code || 'NG';
          const flag = getFlagEmoji(country);
          if (city === 'Ado-Odo' || city === 'Ilare' || city === 'Unknown') {
            city = 'Lagos';
          }
          return `${flag} ${country} (${city})`;
        }
      } catch (e) {
        return '🇳🇬 NG (Lagos)';
      }
    };

    const trackClickGlobal = (pageName: string) => {
      try {
        const userEmail = (localStorage.getItem('user_email') || localStorage.getItem('admin_email') || currentUser?.email || '').toLowerCase();
        const isAdminUser = currentUser?.role === 'admin' || localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_owner') === 'true' || userEmail.includes('goyedagos') || userEmail.includes('ifiok82') || userEmail.includes('godswill');
        const excludeAdminSetting = localStorage.getItem('excludeAdminClicks') === 'true';
        const excludeMyClicksSetting = localStorage.getItem('exclude_my_clicks') !== 'false';
        const isExcludeActive = excludeAdminSetting || excludeMyClicksSetting;

        if (isExcludeActive && (isAdminUser || excludeAdminSetting)) {
          console.log('Admin click tracking EXCLUDED in trackClickGlobal');
          return;
        }

        const loc = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        let flag = '🌍';
        if (loc.includes('Lagos') || loc.includes('Africa/Lagos')) flag = '🇳🇬 NG (Lagos)';
        else if (loc.includes('America') || loc.includes('New_York') || loc.includes('Los_Angeles')) flag = '🇺🇸 US';
        else if (loc.includes('London') || loc.includes('Europe/London')) flag = '🇬🇧 GB';
        else if (loc.includes('Kolkata') || loc.includes('Asia/Kolkata')) flag = '🇮🇳 IN';

        const log = {
          id: 'CLK-' + Date.now(),
          location: flag,
          page: pageName,
          date: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          email: userEmail || 'guest@gasv.store',
          customerName: userEmail ? userEmail.split('@')[0] : 'Guest',
          is_admin: isAdminUser
        };

        let logs = safeParse('global_traffic', safeParse('traffic_log', []));

        logs.unshift(log);
        localStorage.setItem('global_traffic', JSON.stringify(logs.slice(0, 100)));
        localStorage.setItem('traffic_log', JSON.stringify(logs.slice(0, 100)));

        let clicks = safeGetNumber('total_clicks_global', safeGetNumber('total_clicks', 0)) + 1;
        localStorage.setItem('total_clicks_global', clicks.toString());
        localStorage.setItem('total_clicks', clicks.toString());

        console.log('Click tracked', flag, pageName);
      } catch (e) {
        console.error('trackClickGlobal error', e);
      }
    };

    (window as any).trackClickGlobal = trackClickGlobal;

    const trackPageView = async () => {
      try {
        const userEmail = (localStorage.getItem('user_email') || localStorage.getItem('admin_email') || currentUser?.email || '').toLowerCase();
        const isAdminUser = currentUser?.role === 'admin' || localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_owner') === 'true' || userEmail.includes('goyedagos') || userEmail.includes('ifiok82') || userEmail.includes('godswill');
        if (isAdminUser) {
          localStorage.setItem('is_admin', 'true');
          localStorage.setItem('is_owner', 'true');
          localStorage.setItem('admin_device', 'true');
        }

        const excludeAdminSetting = localStorage.getItem('excludeAdminClicks') === 'true';
        const excludeMyClicksSetting = localStorage.getItem('exclude_my_clicks') !== 'false';
        const isExcludeActive = excludeAdminSetting || excludeMyClicksSetting;

        if (isExcludeActive && (isAdminUser || excludeAdminSetting)) {
          console.log('Admin page view tracking EXCLUDED in trackPageView');
          return;
        }

        let total = safeGetNumber('total_clicks', safeGetNumber('total_clicks_global', 0));
        localStorage.setItem('total_clicks', (total + 1).toString());
        localStorage.setItem('total_clicks_global', (total + 1).toString());

        const locationStr = await getTrueLocation();
        let customerName = 'Guest Customer';
        if (isAdminUser) {
          customerName = 'Admin (Owner) - Lagos';
        } else {
          const savedName = localStorage.getItem('pupil_name') || localStorage.getItem('user_name') || localStorage.getItem('customer_name');
          if (savedName && savedName !== 'Guest') {
            customerName = savedName;
          } else if (userEmail) {
            customerName = userEmail.split('@')[0];
          }
        }

        const pageView = {
          id: Date.now().toString(),
          ip: '102.89.***.***',
          country: 'NG',
          city: 'Lagos',
          flag: '🇳🇬',
          location: locationStr,
          customerName,
          customer_name: customerName,
          email: userEmail || 'guest@gasv.store',
          is_admin: isAdminUser,
          path: window.location.hash || window.location.pathname || '/',
          page: window.location.hash || window.location.pathname || '/',
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleTimeString(),
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'Phone' : 'Desktop',
          global: true
        };

        let logs = safeParse('traffic_log', safeParse('global_traffic', []));
        logs.unshift(pageView);
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem('traffic_log', JSON.stringify(logs));
        localStorage.setItem('global_traffic', JSON.stringify(logs));
      } catch (e) {
        console.error('Page view tracking error', e);
      }
    };
    trackPageView();
  }, []);


  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  
    const handlePushNotification = async () => {
    if (!('Notification' in window)) {
      showToast('Push notifications are not supported in this browser.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            registration.showNotification('GOYE Global Store', {
              body: 'Welcome to GOYE! You are now subscribed to updates.',
              icon: '/goye-logo.svg',
              badge: '/goye-logo.svg'
            });
          }
        } else {
          new Notification('GOYE Global Store', {
            body: 'Welcome! You are now subscribed to updates.',
            icon: '/goye-logo.svg'
          });
        }
        showToast('Push notifications enabled!');
      } else {
        showToast('Notification permission denied.');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to enable notifications.');
    }
  };

  const formatPrice = (usdPrice: number) => {
    const curr = exchangeRates.find(c => c.code === currentCurrency) || CURRENCIES[0];
    if (curr.code === 'USD' || curr.code === 'USDC') return `${curr.symbol}${usdPrice.toFixed(2)}`;
    const converted = usdPrice * curr.rate;
    if (curr.code === 'PI') return `${usdPrice.toFixed(2)} (~${converted.toFixed(6)} ${curr.symbol})`;
    return `${usdPrice.toFixed(2)} (~${curr.symbol}${converted.toFixed(0)})`;
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };


  useEffect(() => {
    // Strict fallback timer to automatically hide splash screen & auth loading after 1.5s max
    const timer = setTimeout(() => {
      setShowSplash(false);
      setAuthLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        setTab(window.location.hash.replace('#', '') || 'home');
      } catch (e) {}
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', handleHashChange);
    }
    
    // Load downloads
    try {
      const items = safeParse('my_downloads', []);
      setPurchasedItems(Array.isArray(items) ? items : []);
    } catch (e) {}
    
    // Check if URL is /admin
    try {
      if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
        setShowAdminLogin(true);
      }
    } catch (e) {}

    const handlePiAuthSuccess = (e: any) => {
      try {
        if (e && e.detail) {
          const { username, email } = e.detail;
          const piUser = { id: 'pi_' + username, email: email, name: username, role: 'student' };
          const piProfile = { uid: piUser.id, email: email, displayName: username, country: 'Pi Network Pioneer' };
          setIsAuthenticated(true);
          setCurrentUser(piUser);
          setUserProfile(piProfile);
          setTab('academy');
        }
      } catch (err) {
        console.warn('Pi auth error:', err);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('piAuthSuccess', handlePiAuthSuccess);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener('piAuthSuccess', handlePiAuthSuccess);
      }
    };
  }, []);

  const handleAdminLogin = (e: any) => {
    e.preventDefault();
    if (adminPassword === 'GoyeBN3583773') {
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setTab('admin');
    } else {
      showToast('Invalid admin password', 'error');
    }
  };

  const hasAccess = (id: string) => {
    if (id === 'ai-mastery') return true; // Free preview
    return purchasedItems.some(item => item.productId === id);
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><GoyeLogo size={80} className="animate-pulse" /></div>;



  return (
    <div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-[120px] w-full max-w-[420px] mx-auto overflow-y-auto overflow-x-hidden relative box-border">
      {showSplash && (
        <div className="fixed inset-0 bg-[#000] z-[10000] flex flex-col items-center justify-center transition-opacity duration-500">
          <GoyeLogo size={180} className="mb-6 shadow-[0_0_50px_rgba(255,215,0,0.5)] rounded-full animate-pulse" />
          <h1 className="text-[#FFD700] text-2xl font-black tracking-widest text-center px-4">GOYE STORE GLOBAL</h1>
          <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mt-2">Sirwise AI Web3 Academy</p>
        </div>
      )}

      {showAdminLogin && !isAdminAuth && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-[#FFD700] text-xl font-bold mb-4">Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
              />
              <button type="submit" className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl">Login</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full mt-2 text-gray-500 py-2">Cancel</button>
            </form>
          </div>
        </div>
      )}

            
      <UrgencyCountdownBanner />

      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', background: '#000', borderBottom: '1px solid #333' }}>
        {/* Top Pi GCV Bar - Clean conditional render */}
        <div id="piGcvBar" className="flex items-center justify-between px-3 py-2 bg-black border-b border-[#222]">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold', flexWrap: 'wrap' }}>
            <span>💱 GCV: 1 Pi = $314,159</span>
            <select 
              id="currencySelector" 
              value={currentCurrency}
              onChange={(e) => {
                const val = e.target.value;
                setCurrentCurrency(val);
                localStorage.setItem('goye_currency', val);
                localStorage.setItem('goye_preferred_currency', val);
                (window as any).SELECTED_CURRENCY = val;
                if (val === 'PI') {
                  setCurrencyMode('pi');
                  localStorage.setItem('goye_curr_mode', 'pi');
                } else {
                  setCurrencyMode('fiat');
                  localStorage.setItem('goye_curr_mode', 'fiat');
                }
                if (typeof (window as any).changeCurrency === 'function') {
                  (window as any).changeCurrency(val);
                }
              }}
              style={{ background: '#111', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '6px', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="INR">INR (₹)</option>
              <option value="ZAR">ZAR (R)</option>
              <option value="PI">Pi (π)</option>
            </select>

            {(currentCurrency === 'PI') && (
              <button 
                id="toggleCurrencyModeBtn"
                onClick={() => {
                  const newMode = currencyMode === 'pi' ? 'fiat' : 'pi';
                  setCurrencyMode(newMode);
                  localStorage.setItem('goye_curr_mode', newMode);
                  (window as any).CURRENCY_MODE = newMode;
                  if (typeof (window as any).toggleCurrencyMode === 'function') {
                    (window as any).toggleCurrencyMode();
                  }
                }}
                style={{ background: '#222', color: '#00FF88', border: '1px solid #00FF88', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {currencyMode === 'pi' ? '🟣 Pi GCV Mode' : '💵 Fiat Mode'}
              </button>
            )}
          </div>

          <div id="piLoginContainer" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {(currentCurrency === 'PI') && (
              <>
                <button 
                  id="refreshPiPricesBtn" 
                  onClick={() => {
                    if (typeof (window as any).refreshPricesAndFx === 'function') {
                      (window as any).refreshPricesAndFx();
                    } else if (typeof (window as any).convertAllPrices === 'function') {
                      (window as any).convertAllPrices();
                    }
                  }} 
                  style={{ background: '#7D2AE7', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                  🔄 Refresh
                </button>
                <button 
                  id="loginWithPiBtn" 
                  onClick={() => {
                    if (typeof (window as any).loginWithPi === 'function') {
                      (window as any).loginWithPi();
                    } else {
                      if (typeof (window as any).showToast === 'function') {
                        (window as any).showToast('Pi Network SDK loading... Open gasv.store in Pi Browser app!');
                      }
                    }
                  }} 
                  style={{ background: '#7D2AE7', color: 'white', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span style={{ width: '8px', height: '8px', background: '#FFD700', borderRadius: '50%', display: 'inline-block' }}></span> Connect Pi
                </button>
              </>
            )}
            <button 
              onClick={() => {
                if (typeof (window as any).openUserMenu === 'function') {
                  (window as any).openUserMenu();
                } else {
                  setShowMoreMenu(!showMoreMenu);
                }
              }} 
              style={{ background: 'white', color: 'black', width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}
            >
              👤
            </button>
          </div>
        </div>

        {showMoreMenu && (
            <div className="absolute top-[50px] right-[10px] bg-[#111] border border-[#FFD700] rounded-xl shadow-2xl z-[99999] w-[200px] overflow-hidden pointer-events-auto">
                <button onClick={() => setShowMoreMenu(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white pointer-events-auto z-10"><X size={16} /></button>
                <button onClick={() => { setShowReferralModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><Users size={16} className="text-[#FFD700]"/> 🤝 Referral & Earn</button>
                <button onClick={() => { setShowLanguageModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><Globe size={16} className="text-[#3b82f6]"/> 🌐 Language</button>
                <button onClick={() => { setShowCurrencyModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><DollarSign size={16} className="text-[#10B981]"/> 💱 Currency ({currentCurrency})</button>
                <button onClick={handlePushNotification} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><Bell size={16} className="text-[#FF8C00]"/> 🔔 Notifications</button>
                <button onClick={() => { showToast('Terms & Privacy opened.'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><FileText size={16} className="text-[#10B981]"/> 📄 Terms & Privacy</button>
                <button onClick={handleInstallClick} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><Smartphone size={16} className="text-[#8b5cf6]"/> 📲 Install App</button>
                <button onClick={() => { localStorage.removeItem('goye_active_user'); setIsAuthenticated(false); setCurrentUser(null); setTab('auth'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]"><Lock size={16} className="text-red-500"/> 🚪 Log Out</button>
            </div>
        )}
      </header>


      <main className="w-full mx-auto pb-12">
        {(tab === 'auth') ? (
           <AuthScreen 
             onAuthenticated={(user, profile) => {
               setIsAuthenticated(true);
               setCurrentUser(user);
               setUserProfile(profile);
               setTab('home');
             }} 
             onClose={() => setTab('home')}
           />
        ) : null}
        
        {(tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-4 animate-in fade-in duration-500 pb-[100px]">

            {tab === 'home' && (
              <>
                {/* 1. TRIPWIRE MICRO-OFFER CARD AT TOP OF HOMEPAGE */}
                <div className="bg-[#0f0f0f] border-2 border-[#FFD700] rounded-2xl p-4 sm:p-5 mb-6 text-left shadow-[0_0_30px_rgba(255,215,0,0.25)] relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="bg-[#FFD700] text-black font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                      <Zap size={12} className="fill-black" /> TRIPWIRE MICRO-OFFER ($1 / 0.000003 Pi)
                    </span>
                    <span className="text-[#10B981] font-mono font-black text-xs bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-[#10B981]/40">
                      0.000003 Pi GCV
                    </span>
                  </div>

                  <h2 className="text-white text-lg sm:text-xl font-black mb-1">
                    Get the <span className="text-[#FFD700]">AI Starter & Global Travel Pass</span> for $1 / 0.000003 Pi
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 font-medium">
                    Includes 3 High-Impact Copy-Paste Prompts + 1GB Travel eSIM Trial + 1-Day Access Pass to Sirwise AI Academy.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-200 mb-4">
                    <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-[#333] flex items-center gap-2">
                      <span className="text-[#FFD700] text-base">🤖</span>
                      <span><strong>3 Copy-Paste Prompts</strong> for ChatGPT/Gemini</span>
                    </div>
                    <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-[#333] flex items-center gap-2">
                      <span className="text-[#FFD700] text-base">🌐</span>
                      <span><strong>1GB Travel eSIM Trial</strong> for 190+ countries</span>
                    </div>
                    <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-[#333] flex items-center gap-2">
                      <span className="text-[#FFD700] text-base">🎓</span>
                      <span><strong>1-Day Academy Access</strong> Pass to Sirwise AI</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const tripwireProd = products.find((p: any) => p.id === 'ai-starter-tripwire-pass') || {
                        id: 'ai-starter-tripwire-pass',
                        name: 'AI Starter & Global Travel Pass ($1 / 0.000003 Pi)',
                        price: 1.00,
                        priceUSD: 1.00,
                        priceNGN: 1500,
                        category: 'starter'
                      };
                      setSelectedProduct(tripwireProd);
                    }}
                    className="w-full bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFA500] hover:brightness-110 text-black font-black py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition active:scale-95 cursor-pointer border border-yellow-200"
                  >
                    <span>⚡ Get the AI Starter & Global Travel Pass for $1 / 0.000003 Pi</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* 2. NEW HERO SECTION */}
                <div className="bg-[#FFD700] text-black p-5 rounded-2xl shadow-xl border-2 border-black mb-6">
                  <div className="flex flex-col gap-4">
                    {/* Left: Brand / Logo */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer" 
                      onClick={() => {
                        const newCount = adminTapCount + 1;
                        setAdminTapCount(newCount);
                        if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
                        setTimeout(() => setAdminTapCount(0), 3000);
                      }}
                    >
                      <img 
                        src="/icon-192.png" 
                        style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid black', objectFit: 'cover' }} 
                        alt="GOYE Store Global Logo" 
                        onError={(e: any) => { e.target.src='https://gasv.store/icon-192.png'; }} 
                      />
                      <div>
                        <h1 className="font-black text-lg leading-tight text-black uppercase tracking-tight">GOYE STORE GLOBAL</h1>
                        <p className="font-extrabold text-[11px] text-black/90 uppercase">SIRWISE AI WEB3 ACADEMY</p>
                        <p className="font-bold text-[10px] text-black/80">RC BN3583773 • www.gasv.store</p>
                      </div>
                    </div>

                    {/* Right: 2 Big CTA Buttons Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                      <button 
                        onClick={() => {
                          const el = document.getElementById('esim-hub');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-black text-[#FFD700] border-2 border-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                      >
                        <span>🌍</span> Get Dubai eSIM Instant - $7.50
                      </button>

                      <button 
                        onClick={() => {
                          setTab('academy');
                          window.location.hash = 'academy';
                        }}
                        className="bg-[#1E3A8A] text-white border-2 border-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                      >
                        <span>🎓</span> Join AI Web3 Academy
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. STORE & eSIM HUB (POSITION #1 AFTER HERO) */}
                <div id="esim-hub" className="mb-8 scroll-mt-20">
                  <div className="flex items-center justify-between mb-3 border-b border-[#333] pb-2 flex-wrap gap-2">
                    <div>
                      <span className="bg-[#FFD700] text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        INSTANT DELIVERY
                      </span>
                      <h2 className="text-white text-xl font-black mt-1">✈️ Dubai & Global eSIM</h2>
                      <p className="text-gray-400 text-xs">Instant QR Delivery via WhatsApp • 190+ Countries</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#111] px-3 py-1 rounded-full border border-[#FFD700]/40">
                      Total Active Products: {products.filter((p: any) => p.status === 'ACTIVE' && p.visible !== false && !p.isDeleted).length}
                    </span>
                  </div>

                  {/* Category Filter Pills - Clean text only, no overlapping emoji */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar mb-4">
                    {[
                      { id: 'all', label: `ALL (${products.filter((p: any) => p.status === 'ACTIVE' && p.visible !== false && !p.isDeleted).length})` },
                      { id: 'dubai', label: 'DUBAI' },
                      { id: 'esim', label: 'ESIM' },
                      { id: 'prompts', label: 'PROMPTS' },
                      { id: 'academy', label: 'ACADEMY' },
                      { id: 'contracts', label: 'VISA' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition whitespace-nowrap cursor-pointer flex-shrink-0 border ${
                          activeCategory === cat.id 
                            ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-md' 
                            : 'bg-[#111] text-gray-300 border-[#333] hover:border-[#FFD700]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid of Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.filter((p: any) => {
                      if (p.status !== 'ACTIVE' || p.visible === false || p.isDeleted === true) return false;
                      if (activeCategory !== 'all') {
                        if (activeCategory === 'contracts') return p.category === 'contracts' || p.category === 'jobs' || p.category === 'visa';
                        if (activeCategory === 'prompts') return p.category === 'prompts' || p.category === 'starter' || p.category === 'toolkit';
                        return p.category === activeCategory;
                      }
                      return true;
                    }).slice(0, activeCategory === 'all' ? 6 : 100).map((product: any) => {
                      const priceDisplay = formatPriceDisplay(product.price, currentCurrency, currencyMode);
                      return (
                        <div key={product.id} className="bg-[#111] border border-[#333] rounded-2xl p-4 flex flex-col justify-between hover:border-[#FFD700] transition relative overflow-hidden shadow-lg">
                          {product.badge && (
                            <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                              {product.badge}
                            </div>
                          )}
                          <div>
                            <div className="text-3xl mb-2">{product.icon || '📱'}</div>
                            <h3 className="text-white font-black text-sm mb-1 leading-snug">{product.name}</h3>
                            {product.description && <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>}
                            {(product.data || product.days) && (
                              <div className="flex gap-2 mb-3">
                                {product.data && <span className="bg-[#222] text-[#FFD700] font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#333]">{product.data}</span>}
                                {product.days && <span className="bg-[#222] text-gray-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#333]">{product.days}</span>}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 pt-3 border-t border-[#222]">
                            <div className="flex items-baseline justify-between mb-2">
                              <div className="text-[#10B981] font-black text-lg" data-usd-price={product.price}>
                                {priceDisplay.main}
                              </div>
                              <div className="text-gray-400 text-[10px] font-medium">
                                {priceDisplay.sub}
                              </div>
                            </div>

                            {hasAccess(product.id) ? (
                              <button onClick={() => {
                                showToast('Access granted! Opening link...');
                                window.open(product.downloadUrl || product.filePath || 'https://www.gasv.store/support', '_blank');
                              }} className="w-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#10B981]/30 cursor-pointer text-xs">
                                <Download size={14}/> Access Content
                              </button>
                            ) : (
                              <button 
                                data-usd-button={product.price}
                                onClick={() => { setSelectedProduct(product); setShowCheckoutModal(true); }} 
                                className="w-full bg-[#FFD700] text-black font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-yellow-400 cursor-pointer pointer-events-auto shadow-md transition active:scale-95 text-xs uppercase tracking-wider"
                              >
                                <ShoppingCart size={14}/> Buy & Unlock ({priceDisplay.main})
                              </button>
                            )}
                            <p className="text-[10px] text-gray-400 font-medium text-center mt-1.5 flex items-center justify-center gap-1">
                              ⚡ Delivered in 60 seconds
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeCategory === 'all' && (
                    <div className="text-center mt-5">
                      <button 
                        onClick={() => { setTab('shop'); window.location.hash = 'shop'; }} 
                        className="bg-[#222] hover:bg-[#333] text-[#FFD700] border border-[#FFD700] font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md"
                      >
                        View All {products.filter((p: any) => p.status === 'ACTIVE' && p.visible !== false && !p.isDeleted).length} Products →
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. ACADEMY SECTION (POSITION #2 AFTER eSIM HUB) */}
                <div id="academy-section" className="mb-8 border-t border-[#333] pt-6 scroll-mt-20">
                  <div className="text-center mb-5">
                    <span className="bg-[#1E3A8A] text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-400">
                      ACADEMY PROGRAMMES
                    </span>
                    <h2 className="text-[#FFD700] text-xl font-black mt-1.5 uppercase tracking-tight">
                      SIRWISE AI WEB3 ACADEMY
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">4-Week Masterclasses for Global Pupils • RC BN3583773</p>
                  </div>

                  {/* 3 Main Cards in 1 row horizontal scroll */}
                  <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x mb-6">
                    <div className="min-w-[260px] max-w-[280px] flex-shrink-0 bg-[#111] p-4 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between snap-start">
                      <div>
                        <div className="text-3xl mb-2">🤖</div>
                        <h3 className="text-white font-bold text-sm mb-1">AI Mastery</h3>
                        <p className="text-gray-400 text-xs mb-3 leading-snug">Master AI prompts, homework assistance, research tools, and smart automation.</p>
                        <div className="text-[#10B981] font-mono font-bold text-xs mb-3">$49.99 (0.000159 Pi GCV)</div>
                      </div>
                      <button 
                        onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week Pass", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }}
                        className="bg-[#FFD700] text-black font-black text-xs w-full py-2.5 rounded-xl hover:bg-yellow-400 cursor-pointer pointer-events-auto"
                      >
                        Start Learning ($49.99)
                      </button>
                    </div>

                    <div className="min-w-[260px] max-w-[280px] flex-shrink-0 bg-[#111] p-4 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between snap-start">
                      <div>
                        <div className="text-3xl mb-2">💰</div>
                        <h3 className="text-white font-bold text-sm mb-1">Crypto & DeFi</h3>
                        <p className="text-gray-400 text-xs mb-3 leading-snug">Deep dive into blockchain basics, wallet security, decentralized finance, and Pi GCV.</p>
                        <div className="text-[#10B981] font-mono font-bold text-xs mb-3">$49.99 (0.000159 Pi GCV)</div>
                      </div>
                      <button 
                        onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week Pass", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }}
                        className="bg-[#FFD700] text-black font-black text-xs w-full py-2.5 rounded-xl hover:bg-yellow-400 cursor-pointer pointer-events-auto"
                      >
                        Start Learning ($49.99)
                      </button>
                    </div>

                    <div className="min-w-[260px] max-w-[280px] flex-shrink-0 bg-[#111] p-4 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between snap-start">
                      <div>
                        <div className="text-3xl mb-2">🎨</div>
                        <h3 className="text-white font-bold text-sm mb-1">Digital Asset Creation</h3>
                        <p className="text-gray-400 text-xs mb-3 leading-snug">Create digital art, storytelling, ebooks, and interactive multimedia capstone projects.</p>
                        <div className="text-[#10B981] font-mono font-bold text-xs mb-3">$49.99 (0.000159 Pi GCV)</div>
                      </div>
                      <button 
                        onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week Pass", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }}
                        className="bg-[#FFD700] text-black font-black text-xs w-full py-2.5 rounded-xl hover:bg-yellow-400 cursor-pointer pointer-events-auto"
                      >
                        Start Learning ($49.99)
                      </button>
                    </div>
                  </div>

                  {/* Teaching Method - 3 Columns */}
                  <div className="bg-[#111] p-4 rounded-2xl border border-[#222] mb-5">
                    <h3 className="text-[#3b82f6] text-center font-black text-xs uppercase mb-1">OUR TEACHING METHOD</h3>
                    <p className="text-gray-400 text-[11px] text-center mb-4">How Sirwise AI Guarantees Success for Every Pupil</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-black p-3 rounded-xl border border-[#222] text-center">
                        <div className="text-xl mb-1">🤖</div>
                        <h4 className="text-white font-bold text-xs mb-0.5">24/7 AI Guidance</h4>
                        <p className="text-gray-400 text-[10px]">Personalized tutor providing step-by-step interactive lessons anytime.</p>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-[#222] text-center">
                        <div className="text-xl mb-1">🛠️</div>
                        <h4 className="text-white font-bold text-xs mb-0.5">Hands-On Projects</h4>
                        <p className="text-gray-400 text-[10px]">Learn by creating real digital art, stories, apps, and Web3 portfolio items.</p>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-[#222] text-center">
                        <div className="text-xl mb-1">🎓</div>
                        <h4 className="text-white font-bold text-xs mb-0.5">Verified Diploma</h4>
                        <p className="text-gray-400 text-[10px]">Tamper-proof certificate with QR verification under RC BN3583773.</p>
                      </div>
                    </div>
                  </div>

                  {/* Action toolbar for Academy */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button onClick={() => { setTab('academy'); window.location.hash = 'academy'; }} className="bg-black text-[#FFD700] px-3.5 py-2 rounded-xl text-xs font-bold border border-[#FFD700] flex items-center gap-1.5 cursor-pointer">
                      <GraduationCap size={14}/> Student Dashboard
                    </button>
                    <button onClick={() => setShowReferralModal(true)} className="bg-black text-gray-300 px-3 py-2 rounded-xl text-xs font-bold border border-[#333] flex items-center gap-1 cursor-pointer">
                      <Users size={14}/> Referral
                    </button>
                    <button onClick={() => setShowQRModal(true)} className="bg-black text-[#FFD700] px-3 py-2 rounded-xl text-xs font-bold border border-[#333] flex items-center gap-1 cursor-pointer">
                      <QrCode size={14}/> QR
                    </button>
                    <button onClick={() => setShowScanModal(true)} className="bg-black text-[#00FF88] px-3 py-2 rounded-xl text-xs font-bold border border-[#333] flex items-center gap-1 cursor-pointer">
                      <Scan size={14}/> Scan
                    </button>
                    <button onClick={() => setShowVoiceModal(true)} className="bg-black text-[#60A5FA] px-3 py-2 rounded-xl text-xs font-bold border border-[#333] flex items-center gap-1 cursor-pointer">
                      <Mic size={14}/> Record
                    </button>
                  </div>
                </div>

                {/* 6. SOCIAL PROOF & COMMUNITY (POSITION #3) */}
                <div id="community-section" className="mb-6 border-t border-[#333] pt-6">
                  <ShareBlueprintSection onToast={showToast} compact={true} />

                  <div className="mt-4 bg-gradient-to-r from-[#111] to-[#1a1a1a] p-5 rounded-2xl border border-[#25D366]/40 text-center">
                    <h3 className="text-[#FFD700] text-sm font-black mb-1 uppercase">Join Global Pupil Community</h3>
                    <p className="text-gray-300 text-xs mb-3">Connect with pupils across 190+ countries in our safe WhatsApp community.</p>
                    <a href="/go/whatsapp?text=Join%20Sirwise%20Community" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-black px-5 py-2.5 rounded-xl text-xs hover:bg-[#20ba5a] transition">
                      <MessageCircle size={16}/> Join WhatsApp Community
                    </a>
                  </div>
                </div>
              </>
            )}
            
            {tab === 'academy' ? (
              <AcademyDashboard 
                currentUser={currentUser} 
                userProfile={userProfile} 
                onPurchase={(item: any) => { setSelectedProduct(item);  }}
                onToast={showToast}
              />
            ) : tab === 'downloads' ? (
              <div className="mb-6 flex flex-col items-center justify-center pt-2">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/certificate-template.pdf';
                    link.download = 'Goye-Store-Global-Sirwise-AI-WEB3-Academy-E-Certificate-RC-BN3583773.pdf';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }} 
                  style={{ background: '#FFD700', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '16px', color: 'black', cursor: 'pointer', border: 'none', position: 'relative', zIndex: 10 }}
                  className="flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  ⬇ DOWNLOAD E-CERTIFICATE
                </button>
                <p className="text-gray-400 text-xs mt-2 text-center">Your official verified Web3 & AI credential</p>
              </div>
            ) : (
              <>
                <div className="mt-8 mb-6">
                  <div className="flex items-center justify-between mb-4 border-b border-[#333] pb-2 flex-wrap gap-2">
                    <h2 className="text-white text-2xl font-black">
                      {tab === 'shop' ? 'All Digital Products' : 
                       tab === 'esim' ? 'Global eSIMs' : 
                       tab === 'contracts' ? 'Contracts & Visas' : 
                       tab === 'prompts' ? 'AI Prompts' : 
                       'Store & eSIM Hub'}
                    </h2>
                    <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#111] px-3.5 py-1.5 rounded-full border border-[#FFD700]/40 shadow-sm">
                      Total Active Products: {products.filter((p: any) => p.status === 'ACTIVE' && p.visible !== false && !p.isDeleted).length}
                    </span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar mb-4">
                    {[
                      { id: 'all', label: `ALL (${products.filter((p: any) => p.status === 'ACTIVE' && p.visible !== false && !p.isDeleted).length})` },
                      { id: 'dubai', label: 'DUBAI' },
                      { id: 'esim', label: 'ESIM' },
                      { id: 'prompts', label: 'PROMPTS' },
                      { id: 'academy', label: 'ACADEMY' },
                      { id: 'contracts', label: 'VISA' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition whitespace-nowrap cursor-pointer flex-shrink-0 border ${
                          activeCategory === cat.id 
                            ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-md' 
                            : 'bg-[#111] text-gray-300 border-[#333] hover:border-[#FFD700]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter((p: any) => {
                    if (p.status !== 'ACTIVE' || p.visible === false || p.isDeleted === true) return false;
                    if (activeCategory !== 'all') {
                      if (activeCategory === 'contracts') return p.category === 'contracts' || p.category === 'jobs' || p.category === 'visa';
                      if (activeCategory === 'prompts') return p.category === 'prompts' || p.category === 'starter';
                      return p.category === activeCategory;
                    }
                    if (tab === 'esim') return p.category === 'esim' || p.category === 'dubai';
                    if (tab === 'contracts') return p.category === 'contracts' || p.category === 'jobs' || p.category === 'visa';
                    if (tab === 'prompts') return p.category === 'prompts' || p.category === 'starter' || p.category === 'toolkit';
                    if (tab === 'academy') return p.category === 'academy';
                    return true;
                  }).map((product: any) => {
                    const priceDisplay = formatPriceDisplay(product.price, currentCurrency, currencyMode);
                    return (
                      <div key={product.id} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FFD700] transition relative overflow-hidden">
                        {product.badge && <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">{product.badge}</div>}
                        <div>
                          <div className="text-4xl mb-4">{product.icon}</div>
                          <h3 className="text-white font-bold text-lg mb-2 leading-tight">{product.name}</h3>
                          {product.description && <p className="text-gray-400 text-sm mb-4">{product.description}</p>}
                          {product.data && (
                            <div className="flex gap-2 mb-3">
                              <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.data}</span>
                              <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.days}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-[#222]">
                          <div className="mb-4">
                            <div className="text-[#10B981] font-black text-2xl flex items-baseline gap-2" data-usd-price={product.price}>
                              {priceDisplay.main}
                            </div>
                            <div className="text-gray-400 text-xs font-semibold mt-1">
                              {priceDisplay.sub}
                            </div>
                          </div>

                          {hasAccess(product.id) ? (
                            <button onClick={() => {
                              showToast('Access granted! Opening download link...');
                              if (product.category === 'academy') {
                                const m = document.getElementById('videoModal');
                                if(m) m.style.display = 'flex';
                              } else {
                                window.open(product.downloadUrl || product.filePath || 'https://www.gasv.store/support', '_blank');
                              }
                            }} className="w-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#10B981]/30 cursor-pointer pointer-events-auto z-10 touch-manipulation">
                              <Download size={18}/> Access Content
                            </button>
                          ) : (
                            <button 
                              data-usd-button={product.price}
                              onClick={() => { setSelectedProduct(product); setShowCheckoutModal(true); }} 
                              className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 cursor-pointer pointer-events-auto z-10 touch-manipulation shadow-lg transition active:scale-95"
                            >
                              <ShoppingCart size={18}/> Buy & Unlock ({priceDisplay.main})
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Free Download Resource Section with Academy Upgrade Button */}
            <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold px-3 py-1 rounded-full border border-[#FFD700]/40">
                  🎁 FREE BLUEPRINT ACCESS
                </span>
                <span className="text-gray-400 text-xs font-mono">RC BN3583773</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">The 5-Minute AI Prompt Blueprint for Entrepreneurs</h3>
              <p className="text-gray-300 text-xs mb-4">
                4 battle-tested prompts for ChatGPT, Gemini & Claude. Save 15+ hours weekly automating copy, proposals & sales.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  id="downloadBlueprintBtn"
                  onClick={() => {
                    window.open('/blueprints/5-Minute-AI-Prompt-Blueprint.pdf', '_blank');
                  }} 
                  style={{ background: '#10B981', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 900, color: 'black', cursor: 'pointer', border: 'none', position: 'relative', zIndex: 10 }}
                  className="flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-95 text-sm font-bold"
                >
                  ⚡ Download Free AI Prompt Blueprint
                </button>

                <button 
                  id="upgradeToAcademyBtn" 
                  onClick={() => setShowPaymentModal(true)} 
                  style={{ background: '#FFD700', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', color: 'black', border: 'none', position: 'relative', zIndex: 10 }}
                  className="active:scale-95 transition shadow-lg flex items-center justify-center text-center px-3"
                >
                  🎓 Upgrade to Full Academy $49.99 - 8 Modules Certificate
                </button>
              </div>
            </div>

            <h3 className="text-white font-bold text-lg mb-4">Purchased Digital Goods</h3>

            {purchasedItems.length === 0 ? (
              <div className="bg-[#111] border border-[#333] rounded-2xl p-12 text-center">
                <Download size={48} className="text-gray-600 mx-auto mb-4"/>
                <p className="text-gray-400">You haven't purchased anything yet.</p>
                <button onClick={() => setTab('shop')} className="mt-4 bg-[#FFD700] text-black font-bold py-2 px-6 rounded-xl">Browse Store</button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedItems.map((item: any, i: number) => (
                  <div key={i} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#FFD700] font-mono mb-1">{item.ref}</div>
                      <h3 className="text-white font-bold text-lg">{item.productName}</h3>
                      <div className="text-gray-400 text-xs mt-1">
                        Date: {item.date} • Method: {item.method} • Status: <span className={item.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>{item.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={() => showToast('Generating invoice...')} className="bg-[#222] text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center">
                         <FileText size={16}/> Invoice
                      </button>
                      {item.status === 'pending' ? (
                        <div className="bg-yellow-900/30 text-yellow-500 border border-yellow-900/50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 flex-1 md:flex-none justify-center">
                          <RefreshCw size={14} className="animate-spin"/> Verifying
                        </div>
                      ) : (
                        <button onClick={() => { 
                          showToast('Download starting...'); 
                          const a = document.createElement('a'); 
                          a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; 
                          a.download = (item.productName || 'product').replace(/\s+/g, '_') + '_delivery.txt'; 
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }} className="bg-[#10B981] text-black font-black py-2 px-6 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center transition-transform active:scale-95">
                          <Download size={16}/> Download Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isAdminAuth && tab === 'admin' && (
          <AdminDashboard showToast={showToast} />
        )}
      </main>

      {selectedProduct && (
        <UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => {
          const wasStarter = selectedProduct.id === 'web3-starter-toolkit' || selectedProduct.price <= 5.0;
          setSelectedProduct(null);
          const items = safeParse('my_downloads', []);
          setPurchasedItems(Array.isArray(items) ? items : []);
          if (wasStarter && localStorage.getItem('sirwise_paid') === 'true') {
            setShowPostPurchaseUpsellModal(true);
          }
        }} onToast={showToast} />
      )}

      <FreeLeadMagnetModal 
        isOpen={showLeadMagnetModal} 
        onClose={() => {
          setShowLeadMagnetModal(false);
          sessionStorage.setItem('lead_modal_dismissed', 'true');
        }}
        onClaimTripwire={() => {
          setShowLeadMagnetModal(false);
          setSelectedProduct(ALL_PRODUCTS[0]);
        }}
        onToast={showToast}
      />

      <PostPurchaseUpsellModal 
        isOpen={showPostPurchaseUpsellModal}
        onClose={() => setShowPostPurchaseUpsellModal(false)}
        onAcceptUpsell={() => {
          setShowPostPurchaseUpsellModal(false);
          setSelectedProduct({
            id: '1000-prompts-upsell',
            name: '1000 Viral AI Prompts Mega-Pack (50% OFF UPGRADE)',
            icon: '🤖',
            price: 19.99,
            category: 'prompts',
            badge: 'SPECIAL UPGRADE (₦29,900)'
          });
        }}
      />


      {showEsimVideoModal && <EsimVideoModal onClose={() => setShowEsimVideoModal(false)} />}
      
      <div id="videoModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#000', border: '2px solid #FFD700', padding: '20px', borderRadius: '16px', maxWidth: '400px', width: '90%' }}>
          <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>Free AI Course Lesson Module 1</h3>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '10px' }}>Introduction to AI: What is Artificial Intelligence? Learn basics...</p>
          <div style={{ width: '100%', height: '200px', background: '#111', margin: '10px 0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
            <span style={{color: '#FFD700', fontSize: '12px', fontWeight: 'bold'}}>Internal Video Player (Playing...)</span>
          </div>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>Free preview - Full courses available</p>
          <button type="button" onClick={() => { const m = document.getElementById('videoModal'); if(m) m.style.display='none'; }} style={{ background: '#FFD700', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '8px', marginTop: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
        </div>
      </div>

      
      {/* Payment Badges & Quick Access */}
      <div className="p-4 bg-[#0a0a0a] pt-12 pb-36">
        <div className="text-center text-gray-400 text-[11px] font-medium mb-6 leading-loose">
          connecting 190+ Countries Instantly.<br/>
          26 Courses From $9.99 • UK Visa $89.99<br/>
          Sirwise AI Web3 Academy 24/7
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-[#FFD700] text-[11px] font-bold flex items-center gap-2">
            <CreditCard size={14}/> Paystack
          </div>
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-gray-300 text-[11px] font-bold">
            Flutterwave
          </div>
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-[#10B981] text-[11px] font-bold flex items-center gap-1.5">
            <span className="font-serif">₿</span> Crypto
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <div className="bg-[#111] border border-[#333] py-2 px-6 rounded-full text-[#a855f7] text-[11px] font-bold">
            π Pi GCV $314k
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="border border-[#10B981]/30 bg-[#064e3b]/20 py-2.5 px-6 rounded-xl text-[#34d399] text-[11px] font-bold flex items-center gap-2">
            ⚡ Instant Delivery 190+ Countries • 24/7 Support
          </div>
        </div>

        <div className="bg-[#111] rounded-[2rem] p-6 max-w-md mx-auto border border-[#222]">
          <h3 className="text-center text-white text-base font-bold mb-6 flex items-center justify-center gap-2">
            🚀 QUICK ACCESS
          </h3>
          <div className="flex flex-col gap-3">
            <a href="https://www.gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Globe className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Website</span>
              </div>
              <span className="text-[#FFD700] text-[13px] font-bold">https://www.gasv.store</span>
            </a>
    
            
            <a href="#" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Search className="text-gray-400" size={20}/>
                <span className="text-gray-300 text-[13px]">Google</span>
              </div>
              <span className="text-gray-300 text-[13px]">GOYE Global Worldwide</span>
            </a>
    

            <a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" rel="noopener noreferrer" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#25D366] border border-transparent transition">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-[#25D366]" size={20}/>
                <span className="text-gray-300 text-[13px]">WhatsApp Support</span>
              </div>
              <span className="bg-[#111] text-[#25D366] px-4 py-2 rounded-lg text-[13px] font-bold border border-[#333]">💬 Chat on WhatsApp</span>
            </a>
    

            <a href="mailto:goyedagosmess@gmail.com?subject=New%20Sirwise%20Academy%20Inquiry%20RC%20BN3583773" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Mail className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Contact Portal</span>
              </div>
              <span className="bg-[#111] text-white px-4 py-2 rounded-lg text-[13px] font-bold border border-[#333]">📧 Email Support</span>
            </a>
    

            <button onClick={handleInstallClick} className="bg-black rounded-xl p-4 flex items-center justify-between w-full hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Smartphone className="text-gray-400" size={20}/>
                <span className="text-gray-300 text-[13px]">Install</span>
              </div>
              <span className="text-[#FFD700] text-[13px] font-bold">Install Now</span>
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-[#555] text-[10px] leading-relaxed">
              © 2026 Goyedagosmess Enterprise<br/>
              Sirwise AI Web3 Academy<br/>
              Trusted Worldwide • RC BN3583773
            </p>
          </div>
        </div>
      </div>
      <footer id="support" style={{background:'#000', borderTop:'3px solid #FFD700', padding:'40px 15px', marginTop:'50px', textAlign:'center'}}>
        <div className="qr-container" style={{maxWidth: '200px', width: '90%', margin: '20px auto', display: 'block', position: 'relative', zIndex: 1, padding: '8px', background: 'white', border: '3px solid #FFD700', borderRadius: '24px'}}>
          <div style={{position:'relative'}}>
            <img loading="lazy" src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store" alt="GOYE QR" style={{width:'100%', height:'auto', display:'block', borderRadius:'16px'}} />
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'white', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.2)'}}>
              <span style={{fontSize:'24px', color:'#3b82f6'}}>🌐</span>
            </div>
          </div>
          <p style={{color:'#000', fontWeight:'bold', marginTop:'8px', fontSize:'12px', marginBottom:'0', textAlign:'center'}}>Scan Me<br/>www.gasv.store</p>
        </div>
        
        <div style={{marginTop:'30px'}}>
          <button onClick={() => {
            if (!navigator.onLine) {
              showToast('You are currently offline. Please reconnect to launch support.');
              return;
            }
            window.open('https://wa.me/2348033584736?text=Hello%20GOYE%20Sirwise%20Academy%20RC%20BN3583773', '_blank');
          }} style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:'bold'}}>
            <MessageCircle size={18}/> WhatsApp Support
          </button>
        </div>
        
        <div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Paystack</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Flutterwave</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">PayPal</span>
            <span className="bg-[#111] text-[#F0B90B] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Crypto USDT BEP20</span>
            <span className="bg-[#111] text-[#8b5cf6] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Pi GCV $314k</span>
          </div>
          <p style={{color:'#888', fontSize:'11px', margin:0, lineHeight:'1.6'}}>
            © 2026 Goyedagosmess Enterprise RC BN3583773 Sirwise AI Web3 Academy Trusted Worldwide 190+ Countries www.gasv.store<br/>
            Support: <a href="mailto:goyedagosmess@gmail.com" style={{color:'#FFD700', textDecoration:'underline'}}>goyedagosmess@gmail.com</a>
          </p>
        </div>
      </footer>

      <SirwiseAITeacher isOpen={showSirwiseBot} onClose={() => setShowSirwiseBot(false)} />
      
      {showQRModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white p-6 rounded-3xl w-[90%] max-w-[300px] border-4 border-[#FFD700] flex flex-col items-center relative">
            <button onClick={() => setShowQRModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-black mb-4">Scan Me</h3>
            <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.gasv.store"} alt="QR" className="w-[200px] h-[200px]" />
            <div className="text-black font-bold mt-2 text-sm flex items-center gap-1"><Globe size={16} className="text-blue-500"/> www.gasv.store</div>
          </div>
        </div>
      )}

      
      {showScanModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <ScanModal onClose={() => setShowScanModal(false)} onScanResult={(res: string) => { showToast('Scanned: ' + res); setShowScanModal(false); }} />
        </div>
      )}

      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#3b82f6] p-6 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center relative">
            <button onClick={() => setShowVoiceModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>
            <h3 className="font-black text-[#3b82f6] mb-4">Record Capstone</h3>
            <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-gray-500 mb-4 rounded-xl border border-[#222]">
              <Mic size={48} className="text-[#3b82f6] mb-2" />
              <span>Camera & Mic</span>
            </div>
            <button onClick={() => { showToast('Recording started (simulated)...'); setTimeout(()=> { showToast('Recording saved!'); setShowVoiceModal(false); }, 3000); }} className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl cursor-pointer pointer-events-auto z-[100]">Start Recording</button>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white border-[3px] border-[#FFD700] p-6 rounded-[24px] w-[250px] flex flex-col items-center relative cursor-pointer pointer-events-auto z-[100]" onClick={() => setShowQRModal(false)}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.gasv.store" alt="GOYE QR" style={{width:'200px', height:'200px', display:'block', borderRadius:'16px'}} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <span className="text-2xl text-[#3b82f6]">🌐</span>
            </div>
            <p className="text-black font-bold mt-2 text-[14px] text-center mb-0 leading-tight">Scan Me<br/>www.gasv.store</p>
          </div>
        </div>
      )}


      {showReferralModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#FFD700] p-6 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center relative">
            <button onClick={() => setShowReferralModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-[#FFD700] mb-4 text-xl">Referral & Earn</h3>
            <p className="text-gray-400 text-sm text-center mb-4">Invite friends and earn rewards when they enroll in the Academy.</p>
            <div className="bg-black border border-[#333] w-full p-3 rounded-xl text-white text-center text-xs font-mono break-all mb-4 select-all">
              https://www.gasv.store?ref={currentUser?.uid || 'guest'}
            </div>
            <button onClick={() => { navigator.clipboard.writeText('https://www.gasv.store?ref='+(currentUser?.uid||'guest')); showToast('Copied to clipboard!'); }} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4">Copy Referral Link</button>
            <div className="w-full flex justify-between items-center bg-[#222] p-4 rounded-xl border border-[#333]">
              <span className="text-gray-400 font-bold">Total Earnings:</span>
              <span className="text-[#10B981] font-black text-xl">$0.00</span>
            </div>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[300px] flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowLanguageModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>
            <h3 className="font-black text-white mb-4">Select Language</h3>
            {['English', 'French (Français)', 'Spanish (Español)', 'Arabic (العربية)', 'Hindi (हिन्दी)'].map(lang => (
               <button key={lang} onClick={() => { showToast(lang + ' selected'); setShowLanguageModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] cursor-pointer pointer-events-auto z-[100] font-bold">{lang}</button>
            ))}
          </div>
        </div>
      )}

      {showCurrencyModal && (
        <CurrencyModal
          onClose={() => setShowCurrencyModal(false)}
          currentCurrency={currentCurrency}
          onSelectCurrency={(code: string) => {
            setCurrentCurrency(code);
            localStorage.setItem('goye_currency', code);
            localStorage.setItem('goye_preferred_currency', code);
            (window as any).SELECTED_CURRENCY = code;
            if (typeof (window as any).changeCurrency === 'function') {
              (window as any).changeCurrency(code);
            }
            showToast('Currency set to ' + code, 'success');
            setShowCurrencyModal(false);
          }}
          rates={exchangeRates}
        />
      )}

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#0a0a0a] border-t border-[#222] z-[5000] flex overflow-x-auto items-center justify-between px-2 pb-safe w-full max-w-[420px] mx-auto hide-scrollbar pointer-events-auto">
        <button onClick={() => {setTab('home'); window.location.hash='home'}} className={`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-[9px] font-bold">HOME</span>
        </button>
        <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'shop' || tab === 'esim' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
          <ShoppingBag size={24} />
          <span className="text-[9px] font-bold">SHOP</span>
        </button>
        <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'academy' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
          <GraduationCap size={24} />
          <span className="text-[9px] font-bold">ACADEMY</span>
        </button>
        <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'downloads' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
          <Download size={24} />
          <span className="text-[9px] font-bold">DOWNLOADS</span>
        </button>
        <a href="/go/whatsapp?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" rel="noopener noreferrer" className="min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 text-gray-500 hover:text-[#25D366]">
          <MessageCircle size={24} />
          <span className="text-[9px] font-bold">SUPPORT</span>
        </a>
      </nav>
      {/* Floating Widgets Container (Stacked Vertically to Prevent Overlap) */}
      <div className="fixed bottom-[80px] right-[16px] sm:right-[24px] z-[9995] flex flex-col items-end gap-3 pointer-events-auto">
        {/* Top: AI Assistant Bot Floating Button */}
        <button 
          onClick={() => setShowSirwiseBot(true)} 
          className="bg-[#FFD700] text-black w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black cursor-pointer"
          title="Open AI Support Bot"
        >
          🤖
        </button>

        {/* Bottom: WhatsApp Floating Support Button */}
        <a
          href="https://wa.me/2348033584736?text=Hello%20Goye%20Store%20Support!%20I%20need%20assistance%20with%20my%20order"
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.5)] flex items-center gap-2 font-bold text-xs transition-transform active:scale-95 border-2 border-white/20 group cursor-pointer"
          title="Need Help? Chat on WhatsApp"
        >
          <MessageCircle size={22} className="fill-white text-[#25D366]" />
          <span className="hidden sm:inline font-bold pr-1 text-xs">Need Help? Chat 24/7</span>
        </a>
      </div>

      {/* Toast Notification */}
      {showPaymentModal && (
        <PaymentOptionsModal onClose={() => setShowPaymentModal(false)} />
      )}

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#10B981] text-black px-6 py-3 rounded-full font-bold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}
    </div>
  );
}
