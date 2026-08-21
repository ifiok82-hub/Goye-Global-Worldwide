import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRScannerModal from './components/QRScannerModal';
import { GoyeLogo } from './components/GoyeLogo';
import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, Users, Activity, UserCircle } from 'lucide-react';
import { ESIM_PRODUCTS, ACADEMY_COURSES } from './data';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import EsimVideoModal from './components/EsimVideoModal';
import { auth, googleAuthProvider, db } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';


const HeroSection = ({ onLogoTap, onPlayVideo }: { onLogoTap?: () => void, onPlayVideo?: () => void }) => (
  <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f0f] border-2 border-[#FFD700] rounded-[20px] p-5 mx-4 my-4 shadow-2xl shadow-purple-900/10">
    <div className="bg-[#FFD700] text-black px-3 py-1.5 rounded-full inline-block font-bold text-[10px] sm:text-xs">
      ⚡ 100% DIGITAL PRODUCTS STORE
    </div>
    <div className="bg-[#6B46C1] text-white px-3 py-1.5 rounded-full inline-block ml-2 text-[10px] mt-2">
      BN3583773 • https://www.gasv.store
    </div>
    <div className="border border-[#10B981] text-[#10B981] px-3 py-1.5 rounded-full inline-block mt-2 text-[10px]">
      🛡️ Instant Delivery 190+ Countries
    </div>

    <h1 className="text-white text-3xl font-bold mt-5 leading-tight" title="Tap 5 times for admin" style={{cursor:'pointer', userSelect:'none'}} onClick={onLogoTap}>
      GOYE STORE GLOBAL<br/>
      <span className="text-[#FFD700]">SIRWISE AI WEB3 ACADEMY</span>
    </h1>

    <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
      <span className="bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1">
        <ShieldCheck size={14} /> 100% Money Back Guarantee - 7 Days - No Questions
      </span>
    </div>

    <div className="mt-4 flex items-center justify-center gap-2 bg-[#111] border border-[#333] rounded-lg p-2.5 text-[10px] sm:text-xs shadow-inner">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <span className="text-gray-300 font-mono">
        🔥 {Math.floor(Math.random() * (3500 - 2000 + 1)) + 2000} online now - {Math.floor(Math.random() * (200 - 50 + 1)) + 50} sales today - Last sale: <span className="text-[#FFD700]">eSIM USA 3m ago</span>
      </span>
    </div>

    <p className="text-[#aaa] text-sm mt-3 leading-relaxed">
      100% Digital Products. No Physical Shipping Friction. Instant QR eSIMs, AI Academy Toolkits, Software Licenses, Web3 Smart Contracts & Digital Nomad Suites.
    </p>

    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlayVideo?.(); }} className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
      <div className="w-16 h-16 bg-[#FFD700] text-black rounded-full flex items-center justify-center pl-1 z-20 mb-3 shadow-[0_0_30px_rgba(255,215,0,0.5)] transform group-hover:scale-110 transition-transform">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <p className="text-white font-bold z-20 text-lg">Watch How eSIM Works in 60 Seconds</p>
      <p className="text-gray-400 text-xs z-20 mt-1">▶️ Internal Video Demo Placeholder</p>
    </div>

    <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[#888] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
      <span>🔒 Paystack Secured</span>
      <span className="hidden sm:inline">•</span>
      <span>🔒 Flutterwave Secured</span>
      <span className="hidden sm:inline">•</span>
      <span>✅ Verified Seller</span>
      <span className="hidden sm:inline">•</span>
      <span>⚡ Instant Delivery</span>
      <span className="hidden sm:inline">•</span>
      <span>🎧 24/7 Support</span>
    </div>

    <div className="border-2 border-[#8B5CF6] rounded-[15px] p-4 mt-5 bg-black/50">
      <div className="text-[#FFD700] text-xs flex items-center gap-1 font-bold mb-3">
        <Landmark size={14}/> PI GCV RATE:
      </div>
      <div className="flex gap-2">
        <div className="bg-[#8B5CF6] text-white p-2 rounded-xl text-center flex-1 text-[11px] font-bold leading-tight flex flex-col justify-center">
          <span>$314,159</span>
          <span>GCV</span>
        </div>
        <div className="bg-[#222] text-[#888] p-2 rounded-xl text-center flex-1 text-[11px] leading-tight flex flex-col justify-center">
          <span>$314</span>
          <span>GCV</span>
        </div>
        <div className="bg-[#222] text-[#888] p-2 rounded-xl text-center flex-1 text-[11px] leading-tight flex flex-col justify-center">
          <span>Market</span>
          <span>$0.50</span>
        </div>
      </div>
    </div>

    <div className="bg-[#111] border border-[#333] rounded-full p-3.5 mt-5 flex items-center gap-2">
      <Search size={16} className="text-gray-400"/>
      <input 
        placeholder="Search eSIM, AI tools, licenses, Web3..." 
        className="bg-transparent border-none text-white w-full outline-none text-sm placeholder:text-gray-600" 
      />
    </div>
  </div>
);

