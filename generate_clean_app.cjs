const fs = require('fs');

const code = `import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Download, ShieldCheck, ChevronRight, Lock, BookOpen, Settings, List, Save, Mail, CreditCard, DollarSign, Wallet, Phone, Landmark, Home, ShoppingBag, GraduationCap, MessageCircle, Search, Edit, Trash2, Plus, FileText, Video, Eye, EyeOff, CheckCircle, Users, Activity, UserCircle } from 'lucide-react';
import { ESIM_PRODUCTS, ACADEMY_COURSES } from './data';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import EsimVideoModal from './components/EsimVideoModal';
import RealQRCode from './components/RealQRCode';
import { GoyeLogo } from './components/GoyeLogo';

// Dummy components for things that were in App.tsx
const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
  <div className="bg-[#000] border-b-2 border-[#FFD700] p-6 text-center">
    <div onClick={onLogoTap} className="inline-block cursor-pointer">
      <GoyeLogo size={60} className="mx-auto mb-2 text-[#FFD700]"/>
      <h1 className="text-[#FFD700] text-3xl font-black tracking-widest mb-1">SIRWISE AI WEB3 ACADEMY</h1>
      <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-4">GOYE Global Worldwide - RC BN3583773</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden">
        <div className="text-4xl mb-2">🤖</div>
        <h3 className="text-[#FFD700] font-bold text-lg">AI Mastery</h3>
        <p className="text-gray-400 text-xs mb-3">Master AI and machine learning for business</p>
        <button onClick={() => {}} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden">
        <div className="text-4xl mb-2">💰</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Crypto & DeFi</h3>
        <p className="text-gray-400 text-xs mb-3">Deep dive into decentralized finance and trading</p>
        <button onClick={() => {}} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden">
        <div className="text-4xl mb-2">π</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Pi Network GCV</h3>
        <p className="text-gray-400 text-xs mb-3">Understanding Pi Network at $314,159</p>
        <button onClick={() => {}} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [tab, setTab] = useState(window.location.hash.replace('#', '') || 'home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showEsimVideoModal, setShowEsimVideoModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTapCount, setAdminTapCount] = useState(0);
  const adminPressTimer = useRef<any>(null);

  const [esimProducts, setEsimProducts] = useState(ESIM_PRODUCTS);
  const [academyCourses, setAcademyCourses] = useState(ACADEMY_COURSES);
  
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);

  useEffect(() => {
    const handleHashChange = () => setTab(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('hashchange', handleHashChange);
    
    setTimeout(() => setShowSplash(false), 2000);
    
    // Load downloads
    setPurchasedItems(JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]'));
    
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
    <div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-24">
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

      <header className="bg-[#000] p-3 sticky top-0 z-[50] border-b border-[#222]">
        <div className="flex justify-center mt-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-[#333] shadow-inner shrink-0">
            <button onClick={() => {setTab('home'); window.location.hash='home'}} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'home' || tab === 'academy' ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#e5c100]' : 'text-[#888] hover:text-[#FFD700] border border-transparent'}\`}><GraduationCap size={16}/> Academy</button>
            <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'shop' || tab === 'esim' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}\`}><ShoppingBag size={16}/> Store & eSIM</button>
            <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'downloads' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}\`}><Download size={16}/> My Downloads</button>
            {isAdminAuth && (
              <button onClick={() => setTab('admin')} className={\`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ml-1 \${tab.startsWith('admin') ? 'bg-[#2a2a2a] text-[#FFD700] shadow-md border border-[#444]' : 'text-[#888] hover:text-[#FFD700] border border-transparent'}\`}>
                <Settings size={14}/> Admin
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-12">
        {(tab === 'home' || tab === 'academy') && (
          <div className="animate-in fade-in duration-500">
            <HeroSection onLogoTap={() => {
              const newCount = adminTapCount + 1;
              setAdminTapCount(newCount);
              if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
              setTimeout(() => setAdminTapCount(0), 3000);
            }} />
            <div className="px-4 mt-8">
              <h2 className="text-[#FFD700] text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block">GOYE Academy Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {academyCourses.map((course: any) => (
                  <div key={course.id} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FFD700] transition">
                    <div>
                      <div className="text-4xl mb-4">{course.icon}</div>
                      <h3 className="text-white font-bold text-lg mb-2">{course.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="text-[#10B981] font-black text-2xl mb-4">\${course.price}</div>
                      {hasAccess(course.id) ? (
                        <button onClick={() => {
                          const m = document.getElementById('videoModal');
                          if(m) m.style.display = 'flex';
                        }} className="w-full bg-[#222] border border-[#FFD700] text-[#FFD700] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                          <Video size={18}/> Access Course
                        </button>
                      ) : (
                        <button onClick={() => setSelectedProduct(course)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                          <Lock size={18}/> Unlock Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(tab === 'shop' || tab === 'esim') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500">
            <h2 className="text-white text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block">Premium Store & eSIMs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {esimProducts.map((product: any) => (
                <div key={product.id} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FFD700] transition relative overflow-hidden">
                  {product.badge && <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">{product.badge}</div>}
                  <div>
                    <div className="text-4xl mb-4">{product.flag}</div>
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{product.name}</h3>
                    {product.data && (
                      <div className="flex gap-2 mb-3">
                        <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.data}</span>
                        <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.days}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="text-[#10B981] font-black text-2xl mb-4">\${product.price}</div>
                    <button onClick={() => setSelectedProduct(product)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      <ShoppingBag size={18}/> Buy Now
                    </button>
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
                        <button onClick={() => alert('Download starting...')} className="bg-[#10B981] text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2">
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
                        <td className="p-4 text-[#10B981] font-bold">\${order.amount}</td>
                        <td className="p-4">
                          <span className="text-xs font-bold uppercase mr-2">{order.method}</span>
                          <span className={\`px-2 py-1 rounded text-[10px] font-bold \${order.status==='completed' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-yellow-500/20 text-yellow-500'}\`}>{order.status}</span>
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
        <UnifiedCheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
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

      <footer id="support" style={{background:'linear-gradient(180deg,#0a0a0a 0%,#000 100%)', borderTop:'3px solid #FFD700', padding:'0', marginTop:'50px', overflow:'hidden'}}>
        {/* Top gold shine line */}
        <div style={{height:'2px', background:'linear-gradient(90deg, transparent, #FFD700, transparent)'}}></div>
        
        <div style={{padding:'35px 15px 20px'}}>
          <div style={{maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'30px', alignItems:'start'}}>
            
            {/* Column 1: Brand & Identity */}
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}
                   onMouseDown={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
                   onMouseUp={() => clearTimeout(adminPressTimer.current)}
                   onMouseLeave={() => clearTimeout(adminPressTimer.current)}
                   onTouchStart={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
                   onTouchEnd={() => clearTimeout(adminPressTimer.current)}>
                <GoyeLogo size={40} className="text-[#FFD700]"/>
                <div>
                  <h3 style={{color:'#FFD700', fontSize:'16px', fontWeight:'900', margin:0, letterSpacing:'1px', lineHeight:'1.2'}}>GOYE GLOBAL WORLDWIDE</h3>
                  <p style={{color:'#888', fontSize:'10px', fontWeight:'bold', margin:0, letterSpacing:'2px'}}>RC BN3583773</p>
                </div>
              </div>
              <p style={{color:'#aaa', fontSize:'12px', lineHeight:'1.6', marginBottom:'20px'}}>
                Your trusted gateway to premium digital products, AI mastery, and Web3 education.
              </p>
              <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#fff', fontSize:'12px', marginBottom:'10px'}}>
                <Globe size={14} className="text-[#FFD700]"/> www.gasv.store
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#fff', fontSize:'12px'}}>
                <Mail size={14} className="text-[#FFD700]"/> goye@gasv.store
              </div>
            </div>

            {/* Column 2: Trust & Badges */}
            <div>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px', borderLeft:'3px solid #FFD700', paddingLeft:'10px'}}>Secure Payments</h4>
              <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>💳 Paystack</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>💳 Flutterwave</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>🅿️ PayPal</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#10B981', fontSize:'11px', fontWeight:'bold'}}>💎 Crypto USDC</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#8b5cf6', fontSize:'11px', fontWeight:'bold'}}>π Pi GCV</div>
              </div>
            </div>

            {/* Column 3: Quick Links & Support */}
            <div>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px', borderLeft:'3px solid #FFD700', paddingLeft:'10px'}}>Quick Access</h4>
              <ul style={{listStyle:'none', padding:0, margin:0, color:'#aaa', fontSize:'12px', lineHeight:'2.5'}}>
                <li><a href="https://www.gasv.store" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold'}}>🌐 https://www.gasv.store</a></li>
                <li style={{cursor:'pointer'}} onClick={() => {setTab('academy'); window.location.hash='academy'}}>🎓 AI Web3 Academy</li>
                <li style={{cursor:'pointer'}} onClick={() => {setTab('shop'); window.location.hash='shop'}}>🛒 Store & eSIM</li>
              </ul>
              <a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'10px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'12px', fontWeight:'bold', marginTop:'15px'}}>
                <MessageCircle size={16}/> WhatsApp Support
              </a>
            </div>

            {/* Column 4: QR Code */}
            <div style={{textAlign:'center'}}>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px'}}>Scan to Share</h4>
              <RealQRCode />
            </div>
            
          </div>
        </div>

        <div style={{background:'#000', borderTop:'1px solid #222', padding:'15px', textAlign:'center'}}>
          <p style={{color:'#666', fontSize:'11px', margin:0}}>
            © 2026 Goyedagosmess Enterprise • Sirwise AI Web3 Academy • Trusted Worldwide • RC BN3583773
          </p>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', code);
