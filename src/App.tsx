import AuthScreen from './components/AuthScreen';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Globe, Zap, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, ShoppingCart, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, RefreshCw, Users, Activity, UserCircle , Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard, Camera, Mic, MoreHorizontal} from 'lucide-react';
import { ALL_PRODUCTS } from './data';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import AcademyDashboard from './components/AcademyDashboard';
import EsimVideoModal from './components/EsimVideoModal';

import ScanModal from './components/ScanModal';
import ReferralDashboardModal from './components/ReferralDashboardModal';
import VoiceModal from './components/VoiceModal';
import LanguageModal from './components/LanguageModal';
import AdminDashboard from './components/AdminDashboard';
import CurrencyModal, { CURRENCIES } from './components/CurrencyModal';
import { Bell, User } from 'lucide-react';
import { GoyeLogo } from './components/GoyeLogo';
import SirwiseAITeacher from './components/SirwiseAITeacher';
import { db } from './lib/firebase';
import { collection, onSnapshot, setDoc, doc, getDoc, updateDoc, increment, addDoc } from 'firebase/firestore';


// Dummy components for things that were in App.tsx
const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
  <div className="bg-[#0a0a0a] border border-[#FFD700] rounded-[2rem] p-6 text-center mt-6 relative mx-4 pointer-events-auto">
    <div className="flex flex-col gap-3 mb-8">
      <div className="bg-[#FFD700] text-black text-[11px] font-bold py-2 px-5 rounded-full mx-auto inline-flex items-center gap-2">
        <span className="text-yellow-600">⚡</span> 100% DIGITAL PRODUCTS STORE
      </div>
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
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg">Start Learning</button>
      </div>
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
        <div className="text-3xl mb-2">💰</div>
        <h3 className="text-white font-bold mb-1">Crypto & DeFi</h3>
        <p className="text-gray-400 text-xs mb-4">Deep dive into decentralized finance and trading</p>
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg">Start Learning</button>
      </div>
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
        <div className="text-3xl mb-2">π</div>
        <h3 className="text-white font-bold mb-1">Pi Network GCV</h3>
        <p className="text-gray-400 text-xs mb-4">Understanding Pi Network at Global Consensus Value</p>
        <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg">Start Learning</button>
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
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };

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

  // Background Sync Effect
  useEffect(() => {
    const handleOnline = async () => {
      if (currentUser?.uid) {
        // Here we could sync offline stored purchases, academy progress, etc to Firebase
        try {
          const { doc, setDoc } = await import('firebase/firestore');
          const { db } = await import('./lib/firebase');
          const progress = localStorage.getItem(`goye_academy_progress_${currentUser.uid}`);
          if (progress) {
             const data = JSON.parse(progress);
             await setDoc(doc(db, 'academy', currentUser.uid), data, { merge: true });
          }
        } catch (err) {
          console.warn('Sync failed', err);
        }
        showToast('You are back online. Data synchronized.');
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [currentUser]);
  const [paymentConfig, setPaymentConfig] = useState<any>({
    paystack: localStorage.getItem('paystack_public_key') || '',
    flutterwave: localStorage.getItem('flutterwave_public_key') || '',
    crypto: localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4',
    pi: localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('PAYMENT_CONFIG');
      if (stored) {
        setPaymentConfig(JSON.parse(stored));
      }
    } catch (e) {}

    const unsub = onSnapshot(doc(db, 'settings', 'payments'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPaymentConfig(data);
        localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(data));
        localStorage.setItem('paystack_public_key', data.paystack || '');
        localStorage.setItem('flutterwave_public_key', data.flutterwave || '');
        localStorage.setItem('crypto_wallet', data.crypto || '');
        localStorage.setItem('pi_wallet', data.pi || '');
      }
    });

    return () => unsub();
  }, []);

  const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('CUSTOM_PRODUCTS') || '[]');
    return [...ALL_PRODUCTS, ...custom];
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
  const [currentCurrency, setCurrentCurrency] = useState(localStorage.getItem('goye_preferred_currency') || 'USD');
  const [exchangeRates, setExchangeRates] = useState(CURRENCIES);

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
    const trackReferral = async () => {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        // Set cookie for 30 days
        const d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        document.cookie = "referred_by=" + ref + ";expires=" + d.toUTCString() + ";path=/";
        localStorage.setItem('referred_by', ref);
        
        // Check if we already counted this IP/session click
        if (!sessionStorage.getItem('ref_clicked_' + ref)) {
          sessionStorage.setItem('ref_clicked_' + ref, 'true');
          try {
            
            const refDoc = doc(db, 'referrals', ref);
            const snap = await getDoc(refDoc);
            if (snap.exists()) {
              await updateDoc(refDoc, { clicks: increment(1) });
            } else {
              await setDoc(refDoc, { clicks: 1, signups: 0, usd: 0, ngn: 0, pi: 0, payouts: [] });
            }
          } catch (e) {
            console.error("Failed to track referral click", e);
          }
        }
      }
    };
    trackReferral();
  }, []);

  const [isAiTeacherOpen, setIsAiTeacherOpen] = useState(false);
  const userAccessStatus = purchasedItems.length > 0 ? 'paid' : 'free';

  
  useEffect(() => {
    // Analytics Page View Tracker
    const trackPageView = async () => {
      try {
        const userEmail = localStorage.getItem('user_email') || localStorage.getItem('admin_email') || currentUser?.email || '';
        const isAdminUser = localStorage.getItem('is_admin') === 'true' || userEmail === 'ifiok82@gmail.com' || userEmail.includes('goye');
        if (isAdminUser) {
          localStorage.setItem('is_admin', 'true');
        }

        const shouldExclude = localStorage.getItem('exclude_my_clicks') !== 'false'; // default true

        if (isAdminUser && shouldExclude) {
          console.log('Excluding admin click - Not counting traffic');
          return;
        }

        if (!sessionStorage.getItem('session_tracked')) {
          sessionStorage.setItem('session_tracked', 'true');
          
          let country = 'NG';
          let ip = '102.89.***.***';
          let city = 'Lagos';
          let flag = '🇳🇬';
          try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
              const data = await res.json();
              if (data.country_code) {
                country = data.country_code;
                flag = String.fromCodePoint(...[...data.country_code.toUpperCase()].map(c => c.charCodeAt(0) + 127397));
              }
              if (data.ip) {
                ip = data.ip.replace(/\.\d+\.\d+$/, '.***.***').replace(/:[0-9a-fA-F:]+$/, ':****');
              }
              city = data.city || 'Lagos';
            }
          } catch(e) {}

          if (city === 'Ado-Odo' || city === 'Ilare' || city === 'Unknown' || isAdminUser) {
            city = 'Lagos';
          }
          if (country === 'Unknown' || country === 'NG') {
            country = 'NG';
            flag = '🇳🇬';
          }

          let customerName = 'Guest';
          if (isAdminUser) {
            customerName = 'Admin (Owner)';
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
            ip,
            country,
            city,
            flag,
            customerName,
            customer_name: customerName,
            is_admin: isAdminUser,
            path: window.location.hash || window.location.pathname || '/',
            timestamp: new Date().toISOString(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Phone' : 'Desktop'
          };
          
          let logs = JSON.parse(localStorage.getItem('traffic_log') || '[]');
          logs.unshift(pageView);
          localStorage.setItem('traffic_log', JSON.stringify(logs.slice(0, 500)));
          
          let total = parseInt(localStorage.getItem('total_clicks') || '0');
          localStorage.setItem('total_clicks', (total + 1).toString());
        }
      } catch (e) {
        console.error('Page view tracking error', e);
      }
    };
    trackPageView();

    // 1. Firebase Real-time listeners (onSnapshot)
    const productsRef = collection(db, 'all_products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        ALL_PRODUCTS.forEach(p => setDoc(doc(db, 'all_products', p.id), p));
      } else {
        setProducts(snapshot.docs.map(d => d.data() as typeof ALL_PRODUCTS[0]));
      }
    }, (error) => console.error("Firestore error all_products:", error));


    return () => {
      unsubProducts();
    };
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
              icon: '/logo.png',
              badge: '/logo.png'
            });
          }
        } else {
          new Notification('GOYE Global Store', {
            body: 'Welcome! You are now subscribed to updates.',
            icon: '/logo.png'
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
    const handleHashChange = () => setTab(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('hashchange', handleHashChange);
    
    setTimeout(() => setShowSplash(false), 2000);
    
    // Load downloads
    const items = JSON.parse(localStorage.getItem('my_downloads') || '[]');
    setPurchasedItems(Array.isArray(items) ? items : []);
    
    // Check if URL is /admin
    if (window.location.pathname === '/admin') {
      setShowAdminLogin(true);
    }
    

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAdminLogin = (e: any) => {
    e.preventDefault();
    if (adminPassword === 'GoyeBN3583773') {
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setTab('admin');
    } else {
      alert('Invalid admin password');
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

            
      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', background: '#FFD700', minHeight: '60px', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 999 }}>
            {!isAuthenticated ? (
                <button onClick={() => setTab('auth')} className="px-3 py-1 bg-white text-black text-xs font-bold rounded shadow-md border border-gray-300">Login / Register</button>
            ) : (
                <div className="flex flex-col items-center justify-center bg-white border border-[#333] rounded-full w-[36px] h-[36px] cursor-pointer overflow-hidden shadow-md" onClick={() => { setShowMoreMenu(!showMoreMenu); }}>
                    {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="User" className="w-full h-full object-cover" /> : <User size={16} className="text-black" />}
                </div>
            )}
        </div>
        <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}>
            <GoyeLogo size={40} className="text-black mb-1" />
            <h1 className="text-black font-black text-sm leading-tight uppercase">GOYE Global Worldwide</h1>
            <div className="text-[10px] text-black font-bold">RC BN3583773</div>
            <div className="text-[10px] text-black font-bold">www.gasv.store</div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3 px-2 z-[60] relative" style={{ pointerEvents: 'auto' }}>
            <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("programs-section") || document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Programs</button>
            <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("our-method-section") || document.getElementById("our-method"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Our method</button>
            <button onClick={() => { window.open("https://wa.me/2348033584736?text=Join%20Sirwise%20Community", "_blank"); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Community</button>
            <button onClick={() => { if(!isAuthenticated) setTab("auth"); else { setTab("academy"); setTimeout(()=>document.getElementById("dashboard")?.scrollIntoView({behavior:"smooth"}), 100); } }} className="text-[#FFD700] bg-black font-bold text-[10px] hover:bg-black/80 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Student dashboard <ChevronRight size={10} /></button>
            <button onClick={() => { if(localStorage.getItem("sirwise_paid") !== "true") { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); } else { setTab("academy"); } }} className="text-white bg-blue-900 font-bold text-[10px] hover:bg-blue-800 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Start learning <ChevronRight size={10} /></button>
            <button onClick={() => setShowReferralModal(true)} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Referral</button>
        </div>
        <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("programs-section") || document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="w-full bg-[#FFD700] text-black text-center text-[10px] font-black py-1 cursor-pointer pointer-events-auto z-[100] relative block hover:bg-[#ffe033]">
          EXPLORE THE PROGRAMMES →
        </button>
        <div className="flex justify-center gap-4 mt-2 z-[60] relative pointer-events-auto">
            
            <button onClick={() => setShowQRModal(true)} className="flex items-center gap-1 bg-black text-[#FFD700] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]"><QrCode size={12} /> QR</button>
            <button onClick={() => setShowScanModal(true)} className="flex items-center gap-1 bg-black text-[#10B981] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]"><Search size={12} /> Scan</button>
            <button onClick={() => setShowVoiceModal(true)} className="flex items-center gap-1 bg-black text-[#3b82f6] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]"><Mic size={12} /> Record</button>
            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]"><MoreHorizontal size={12} /> More</button>
        </div>
        {showMoreMenu && (
            <div className="absolute top-[80px] right-[10px] bg-[#111] border border-[#FFD700] rounded-xl shadow-2xl z-[99999] w-[200px] overflow-hidden pointer-events-auto">
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
        
        {(tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500 pb-[100px]">

            {!isAuthenticated && tab === 'home' && (
               <div className="bg-[#111] border-2 border-[#FFD700] p-4 rounded-xl mb-6 text-center">
                 <h3 className="text-[#FFD700] font-bold mb-2">Welcome to GOYE Store</h3>
                 <p className="text-sm text-gray-300 mb-4">Please Register or Login to unlock all features.</p>
                 <button onClick={() => setTab('auth')} className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-bold">Register / Login</button>
               </div>
            )}
            {tab === 'home' && (
              <>
                <HeroSection onLogoTap={() => {
                  const newCount = adminTapCount + 1;
                  setAdminTapCount(newCount);
                  if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
                  setTimeout(() => setAdminTapCount(0), 3000);
                }} />

                {/* Programs Section */}
                <div id="programs-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <h2 className="text-[#FFD700] text-xl font-black mb-2 text-center uppercase tracking-wider">Academic Programmes</h2>
                  <p className="text-gray-400 text-xs text-center mb-6">4-Week Masterclasses for Global Pupils Aged 8-18</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🤖</div>
                        <h3 className="text-white font-bold mb-1 text-base">Sirwise AI & Prompt Engineering</h3>
                        <p className="text-gray-400 text-xs mb-4">Master AI prompts, homework assistance, research tools, and smart automation.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🎨</div>
                        <h3 className="text-white font-bold mb-1 text-base">Digital Asset Creation</h3>
                        <p className="text-gray-400 text-xs mb-4">Create digital art, storytelling, ebooks, and interactive multimedia projects.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🔐</div>
                        <h3 className="text-white font-bold mb-1 text-base">Web3 & Cyber Safety</h3>
                        <p className="text-gray-400 text-xs mb-4">Blockchain basics, digital identity security, NFT credentials, and online privacy.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="text-white font-bold mb-1 text-base">Capstone & Certification</h3>
                        <p className="text-gray-400 text-xs mb-4">Build your final project and receive an official blockchain-verified diploma.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                  </div>
                </div>

                {/* Our Method Section */}
                <div id="our-method-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <h2 className="text-[#3b82f6] text-xl font-black mb-2 text-center uppercase tracking-wider">Our Teaching Method</h2>
                  <p className="text-gray-400 text-xs text-center mb-6">How Sirwise AI Guarantees Success for Every Pupil</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🤖</div>
                      <h4 className="text-white font-bold text-sm mb-1">24/7 AI Guidance</h4>
                      <p className="text-gray-400 text-xs">Personalized tutor providing step-by-step interactive lessons and feedback anytime.</p>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🛠️</div>
                      <h4 className="text-white font-bold text-sm mb-1">Hands-On Projects</h4>
                      <p className="text-gray-400 text-xs">Learn by creating real digital art, stories, apps, and Web3 portfolio items.</p>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🎓</div>
                      <h4 className="text-white font-bold text-sm mb-1">Verified Diploma</h4>
                      <p className="text-gray-400 text-xs">Tamper-proof certificate with QR verification under RC BN3583773.</p>
                    </div>
                  </div>
                </div>

                {/* Community Section */}
                <div id="community-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-6 rounded-2xl border border-[#FFD700] text-center">
                    <h2 className="text-[#FFD700] text-xl font-black mb-2 uppercase">Join Global Pupil Community</h2>
                    <p className="text-gray-300 text-xs mb-4">Connect with pupils and parents across 190+ countries in our safe community group.</p>
                    <a href="https://wa.me/2348033584736?text=Join%20Sirwise%20Community" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-black px-6 py-3 rounded-xl text-xs hover:bg-[#20ba5a] transition">
                      💬 Join WhatsApp Community
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
            ) : (
              <>
                <h2 className="text-white text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block mt-8">
                  {tab === 'shop' ? 'All Digital Products' : 
                   tab === 'esim' ? 'Global eSIMs' : 
                   tab === 'contracts' ? 'Contracts & Visas' : 
                   tab === 'prompts' ? 'AI Prompts' : 
                   'Store'}
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {products.filter((p: any) => tab === 'shop' || tab === 'home' || p.category === tab).map((product: any) => (
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
                        <div className="text-[#10B981] font-black text-2xl mb-4">${product.price}</div>
                        {hasAccess(product.id) ? (
                          <button onClick={() => {
                            showToast('Access granted! Downloading...');
                            if (product.category === 'academy') {
                              const m = document.getElementById('videoModal');
                              if(m) m.style.display = 'flex';
                            } else {
                              const a = document.createElement('a');
                              a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.';
                              a.download = `${product.name}.txt`;
                              a.click();
                            }
                          }} className="w-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#10B981]/30 cursor-pointer pointer-events-auto z-10 touch-manipulation">
                            <Download size={18}/> Access Content
                          </button>
                        ) : (
                          <button onClick={() => { setSelectedProduct(product); }} className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 cursor-pointer pointer-events-auto z-10 touch-manipulation">
                            <ShoppingCart size={18}/> Buy & Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

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
          setSelectedProduct(null);
          const items = JSON.parse(localStorage.getItem('my_downloads') || '[]');
          setPurchasedItems(Array.isArray(items) ? items : []);
        }} onToast={showToast} />
      )}

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
    

            <a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#25D366] border border-transparent transition">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-[#25D366]" size={20}/>
                <span className="text-gray-300 text-[13px]">WhatsApp</span>
              </div>
              <span className="bg-[#111] text-[#25D366] px-4 py-2 rounded-lg text-[13px] font-bold border border-[#333]">💬 Chat on WhatsApp</span>
            </a>
    

            <a href="mailto:goye@gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Mail className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Email</span>
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
            window.open('/api/support-chat?text=Hello GOYE Support', '_blank');
          }} style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:'bold'}}>
            <MessageCircle size={18}/> WhatsApp Support
          </button>
        </div>
        
        <div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Paystack</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Flutterwave</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">PayPal</span>
            <span className="bg-[#111] text-[#10B981] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Crypto USDC</span>
            <span className="bg-[#111] text-[#8b5cf6] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Pi GCV $314k</span>
          </div>
          <p style={{color:'#666', fontSize:'11px', margin:0, lineHeight:'1.5'}}>
            © 2026 Goyedagosmess Enterprise<br/>Sirwise AI Web3 Academy • Trusted Worldwide • RC BN3583773
          </p>
        </div>
      </footer>

      
      <div className="fixed bottom-[90px] right-[10px] z-[99] pointer-events-auto">
        <button onClick={() => setShowSirwiseBot(true)} className="bg-[#FFD700] w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] border-2 border-black animate-bounce cursor-pointer pointer-events-auto">
          <span className="text-3xl">🤖</span>
        </button>
      </div>
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
          <ScanModal onClose={() => setShowScanModal(false)} onScanResult={(res) => { alert(res); setShowScanModal(false); }} />
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
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[300px] flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowCurrencyModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>
            <h3 className="font-black text-white mb-4">Select Currency</h3>
            {['USD', 'NGN', 'GBP', 'EUR', 'CAD', 'AUD', 'INR', 'ZAR'].map(curr => (
               <button key={curr} onClick={() => { localStorage.setItem('goye_currency', curr); setCurrentCurrency(curr); showToast('Currency set to ' + curr); setShowCurrencyModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] font-bold cursor-pointer pointer-events-auto z-[100]">{curr}</button>
            ))}
          </div>
        </div>
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
        <a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" className="min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 text-gray-500 hover:text-[#25D366]">
          <MessageCircle size={24} />
          <span className="text-[9px] font-bold">SUPPORT</span>
        </a>
      </nav>
      {/* Floating Widgets */}
      <div className="fixed bottom-[90px] right-[20px] z-[99999] cursor-pointer pointer-events-auto">
        <button onClick={() => setShowSirwiseBot(true)} className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black">
          🤖
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#10B981] text-black px-6 py-3 rounded-full font-bold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}
    </div>
  );
}