const ContractGeneratorModal = ({ contract, onClose, onCheckout }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({ partyA: '', partyB: '', date: '' });
  
  if (!contract) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
      <div className="bg-[#111] border-2 border-[#FFD700] rounded-[20px] p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
        <h2 className="text-[#FFD700] text-xl font-bold mb-4">{contract.name} Generator</h2>
        
        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm">Step 1: Enter contract details to generate your document.</p>
            <input className="bg-black border border-[#333] p-3 rounded-xl text-white outline-none focus:border-[#FFD700]" placeholder="Party A (Your Name/Company)" value={formData.partyA} onChange={e => setFormData({...formData, partyA: e.target.value})} />
            <input className="bg-black border border-[#333] p-3 rounded-xl text-white outline-none focus:border-[#FFD700]" placeholder="Party B (Client/Partner)" value={formData.partyB} onChange={e => setFormData({...formData, partyB: e.target.value})} />
            <button onClick={() => setStep(2)} className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl mt-2">GENERATE PREVIEW</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <div className="bg-white p-6 rounded-lg relative overflow-hidden h-48 flex flex-col justify-start text-left">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-30deg]">
                <span className="text-6xl font-black text-black tracking-widest uppercase">WATERMARK</span>
              </div>
              <h3 className="text-black font-bold text-lg border-b pb-2">{contract.name}</h3>
              <p className="text-gray-600 text-xs mt-2">This Agreement is made on [Date] between {formData.partyA || '[Party A]'} and {formData.partyB || '[Party B]'}...</p>
              <p className="text-gray-600 text-xs mt-2">Confidential Information shall include all data, materials, products, technology, computer programs, specifications, manuals, business plans, software, marketing plans...</p>
            </div>
            <p className="text-[#FFD700] text-sm font-bold mt-2">Preview Generated! Pay to download PDF.</p>
            <button onClick={() => { onClose(); onCheckout(contract); }} className="w-full bg-[#10B981] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2">
              <Download size={16}/> PAY ${contract.price} & DOWNLOAD PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const REAL_QR = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://www.gasv.store&bgcolor=FFFFFF&color=000000&qzone=1&margin=10&ecc=H&format=png";

  const [tab, setTab] = useState<'home' | 'shop' | 'esim' | 'academy' | 'contracts' | 'prompts' | 'downloads' | 'admin' | 'admin-users' | 'admin-settings' | 'admin-academy' | 'admin-products' | 'trackers' | 'referrals' | 'legal-tos' | 'legal-privacy' | 'legal-refund'>('home');
  const [showRecorder, setShowRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [toast, setToast] = useState({message: "", show: false});
  const showToast = (msg: string) => { setToast({message: msg, show: true}); setTimeout(()=>setToast({message: "", show: false}), 3000); };
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [generatingContract, setGeneratingContract] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Admin state
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const adminPressTimer = React.useRef<any>(null);
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  // Referral state
  const [refClicks, setRefClicks] = useState(0);

  // Tracking state
  const [trackingRefInput, setTrackingRefInput] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin && (tab === 'admin' || tab === 'admin-users')) {
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          setDbUsers(usersList.sort((a, b) => new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime()));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };
    fetchUsers();
  }, [isAdmin, tab]);
  const [refSignups, setRefSignups] = useState(0);
  const [refSales, setRefSales] = useState(0);
  const [refBalance, setRefBalance] = useState(0);
  const [refHistory, setRefHistory] = useState<any[]>([]);
  const [myReferrals, setMyReferrals] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch of referral data when tab changes or initially
    if (tab === 'referrals') {
      setRefClicks(parseInt(localStorage.getItem('referral_clicks') || '0', 10));
      setRefSignups(parseInt(localStorage.getItem('referral_signups') || '0', 10));
      setRefSales(parseInt(localStorage.getItem('referral_sales') || '0', 10));
      setRefBalance(parseFloat(localStorage.getItem('referral_balance') || '0'));
      setRefHistory(JSON.parse(localStorage.getItem('referral_sales_list') || '[]'));
      
      if (user) {
        const fetchMyReferrals = async () => {
          try {
            const myUserDoc = await getDoc(doc(db, 'users', user.uid));
            if (myUserDoc.exists()) {
               const myData = myUserDoc.data();
               if (myData.refBalance !== undefined) setRefBalance(myData.refBalance);
               if (myData.refSales !== undefined) setRefSales(myData.refSales);
            }
          
            const refQ = query(collection(db, 'users'), where('referred_by', '==', user.uid));
            const snap = await getDocs(refQ);
            const myRefs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
            setMyReferrals(myRefs.sort((a,b) => new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime()));
            setRefSignups(myRefs.length);
          } catch(e) {
            console.error("Error fetching my referrals:", e);
          }
        };
        fetchMyReferrals();
      }
    }
  }, [tab, user]);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA install ready');
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      alert('✅ GOYE App installed! Find it on home screen!');
    });
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u?.email === 'goye@gasv.store') {
        setIsAdmin(true);
        localStorage.setItem('goye_admin_auth', 'true');
      } else if (u) {
        setIsAdmin(false);
        localStorage.removeItem('goye_admin_auth');
      }

      if (u) {
        try {
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const getCookieValue = (name: string) => document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
            const refCode = localStorage.getItem('active_referral') || getCookieValue('active_referral') || '';
            
            await setDoc(userRef, {
              name: u.displayName || u.email,
              email: u.email,
              uid: u.uid,
              referred_by: refCode,
              joinedAt: new Date().toISOString(),
              totalSpent: 0
            });
          }
        } catch (error) {
          console.error("Error saving user profile:", error);
        }
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check referral
    const refCode = params.get('ref');
    if (refCode && !sessionStorage.getItem('ref_counted')) {
      if (localStorage.getItem('goye_is_owner') === 'true' && refCode === 'GOYE') {
        alert("Owner mode: Your click NOT counted as customer - Use https://www.gasv.store without ref for browsing");
      } else if (localStorage.getItem('goye_is_owner') !== 'true') {
        localStorage.setItem('active_referral', refCode);
        document.cookie = `active_referral=${refCode}; path=/; max-age=2592000`;
        const currentClicks = parseInt(localStorage.getItem('referral_clicks') || '0', 10);
        localStorage.setItem('referral_clicks', (currentClicks + 1).toString());
      }
      sessionStorage.setItem('ref_counted', 'true');
    }

    // Admin
    if(params.get('admin') === 'GoyeBN3583773') {
      setShowAdminLogin(true);
    }
    if (localStorage.getItem('goye_admin_auth') === 'true') {
       setIsAdmin(true);
    }
  }, []);

  const handleCopyLink = (link: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => {
        alert('Link copied! Share and earn 20%');
        if (navigator.vibrate) navigator.vibrate(50);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link copied! Share and earn 20%');
        if (navigator.vibrate) navigator.vibrate(50);
      } catch (err) {
        console.error('Copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = (order: any) => {
    if (order.productName && order.productName.includes("FREE eBook")) {
      const content = "5 WAYS TO MAKE MONEY WITH AI 2024\n\nBy Goye Global & Sirwise AI Web3 Academy\nRC BN3583773\n\n1. AI Freelancing - Offer ChatGPT services on Fiverr $50-$500 per gig\n2. AI eBooks - Create eBooks with AI and sell on GOYE Store\n3. AI Course Creation - Teach what you learn\n4. eSIM Reselling - Buy $9.99 sell $19.99 worldwide\n5. Prompt Engineering - Sell prompts $5-$50\n\nFull 20-page guide available after download...\n\nContact: https://www.gasv.store - Support 24/7";
      const blob = new Blob([content], {type: "text/plain"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download="5_Ways_To_Make_Money_With_AI_2024_FREE_eBook.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      alert("✅ FREE eBook Downloaded! Check your Downloads folder!");
      return;
    }

    if (order.productName && order.productName.includes("Free eSIM 1GB Trial")) {
      alert("✅ Your Free Trial Code is already applied or can be used at checkout!\n\n" + order.productName);
      return;
    }

    alert(`Preview your purchase:\n\nYour eSIM / Premium Access will be sent to your email after Paystack verification.\nSave this receipt access file.`);
    const blob = new Blob([`Premium Digital Content Access\nProduct: ${order.productName}\nRef: ${order.ref}\n\nThank you for choosing GOYE Global Worldwide!\n\nAccess Link: https://www.gasv.store/access/${order.ref}`], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.productName.replace(/\s+/g, '_')}_Access.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [adminPassword, setAdminPassword] = useState('');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [freeItems, setFreeItems] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [allCompletedOrdersList, setAllCompletedOrdersList] = useState<any[]>([]);

  useEffect(() => {
    // Refresh pending orders and purchased items just in case
    const pOrders = JSON.parse(localStorage.getItem('goye_pending_orders') || '[]');
    setPendingOrders(pOrders);
    
    const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_free_downloads') || '[]');
    setPurchasedItems(purchased);
    // free is not loaded in purchasedItems anymore
    setFreeItems(freeDownloads);

    if (isAdmin) {
      let revenue = 0;
      let orderCount = 0;
      const uniqueEmails = new Set();
      const completedList: any[] = [];
      
      purchased.forEach((o: any) => {
        revenue += Number(o.price) || 0;
        orderCount++;
        if (o.email) uniqueEmails.add(o.email);
        completedList.push({ ...o, status: 'completed' });
      });

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('goye_order_')) {
          try {
            const orderData = JSON.parse(localStorage.getItem(key) || '{}');
            if (orderData.status === 'completed' || orderData.status === 'paid') {
              revenue += Number(orderData.price) || 0;
              orderCount++;
              if (orderData.email) uniqueEmails.add(orderData.email);
              completedList.push({ ...orderData, status: 'completed' });
            }
          } catch(e) {}
        }
      }

      const analyticsRaw = localStorage.getItem('goye_analytics');
      let views = 0;
      if (analyticsRaw) {
        try {
          const parsedAnalytics = JSON.parse(analyticsRaw);
          views = parsedAnalytics.totalViews || 0;
        } catch(e) {}
      }

      setTotalOrders(orderCount);
      setTotalRevenue(revenue);
      setActiveUsers(views || uniqueEmails.size + 1); // Fallback to unique emails + admin if no views
      setAllCompletedOrdersList(completedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [isAdmin, tab]);
  
  
  const combinedOrders = useMemo(() => {
    return [...pendingOrders.map(o => ({...o, status: 'pending'})), ...allCompletedOrdersList]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [pendingOrders, allCompletedOrdersList]);

  const handleTrackOrder = () => {
    if (!trackingRefInput.trim()) return;
    setTrackingStatus('loading');
    setTrackingResult(null);
    
    setTimeout(() => {
      let found = null;
      try {
        const pOrders = JSON.parse(localStorage.getItem('goye_pending_orders') || '[]');
        const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
        const freeDownloads = JSON.parse(localStorage.getItem('goye_downloads') || '[]');
        found = pOrders.find((o: any) => o.ref === trackingRefInput) || purchased.find((o: any) => o.ref === trackingRefInput) || freeDownloads.find((o: any) => o.title === trackingRefInput);
        
        if (!found) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('goye_order_')) {
              try {
                const orderData = JSON.parse(localStorage.getItem(key) || '{}');
                if (orderData.ref === trackingRefInput) {
                   found = orderData;
                   break;
                }
              } catch(e) {}
            }
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (found) {
        setTrackingResult(found);
        setTrackingStatus('found');
      } else {
        setTrackingStatus('not_found');
      }
    }, 1200);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') { console.log('Installed'); }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      alert('📱 To install GOYE App:\n\niPhone: Tap Share ↑ button → Add to Home Screen\n\nAndroid: Tap ⋮ Menu (top right) → Install app or Add to Home Screen\n\nOr use Chrome → Menu → Install GOYE Global');
    }
  };

  // Academy & Shop State
  const [academyCourses, setAcademyCourses] = useState<any[]>(ACADEMY_COURSES);
  const [esimProducts, setEsimProducts] = useState<any[]>(ESIM_PRODUCTS);

  // Payment settings state
  const [paystackKey, setPaystackKey] = useState('');
  const [paystackSecret, setPaystackSecret] = useState('');
  const [flutterwaveKey, setFlutterwaveKey] = useState('');
  const [flutterwaveSecret, setFlutterwaveSecret] = useState('');
  const [cryptoWallet, setCryptoWallet] = useState('0xaeed4e48f2146aadd07e85219f209053616e4e71');
  const [piWallet, setPiWallet] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showEsimVideoModal, setShowEsimVideoModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<{sender: string, text: string, cta?: string}[]>([{sender: 'ai', text: 'Welcome to Academy! Ask me anything about AI, Web3, Pi Network...'}]);
  const [formSubmitId, setFormSubmitId] = useState('b5ff137904e20ed9fbad829a69fc150b');
  const [bankDetails, setBankDetails] = useState('');
  
  // Eye toggles
  const [showPsSecret, setShowPsSecret] = useState(false);
  const [showFwSecret, setShowFwSecret] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({});

  
  const trackClick = (type: string, name: string, price: number = 0) => {
    if (localStorage.getItem('goye_is_owner') === 'true' || localStorage.getItem('goye_admin_session') === 'true' || window.location.search.includes('admin') || document.body.classList.contains('admin-mode')) {
      // Track as test click
      try {
        let testAnalytics = JSON.parse(localStorage.getItem('goye_test_analytics') || '{"totalClicks":0,"clicks":[]}');
        testAnalytics.totalClicks += 1;
        testAnalytics.clicks.push({type, name, price, time:new Date().toLocaleString()});
        localStorage.setItem('goye_test_analytics', JSON.stringify(testAnalytics));
      } catch(e) {}
      return; 
    }

    try {
      let analytics = JSON.parse(localStorage.getItem('goye_analytics') || '{"totalViews":0,"totalClicks":0,"dailyViews":{},"clicks":[],"links":{}}');
      const today = new Date().toISOString().split('T')[0];
      
      if(!analytics.links) analytics.links = {};
      if(!analytics.clicks) analytics.clicks = [];
      
      if(!analytics.links[name]) analytics.links[name] = {count:0, today:0, lastClick:''};
      
      analytics.links[name].count += 1;
      analytics.links[name].lastClick = new Date().toLocaleString();
      analytics.totalClicks = (analytics.totalClicks || 0) + 1;
      analytics.clicks.push({type, name, price, time:new Date().toLocaleString(), page:window.location.pathname});
      
      localStorage.setItem('goye_analytics', JSON.stringify(analytics));
      console.log('Tracked:', name, analytics.links[name].count);
    } catch(e) { console.error('Analytics error:', e); }
  };

  const openAnalytics = () => {
    try {
      const data = JSON.parse(localStorage.getItem('goye_analytics') || '{"totalViews":0,"totalClicks":0,"dailyViews":{},"clicks":[],"links":{}}');
      const testData = JSON.parse(localStorage.getItem('goye_test_analytics') || '{"totalClicks":0,"clicks":[]}');
      setAnalyticsData({...data, testData});
      setShowAnalyticsModal(true);
    } catch(e) {}
  };

  useEffect(() => {
    if (localStorage.getItem('goye_is_owner') === 'true' || localStorage.getItem('goye_admin_session') === 'true' || window.location.search.includes('admin')) {
      return; // Do not count owner views
    }
    try {
      let analytics = JSON.parse(localStorage.getItem('goye_analytics') || '{"totalViews":0,"totalClicks":0,"dailyViews":{},"clicks":[],"links":{}}');
      analytics.totalViews = (analytics.totalViews || 0) + 1;
      analytics.dailyViews = analytics.dailyViews || {};
      const today = new Date().toISOString().split('T')[0];
      analytics.dailyViews[today] = (analytics.dailyViews[today] || 0) + 1;
      localStorage.setItem('goye_analytics', JSON.stringify(analytics));
    } catch(e) {}

    const orders = JSON.parse(localStorage.getItem('goye_pending_orders') || '[]');
    setPendingOrders(orders);
    
    const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_free_downloads') || '[]');
    setPurchasedItems(purchased);
    setFreeItems(freeDownloads);
    
    setPaystackKey(localStorage.getItem('paystack_live_key') || '');
    setPaystackSecret(localStorage.getItem('paystack_secret_key') || '');
    setFlutterwaveKey(localStorage.getItem('flutterwave_live_key') || '');
    setFlutterwaveSecret(localStorage.getItem('flutterwave_secret_key') || '');
    setCryptoWallet(localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4e71');
    setPiWallet(localStorage.getItem('pi_wallet') || '');
    setFormSubmitId(localStorage.getItem('formsubmit_id') || 'b5ff137904e20ed9fbad829a69fc150b');
    
    const defaultBank = "💵 Payoneer USD First Citizens Bank 100 E Tryon St Charlotte NC 28202 USA\nAccount Name: Ifiok Enyiema\nAccount No: ...\nRouting: 026013356\nSWIFT: FCCOGB2L\nRef: GOYE+Email\n\n🏦 Naira Local Bank Name: Moniepoint\nAccount Name: GOYEDAGOSMESS ENTERPRISE\nAccount Number: ...";
    setBankDetails(localStorage.getItem('bank_details') || defaultBank);

    const savedCourses = JSON.parse(localStorage.getItem('sirwise_academy_subjects') || 'null');
    if (savedCourses && savedCourses[0] && savedCourses[0].price !== 49.99) { localStorage.removeItem('sirwise_academy_subjects'); setAcademyCourses(ACADEMY_COURSES); } else 
    if (savedCourses) setAcademyCourses(savedCourses);
    
    const savedProducts = JSON.parse(localStorage.getItem('goye_digital_products') || 'null');
    if (savedProducts && savedProducts.length < 20) { localStorage.removeItem('goye_digital_products'); setEsimProducts(ESIM_PRODUCTS); } else 
    if (savedProducts) setEsimProducts(savedProducts);

    setIsAdminAuth(localStorage.getItem('goye_admin_auth') === 'true');
  }, [tab]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'GoyeBN3583773') {
      setIsAdminAuth(true);
      localStorage.setItem('goye_admin_auth', 'true');
      setAdminPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const askAI = (overrideQ?: string) => {
    const qText = overrideQ || aiQuestion;
    if (!qText.trim()) return;
    const newMsgs = [...aiMessages, {sender: 'user', text: qText}];
    setAiMessages(newMsgs);
    if (!overrideQ) setAiQuestion('');
    
    setTimeout(() => {
      let answer = '';
      let cta = '';
      const q = qText.toLowerCase();
      
      if(q.includes('pi') || q.includes('gcv') || q.includes('314159')){
        answer = 'Pi GCV $314,159 is Global Consensus Value agreed by 60M+ Pioneers! This is your chance to cash out Pi at $314,159 not $0.50! In our Pi Network GCV Mastery ($49.99), I teach you: 1) How to lock GCV value 2) Pi to USD cashout via USA LLC 3) Stripe setup 4) Real buyers list. This course alone made students $3k+/month!';
        cta = '🎓 UNLOCK Pi GCV Mastery $49.99';
      }
      else if(q.includes('no money') || q.includes("don't have money") || q.includes('broke') || q.includes('no fund') || q.includes('teach me free') || q.includes('how to make money fast?')){
        answer = "I understand you dear! That's exactly why you NEED this Academy! Listen - 90% of my students started broke. Here's what I will do for you: 1) Start with '1000 Viral AI Prompts Make $1000/month' only $39.99 - Use my prompts, post on TikTok, make $50 in 48hrs. 2) Use that $50 to unlock Pi to Cashout Masterclass $79.99. 3) Cashout your Pi, make $500+. You don't need money, you need the RIGHT knowledge! I will hold your hand. Start small today?";
        cta = '🚀 Start with $39.99 - Make $1000/mo';
      }
      else if(q.includes('ai') || q.includes('mastery')){
        answer = 'AI Mastery is your golden ticket! I teach you how to use ChatGPT, Gemini, Claude to build businesses that print money while you sleep! Module 1: Prompt Engineering, Module 2: Build AI Agency $3k/mo, Module 3: Automate TikTok Shop USA. Lifetime access + my personal templates!';
        cta = '🤖 UNLOCK AI Mastery $49.99';
      }
      else if(q.includes('web3') || q.includes('blockchain')){
        answer = 'Web3 is the future! Web2 made Mark Zuckerberg billionaire, Web3 will make YOU! I teach: Smart Contract Deployment $20 course, WalletConnect 04b23511d6e09ef4e3512228bbe8b309, IPFS Hosting. Build dApps and charge $2k per project!';
        cta = '⛓️ UNLOCK Web3 Dev $59.99';
      }
      else if(q.includes('visa') || q.includes('uk') || q.includes('canada') || q.includes('usa') || q.includes('lmia') || q.includes('care')){
        answer = 'This is our BESTSELLER! UK Care Worker Visa Blueprint 2026 + COS List $89.99 - Real COS sponsors list 2026, cover letter template, interview answers! Canada LMIA 500 employers database! Students moved in 3 months! I give you direct employer emails!';
        cta = '🇬🇧 UNLOCK UK Visa $89.99 BESTSELLER';
      }
      else if(q.includes('make money') || q.includes('earn') || q.includes('income')){
        answer = 'You want to make money fast? Here is my 3-step formula I teach: Step 1: Canva 10k Etsy Templates $29.99 - Upload to Etsy, $10/sale. Step 2: Shopify 100 Winning Products $35.99 - Start dropshipping. Step 3: TikTok Shop USA/UK Setup $59.99 - $100/day. Which one fits your budget? I will mentor you!';
        cta = '💰 Start Earning Today';
      }
      else {
        answer = 'Great question! In this Academy, we cover all foundational and advanced concepts with practical hands-on! I have 26 courses including eSIM business, AI, Web3, Visa blueprints, Pi GCV $314,159. All lifetime access, 2 mins delivery, certificate! What skill do you want to learn first? Tell me your goal and I will recommend the perfect course for your budget!';
        cta = '🎓 See All Courses from $9.99';
      }
      
      setAiMessages([...newMsgs, {sender: 'ai', text: answer, cta: cta}]);
      setTimeout(() => {
        const chat = document.getElementById('ai-chat-container');
        if(chat) chat.scrollTop = chat.scrollHeight;
      }, 50);
    }, 800);
  };
  
  const openCheckoutFor = (text: string) => {
    const priceMatch = text.match(/\$(\d+\.\d+)/);
    if(priceMatch) {
      const p = parseFloat(priceMatch[1]);
      trackClick('ai', text, p);
      const matchedCourse = academyCourses.find(c => c.price === p) || esimProducts.find(e => e.price === p);
      if(matchedCourse) {
        setShowAiModal(false);
        setSelectedProduct(matchedCourse);
      }
    } else {
      trackClick('ai', text, 0);
      setShowAiModal(false);
      setTab('academy');
    }
  };
  
  const saveSettings = () => {
    localStorage.setItem('paystack_live_key', paystackKey);
    localStorage.setItem('paystack_secret_key', paystackSecret);
    localStorage.setItem('flutterwave_live_key', flutterwaveKey);
    localStorage.setItem('flutterwave_secret_key', flutterwaveSecret);
    localStorage.setItem('crypto_wallet', cryptoWallet);
    localStorage.setItem('pi_wallet', piWallet);
    localStorage.setItem('formsubmit_id', formSubmitId);
    localStorage.setItem('bank_details', bankDetails);
    
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    localStorage.removeItem('goye_admin_auth');
    if (tab.startsWith('admin')) setTab('home');
  };

  const hasPurchased = (id: string) => {
    if (id === 'ai-mastery') return true; // Module 1 is free
    return purchasedItems.some(item => item.id === id || item.productId === id);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 font-sans pb-24">
      {showSplash && (
        <div className="fixed inset-0 bg-[#000] z-[10000] flex flex-col items-center justify-center transition-opacity duration-500">
          <GoyeLogo size={180} className="mb-6 shadow-[0_0_50px_rgba(255,215,0,0.5)] rounded-full animate-pulse" />
          <h1 className="text-[#FFD700] text-2xl font-black tracking-widest text-center px-4">GOYE STORE GLOBAL</h1>
          <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mt-2">Sirwise AI Web3 Academy</p>
        </div>
      )}

      <header className="bg-[#000000] p-3 sticky top-0 z-[50] border-b border-[#222]" style={{position:'relative', pointerEvents:'auto'}}>
        <div className="flex justify-between items-center max-w-7xl mx-auto mb-3">
          <div className="text-left flex-1 flex items-start gap-3">
            <div
              className="relative z-[9999] pointer-events-auto cursor-pointer flex-shrink-0"
              title="Hold for Admin"
              onMouseDown={() => { const t = setTimeout(()=>setShowAdminLogin(true), 3000); adminPressTimer.current = t; }}
              onMouseUp={() => clearTimeout(adminPressTimer.current)}
              onMouseLeave={() => clearTimeout(adminPressTimer.current)}
              onTouchStart={() => { const t = setTimeout(()=>setShowAdminLogin(true), 3000); adminPressTimer.current = t; }}
              onTouchEnd={() => clearTimeout(adminPressTimer.current)}
            >
              <GoyeLogo size={48} />
            </div>
            <div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-bold text-lg sm:text-xl leading-tight">GOYE Global Worldwide</span>
              </div>
              <div className="text-[#888] text-[10px] sm:text-[11px] mt-1">
                RC: BN3583773 • <span className="text-[#FFD700]">www.gasv.store</span><br className="sm:hidden" /> • goye@gasv.store / goyedagosmess@gmail.com
              </div>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'8px', position:'relative', zIndex:100, pointerEvents:'auto'}}>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-[#FFD700] text-xs font-bold">{user.email}</div>
                  <div className="text-[#888] text-[10px] cursor-pointer hover:text-white" onClick={() => setTab('downloads')}>My Orders</div>
                </div>
                <button onClick={handleLogout} className="bg-[#222] text-gray-300 hover:text-white hover:bg-red-900/50 px-3 py-2 rounded-xl text-xs font-bold border border-[#333] transition">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                <UserCircle size={14} /> Login
              </button>
            )}
            <button 
              onClick={(e)=>{ e.stopPropagation(); console.log('QR clicked'); setShowQRModal(true); }} 
              style={{background:'#111', border:'2px solid #FFD700', color:'#FFD700', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
            >
              📷 QR
            </button>
            <button 
              onClick={(e)=>{ e.stopPropagation(); setShowScanner(true); }} 
              style={{background:'#111', border:'2px solid #10B981', color:'#10B981', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
            >
              🔍 Scan
            </button>
            <button 
              onClick={(e)=>{ e.stopPropagation(); setShowRecorder(true); }} 
              style={{background:'#222', border:'1px solid #444', color:'#fff', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
            >
              🎙️ Record
            </button>
            <button 
              onClick={(e)=>{ e.stopPropagation(); console.log('More clicked'); setShowAccessModal(true); }} 
              style={{background:'#222', border:'1px solid #444', color:'#fff', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
            >
              ••• More
            </button>
          </div>
        </div>
                <div className="flex justify-start sm:justify-center mt-4 overflow-x-auto pb-3 px-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-[#333] shadow-inner shrink-0">
<button onClick={() => setTab('home')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'home' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><Home size={14}/> Home</button>
            <button onClick={() => setTab('shop')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'shop' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><ShoppingBag size={14}/> Shop</button>
            <button onClick={() => setTab('esim')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'esim' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><Globe size={14}/> eSIM</button>
            <button onClick={() => setTab('academy')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'academy' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><GraduationCap size={14}/> Academy</button>
            <button onClick={() => setTab('contracts')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'contracts' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><FileText size={14}/> Contracts</button>
            <button onClick={() => setTab('prompts')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'prompts' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><MessageCircle size={14}/> Prompts</button>
            <button onClick={() => setTab('trackers')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'trackers' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><Activity size={14}/> Trackers</button>
            <button onClick={() => setTab('referrals')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'referrals' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><Users size={14}/> Referrals</button>
<button onClick={() => { trackClick('nav', 'My Downloads'); setTab('downloads'); }} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${tab === 'downloads' ? 'bg-[#FFD700] text-black shadow-md border border-[#e5c100]' : 'text-[#FFD700] hover:text-yellow-400 border border-transparent'}`}>
              <Download size={14}/> My Orders
            </button>
            {isAdmin && (
              <button onClick={() => setTab('admin')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ml-1 ${tab.startsWith('admin') ? 'bg-[#2a2a2a] text-[#FFD700] shadow-md border border-[#444]' : 'text-[#888] hover:text-[#FFD700] border border-transparent'}`}>
                <Settings size={14}/> Admin
              </button>
            )}
          </div>
        </div>
      </header>

      <main id="home" className="max-w-5xl mx-auto py-2 pb-[90px] relative z-10 touch-manipulation">
<div id="top"></div>
        {(tab === 'home' || tab === 'academy') && (
          <div className="animate-in fade-in duration-500">
            {tab === 'home' && <HeroSection onPlayVideo={() => setShowEsimVideoModal(true)} onLogoTap={()=>{
      const newCount = adminTapCount+1;
      setAdminTapCount(newCount);
      if(newCount>=5){ setShowAdminLogin(true); setAdminTapCount(0); }
      setTimeout(()=>setAdminTapCount(0), 3000);
    }} />}

    {tab === 'home' && (
      <>
        {/* Free Gifts / Lead Magnet */}
        <div className="px-4 mt-12 mb-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#8B5CF6]/10 border-2 border-[#FFD700] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-[#FFD700] text-black font-black text-[10px] rounded-bl-xl uppercase tracking-wider">Limited Time</div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,215,0,0.4)]">🎁</div>
              <h2 className="text-2xl font-black text-white">FREE GIFTS <span className="text-[#FFD700]">- Download Now</span></h2>
            </div>
            <p className="text-gray-300 text-sm mb-6">Start your journey today with our exclusive free resources.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/60 border border-[#333] p-4 rounded-xl flex flex-col">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="text-white font-bold text-sm mb-1">5 Ways to Make Money with AI 2024</h3>
                <p className="text-gray-400 text-xs mb-4 flex-1">Exclusive 20-page eBook guide.</p>
                <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); const content = "5 WAYS TO MAKE MONEY WITH AI 2024\n\nBy Goye Global & Sirwise AI Web3 Academy\nRC BN3583773\n\n1. AI Freelancing - Offer ChatGPT services on Fiverr $50-$500 per gig\n2. AI eBooks - Create eBooks with AI and sell on GOYE Store\n3. AI Course Creation - Teach what you learn\n4. eSIM Reselling - Buy $9.99 sell $19.99 worldwide\n5. Prompt Engineering - Sell prompts $5-$50\n\nFull 20-page guide available after download...\n\nContact: https://www.gasv.store - Support 24/7"; const blob = new Blob([content], {type:"text/plain"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="5_Ways_To_Make_Money_With_AI_2024_FREE_eBook.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); const downloads = JSON.parse(localStorage.getItem('goye_free_downloads')||'[]'); downloads.push({id:Date.now(), title:"5 Ways to Make Money with AI 2024 FREE eBook", type:"FREE", date:new Date().toLocaleString()}); localStorage.setItem('goye_free_downloads', JSON.stringify(downloads)); alert("✅ FREE eBook Downloaded! Check your Downloads folder! No payment needed!"); setTab("downloads"); setTimeout(() => window.scrollTo({top:0, behavior:"smooth"}), 100); }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition cursor-pointer">Download Free</button>
              </div>
              <div className="bg-black/60 border border-[#333] p-4 rounded-xl flex flex-col">
                <div className="text-2xl mb-2">📶</div>
                <h3 className="text-white font-bold text-sm mb-1">Free eSIM 1GB Trial</h3>
                <p className="text-gray-400 text-xs mb-4 flex-1">First 100 users only. Global data.</p>
                <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); const code="TRIAL-1GB-"+Math.random().toString(36).substr(2,5).toUpperCase(); const downloads=JSON.parse(localStorage.getItem('goye_free_downloads')||'[]'); downloads.push({id:Date.now(), title:"Free eSIM 1GB Trial Code: "+code, type:"FREE", date:new Date().toLocaleString()}); localStorage.setItem('goye_free_downloads', JSON.stringify(downloads)); alert("✅ Free Trial Claimed! Your Code: "+code+" - Use at checkout! Check DOWNLOADS tab!"); setTab("downloads"); setTimeout(() => window.scrollTo({top:0, behavior:"smooth"}), 100); }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition cursor-pointer">Claim Free Trial</button>
              </div>
              <div className="bg-black/60 border border-[#333] p-4 rounded-xl flex flex-col">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="text-white font-bold text-sm mb-1">Free AI Course Lesson</h3>
                <p className="text-gray-400 text-xs mb-4 flex-1">Watch Module 1 instantly.</p>
                <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); const m = document.getElementById("videoModal"); if(m) { m.style.display="flex"; m.innerHTML=`
<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left; position:relative; padding-bottom:120px;">
  <button onclick="document.getElementById('videoModal').style.display='none'" style="position:absolute; top:15px; right:15px; background:transparent; border:none; color:#aaa; font-size:24px; cursor:pointer;">×</button>
  <h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">GOYE Academy - AI Course</h2>
  <div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;">
    <p style="color:white; font-weight:bold; font-size:14px;">🎓 Sirwise AI WEB3 Academy - Internal Lesson</p>
    <p style="color:#aaa; font-size:11px;">RC BN3583773 - Goye Store Global - Sirwise AI verified</p>
  </div>
  
  <div style="background:linear-gradient(to bottom, #000, #222); width:100%; height:200px; display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px solid #FFD700; border-radius:12px; margin:15px 0;">
    <div style="font-size:36px; animation: pulse 2s infinite;">🤖 🧠 📈</div>
    <p style="color:#FFD700; margin-top:10px; font-weight:bold;">AI Mastery Course - Internal Demo</p>
    <div style="background:#FFD700; color:#000; width:100%; padding:5px; text-align:center; font-size:10px; font-weight:bold; margin-top:auto; border-bottom-left-radius:10px; border-bottom-right-radius:10px;">Internal Academy Content - GOYE Store Global</div>
  </div>

  <div style="background:#000; padding:15px; border-radius:10px;">
    <h3 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">Module 1: What is AI - By Sirwise AI WEB3 Academy</h3>
    <p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;">Artificial Intelligence (AI) is the simulation of human intelligence by software-coded heuristics. In this era, AI is not just a tool; it's a workforce.</p>
    <p style="color:white; font-size:14px; margin-bottom:10px; line-height:1.5;"><strong>Prompt Engineering 101:</strong><br/>Instead of asking "Write a blog", ask "Act as an expert copywriter. Write a 500-word blog about eSIMs focusing on travelers, using an engaging tone."</p>
    <p style="color:#FFD700; font-size:14px; margin-bottom:10px; line-height:1.5; font-style:italic;">Exercise: Open ChatGPT and try the prompt above. Notice the difference in quality!</p>
  </div>
  <p style="color:#666; font-size:10px; text-align:center; margin-top:10px; margin-bottom:20px;">This lesson stays inside GOYE Academy - No external YouTube - https://www.gasv.store</p>

  <div style="position:absolute; bottom:0; left:0; right:0; background:#111; padding:15px; border-top:1px solid #333; border-bottom-left-radius:16px; border-bottom-right-radius:16px; display:flex; flex-direction:column; gap:8px;">
    <button onclick="document.getElementById('videoModal').style.display='none'; window.location.hash='#academy';" style="background:#FFD700; color:#000; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Next Module - Unlock 26 Courses</button>
    <button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Close</button>
  </div>
</div>
`; } }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition flex justify-center items-center gap-1 cursor-pointer">Watch Free Lesson</button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="px-4 mt-12 mb-12 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">What Customers Say Worldwide</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex text-[#FFD700]">
                {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
              </div>
              <span className="text-white font-bold">4.9/5</span>
              <span className="text-gray-400 text-sm">(1,200+ Reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { flag: '🇳🇬', text: "I bought eSIM for UK travel - Instant QR in 2 minutes!", name: "Chinedu", location: "Lagos" },
              { flag: '🇬🇧', text: "AI Course changed my life - Now I earn $500 monthly", name: "Sarah", location: "London" },
              { flag: '🇳🇬', text: "UK Visa guide very helpful - Fast support.", name: "Ahmed", location: "Abuja" },
              { flag: '🇺🇸', text: "The Smart Contracts pack saved my startup thousands in legal fees.", name: "Michael", location: "New York" },
              { flag: '🇿🇦', text: "Best customer service. They helped me install the eSIM step by step.", name: "David", location: "Cape Town" },
              { flag: '🇨🇦', text: "Purchased the 10,000 Prompts pack. Absolutely incredible value.", name: "Emily", location: "Toronto" },
            ].map((t, i) => (
              <div key={i} className="bg-[#111] border border-[#333] p-5 rounded-2xl relative transition hover:border-[#FFD700]/50">
                <div className="absolute top-4 right-4 text-2xl opacity-80">{t.flag}</div>
                <div className="text-[#FFD700] text-xs mb-2">★★★★★</div>
                <p className="text-gray-300 text-sm italic mb-4">"{t.text}"</p>
                <p className="text-white font-bold text-xs">{t.name} <span className="text-gray-500 font-normal">- {t.location}</span></p>
                <div className="flex items-center gap-1 text-green-500 text-[10px] mt-1 font-bold">
                  <CheckCircle size={10} /> Verified Buyer
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
            
            <div id="academy" className="px-4 mt-8 mb-12">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">SIRWISE AI WEB3 ACADEMY</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Master AI, Web3 & Decentralized Future. Join the elite network of tomorrow's builders.</p>
              </div>
              
              {tab === 'academy' && (
              <div id="academy">
                <div className="flex flex-col items-center justify-center text-center mb-8 mt-4 animate-in zoom-in duration-500">
                  <GoyeLogo size={120} className="mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] rounded-full" />
                  <h2 className="text-[#FFD700] text-2xl md:text-3xl font-black max-w-lg">Goye Global & Sirwise AI Web3 Academy</h2>
                  <p className="text-white mt-2 font-bold uppercase tracking-widest text-sm">Trusted Worldwide</p>
                </div>
                <div className="bg-gradient-to-br from-[#111] to-[#222] border border-[#FFD700] rounded-[20px] p-5 mb-8 shadow-lg shadow-yellow-900/10 max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-[60px] h-[60px] min-w-[60px] bg-[#FFD700] rounded-full flex items-center justify-center text-3xl shadow-inner">🤖</div>
                  <div className="flex-1">
                    <h3 className="text-[#FFD700] text-lg md:text-xl font-bold m-0 leading-tight">Sirwise AI Instructor - Online</h3>
                    <p className="text-[#10B981] text-xs font-bold m-0 mt-0.5">● Live - Ready to teach you</p>
                    <p className="text-[#888] text-[10px] md:text-xs m-0 mt-1">Powered by GOYE Global AI • 24/7 Masterclass</p>
                  </div>
                  <button onClick={() => { trackClick('ai', 'Ask AI Instructor'); setShowAiModal(true); }} className="hidden md:flex bg-[#FFD700] hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-xs items-center gap-2 transition">
                    <MessageCircle size={14}/> Ask AI Instructor
                  </button>
                </div>
                
                <div className="mt-4 bg-black rounded-[15px] p-4 border border-[#333]">
                  <p className="text-white text-sm italic">"Hello! I'm Sirwise, your AI Web3 Instructor. I've been trained on 10,000+ hours of AI, Blockchain & Pi Network. Which masterclass will we start today? 🚀"</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => { trackClick('ai', 'AI Quick: Pi GCV'); setAiQuestion('What is Pi GCV $314,159?'); setShowAiModal(true);}} className="bg-[#222] hover:bg-[#333] text-[#FFD700] border border-[#FFD700]/50 px-3 py-1.5 rounded-full text-[10px] transition">What is Pi GCV $314,159?</button>
                    <button onClick={() => { trackClick('ai', 'AI Quick: AI Mastery'); setAiQuestion('Explain AI Mastery'); setShowAiModal(true);}} className="bg-[#222] hover:bg-[#333] text-white border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">Explain AI Mastery</button>
                    <button onClick={() => { trackClick('ai', 'AI Quick: Web3'); setAiQuestion('Web3 Career Path?'); setShowAiModal(true);}} className="bg-[#222] hover:bg-[#333] text-white border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">Web3 Career Path?</button>
                  </div>
                </div>
                
                <button onClick={() => { trackClick('ai', 'Ask AI Instructor'); setShowAiModal(true); }} className="md:hidden mt-4 w-full bg-[#FFD700] text-black px-4 py-3 rounded-xl font-bold text-xs flex justify-center items-center gap-2">
                  <MessageCircle size={16}/> Ask AI Instructor
                </button>
              </div>
              </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {academyCourses.map(course => {
                  const unlocked = hasPurchased(course.id);
                  return (
                    <div key={course.id} className={`bg-[#111] border rounded-2xl p-6 flex flex-col relative ${unlocked ? 'border-green-500/50' : 'border-[#333]'}`}>
                      {unlocked ? (
                        <div className="absolute top-4 right-4 text-green-400 border border-green-500/50 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle size={12}/> UNLOCKED
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 text-[#FFD700] border border-[#FFD700]/50 bg-[#FFD700]/10 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                          <Lock size={12}/> LOCKED
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center text-center">
                        <div className={`text-5xl mb-4 ${!unlocked ? 'blur-[2px] opacity-70' : ''}`}>{course.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                        <div className="text-xs text-[#FFD700] font-bold mb-1">🎓 Lifetime Access • 12 Courses</div>
                        <div className="text-xs text-gray-400 mb-3">⭐ 4.9 (2,341 students) BESTSELLER</div>
                        
                        <div className="bg-black border-l-2 border-[#FFD700] p-3 mt-1 mb-3 rounded-r-lg w-full text-left">
                          <p className="text-[#FFD700] text-[10px] font-bold mb-1 flex items-center gap-1">🤖 AI Instructor Note:</p>
                          <p className="text-gray-300 text-[10px] italic">"This module will take you from beginner to pro in 3 hours. 80% practical!" - Sirwise</p>
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-4">{course.description}</p>
                        
                        <div className="text-2xl font-black text-white mb-1">${course.price}</div>
                      </div>

                      {unlocked ? (
                        <div className="mt-auto space-y-2">
                          <div className="bg-[#222] border border-[#333] rounded-lg p-3 mb-3 flex items-center gap-3">
                            <div className="bg-green-500/20 text-green-500 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                              <Video size={14}/>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white mb-0.5">▶️ AI Instructor Intro</div>
                              <div className="text-[10px] text-gray-400">2 mins • Core Module</div>
                            </div>
                            <button className="ml-auto bg-white/10 text-white p-1.5 rounded-md hover:bg-white/20"><Download size={12}/></button>
                          </div>
                          <div className="bg-black border border-[#333] rounded-lg p-3 mb-3">
                            <div className="text-[10px] text-gray-400 font-bold mb-2 uppercase">AI Generated Curriculum</div>
                            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1"><CheckCircle size={12} className="text-green-500"/> Foundational Basics</div>
                            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1"><CheckCircle size={12} className="text-green-500"/> Practical Scenarios</div>
                            <div className="flex items-center gap-2 text-xs text-gray-300"><CheckCircle size={12} className="text-gray-600"/> AI Quiz Verification</div>
                          </div>
                          
                          <p className="text-center text-[10px] text-green-400/70 mt-2 flex items-center justify-center gap-1"><CheckCircle size={10}/> Lifetime Access • Downloadable</p>
                        </div>
                      ) : (
                        <div className="mt-auto pt-4 border-t border-white/5">
                          <div className="text-xs text-gray-500 space-y-1 mb-4">
                            <div className="flex items-center gap-2"><Video size={12}/> 12 Videos Locked</div>
                            <div className="flex items-center gap-2"><FileText size={12}/> 5 PDFs Locked</div>
                            <div className="flex items-center gap-2"><GraduationCap size={12}/> Certificate Locked</div>
                          </div>
                          <button 
                            onClick={() => { trackClick('academy', course.name, course.price); setSelectedProduct(course); }}
                            className="w-full bg-[#FFD700] text-black font-black uppercase text-[10px] md:text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition"
                          >
                            <Lock size={14}/> GET INSTANT ACCESS &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 mt-12 mx-auto max-w-3xl text-center">
              <h2 className="text-white text-xl font-bold mb-4">🛡️ ABOUT GOYE GLOBAL</h2>
              <p className="text-gray-400 text-sm mb-4">We are a globally recognized digital academy and eSIM provider connecting 190+ countries instantly.</p>
              <div className="bg-black p-4 rounded-xl border border-[#FFD700] inline-block mb-4">
                <img src={REAL_QR} alt="GOYE Official QR" className="w-32 h-32 mx-auto rounded-lg mb-2 bg-white p-1" />
                <p className="text-[#FFD700] font-bold text-xs">Our Official QR</p>
                <p className="text-gray-400 text-[10px]">Scan to Verify</p>
              </div>
              <p className="text-white font-bold text-sm">RC BN3583773 <span onClick={() => setShowAdminLogin(true)} style={{cursor: 'pointer', padding: '5px', opacity: 0.3}}><Lock size={12} className="inline" /></span></p>
              <p className="text-[#FFD700] text-xs font-bold mt-1">https://www.gasv.store</p>
            </div>

          </div>
        )}

        {(tab === 'home' || tab === 'esim') && (
          <div id="esim" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Instant Global eSIM Data</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Get connected in 190+ countries. Zero roaming fees. Instant QR code delivery to your email in under 2 minutes after payment verification.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {esimProducts.filter(p => p.id.includes('esim') || p.name.toLowerCase().includes('esim')).map(product => {
                const unlocked = hasPurchased(product.id);
                return (
                  <div key={product.id} className={`bg-[#111] border rounded-2xl p-4 flex flex-col ${unlocked ? 'border-green-500/50' : 'border-[#333]'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2"><span className="text-3xl">{product.flag || '🌐'}</span>{product.badge && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">{product.badge}</span>}{product.bestseller && !product.badge && <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">BESTSELLER</span>}</div>
                      <span className="bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">{product.days || '30 Days'}</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1 leading-tight min-h-[40px]">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{product.data || '5GB'} High-Speed Data</p>
                    
                    <div className="mt-auto pt-3 border-t border-white/5">
                      <div className="text-xl font-black text-[#FFD700] mb-1">${product.price}</div>
                      {unlocked ? (
                        <div className="flex flex-col gap-2">
                          <button className="w-full bg-green-500/20 text-green-400 text-[10px] py-2 rounded-lg font-bold border border-green-500/30">
                            ✅ UNLOCKED
                          </button>
                          <button className="w-full bg-[#222] text-white text-[10px] py-1.5 rounded-lg flex justify-center items-center gap-1">
                            <Download size={12}/> Download QR
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { trackClick('esim', product.name, product.price); setSelectedProduct(product); }}
                          className="w-full bg-[#FFD700] text-black font-black uppercase text-[10px] md:text-xs py-2.5 rounded-xl flex items-center justify-center gap-1"
                        >
                          BUY ESIM <ChevronRight size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(tab === 'home' || tab === 'shop') && (
          <div id="shop" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Digital Shop</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Premium digital assets, masterclasses, and software tools. Instant delivery.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {esimProducts.filter(p => !(p.id.includes('esim') || p.name.toLowerCase().includes('esim'))).map(product => {
                const unlocked = hasPurchased(product.id);
                return (
                  <div key={product.id} className={`bg-[#111] border rounded-2xl p-4 flex flex-col ${unlocked ? 'border-green-500/50' : 'border-[#333]'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2"><span className="text-3xl">{product.flag || '💻'}</span>{product.badge && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">{product.badge}</span>}{product.bestseller && !product.badge && <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">BESTSELLER</span>}</div>
                      <span className="bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">Lifetime</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1 leading-tight min-h-[40px]">{product.name}</h3>
                    
                    
                    <div className="mt-auto pt-3 border-t border-white/5">
                      <div className="text-xl font-black text-[#FFD700] mb-1">${product.price}</div>
                      {unlocked ? (
                        <div className="flex flex-col gap-2">
                          <button className="w-full bg-green-500/20 text-green-400 text-[10px] py-2 rounded-lg font-bold border border-green-500/30">
                            ✅ UNLOCKED
                          </button>
                          <button className="w-full bg-[#222] text-white text-[10px] py-1.5 rounded-lg flex justify-center items-center gap-1">
                            <Download size={12}/> Download
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { trackClick('shop', product.name, product.price); setSelectedProduct(product); }}
                          className="w-full bg-[#FFD700] text-black font-black uppercase text-[10px] md:text-xs py-2.5 rounded-xl flex items-center justify-center gap-1"
                        >
                          BUY NOW <ChevronRight size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'downloads' && (
          <div className="max-w-3xl mx-auto px-4 animate-in fade-in">
            <h2 id="downloads" className="text-2xl font-black text-white mb-6 flex items-center gap-2 pt-6">
              <ShieldCheck className="text-green-500"/> My Downloads
            </h2>
            
            {/* Free Gifts Section */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-l-4 border-green-500 pl-2">
                🎁 FREE GIFTS - No Payment
              </h3>
              {freeItems.length === 0 ? (
                <div className="bg-[#111] border border-green-500/10 p-4 rounded-xl text-center text-gray-500 text-sm">
                  No free gifts claimed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {freeItems.map((item, i) => (
                    <div key={i} className="bg-[#111] border border-green-500/30 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500"/> {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Claimed: {item.date}</p>
                      </div>
                      <button onClick={() => { const handleFreeDownload = (title) => {    if (title.includes("eBook")) {      const content = "5 WAYS TO MAKE MONEY WITH AI 2024\n\nBy Goye Global & Sirwise AI Web3 Academy\nRC BN3583773\n\n1. AI Freelancing - Offer ChatGPT services on Fiverr $50-$500 per gig\n2. AI eBooks - Create eBooks with AI and sell on GOYE Store\n3. AI Course Creation - Teach what you learn\n4. eSIM Reselling - Buy $9.99 sell $19.99 worldwide\n5. Prompt Engineering - Sell prompts $5-$50\n\nFull 20-page guide available after download...\n\nContact: https://www.gasv.store - Support 24/7";      const blob = new Blob([content], {type: "text/plain"});      const url = URL.createObjectURL(blob);      const a = document.createElement("a"); a.href=url; a.download="5_Ways_To_Make_Money_With_AI_2024_FREE_eBook.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);      alert("✅ FREE eBook Downloaded! Check your Downloads folder!");    } else {      alert("✅ Free Trial Code applied: " + title);    }  }; handleFreeDownload(item.title); }} className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto shrink-0 w-full md:w-auto">
                        <Download size={14}/> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paid Purchases Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-l-4 border-[#FFD700] pl-2">
                💳 MY PAID PURCHASES
              </h3>
              {purchasedItems.length === 0 ? (
                <div className="bg-[#111] border border-white/10 p-8 rounded-2xl text-center text-gray-400">
                  <Lock className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                  <p>No purchases yet. Your unlocked items will appear here forever.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchasedItems.map((order, i) => (
                    <div key={i} className="bg-[#111] border border-[#FFD700]/20 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-white font-bold text-lg flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#FFD700]"/> {order.productName}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Order Ref: <span className="font-mono text-[#FFD700]">{order.ref}</span> • {new Date(order.purchaseDate || order.date).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto z-[100] relative">
                        <button onClick={() => { const handlePaidDownload = (order) => {    const m = document.getElementById("videoModal");     if(m) {       m.style.display="flex";       m.innerHTML=`<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left;"><h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">💳 Access Details: Paid Verified</h2><div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;"><p style="color:white; font-weight:bold; font-size:14px;">${order.productName}</p><p style="color:#aaa; font-size:11px;">Ref: ${order.ref}</p></div><div style="background:#000; padding:15px; border-radius:10px;"><p style="color:white; font-size:14px; margin-bottom:8px;">✅ Payment Confirmed (Paystack/Flutterwave/Crypto)</p><p style="color:white; font-size:14px; margin-bottom:8px;">📧 QR Code / Access Link sent to your email.</p><p style="color:white; font-size:14px; margin-bottom:8px;">Need help? Contact support.</p></div><button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:8px; border-radius:8px; margin-top:8px; cursor:pointer;">Close</button></div>`;     }  }; handlePaidDownload(order); }} className="flex-1 md:flex-none px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 rounded-lg text-xs font-bold hover:bg-[#FFD700]/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                          <CheckCircle size={14}/> View Details
                        </button>
                        <button onClick={() => alert('Access link has been resent to your email!')} className="flex-1 md:flex-none px-4 py-2 bg-[#222] text-white border border-[#333] rounded-lg text-xs hover:bg-[#333] transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                          <Mail size={14}/> Resend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

                {(tab === 'home' || tab === 'contracts') && (
          <div id="contracts" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Contract Generator</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Generate legal NDAs, Service Agreements, and Web3 Contracts powered by AI.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                {id: 'contract-nda', name: 'Non-Disclosure Agreement (NDA)', price: 14.99, icon: '🔒'},
                {id: 'contract-sa', name: 'Service Agreement', price: 19.99, icon: '📝'},
                {id: 'contract-web3', name: 'Web3 Token Smart Contract', price: 49.99, icon: '⛓️'},
              ].map(contract => {
                const unlocked = hasPurchased(contract.id);
                return (
                  <div key={contract.id} className={`bg-[#111] border rounded-2xl p-5 flex flex-col ${unlocked ? 'border-green-500/50' : 'border-[#333]'}`}>
                    <div className="text-4xl mb-3">{contract.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{contract.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">Instant AI-generated legal document tailored to your specific details. Includes watermark-free PDF download.</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                      <div className="text-xl font-black text-[#FFD700]">${contract.price}</div>
                      {unlocked ? (
                        <button className="bg-green-500/20 text-green-400 text-xs px-4 py-2 rounded-xl font-bold border border-green-500/30">
                          ✅ UNLOCKED
                        </button>
                      ) : (
                        <button onClick={() => { trackClick('contracts', contract.name, contract.price); setGeneratingContract(contract); }} className="bg-[#FFD700] text-black font-black text-xs px-4 py-2 rounded-xl">
                          GENERATE
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {(tab === 'home' || tab === 'prompts') && (
          <div id="prompts" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Prompt Store</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Battle-tested AI system prompts & code starter kits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                {id: 'prompt-marketing', name: 'Viral Marketing Prompt Kit', price: 9.99, icon: '📈'},
                {id: 'prompt-dev', name: 'Senior Dev Copilot System', price: 12.99, icon: '💻'},
                {id: 'prompt-startup', name: 'Startup Pitch Deck Generator', price: 15.99, icon: '🚀'},
              ].map(prompt => {
                const unlocked = hasPurchased(prompt.id);
                return (
                  <div key={prompt.id} className={`bg-[#111] border rounded-2xl p-5 flex flex-col ${unlocked ? 'border-green-500/50' : 'border-[#333]'}`}>
                    <div className="text-4xl mb-3">{prompt.icon}</div>
                    <h3 className="text-base font-bold text-white mb-2">{prompt.name}</h3>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                      <div className="text-lg font-black text-[#FFD700]">${prompt.price}</div>
                      {unlocked ? (
                        <button className="bg-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-green-500/30">
                          ✅ UNLOCKED
                        </button>
                      ) : (
                        <button onClick={() => { trackClick('prompts', prompt.name, prompt.price); setSelectedProduct(prompt); }} className="bg-[#FFD700] text-black font-black text-xs px-3 py-1.5 rounded-xl">
                          BUY NOW
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'trackers' && (
          <div className="max-w-3xl mx-auto px-4 animate-in fade-in mt-4 mb-8">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
               📦 Order Trackers
            </h2>
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center transition-all">
              <p className="text-gray-400 mb-4 text-sm">Enter your order reference (e.g. REF-...) to track the status of your digital delivery or eSIM provisioning.</p>
              <div className="flex gap-2 max-w-md mx-auto mb-6">
                <input 
                  type="text" 
                  value={trackingRefInput}
                  onChange={(e) => setTrackingRefInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
                  placeholder="Enter Order Ref" 
                  className="flex-1 bg-black border border-[#333] p-3 rounded-xl text-white focus:border-[#FFD700] focus:outline-none transition-colors" 
                />
                <button 
                  onClick={handleTrackOrder}
                  disabled={trackingStatus === 'loading' || !trackingRefInput.trim()}
                  className={`bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold transition-all ${trackingStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
                >
                  {trackingStatus === 'loading' ? 'Searching...' : 'Track'}
                </button>
              </div>

              {trackingStatus === 'loading' && (
                <div className="animate-in fade-in slide-in-from-top-4 flex flex-col items-center justify-center py-8">
                  <div className="w-10 h-10 border-4 border-[#333] border-t-[#FFD700] rounded-full animate-spin mb-4"></div>
                  <p className="text-[#FFD700] font-bold text-sm">Locating your order...</p>
                </div>
              )}

              {trackingStatus === 'not_found' && (
                <div className="animate-in fade-in slide-in-from-top-4 bg-red-900/20 border border-red-500/50 p-4 rounded-xl max-w-md mx-auto">
                  <p className="text-red-400 font-bold mb-1">Order Not Found</p>
                  <p className="text-gray-400 text-xs">We couldn't find an order with that reference. Please check and try again.</p>
                </div>
              )}

              {trackingStatus === 'found' && trackingResult && (
                <div className="animate-in fade-in slide-in-from-top-4 bg-black border border-[#333] rounded-xl p-5 max-w-md mx-auto text-left shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80} className="text-[#10B981]"/></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${trackingResult.status === 'completed' || trackingResult.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {trackingResult.status ? trackingResult.status.toUpperCase() : 'COMPLETED'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Order Date</p>
                      <p className="text-white text-xs">{new Date(trackingResult.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#222] pt-4 mb-4 relative z-10">
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Product Details</p>
                    <p className="text-[#FFD700] font-bold text-lg mb-1">{trackingResult.productName || trackingResult.product}</p>
                    <p className="text-white text-sm font-mono">{trackingResult.ref}</p>
                  </div>

                  <div className="bg-[#111] p-3 rounded-lg border border-[#222] relative z-10">
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#10B981]" />
                      Delivery Sent to: <span className="text-white font-medium">{trackingResult.email}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'referrals' && (
          <div className="max-w-3xl mx-auto px-4 animate-in fade-in mt-4 mb-8">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                 🤝 Referral Dashboard
              </h2>
            </div>
            
            {/* Top Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#111] border border-[#333] p-4 rounded-xl text-center">
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Clicks</p>
                <p className="text-white text-2xl font-black">{refClicks}</p>
              </div>
              <div className="bg-[#111] border border-[#333] p-4 rounded-xl text-center">
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Signups</p>
                <p className="text-white text-2xl font-black">{refSignups}</p>
              </div>
              <div className="bg-[#111] border border-[#333] p-4 rounded-xl text-center">
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Sales</p>
                <p className="text-[#FFD700] text-2xl font-black">{refSales}</p>
              </div>
              <div className="bg-gradient-to-br from-[#111] to-[#222] border border-[#10B981]/50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Pending Balance</p>
                <p className="text-[#10B981] text-2xl font-black">${refBalance.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Link Box */}
              <div className="bg-[#111] border border-[#FFD700]/50 p-5 rounded-2xl shadow-lg shadow-yellow-900/10 flex flex-col justify-center">
                <h3 className="text-[#FFD700] text-lg font-bold mb-2">Earn 20% on Every Sale!</h3>
                <p className="text-gray-400 text-xs mb-4 flex-1">Share your unique link. When someone buys an eSIM or course, you earn cash directly to your wallet.</p>
                
                <div className="bg-black border border-[#333] p-3 rounded-xl flex items-center justify-between gap-2 z-[100] relative">
                  <span className="text-white font-mono text-[10px] truncate">https://www.gasv.store/?ref={user ? user.uid : 'GOYE'}</span>
                  <button onClick={() => handleCopyLink(`https://www.gasv.store/?ref=${user ? user.uid : 'GOYE'}`)} className="bg-[#FFD700] hover:bg-yellow-400 text-black px-3 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer pointer-events-auto transition">Copy Link</button>
                </div>
                
                <button onClick={() => {
                  if (refBalance >= 20) {
                    alert(`Payout request sent! Minimum $20. Your balance: $${refBalance.toFixed(2)}`);
                  } else {
                    alert(`Need $20 minimum to payout. Your balance: $${refBalance.toFixed(2)}`);
                  }
                }} className="w-full mt-4 bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 z-[100] relative cursor-pointer pointer-events-auto">
                  <Wallet size={14}/> Request Payout
                </button>
              </div>

              {/* History */}
              <div className="bg-[#111] border border-[#333] p-5 rounded-2xl">
                <h3 className="text-white text-sm font-bold mb-4 flex items-center justify-between">
                  Recent Activity <span className="text-[10px] text-gray-500 font-normal">Last 30 days</span>
                </h3>
                <div className="space-y-3">
                  {refHistory.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-[#333] rounded-xl">
                      No referral activity yet.<br/>Share your link to earn 20%.
                    </div>
                  ) : (
                    refHistory.map(item => (
                      <div key={item.id} className="flex justify-between items-center border-b border-[#222] pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="text-white text-xs font-bold">{item.action}</p>
                          <p className="text-gray-500 text-[9px]">{item.user} • {item.date}</p>
                        </div>
                        <div className={`text-xs font-bold ${item.amount === '---' ? 'text-gray-600' : 'text-[#10B981]'}`}>
                          {item.amount}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* My Referred Users */}
            <div className="mt-6 bg-[#111] border border-[#333] p-5 rounded-2xl">
              <h3 className="text-white text-sm font-bold mb-4">My Referred Users</h3>
              <div className="space-y-3 z-[100] relative">
                {myReferrals.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-[#333] rounded-xl">
                    No users have signed up under your link yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-gray-400 uppercase font-bold">
                        <tr>
                          <th className="p-3">User</th>
                          <th className="p-3">Joined Date</th>
                          <th className="p-3">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {myReferrals.map((r, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="p-3 font-medium text-white">{r.name || r.email?.split("@")[0]}</td>
                            <td className="p-3 text-gray-400">{new Date(r.joinedAt).toLocaleDateString()}</td>
                            <td className="p-3 text-[#10B981] font-bold">${(r.totalSpent || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            
            {/* Promo materials */}
            <div className="mt-6 bg-[#0a0a0a] border border-[#222] p-5 rounded-2xl">
               <h3 className="text-white text-sm font-bold mb-3">Quick Promo Scripts</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-[100] relative">
                 <div className="bg-black p-3 rounded-xl border border-[#333]">
                   <p className="text-gray-400 text-[10px] italic mb-2">"Traveling soon? Get 5GB global data instantly without roaming fees. Use my link..."</p>
                   <button onClick={() => handleCopyLink(`Traveling soon? Get 5GB global data instantly without roaming fees. Use my link: https://www.gasv.store/?ref=${user ? user.uid : 'GOYE'}`)} className="text-[#FFD700] text-[10px] font-bold cursor-pointer pointer-events-auto hover:text-yellow-400">Copy Script</button>
                 </div>
                 <div className="bg-black p-3 rounded-xl border border-[#333]">
                   <p className="text-gray-400 text-[10px] italic mb-2">"Master AI & Web3 development today at SIRWISE Academy. Join here..."</p>
                   <button onClick={() => handleCopyLink(`Master AI & Web3 development today at SIRWISE Academy. Join here: https://www.gasv.store/?ref=${user ? user.uid : 'GOYE'}`)} className="text-[#FFD700] text-[10px] font-bold cursor-pointer pointer-events-auto hover:text-yellow-400">Copy Script</button>
                 </div>
               </div>
            </div>

          </div>
        )}

        {tab === 'legal-tos' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Terms of Service</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Digital Product Delivery</strong><br/>All products purchased on GOYE Store Global (including eSIMs, Academy Courses, and Digital Toolkits) are 100% digital. Upon successful payment verification (via Paystack, Flutterwave, Crypto, or Pi GCV), you will receive instant access to your product. For eSIMs, a QR code will be emailed to you securely.</p>
              <p><strong>2. Access & Usage</strong><br/>Purchased courses and downloads are tied to the email used during checkout. You may not distribute, resell, or share access links to premium content. Doing so will result in immediate revocation of your access without refund.</p>
              <p><strong>3. Payment Verification</strong><br/>Instant gateways (Paystack, Flutterwave) provide immediate access. Manual verification methods (Crypto USDC, Pi GCV, Bank Transfer) require on-chain or manual confirmation by our administration team before access is granted. This process is usually completed within 24 hours.</p>
            </div>
          </div>
        )}

        {tab === 'legal-privacy' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Privacy Policy</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Data Collection</strong><br/>We only collect information necessary to process your orders and deliver digital goods. This includes your name, email address, and order history.</p>
              <p><strong>2. Payment Security</strong><br/>All payments are processed securely through certified gateways (Paystack, Flutterwave). We do not store or process your credit card details on our servers.</p>
              <p><strong>3. Data Protection</strong><br/>Your data is strictly protected and never sold to third-party marketers. We may use your email to send updates related to your purchases or important security notices regarding your account.</p>
            </div>
          </div>
        )}

        {tab === 'legal-refund' && (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] animate-in fade-in max-w-4xl mx-auto mb-10">
            <h2 className="text-[#FFD700] text-2xl font-bold mb-4 border-b border-[#333] pb-2">Refund Policy</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <p><strong>1. Digital Goods Non-Refundable</strong><br/>Due to the nature of digital goods (eSIMs, PDF guides, courses, prompts), all sales are strictly final. Once an access link, course login, or eSIM QR code has been generated and delivered, the product cannot be returned.</p>
              <p><strong>2. Failed Delivery Exceptions</strong><br/>In the rare event of a system failure where your payment is confirmed but you do not receive the product within 48 hours, please contact our support team. We will verify the transaction and manually issue your product.</p>
              <p><strong>3. Unauthorized Purchases</strong><br/>If you suspect an unauthorized purchase was made using your payment method, please contact your bank or payment provider immediately. We cooperate fully with fraud investigations.</p>
            </div>
          </div>
        )}

        </main>
      {toast.show && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-black border-2 border-[#FFD700] text-white px-6 py-3 rounded-xl font-bold shadow-2xl animate-in slide-in-from-top-4">{toast.message}</div>}

      

            {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#111] border-t border-[#333] flex items-center overflow-x-auto p-2 z-[1000] pb-safe scrollbar-hide pointer-events-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('home'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('top')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'home' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Home size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">HOME</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('shop'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'shop' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <ShoppingBag size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">SHOP</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('esim'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('esim')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'esim' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Globe size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">eSIM</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('academy'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('academy')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'academy' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <GraduationCap size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">ACADEMY</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('contracts'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('contracts')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'contracts' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <FileText size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">CONTRACTS</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); setTab('home'); setActiveSection('prompts'); setTimeout(() => { if(false) window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('prompts')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${activeSection === 'prompts' && tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <MessageCircle size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">PROMPTS</div>
        </button>
<button onClick={(e) => { e.preventDefault(); trackClick('nav', 'My Downloads'); setTab('downloads'); window.scrollTo({top:0, behavior:"smooth"}); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${tab === 'downloads' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Download size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">DOWNLOADS</div>
        </button>
        <button onClick={(e) => { e.preventDefault(); window.location.href="https://wa.me/2348033584736?text=Hello GOYE Support"; }} className="text-center flex flex-col items-center justify-center p-1 min-w-[70px] text-[#888] hover:text-[#FFD700] cursor-pointer">
          <MessageCircle size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold">SUPPORT</div>
        </button>
        {isAdmin && (
          <button onClick={() => setTab('admin')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab.startsWith('admin') ? 'text-[#FFD700]' : 'text-[#888]'}`}>
            <Settings size={20} className="mb-1 mx-auto"/>
            <div className="text-[9px] font-bold">ADMIN</div>
          </button>
        )}
      </div>

      {/* Floating 24/7 AI Tutor Widget */}
      <button 
        onClick={() => { trackClick('ai', 'Floating AI Tutor'); setShowAiModal(true); }}
        style={{ width: "56px", height: "56px" }} className="fixed bottom-[90px] right-[16px] z-[998] bg-[#FFD700] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform cursor-pointer pointer-events-auto"
      >
        <div className="relative">
          <span className="text-2xl">🤖</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111] animate-pulse pointer-events-none"></div>
        </div>
      </button>

      {/* Footer */}
      <footer className="bg-black border-t border-[#333] pt-8 pb-32 px-4 relative z-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h3 className="text-[#FFD700] font-bold text-xl mb-1 flex items-center justify-center md:justify-start gap-2">
              <Globe size={20}/> GOYE Global Worldwide
            </h3>
            <p className="text-gray-400 text-xs">RC BN3583773 • Certified Global Digital Merchant</p>
          </div>
          
          <div className="flex flex-col gap-2 items-center md:items-end">
            <a href="https://www.gasv.store" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] text-sm transition">www.gasv.store</a>
            <a href="mailto:goye@gasv.store" className="text-gray-400 hover:text-white text-sm transition">goye@gasv.store</a>
            <div className="flex gap-4 my-2">
              <button onClick={(e) => { e.preventDefault(); setTab('legal-tos'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-gray-400 hover:text-[#FFD700] text-xs transition cursor-pointer pointer-events-auto">Terms</button>
              <button onClick={(e) => { e.preventDefault(); setTab('legal-privacy'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-gray-400 hover:text-[#FFD700] text-xs transition cursor-pointer pointer-events-auto">Privacy</button>
              <button onClick={(e) => { e.preventDefault(); setTab('legal-refund'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-gray-400 hover:text-[#FFD700] text-xs transition cursor-pointer pointer-events-auto">Refunds</button>
            </div>
            <a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" className="mt-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition pointer-events-auto cursor-pointer">
              <MessageCircle size={16}/> WhatsApp Support
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 flex flex-wrap justify-center gap-3">
          <span className="bg-[#111] text-gray-500 text-[10px] px-2 py-1 rounded border border-[#222]">Paystack Secured</span>
          <span className="bg-[#111] text-gray-500 text-[10px] px-2 py-1 rounded border border-[#222]">Flutterwave Verified</span>
          <span className="bg-[#111] text-[#FFD700]/50 text-[10px] px-2 py-1 rounded border border-[#FFD700]/20">USDC Accepted</span>
          <span className="bg-[#111] text-[#FFD700]/50 text-[10px] px-2 py-1 rounded border border-[#FFD700]/20">Pi GCV Accepted</span>
        </div>
        
        <div className="mt-8 text-center text-[#555] text-[10px]">
          &copy; 2026 GOYE Global Worldwide. All Rights Reserved.
        </div>
      </footer>

      {/* Modal overlays */}
      {generatingContract && <ContractGeneratorModal contract={generatingContract} onClose={() => setGeneratingContract(null)} onCheckout={(c: any) => setSelectedProduct(c)} />}

      {showAnalyticsModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
            <div className="bg-[#000] border-2 border-[#FFD700] rounded-[20px] p-5 w-full max-w-2xl relative flex flex-col h-[80vh] max-h-[700px] overflow-y-auto">
              <button onClick={() => setShowAnalyticsModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
              <h2 className="text-[#FFD700] text-xl font-bold mb-4">📊 GOYE Analytics - RC BN3583773</h2>
              
              <div className="mb-4 bg-[#FFD700]/10 border border-[#FFD700]/30 p-3 rounded-lg text-xs text-[#FFD700]">
                <strong>OWNER TIP:</strong> You are in Owner Mode - Your clicks are NOT counted. Browse your store via <code>https://www.gasv.store</code> (without ?ref) to avoid confusion. Share <code>https://www.gasv.store/?ref=GOYE</code> only with customers.
              </div>
                
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#111] rounded-[15px] p-4 border border-[#333]">
                  <p className="text-[#888] text-xs font-bold mb-1">REAL CUSTOMER VIEWS</p>
                  <h2 className="text-[#FFD700] text-3xl font-black">{analyticsData?.totalViews || 0}</h2>
                  <p className="text-[#10B981] text-xs mt-1">Today: {analyticsData?.dailyViews?.[new Date().toISOString().split('T')[0]] || 0}</p>
                </div>
                <div className="bg-[#111] rounded-[15px] p-4 border border-[#333]">
                  <p className="text-[#888] text-xs font-bold mb-1">REAL CUSTOMER CLICKS</p>
                  <h2 className="text-[#10B981] text-3xl font-black">{analyticsData?.totalClicks || 0}</h2>
                  <p className="text-[#888] text-xs mt-1">Conversion: {((analyticsData?.totalClicks / (analyticsData?.totalViews || 1)) * 100 || 0).toFixed(1)}%</p>
                </div>
              </div>

              <h3 className="text-white font-bold mb-3">🔥 Top Clicked Links (What REAL people want most):</h3>
              <div className="bg-[#111] rounded-[15px] p-3 border border-[#333] mb-6">
                {Object.entries(analyticsData?.links || {}).sort((a: any, b: any) => b[1].count - a[1].count).map(([name, data]: any) => (
                  <div key={name} className="flex justify-between items-center border-b border-[#222] last:border-0 py-2">
                    <span className="text-white text-sm">{name}</span>
                    <div className="text-right">
                      <div className="text-[#FFD700] font-bold text-xs">{data.count} clicks</div>
                      <div className="text-[#888] text-[10px]">{data.lastClick}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-white font-bold mb-3">🕒 Recent Real Customer Clicks:</h3>
              <div className="bg-[#111] rounded-[15px] p-3 border border-[#333] max-h-[200px] overflow-y-auto mb-6">
                {analyticsData?.clicks?.slice(-20).reverse().map((c: any, i: number) => (
                  <div key={i} className="text-[#ccc] text-xs py-1.5 border-b border-[#222] last:border-0 flex justify-between">
                    <span>{c.name} {c.price ? '- $' + c.price : ''}</span>
                    <span className="text-[#888] text-[10px] text-right">{c.time}</span>
                  </div>
                ))}
                {!analyticsData?.clicks?.length && <div className="text-gray-500 text-xs py-2 text-center">No real customer clicks yet.</div>}
              </div>

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-500 font-bold">🧪 My Test Clicks (Owner Excluded Data):</h3>
                <span className="text-gray-600 text-xs">Total: {analyticsData?.testData?.totalClicks || 0}</span>
              </div>
              <div className="bg-[#111] rounded-[15px] p-3 border border-[#333] max-h-[150px] overflow-y-auto mb-6 opacity-60">
                {analyticsData?.testData?.clicks?.slice(-10).reverse().map((c: any, i: number) => (
                  <div key={i} className="text-gray-500 text-xs py-1.5 border-b border-[#222] last:border-0 flex justify-between">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-right">{c.time}</span>
                  </div>
                ))}
                {!analyticsData?.testData?.clicks?.length && <div className="text-gray-600 text-xs py-2 text-center">No test clicks.</div>}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { navigator.clipboard.writeText(JSON.stringify(analyticsData, null, 2)); alert('Analytics copied!'); }}
                  className="bg-[#FFD700] hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-xs flex-1 transition"
                >
                  📋 Copy Data
                </button>
                <button 
                  onClick={() => { 
                    if(window.confirm('Clear all REAL analytics? (Cannot be undone)')){ 
                      localStorage.removeItem('goye_analytics'); 
                      setAnalyticsData({...analyticsData, totalViews:0, totalClicks:0, dailyViews:{}, clicks:[], links:{}});
                    }
                  }}
                  className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-xl font-bold text-xs border border-[#333] transition"
                >
                  🗑️ Clear Real
                </button>
                <button 
                  onClick={() => { 
                    if(window.confirm('Clear your test clicks?')){ 
                      localStorage.removeItem('goye_test_analytics'); 
                      setAnalyticsData({...analyticsData, testData: {totalClicks:0, clicks:[]}});
                    }
                  }}
                  className="bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-xl font-bold text-xs border border-red-900/50 transition"
                >
                  Clear My Tests
                </button>
              </div>
              <p className="text-[#888] text-[10px] mt-4 text-center">💡 Pro Tip: Use Bitly or tinyurl for external YouTube links to track YouTube clicks too! RC BN3583773</p>
            </div>
          </div>
        )}
        
        
      
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4">
          <div className="bg-[#000] border-2 border-[#FFD700] rounded-[20px] p-5 w-full max-w-md relative flex flex-col h-[80vh] max-h-[600px]">
            <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">🤖 Sirwise AI Instructor</h3>
            <p className="text-xs text-[#10B981] mb-4">● Live - Powered by GOYE Global</p>
            
            <div id="ai-chat-container" className="flex-1 overflow-y-auto bg-[#111] rounded-[15px] p-4 mb-4 flex flex-col gap-3 border border-[#333]">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${msg.sender === 'ai' ? 'bg-[#222] text-gray-200 self-start border-l-2 border-[#FFD700] max-w-[85%]' : 'bg-[#FFD700] text-black self-end font-medium max-w-[85%]'}`}>
                  {msg.sender === 'ai' && <b className="text-[#FFD700] text-xs block mb-1">Sirwise:</b>}
                  {msg.text}
                  {msg.cta && (
                    <button 
                      onClick={() => openCheckoutFor(msg.cta)}
                      className="bg-[#FFD700] text-black px-4 py-2 rounded-full font-bold text-xs mt-2 border-none cursor-pointer hover:bg-yellow-500 transition"
                    >
                      {msg.cta} →
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 mb-1">
                <button onClick={() => askAI("😢 I don't have money")} className="bg-[#222] hover:bg-[#333] text-gray-300 border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">😢 I don't have money</button>
                <button onClick={() => askAI("💰 How to make money fast?")} className="bg-[#222] hover:bg-[#333] text-gray-300 border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">💰 Make money fast</button>
                <button onClick={() => askAI("π What is Pi GCV?")} className="bg-[#222] hover:bg-[#333] text-gray-300 border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">π What is Pi GCV?</button>
                <button onClick={() => askAI("🇬🇧 UK Visa")} className="bg-[#222] hover:bg-[#333] text-gray-300 border border-[#333] px-3 py-1.5 rounded-full text-[10px] transition">🇬🇧 UK Visa</button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiQuestion} 
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askAI()}
                  placeholder="Ask Sirwise anything..." 
                  className="flex-1 bg-[#111] border border-[#333] p-3 rounded-xl text-white focus:border-[#FFD700] focus:outline-none text-sm"
                />
                <button onClick={() => askAI()} className="bg-[#FFD700] text-black px-5 py-3 rounded-xl font-bold">Send</button>
              </div>
            </div>
            <p className="text-[#888] text-[10px] text-center mt-3">AI Instructor powered by GOYE • Answers in 0.5s • RC BN3583773</p>
          </div>
        </div>
      )}
      
    
      {/* QR Modal */}
      {showScanner && (
        <QRScannerModal 
          onClose={() => setShowScanner(false)} 
          onScan={(text) => {
            if (text.includes('gasv.store') || text.includes('goye')) {
              alert('GOYE Code detected! Continuing to store features...');
              // Could navigate to specific product if text matches ID
            } else if (text.startsWith('http')) {
              if (window.confirm('Open scanned link?\n' + text)) {
                window.location.href = text;
              }
            } else {
              alert('Scanned Data:\n' + text);
            }
          }}
        />
      )}
      {showQRModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:99999, display:'flex', justifyContent:'center', alignItems:'center', padding:'20px'}} onClick={()=>setShowQRModal(false)}>
          <div style={{background:'linear-gradient(180deg,#1a1a1a,#000)', border:'3px solid #FFD700', borderRadius:'25px', padding:'30px', textAlign:'center', maxWidth:'360px', boxShadow:'0 0 40px rgba(255,215,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            <div style={{background:'#fff', padding:'12px', borderRadius:'18px', display:'inline-block'}}>
              <img src={REAL_QR} style={{width:'240px', height:'240px', display:'block'}} />
            </div>
            <h3 style={{color:'#FFD700', marginTop:'18px', fontSize:'18px'}}>GOYE Global Worldwide</h3>
            <p style={{color:'#fff', fontWeight:'bold', marginTop:'5px'}}>RC BN3583773</p>
            <p style={{color:'#888', fontSize:'12px'}}>www.gasv.store • goye@gasv.store</p>
            <div style={{background:'#111', borderRadius:'12px', padding:'10px', marginTop:'15px'}}>
              <p style={{color:'#10B981', fontSize:'11px'}}>✅ Scan with phone camera to open store</p>
            </div>
            <button onClick={()=>setShowQRModal(false)} style={{background:'#FFD700', color:'#000', border:'none', padding:'12px 30px', borderRadius:'25px', fontWeight:'bold', marginTop:'18px', cursor:'pointer', width:'100%'}}>Close</button>
          </div>
        </div>
      )}

      {/* Access Options Modal */}
      {showRecorder && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:99999, display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} onClick={()=>setShowRecorder(false)}>
          <div style={{background:'#111', border:'2px solid #FFD700', borderRadius:'22px', padding:'25px', maxWidth:'350px', width:'100%', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff', marginBottom:'15px'}}>Quick Voice Recorder</h3>
            <div style={{background:'#000', borderRadius:'50%', width:'100px', height:'100px', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', border: isRecording ? '3px solid #ef4444' : '3px solid #333', animation: isRecording ? 'pulse 1.5s infinite' : 'none'}}>
              <span style={{fontSize:'40px'}}>{isRecording ? '🔴' : '🎙️'}</span>
            </div>
            {isRecording ? (
              <button onClick={() => { setIsRecording(false); alert('Recording saved locally!'); setRecordedAudio('saved'); }} style={{background:'#ef4444', color:'#fff', border:'none', padding:'12px 30px', borderRadius:'25px', fontWeight:'bold', cursor:'pointer', width:'100%', marginBottom:'10px'}}>Stop Recording</button>
            ) : (
              <button onClick={() => { setIsRecording(true); setRecordedAudio(null); }} style={{background:'#10B981', color:'#fff', border:'none', padding:'12px 30px', borderRadius:'25px', fontWeight:'bold', cursor:'pointer', width:'100%', marginBottom:'10px'}}>Start Recording</button>
            )}
            {recordedAudio && (
              <div style={{background:'#222', padding:'10px', borderRadius:'10px', marginBottom:'10px', fontSize:'12px', color:'#10B981'}}>
                Audio recorded successfully!
              </div>
            )}
            <button onClick={()=>setShowRecorder(false)} style={{background:'#222', color:'#fff', border:'none', width:'100%', padding:'12px', borderRadius:'25px', cursor:'pointer', fontWeight:'bold'}}>Close</button>
          </div>
        </div>
      )}

      {/* Access Options Modal */}
      {showAccessModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:99999, display:'flex', justifyContent:'center', alignItems:'center', padding:'15px', overflowY:'auto'}} onClick={()=>setShowAccessModal(false)}>
          <div style={{background:'#111', border:'1px solid #333', borderRadius:'22px', padding:'22px', maxWidth:'400px', width:'100%', boxShadow:'0 10px 40px rgba(0,0,0,0.8)'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff', textAlign:'center', marginBottom:'18px'}}>Quick Access</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <div onClick={() => window.open('https://www.gasv.store', '_blank')} style={{background:'#000', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #222', cursor:'pointer'}}>
                <div><p style={{color:'#fff', fontSize:'14px', margin:0, fontWeight:'bold'}}>🌐 Website</p><p style={{color:'#FFD700', fontSize:'12px', margin:0}}>https://www.gasv.store</p></div>
                <button onClick={(e)=>{e.stopPropagation(); handleCopyLink('https://www.gasv.store');}} style={{background:'#222', color:'#FFD700', border:'none', padding:'6px 12px', borderRadius:'12px', fontSize:'12px', cursor:'pointer'}}>Copy</button>
              </div>
              <div onClick={() => window.open('https://www.google.com/search?q=GOYE+Global+Worldwide', '_blank')} style={{background:'#000', borderRadius:'14px', padding:'14px', border:'1px solid #222', cursor:'pointer'}}>
                <p style={{color:'#fff', fontSize:'14px', margin:0, fontWeight:'bold'}}>🔍 Google</p><p style={{color:'#888', fontSize:'12px', margin:0}}>Search "GOYE Global Worldwide" - 1st result</p>
              </div>
              <div onClick={() => window.open('https://wa.me/2348033584736?text=Hello GOYE Support', '_blank')} style={{background:'#000', borderRadius:'14px', padding:'14px', border:'1px solid #222', cursor:'pointer'}}>
                <p style={{color:'#fff', fontSize:'14px', margin:0, fontWeight:'bold'}}>💬 WhatsApp</p><p style={{color:'#25D366', fontSize:'12px', margin:0}}>Type GOYE for catalog - Buy inside WhatsApp</p>
              </div>
              <div style={{background:'linear-gradient(135deg,#1a1a1a,#000)', border:'2px solid #FFD700', borderRadius:'14px', padding:'14px', textAlign:'center'}}>
                <p style={{color:'#FFD700', fontSize:'14px', fontWeight:'bold', margin:0}}>📷 QR Code</p>
                <img src={REAL_QR} style={{width:'110px', height:'110px', background:'#fff', padding:'5px', borderRadius:'10px', margin:'10px auto'}} />
                <p style={{color:'#888', fontSize:'10px', margin:0}}>Scan with camera</p>
              </div>
              <div style={{background:'#000', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #222'}}>
                <div><p style={{color:'#fff', fontSize:'14px', margin:0, fontWeight:'bold'}}>📲 Install App</p><p style={{color:'#888', fontSize:'12px', margin:0}}>Add to home screen</p></div>
                <button onClick={handleInstall} style={{background:'#FFD700', color:'#000', border:'none', padding:'6px 12px', borderRadius:'12px', fontSize:'12px', fontWeight:'bold', cursor:'pointer'}}>{isInstallable ? 'Install Now' : 'Install'}</button>
              </div>
            </div>
            <button onClick={()=>setShowAccessModal(false)} style={{background:'#222', color:'#fff', border:'none', width:'100%', padding:'12px', borderRadius:'14px', marginTop:'18px', cursor:'pointer', fontWeight:'bold'}}>Close</button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <UnifiedCheckoutModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            setTab('downloads');
            setSelectedProduct(null);
          }}
        />
      )}

      
      {/* Admin Login Modal */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/95 z-[100000] flex justify-center items-center p-5 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#111] border border-[#FFD700]/30 rounded-2xl p-8 max-w-[340px] w-full text-center shadow-2xl shadow-yellow-900/20 relative">
            <div className="mx-auto bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-[#FFD700]/20">
              <Lock size={24} className="text-[#FFD700]" />
            </div>
            <h3 className="text-[#FFD700] text-xl font-black mb-1">Admin Access</h3>
            <p className="text-gray-400 text-xs mb-6">Secured by RC BN3583773</p>
            
            <input 
              id="adminPass"
              type="password" 
              placeholder="Enter Master Password" 
              autoFocus
              className={`w-full p-3 rounded-xl border ${adminError ? 'border-red-500 bg-red-500/5' : 'border-[#333] bg-black'} text-white text-center focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all placeholder:text-gray-600`}
              onKeyDown={(e)=>{ 
                setAdminError('');
                if(e.key==='Enter'){ 
                  const v=e.currentTarget.value; 
                  if(v==='GoyeBN3583773'){ 
                    setIsAdmin(true); 
                    localStorage.setItem('goye_admin_auth', 'true'); 
                    localStorage.setItem('goye_is_owner', 'true');
                    localStorage.setItem('goye_admin_session', 'true');
                    if (!localStorage.getItem('goye_owner_device_id')) {
                      localStorage.setItem('goye_owner_device_id', 'owner_' + Date.now());
                    }
                    setShowAdminLogin(false);
                    if(!tab.startsWith('admin')) setTab('admin'); 
                  } else { 
                    setAdminError('Invalid credentials');
                  } 
                } 
              }}
            />
            
            <div className="h-6 mt-1 flex items-start justify-center">
              {adminError && <p className="text-red-400 text-[10px] font-bold animate-in fade-in">{adminError}</p>}
            </div>

            <button 
              onClick={()=>{ 
                const el = document.getElementById('adminPass') as HTMLInputElement; 
                if(!el) return;
                const v=el.value; 
                if(v==='GoyeBN3583773'){ 
                  setIsAdmin(true); 
                  localStorage.setItem('goye_admin_auth', 'true'); 
                  localStorage.setItem('goye_is_owner', 'true');
                  localStorage.setItem('goye_admin_session', 'true');
                  if (!localStorage.getItem('goye_owner_device_id')) {
                    localStorage.setItem('goye_owner_device_id', 'owner_' + Date.now());
                  }
                  setShowAdminLogin(false);
                  if(!tab.startsWith('admin')) setTab('admin'); 
                } else {
                  setAdminError('Invalid credentials');
                } 
              }} 
              className="bg-[#FFD700] hover:bg-yellow-400 text-black border-none w-full py-3 rounded-xl font-black cursor-pointer transition-colors mt-2 flex items-center justify-center gap-2"
            >
              Authenticate
            </button>
            
            <button 
              onClick={()=>{setShowAdminLogin(false); setAdminError('');}} 
              className="text-gray-500 hover:text-white text-xs mt-6 transition-colors"
            >
              Cancel Return
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel (Full Screen Modal) */}
      {isAdmin && (
        <div style={{position:'fixed', inset:0, background:'#000', zIndex:100000, overflowY:'auto', padding:'20px'}}>
          <div style={{maxWidth:'800px', margin:'0 auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{color:'#FFD700'}}>🔒 Admin Panel - RC BN3583773</h2>
              <button onClick={()=>{ setIsAdmin(false); setShowAdminLogin(false); localStorage.removeItem('goye_admin_auth'); localStorage.setItem('goye_admin_session', 'false'); setTab('home'); }} style={{background:'#f00', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'10px', cursor:'pointer'}}>✕ Close Admin</button>
            </div>
                          <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-6">
                  <h2 className="text-2xl font-black text-white">Admin Dashboard</h2>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={() => setTab('admin-academy')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin-academy' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      🎓 Manage Academy
                    </button>
                    <button onClick={() => setTab('admin-products')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin-products' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      🛍️ Manage Products
                    </button>
                    <button onClick={() => setTab('admin')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      <List size={14}/> Orders
                    </button>
                    <button onClick={() => setTab('admin-users')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin-users' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      <Users size={14}/> Users
                    </button>
                    <button onClick={() => setTab('admin-settings')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin-settings' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      <Settings size={14}/> Settings
                    </button>
                  </div>
                </div>

                <div className="mb-8 bg-[#FFD700]/10 border border-[#FFD700]/30 p-4 rounded-xl text-xs text-[#FFD700] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="text-2xl">🚨</div>
                  <div>
                    <strong className="block text-sm mb-1">OWNER TIP: You are in Owner Mode</strong>
                    Your clicks are NOT counted. Browse your store via <code>https://www.gasv.store</code> (without ?ref) to avoid confusion. Share <code>https://www.gasv.store/?ref=GOYE</code> only with customers.
                  </div>
                </div>

                {/* Dashboard KPI Overview - Always Visible in Admin */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><List size={40} className="text-white"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Total Orders</p>
                    <p className="text-white text-3xl font-black z-10">{totalOrders}</p>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={40} className="text-[#FFD700]"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Total Revenue</p>
                    <p className="text-[#FFD700] text-3xl font-black z-10">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={40} className="text-white"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Active Users</p>
                    <p className="text-white text-3xl font-black z-10">{activeUsers}</p>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#10B981]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={40} className="text-[#10B981]"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">System Status</p>
                    <p className="text-[#10B981] text-lg font-black z-10 mt-1">100% HEALTHY</p>
                  </div>
                </div>

                {tab === 'admin' && (
                  <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">All Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                          <tr>
                            <th className="p-4">Ref</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Method & Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {combinedOrders.map((order, i) => (
                            <tr key={i} className="hover:bg-white/[0.02]">
                              <td className="p-4 font-mono text-[#FFD700] text-xs">{order.ref}</td>
                              <td className="p-4">
                                <div className="font-bold text-white">{order.fullName || order.name || 'Customer'}</div>
                                <div className="text-xs text-gray-400">{order.email}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-white text-xs">{order.productName || order.product}</div>
                                <div className="text-[#10B981] font-bold text-xs">${order.price}</div>
                              </td>
                              <td className="p-4 flex flex-col gap-1 items-start">
                                <span className="uppercase text-[10px] px-2 py-1 bg-white/10 rounded">{order.method || order.gateway || 'Unknown'}</span>
                                <span className={`uppercase text-[10px] px-2 py-1 rounded font-bold ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-gray-500">{new Date(order.date).toLocaleString()}</td>
                              <td className="p-4">
                                <button 
                                  onClick={() => {
                                    const template = `Subject: Your Digital Delivery from GOYE Global (Order ${order.ref})

Dear ${order.fullName || order.name || 'Customer'},

Thank you for your order with GOYE Global Worldwide!
Product: ${order.productName || order.product}
Order Ref: ${order.ref}
Status: ${order.status?.toUpperCase() || 'COMPLETED'}

To access your digital product, please click the secure link below:
https://www.gasv.store/access/${order.ref}

If you require any support, please reply to this email or contact us via our WhatsApp.

Best regards,
GOYE Global Admin Team
RC BN3583773
www.gasv.store`;
                                    navigator.clipboard.writeText(template);
                                    alert('Professional Email Template Copied to Clipboard!');
                                  }}
                                  className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition"
                                >
                                  📧 Email
                                </button>
                              </td>
                            </tr>
                          ))}
                          {combinedOrders.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-gray-500">No orders yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'admin-users' && (
                  <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">Referred Users Analytics</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                          <tr>
                            <th className="p-4">User Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Referred By Code</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4">Total Spent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {dbUsers.map((u, i) => (
                            <tr key={i} className="hover:bg-white/[0.02]">
                              <td className="p-4 font-medium text-white">{u.name || 'Unknown'}</td>
                              <td className="p-4 text-gray-400">{u.email}</td>
                              <td className="p-4">
                                {u.referred_by ? (
                                  <span className="bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded text-xs font-mono">{u.referred_by}</span>
                                ) : (
                                  <span className="text-gray-600">-</span>
                                )}
                              </td>
                              <td className="p-4 text-gray-400">{new Date(u.joinedAt).toLocaleDateString()}</td>
                              <td className="p-4 text-[#10B981] font-bold">${(u.totalSpent || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                          {dbUsers.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-500">No users found in database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'admin-settings' && (
                  <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
                    <button 
                      onClick={openAnalytics}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 mb-6 border-none cursor-pointer"
                    >
                      📊 VIEW ANALYTICS - How Many Clicked My Links
                    </button>
                    
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Lock size={18} className="text-[#FFD700]"/> 🔐 SECRET KEYS (Backend Hidden)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <h4 className="text-[#FFD700] font-bold border-b border-[#333] pb-2">Gateways</h4>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Paystack Public Live</label>
                          <input type="text" value={paystackKey} onChange={e => setPaystackKey(e.target.value)} placeholder="pk_live_..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Paystack Secret Live</label>
                          <div className="relative">
                            <input type={showPsSecret ? "text" : "password"} value={paystackSecret} onChange={e => setPaystackSecret(e.target.value)} placeholder="sk_live_..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none pr-10"/>
                            <button onClick={() => setShowPsSecret(!showPsSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                              {showPsSecret ? <EyeOff size={14}/> : <Eye size={14}/>}
                            </button>
                          </div>
                        </div>
                        <div className="pt-2">
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Flutterwave Public Live</label>
                          <input type="text" value={flutterwaveKey} onChange={e => setFlutterwaveKey(e.target.value)} placeholder="FLWPUBK-..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Flutterwave Secret Live</label>
                          <div className="relative">
                            <input type={showFwSecret ? "text" : "password"} value={flutterwaveSecret} onChange={e => setFlutterwaveSecret(e.target.value)} placeholder="FLWSECK-..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none pr-10"/>
                            <button onClick={() => setShowFwSecret(!showFwSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                              {showFwSecret ? <EyeOff size={14}/> : <Eye size={14}/>}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[#FFD700] font-bold border-b border-[#333] pb-2">Manual & Webhooks</h4>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">USDC Wallet Address</label>
                          <input type="text" value={cryptoWallet} onChange={e => setCryptoWallet(e.target.value)} className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Pi Network Wallet (GCV)</label>
                          <input type="text" value={piWallet} onChange={e => setPiWallet(e.target.value)} placeholder="GA..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Bank Details (Payoneer USD + Naira Local)</label>
                          <textarea value={bankDetails} onChange={e => setBankDetails(e.target.value)} className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-[10px] focus:border-[#FFD700] focus:outline-none h-24 whitespace-pre-wrap leading-tight"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">FormSubmit ID (Webhooks)</label>
                          <input type="text" value={formSubmitId} onChange={e => setFormSubmitId(e.target.value)} placeholder="b5ff..." className="w-full bg-black border border-[#333] p-2 rounded-lg text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"/>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={saveSettings}
                      className="w-full py-4 bg-[#FFD700] hover:bg-yellow-500 text-black font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {savedSettings ? <><CheckCircle size={18}/> Saved LIVE Mode Active!</> : <><Save size={18}/> Save All</>}
                    </button>
                  </div>
                )}

                {tab === 'admin-academy' && (
                  <div className="bg-[#111] rounded-2xl border border-[#FFD700]/50 p-6 shadow-lg shadow-yellow-900/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Manage Academy Courses</h3>
                        <p className="text-gray-400 text-xs mt-1">Add, edit, or remove courses from the Academy catalog.</p>
                      </div>
                      <button className="bg-[#FFD700] hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                        <Plus size={14}/> Add Course
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {academyCourses.map(course => (
                        <div key={course.id} className="bg-black border border-[#333] hover:border-[#FFD700]/30 transition-colors p-4 rounded-xl flex items-start gap-4">
                          <div className="text-3xl bg-[#111] min-w-[48px] h-12 flex items-center justify-center rounded-lg">{course.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm mb-1 truncate">{course.name}</h4>
                            <p className="text-[#FFD700] font-bold text-xs mb-2">${course.price}</p>
                            <p className="text-gray-500 text-[10px] line-clamp-2">{course.features?.join(' • ')}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#222] transition-colors" title="Edit"><Edit size={14}/></button>
                            <button className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-[#222] transition-colors" title="Delete"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'admin-products' && (
                  <div className="bg-[#111] rounded-2xl border border-green-500/50 p-6 shadow-lg shadow-green-900/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Manage Digital Products & eSIMs</h3>
                        <p className="text-gray-400 text-xs mt-1">Configure pricing, regions, and delivery details.</p>
                      </div>
                      <button className="bg-[#10B981] hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                        <Plus size={14}/> Add Product
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {esimProducts.map(product => (
                        <div key={product.id} className="bg-black border border-[#333] hover:border-[#10B981]/30 transition-colors p-4 rounded-xl flex items-start gap-4">
                          <div className="text-3xl bg-[#111] min-w-[48px] h-12 flex items-center justify-center rounded-lg">{product.flag}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm mb-1 truncate">{product.name}</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-[#10B981] font-bold text-xs">${product.price}</span>
                              <span className="text-gray-300 text-[10px] bg-[#222] px-2 py-0.5 rounded-full border border-[#444]">{product.data}</span>
                              <span className="text-gray-300 text-[10px] bg-[#222] px-2 py-0.5 rounded-full border border-[#444]">{product.days} Days</span>
                            </div>
                            <p className="text-gray-500 text-[10px] line-clamp-2">{product.desc}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#222] transition-colors" title="Edit"><Edit size={14}/></button>
                            <button className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-[#222] transition-colors" title="Delete"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

          </div>
        </div>
      )}

      <footer id="support" style={{background:'linear-gradient(180deg,#0a0a0a 0%,#000 100%)', borderTop:'3px solid #FFD700', padding:'0', marginTop:'50px', overflow:'hidden'}}>
        {/* Top gold shine line */}
        <div style={{height:'2px', background:'linear-gradient(90deg, transparent, #FFD700, transparent)'}}></div>
        
        <div style={{padding:'35px 15px 20px'}}>
          <div style={{maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'30px', alignItems:'start'}}>
            
            {/* QR Column - Premium Card */}
            <div style={{background:'radial-gradient(circle at top, #1a1a1a, #000)', border:'2px solid #FFD700', borderRadius:'20px', padding:'22px', textAlign:'center', boxShadow:'0 0 30px rgba(255,215,0,0.15)', position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, #FFD700, transparent)'}}></div>
              <h4 style={{color:'#FFD700', fontSize:'15px', marginBottom:'15px', letterSpacing:'1px'}}>✨ OFFICIAL QR CODE</h4>
              <div style={{background:'#fff', padding:'10px', borderRadius:'16px', display:'inline-block', boxShadow:'0 5px 20px rgba(0,0,0,0.3)'}}>
                <img src={REAL_QR} style={{width:'150px', height:'150px', display:'block', borderRadius:'8px'}} />
              </div>
              <p style={{color:'#fff', fontWeight:'bold', marginTop:'14px', fontSize:'14px'}}>GOYE Global Worldwide</p>
              <p 
  style={{color:'#FFD700', fontSize:'13px', fontWeight:'bold', userSelect:'none', cursor:'pointer'}}
  onMouseDown={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
  onMouseUp={() => clearTimeout(adminPressTimer.current)}
  onMouseLeave={() => clearTimeout(adminPressTimer.current)}
  onTouchStart={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
  onTouchEnd={() => clearTimeout(adminPressTimer.current)}
>RC BN3583773</p>
              <p style={{color:'#666', fontSize:'11px', marginTop:'4px'}}>https://www.gasv.store • Verified Trusted</p>
              <div style={{background:'#111', borderRadius:'10px', padding:'8px', marginTop:'12px', border:'1px solid #222'}}>
                <p style={{color:'#888', fontSize:'10px', margin:0}}>📱 Open camera → Scan → Shop instantly</p>
              </div>
            </div>

            {/* Brand Column */}
            <div style={{textAlign:'center'}} className="flex flex-col items-center justify-center">
              <GoyeLogo size={40} className="mb-3" />
              <div style={{background:'linear-gradient(135deg,#FFD700,#FFA500)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:'bold', fontSize:'22px', marginBottom:'8px'}}>GOYE GLOBAL</div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'15px'}}>
                <p style={{color:'#888', fontSize:'11px', letterSpacing:'2px'}}>WORLDWIDE • RC BN3583773</p>
                <GoyeLogo size={24} />
              </div>
              <p style={{color:'#ccc', fontSize:'13px', lineHeight:'1.6'}}>Digital academy & eSIM provider<br/>connecting 190+ countries instantly.<br/>26 Courses From $9.99 • UK Visa $89.99<br/>Sirwise AI Web3 Academy 24/7</p>
              <div style={{marginTop:'20px', display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'7px'}}>
                <span style={{background:'linear-gradient(135deg,#111,#222)', color:'#FFD700', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', border:'1px solid #333', fontWeight:'bold'}}>💳 Paystack</span>
                <span style={{background:'linear-gradient(135deg,#111,#222)', color:'#fff', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', border:'1px solid #333'}}>Flutterwave</span>
                <span style={{background:'linear-gradient(135deg,#111,#222)', color:'#10B981', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', border:'1px solid #333'}}>₿ Crypto</span>
                <span style={{background:'linear-gradient(135deg,#111,#222)', color:'#8b5cf6', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', border:'1px solid #333'}}>π Pi GCV $314k</span>
              </div>
              <div style={{marginTop:'18px', background:'#111', borderRadius:'12px', padding:'10px', border:'1px solid #222'}}>
                <p style={{color:'#10B981', fontSize:'12px', margin:0, fontWeight:'bold'}}>⚡ Instant Delivery 190+ Countries • 24/7 Support</p>
              </div>
            </div>

            {/* Access Column */}
            <div style={{background:'#0f0f0f', border:'1px solid #222', borderRadius:'18px', padding:'20px'}}>
              <h4 style={{color:'#fff', fontSize:'14px', marginBottom:'15px', textAlign:'center'}}>🚀 QUICK ACCESS</h4>
              <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px'}}><span style={{color:'#888', fontSize:'12px'}}>🌐 Website</span><span style={{color:'#FFD700', fontSize:'12px', fontWeight:'bold'}}>https://www.gasv.store</span></div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px'}}><span style={{color:'#888', fontSize:'12px'}}>🔍 Google</span><span style={{color:'#fff', fontSize:'11px'}}>GOYE Global Worldwide</span></div>
                <a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px', textDecoration:'none'}}><span style={{color:'#888', fontSize:'12px'}}>💬 WhatsApp</span><span style={{color:'#25D366', fontSize:'11px', fontWeight:'bold'}}>+234 803 358 4736</span></a>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px'}}><span style={{color:'#888', fontSize:'12px'}}>📧 Email</span><span style={{color:'#ccc', fontSize:'11px'}}>goye@gasv.store</span></div>
                <div onClick={handleInstall} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px', cursor:'pointer'}}><span style={{color:'#888', fontSize:'12px'}}>📲 Install</span><span style={{color:'#FFD700', fontSize:'11px', fontWeight:'bold'}}>{isInstallable ? 'Install Now' : 'Add to Home Screen'}</span></div>
              </div>
              <p 
  style={{color:'#444', fontSize:'10px', textAlign:'center', marginTop:'18px', lineHeight:'1.5', userSelect:'none', cursor:'pointer'}}
  onMouseDown={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
  onMouseUp={() => clearTimeout(adminPressTimer.current)}
  onMouseLeave={() => clearTimeout(adminPressTimer.current)}
  onTouchStart={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
  onTouchEnd={() => clearTimeout(adminPressTimer.current)}
>© 2026 Goyedagosmess Enterprise<br/>Sirwise AI Web3 Academy<br/>Trusted Worldwide • RC BN3583773</p>
            </div>

          </div>
        </div>
        <div style={{background:'#000', borderTop:'1px solid #111', padding:'12px', textAlign:'center'}}>
          <p style={{color:'#333', fontSize:'10px', margin:0}}>Built with ❤️ for 190+ Countries • Instant Digital Delivery • No Physical Shipping</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/2348033584736?text=Hello GOYE Support" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ width: "56px", height: "56px" }} className="fixed bottom-[90px] left-[16px] bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] z-[998] hover:scale-110 transition flex items-center justify-center group cursor-pointer pointer-events-auto"
      >
        <MessageCircle size={24} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold text-sm">Chat with us on WhatsApp</span>
      </a>

      {/* Video Modal */}
      {showEsimVideoModal && <EsimVideoModal onClose={() => setShowEsimVideoModal(false)} />}
      <div id="videoModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#000', border: '2px solid #FFD700', padding: '20px', borderRadius: '16px', maxWidth: '400px', width: '90%' }}>
          <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>Free AI Course Lesson Module 1</h3>
          <p style={{ color: 'white', fontSize: '14px', marginBottom: '10px' }}>Introduction to AI: What is Artificial Intelligence? Learn basics...</p>
          <video controls style={{ width: '100%', margin: '10px 0', borderRadius: '8px' }}>
            {/* Dummy video source */}
            <source type="video/mp4" />
          </video>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>Free preview - Full 26 courses $9.99 each</p>
          <button type="button" onClick={() => { const m = document.getElementById('videoModal'); if(m) m.style.display='none'; }} style={{ background: '#FFD700', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '8px', marginTop: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
          <button type="button" onClick={() => { const m = document.getElementById('videoModal'); if(m) m.style.display='none'; document.getElementById('academy')?.scrollIntoView({behavior:'smooth'}); }} style={{ background: 'transparent', color: '#FFD700', border: '1px solid #FFD700', padding: '10px 20px', borderRadius: '8px', marginTop: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>Unlock Full Courses</button>
        </div>
      </div>
    </div>
  );
}
