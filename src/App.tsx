import React, { useState, useEffect, useRef } from 'react';
import QRScannerModal from './components/QRScannerModal';
import { GoyeLogo } from './components/GoyeLogo';
import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, Users, Activity, UserCircle } from 'lucide-react';
import { ESIM_PRODUCTS, ACADEMY_COURSES } from './data';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import { auth, googleAuthProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';


const HeroSection = ({ onLogoTap }: { onLogoTap?: () => void }) => (
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

    <p className="text-[#aaa] text-sm mt-3 leading-relaxed">
      100% Digital Products. No Physical Shipping Friction. Instant QR eSIMs, AI Academy Toolkits, Software Licenses, Web3 Smart Contracts & Digital Nomad Suites.
    </p>

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

  const [tab, setTab] = useState<'home' | 'shop' | 'esim' | 'academy' | 'contracts' | 'prompts' | 'downloads' | 'admin' | 'admin-settings' | 'admin-academy' | 'admin-products' | 'trackers' | 'referrals'>('home');
  const [showRecorder, setShowRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
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

  // Referral state
  const [refClicks, setRefClicks] = useState(0);
  const [refSignups, setRefSignups] = useState(0);
  const [refSales, setRefSales] = useState(0);
  const [refBalance, setRefBalance] = useState(0);
  const [refHistory, setRefHistory] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch of referral data when tab changes or initially
    if (tab === 'referrals') {
      setRefClicks(parseInt(localStorage.getItem('referral_clicks') || '0', 10));
      setRefSignups(parseInt(localStorage.getItem('referral_signups') || '0', 10));
      setRefSales(parseInt(localStorage.getItem('referral_sales') || '0', 10));
      setRefBalance(parseFloat(localStorage.getItem('referral_balance') || '0'));
      setRefHistory(JSON.parse(localStorage.getItem('referral_sales_list') || '[]'));
    }
  }, [tab]);

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
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === 'goye@gasv.store') {
        setIsAdmin(true);
        localStorage.setItem('goye_admin_auth', 'true');
      } else if (u) {
        setIsAdmin(false);
        localStorage.removeItem('goye_admin_auth');
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
      localStorage.setItem('active_referral', refCode);
      const currentClicks = parseInt(localStorage.getItem('referral_clicks') || '0', 10);
      localStorage.setItem('referral_clicks', (currentClicks + 1).toString());
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
    alert(`Downloading ${order.productName}...`);
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
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [allCompletedOrdersList, setAllCompletedOrdersList] = useState<any[]>([]);

  useEffect(() => {
    // Refresh pending orders and purchased items just in case
    const pOrders = JSON.parse(localStorage.getItem('goye_pending_orders') || '[]');
    setPendingOrders(pOrders);
    
    const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    setPurchasedItems(purchased);

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
      setAnalyticsData(data);
      setShowAnalyticsModal(true);
    } catch(e) {}
  };

  useEffect(() => {
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
    setPurchasedItems(purchased);
    
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
          </div>
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-[#333] shadow-inner shrink-0 ml-3">
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

      <main className="max-w-5xl mx-auto py-2 pb-32 relative z-10 touch-manipulation">
        {(tab === 'home' || tab === 'academy') && (
          <div className="animate-in fade-in duration-500">
            {tab === 'home' && <HeroSection onLogoTap={()=>{
      const newCount = adminTapCount+1;
      setAdminTapCount(newCount);
      if(newCount>=5){ setShowAdminLogin(true); setAdminTapCount(0); }
      setTimeout(()=>setAdminTapCount(0), 3000);
    }} />}
            
            <div className="px-4 mt-8 mb-12">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">SIRWISE AI WEB3 ACADEMY</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">Master AI, Web3 & Decentralized Future. Join the elite network of tomorrow's builders.</p>
              </div>
              
              {tab === 'academy' && (
              <>
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
              </>
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
          <div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
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
          <div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
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
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-green-500"/> My Downloads
            </h2>
            
            {purchasedItems.length === 0 ? (
              <div className="bg-[#111] border border-white/10 p-8 rounded-2xl text-center text-gray-400">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                <p>No purchases yet. Your unlocked items will appear here forever.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedItems.map((order, i) => (
                  <div key={i} className="bg-[#111] border border-green-500/20 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500"/> {order.productName}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">Order Ref: <span className="font-mono text-[#FFD700]">{order.ref}</span> • {new Date(order.purchaseDate || order.date).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto z-[100] relative">
                      <button onClick={() => handleDownload(order)} className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                        <Download size={14}/> Download
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
        )}

                {tab === 'contracts' && (
          <div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
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

        {tab === 'prompts' && (
          <div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">
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
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center">
              <p className="text-gray-400 mb-4">Enter your order reference (e.g. REF-...) to track the status of your digital delivery or eSIM provisioning.</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input type="text" placeholder="Enter Order Ref" className="flex-1 bg-black border border-[#333] p-3 rounded-xl text-white focus:border-[#FFD700] focus:outline-none" id="track-ref-input" />
                <button onClick={() => {
                  const val = (document.getElementById('track-ref-input') as HTMLInputElement).value;
                  if (val) alert('Tracking status for ' + val + ':\nStatus: Completed\nSent to your email address.');
                }} className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold">Track</button>
              </div>
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
                  <span className="text-white font-mono text-[10px] truncate">https://www.gasv.store/?ref=GOYE</span>
                  <button onClick={() => handleCopyLink('https://www.gasv.store/?ref=GOYE')} className="bg-[#FFD700] hover:bg-yellow-400 text-black px-3 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer pointer-events-auto transition">Copy Link</button>
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
            
            {/* Promo materials */}
            <div className="mt-6 bg-[#0a0a0a] border border-[#222] p-5 rounded-2xl">
               <h3 className="text-white text-sm font-bold mb-3">Quick Promo Scripts</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-[100] relative">
                 <div className="bg-black p-3 rounded-xl border border-[#333]">
                   <p className="text-gray-400 text-[10px] italic mb-2">"Traveling soon? Get 5GB global data instantly without roaming fees. Use my link..."</p>
                   <button onClick={() => handleCopyLink('Traveling soon? Get 5GB global data instantly without roaming fees. Use my link: https://www.gasv.store/?ref=GOYE')} className="text-[#FFD700] text-[10px] font-bold cursor-pointer pointer-events-auto hover:text-yellow-400">Copy Script</button>
                 </div>
                 <div className="bg-black p-3 rounded-xl border border-[#333]">
                   <p className="text-gray-400 text-[10px] italic mb-2">"Master AI & Web3 development today at SIRWISE Academy. Join here..."</p>
                   <button onClick={() => handleCopyLink('Master AI & Web3 development today at SIRWISE Academy. Join here: https://www.gasv.store/?ref=GOYE')} className="text-[#FFD700] text-[10px] font-bold cursor-pointer pointer-events-auto hover:text-yellow-400">Copy Script</button>
                 </div>
               </div>
            </div>

          </div>
        )}

        </main>

      

            {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#333] flex items-center overflow-x-auto p-2 z-[50] pb-safe scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button onClick={() => setTab('home')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'home' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Home size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold">HOME</div>
        </button>
        <button onClick={() => setTab('shop')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'shop' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <ShoppingBag size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">SHOP</div>
        </button>
        <button onClick={() => setTab('esim')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'esim' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Globe size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">eSIM</div>
        </button>
        <button onClick={() => setTab('academy')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'academy' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <GraduationCap size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold">ACADEMY</div>
        </button>
        <button onClick={() => setTab('contracts')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'contracts' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <FileText size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold">CONTRACTS</div>
        </button>
        <button onClick={() => setTab('prompts')} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'prompts' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <MessageCircle size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold">PROMPTS</div>
        </button>
        <button onClick={() => { trackClick('nav', 'My Downloads'); setTab('downloads'); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === 'downloads' ? 'text-[#FFD700]' : 'text-[#888]'}`}>
          <Download size={20} className="mb-1 mx-auto"/>
          <div className="text-[9px] font-bold whitespace-nowrap">DOWNLOADS</div>
        </button>
        <button onClick={() => { trackClick('external', 'Email goye@gasv.store'); window.location.href='mailto:goye@gasv.store'; }} className="text-center flex flex-col items-center justify-center p-1 min-w-[70px] text-[#888]">
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
        className="fixed bottom-24 right-4 z-[90] bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform"
      >
        <div className="relative">
          <span className="text-2xl">🤖</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111] animate-pulse"></div>
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
            <a href="https://wa.me/2348033584736" target="_blank" rel="noopener noreferrer" className="mt-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition">
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
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#111] rounded-[15px] p-4 border border-[#333]">
                  <p className="text-[#888] text-xs font-bold mb-1">TOTAL PAGE VIEWS</p>
                  <h2 className="text-[#FFD700] text-3xl font-black">{analyticsData?.totalViews || 0}</h2>
                  <p className="text-[#10B981] text-xs mt-1">Today: {analyticsData?.dailyViews?.[new Date().toISOString().split('T')[0]] || 0}</p>
                </div>
                <div className="bg-[#111] rounded-[15px] p-4 border border-[#333]">
                  <p className="text-[#888] text-xs font-bold mb-1">TOTAL LINK CLICKS</p>
                  <h2 className="text-[#10B981] text-3xl font-black">{analyticsData?.totalClicks || 0}</h2>
                  <p className="text-[#888] text-xs mt-1">Conversion: {((analyticsData?.totalClicks / (analyticsData?.totalViews || 1)) * 100 || 0).toFixed(1)}%</p>
                </div>
              </div>

              <h3 className="text-white font-bold mb-3">🔥 Top Clicked Links (What people want most):</h3>
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

              <h3 className="text-white font-bold mb-3">🕒 Recent Clicks:</h3>
              <div className="bg-[#111] rounded-[15px] p-3 border border-[#333] max-h-[200px] overflow-y-auto mb-6">
                {analyticsData?.clicks?.slice(-20).reverse().map((c: any, i: number) => (
                  <div key={i} className="text-[#ccc] text-xs py-1.5 border-b border-[#222] last:border-0 flex justify-between">
                    <span>{c.name} {c.price ? '- $' + c.price : ''}</span>
                    <span className="text-[#888] text-[10px] text-right">{c.time}</span>
                  </div>
                ))}
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
                    if(window.confirm('Clear all analytics?')){ 
                      localStorage.removeItem('goye_analytics'); 
                      setAnalyticsData({});
                    }
                  }}
                  className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-xl font-bold text-xs border border-[#333] transition"
                >
                  🗑️ Clear
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
              <div onClick={() => window.open('https://wa.me/2348033584736', '_blank')} style={{background:'#000', borderRadius:'14px', padding:'14px', border:'1px solid #222', cursor:'pointer'}}>
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
              <button onClick={()=>{ setIsAdmin(false); setShowAdminLogin(false); localStorage.removeItem('goye_admin_auth'); setTab('home'); }} style={{background:'#f00', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'10px', cursor:'pointer'}}>✕ Close Admin</button>
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
                    <button onClick={() => setTab('admin-settings')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${tab === 'admin-settings' ? 'bg-[#FFD700] text-black' : 'bg-[#111] text-gray-400 hover:text-white'}`}>
                      <Settings size={14}/> Settings
                    </button>
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
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {[...pendingOrders.map(o => ({...o, status: 'pending'})), ...allCompletedOrdersList]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((order, i) => (
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
                              <td className="p-4 flex items-center gap-2">
                                <span className="uppercase text-[10px] px-2 py-1 bg-white/10 rounded">{order.method || order.gateway || 'Unknown'}</span>
                                <span className={`uppercase text-[10px] px-2 py-1 rounded font-bold ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-gray-500">{new Date(order.date).toLocaleString()}</td>
                            </tr>
                          ))}
                          {(pendingOrders.length === 0 && allCompletedOrdersList.length === 0) && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-500">No orders yet.</td>
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

      <footer style={{background:'linear-gradient(180deg,#0a0a0a 0%,#000 100%)', borderTop:'3px solid #FFD700', padding:'0', marginTop:'50px', overflow:'hidden'}}>
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
                <a href="https://wa.me/2348033584736" target="_blank" rel="noopener noreferrer" style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'10px 12px', borderRadius:'10px', textDecoration:'none'}}><span style={{color:'#888', fontSize:'12px'}}>💬 WhatsApp</span><span style={{color:'#25D366', fontSize:'11px', fontWeight:'bold'}}>Chat Support</span></a>
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
    </div>
  );
}
