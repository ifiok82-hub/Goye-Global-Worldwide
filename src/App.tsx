import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, RefreshCw, Users, Activity, UserCircle , Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard, Camera, Mic, MoreHorizontal} from 'lucide-react';
import { ALL_PRODUCTS } from './data';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import EsimVideoModal from './components/EsimVideoModal';
import { GoyeLogo } from './components/GoyeLogo';
import { db } from './lib/firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';


// Dummy components for things that were in App.tsx
const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
  <div className="bg-[#0a0a0a] border border-[#FFD700] rounded-[2rem] p-6 text-center mt-6 relative mx-4">
    <div className="flex flex-col gap-3 mb-8">
      <div className="bg-[#FFD700] text-black text-[11px] font-bold py-2 px-5 rounded-full mx-auto inline-flex items-center gap-2">
        <span className="text-yellow-600">⚡</span> 100% DIGITAL PRODUCTS STORE
      </div>
      <div className="bg-[#6b21a8] text-white text-[11px] font-bold py-2 px-5 rounded-full mx-auto inline-flex items-center">
        BN3583773 • https://www.gasv.store
      </div>
      <div className="bg-[#064e3b]/80 border border-[#047857] text-[#34d399] text-[11px] font-bold py-2 px-5 rounded-full mx-auto inline-flex items-center gap-1.5">
        <ShieldCheck size={14}/> Instant Delivery 190+ Countries
      </div>
    </div>
    
    <div onClick={onLogoTap} className="inline-block cursor-pointer w-full mb-4">
      <h1 className="text-white text-[42px] font-black tracking-tight mb-2 leading-none">GOYE STORE<br/>GLOBAL</h1>
      <h2 className="text-[#FFD700] text-3xl font-black uppercase tracking-tight leading-none">SIRWISE AI WEB3<br/>ACADEMY</h2>
    </div>
  </div>
);

export default function App() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };

  const [tab, setTab] = useState(window.location.hash.replace('#', '') || 'home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showEsimVideoModal, setShowEsimVideoModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTapCount, setAdminTapCount] = useState(0);
  const adminPressTimer = useRef<any>(null);
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

  const [products, setProducts] = useState(ALL_PRODUCTS);
  
  
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
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
    const items = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
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

  return (
    <div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-40 max-w-[420px] mx-auto border-x border-[#222]">
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

            
      <header className="bg-[#000] sticky top-0 z-[50] border-b border-[#333]">
        <div className="flex items-start justify-between p-3 border-b border-[#222]">
          <div className="flex items-start gap-3 cursor-pointer" onClick={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}>
            <GoyeLogo size={48} className="text-[#FFD700] mt-1" />
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-sm leading-tight">GOYE<br/>Global<br/>Worldwide</h1>
              <div className="text-[10px] text-gray-400 mt-1">RC BN3583773</div>
              <div className="text-[10px] text-[#FFD700]">www.gasv.store</div>
              <div className="text-[10px] text-gray-400">goye@gasv.store</div>
              <div className="text-[10px] text-gray-400">goyedagosmess@gmail.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end max-w-[140px] pt-1">
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#FFD700] rounded-xl w-[42px] h-[42px]">
              <Camera size={14} className="text-[#9ca3af]" />
              <span className="text-[#FFD700] text-[8px] font-bold mt-1">QR</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#10B981] rounded-xl w-[42px] h-[42px]">
              <Search size={14} className="text-[#3b82f6]" />
              <span className="text-[#10B981] text-[8px] font-bold mt-1">Scan</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px]">
              <Mic size={14} className="text-[#3b82f6]" />
              <span className="text-white text-[8px] font-bold mt-1">Record</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px]">
              <MoreHorizontal size={14} className="text-white" />
              <span className="text-white text-[8px] font-bold mt-1">More</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide bg-[#111] p-2">
          <div className="flex flex-nowrap w-max overflow-visible">
            {['HOME', 'SHOP', 'eSIM', 'ACADEMY', 'CONTRACTS', 'PROMPTS', 'DOWNLOADS', 'SUPPORT'].map((t) => (
              <button 
                key={t}
                onClick={() => { setTab(t.toLowerCase()); window.location.hash = t.toLowerCase(); }}
                className={`mr-2 px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition transform active:scale-95 flex items-center gap-2 ${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}`}
              >
                {t === 'HOME' && <Home size={14}/>}
                {t === 'SHOP' && <ShoppingBag size={14}/>}
                {t === 'eSIM' && <Globe size={14}/>}
                {t === 'ACADEMY' && <GraduationCap size={14}/>}
                {t === 'CONTRACTS' && <FileText size={14}/>}
                {t === 'PROMPTS' && <MessageCircle size={14}/>}
                {t === 'DOWNLOADS' && <Download size={14}/>}
                {t === 'SUPPORT' && <MessageCircle size={14}/>}
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>


      <main className="w-full mx-auto pb-12">
        {(tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500">
            {tab === 'home' && <HeroSection onLogoTap={() => {
              const newCount = adminTapCount + 1;
              setAdminTapCount(newCount);
              if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
              setTimeout(() => setAdminTapCount(0), 3000);
            }} />}
            
            <h2 className="text-white text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block mt-8">
              {tab === 'shop' ? 'All Digital Products' : 
               tab === 'esim' ? 'Global eSIMs' : 
               tab === 'academy' ? 'Academy Courses' : 
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
                        // Handle download/access logic here
                        if (product.category === 'academy') {
                          const m = document.getElementById('videoModal');
                          if(m) m.style.display = 'flex';
                        }
                      }} className="w-full bg-[#222] border border-[#10B981] text-[#10B981] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Download size={18}/> Access & Download
                      </button>
                    ) : (
                      <button onClick={() => setSelectedProduct(product)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Lock size={18}/> Unlock & Buy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'downloads' && (
          <div className="max-w-4xl mx-auto px-4 mt-8 animate-in fade-in duration-500">
            <h2 className="text-[#FFD700] text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block">My Downloads & Orders</h2>
            {purchasedItems.length === 0 ? (
              <div className="bg-[#111] border border-[#333] rounded-2xl p-12 text-center">
                <Download size={48} className="text-gray-600 mx-auto mb-4"/>
                <p className="text-gray-400">You haven't purchased anything yet.</p>
                <button onClick={() => setTab('shop')} className="mt-4 bg-[#FFD700] text-black font-bold py-2 px-6 rounded-xl">Browse Store</button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedItems.map((item: any, i: number) => (
                  <div key={i} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#FFD700] font-mono mb-1">{item.ref}</div>
                      <h3 className="text-white font-bold text-lg">{item.productName}</h3>
                      <div className="text-gray-400 text-xs mt-1">Date: {item.date} • Method: {item.method}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.status === 'pending' ? (
                        <div className="bg-yellow-900/30 text-yellow-500 border border-yellow-900/50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                          <RefreshCw size={14} className="animate-spin"/> Verifying...
                        </div>
                      ) : (
                        <button onClick={() => { showToast('Download starting...'); setTimeout(() => { const a = document.createElement('a'); a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; a.download = item.productName + '.txt'; a.click(); }, 1500); }} className="bg-[#10B981] text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2">
                          <Download size={16}/> Access
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
          <div className="max-w-6xl mx-auto px-4 mt-8 animate-in fade-in duration-500">
            
            <h2 className="text-white text-2xl font-black mb-6">Admin Dashboard</h2>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 mb-8">
              <h3 className="text-[#FFD700] font-bold mb-4">Payment Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Paystack Public Key (pk_live_...)</label>
                  <input id="paystack_key" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).paystack : localStorage.getItem('paystack_public_key')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Flutterwave Public Key (FLWPUBK-...)</label>
                  <input id="flutterwave_key" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).flutterwave : localStorage.getItem('flutterwave_public_key')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Crypto USDC Wallet Address</label>
                  <input id="crypto_wallet" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).crypto : localStorage.getItem('crypto_wallet')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pi Network GCV Wallet Address</label>
                  <input id="pi_wallet" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).pi : localStorage.getItem('pi_wallet')} />
                </div>
                <button onClick={() => {
                  const paystack = (document.getElementById('paystack_key') as HTMLInputElement).value.trim();
                  const flutterwave = (document.getElementById('flutterwave_key') as HTMLInputElement).value.trim();
                  const crypto = (document.getElementById('crypto_wallet') as HTMLInputElement).value.trim();
                  const pi = (document.getElementById('pi_wallet') as HTMLInputElement).value.trim();
                  
                  const config = { paystack, flutterwave, crypto, pi };
                  localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(config));
                  
                  localStorage.setItem('paystack_public_key', paystack);
                  localStorage.setItem('flutterwave_public_key', flutterwave);
                  localStorage.setItem('crypto_wallet', crypto);
                  localStorage.setItem('pi_wallet', pi);
                  
                  // Save to Firebase
                  setDoc(doc(db, 'settings', 'payments'), config)
                    .then(() => showToast('Saved to Firestore & Local Storage!'))
                    .catch(e => showToast('Saved locally. Firestore error: ' + e.message));
                }} className="bg-[#10B981] text-white font-bold px-6 py-2 rounded">
                  SAVE ALL CONFIG
                </button>
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
              <h3 className="text-[#FFD700] font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4">Ref</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method & Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {purchasedItems.map((order, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-[#FFD700] text-xs">{order.ref}</td>
                        <td className="p-4 font-bold text-white">{order.productName}</td>
                        <td className="p-4 text-[#10B981] font-bold">${order.amount}</td>
                        <td className="p-4">
                          <span className="text-xs font-bold uppercase mr-2">{order.method}</span>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status==='completed' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-yellow-500/20 text-yellow-500'}`}>{order.status}</span>
                        </td>
                        <td className="p-4 text-gray-500 text-xs">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedProduct && (
        <UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} onToast={showToast} />
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

            <a href="https://wa.me/2348033584736" target="_blank" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#25D366] border border-transparent transition">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-white" size={20}/>
                <span className="text-gray-300 text-[13px]">WhatsApp</span>
              </div>
              <span className="text-[#10B981] text-[13px] font-bold">+234 803 358 4736</span>
            </a>

            <a href="mailto:goye@gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Mail className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Email</span>
              </div>
              <span className="text-gray-400 text-[13px]">goye@gasv.store</span>
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
        <h4 style={{color:'#fff', fontSize:'18px', fontWeight:'bold', marginBottom:'20px'}}>Scan to Share</h4>
        <div style={{background:'white', padding:'12px', border:'3px solid #FFD700', borderRadius:'24px', maxWidth:'320px', margin:'0 auto', position:'relative'}}>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store" alt="GOYE QR" style={{width:'100%', height:'auto', display:'block', borderRadius:'12px'}} />
          <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'white', borderRadius:'50%', width:'60px', height:'60px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.2)'}}>
            <span style={{fontSize:'36px'}}>🌐</span>
          </div>
          <p style={{color:'#000', fontWeight:'bold', marginTop:'10px', fontSize:'14px', marginBottom:'0'}}>Scan Me - www.gasv.store</p>
        </div>
        
        <div style={{marginTop:'30px'}}>
          <a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'12px', textDecoration:'none', fontSize:'14px', fontWeight:'bold'}}>
            <MessageCircle size={18}/> WhatsApp Support
          </a>
        </div>
        
        <div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>
          <p style={{color:'#666', fontSize:'11px', margin:0, lineHeight:'1.5'}}>
            © 2026 Goyedagosmess Enterprise<br/>Sirwise AI Web3 Academy • Trusted Worldwide • RC BN3583773
          </p>
        </div>
      </footer>

      {/* Floating Widgets */}
      <div className="fixed bottom-20 left-4 z-[90]">
        <a href="https://wa.me/2348033584736" target="_blank" className="bg-[#10B981] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative transition hover:scale-105">
          <MessageCircle size={28}/>
          <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-[#111]"></div>
        </a>
      </div>
      <div className="fixed bottom-20 right-4 z-[90]">
        <button className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative transition hover:scale-105">
          <Bot size={28}/>
          <div className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-[#111]"></div>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] z-[100]">
        <div className="flex justify-between items-center px-4 py-2 overflow-x-auto scrollbar-hide w-full gap-6">
          <button onClick={() => {setTab('home'); window.location.hash='home'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
            <Home size={22} className={tab === 'home' ? 'fill-transparent' : ''}/>
            <span className="text-[10px] font-bold">HOME</span>
          </button>
          <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'shop' ? 'text-gray-300' : 'text-gray-500'}`}>
            <ShoppingBag size={22}/>
            <span className="text-[10px] font-bold">SHOP</span>
          </button>
          <button onClick={() => {setTab('esim'); window.location.hash='esim'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'esim' ? 'text-gray-300' : 'text-gray-500'}`}>
            <Globe size={22}/>
            <span className="text-[10px] font-bold">eSIM</span>
          </button>
          <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'academy' ? 'text-gray-300' : 'text-gray-500'}`}>
            <GraduationCap size={22}/>
            <span className="text-[10px] font-bold">ACADEMY</span>
          </button>
          <button onClick={() => {setTab('contracts'); window.location.hash='contracts'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'contracts' ? 'text-gray-300' : 'text-gray-500'}`}>
            <FileText size={22}/>
            <span className="text-[10px] font-bold">CONTRACTS</span>
          </button>
          <button onClick={() => {setTab('prompts'); window.location.hash='prompts'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'prompts' ? 'text-gray-300' : 'text-gray-500'}`}>
            <MessageCircle size={22}/>
            <span className="text-[10px] font-bold">PROMPTS</span>
          </button>
          <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'downloads' ? 'text-gray-300' : 'text-gray-500'}`}>
            <Download size={22}/>
            <span className="text-[10px] font-bold">DOWNLOADS</span>
          </button>
          <button onClick={() => {setTab('support'); window.location.hash='support'}} className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ${tab === 'support' ? 'text-gray-300' : 'text-gray-500'}`}>
            <MessageCircle size={22}/>
            <span className="text-[10px] font-bold">SUPPORT</span>
          </button>
        </div>
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