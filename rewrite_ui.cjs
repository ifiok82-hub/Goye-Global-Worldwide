const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the existing <header>
const oldHeaderRegex = /<header className="bg-\[#000\] sticky top-0 z-\[50\] border-b border-\[#222\]">[\s\S]*?<\/header>/;
const newHeader = `
      <header className="bg-[#000] sticky top-0 z-[50] border-b border-[#333]">
        <div className="flex items-center justify-between p-3 border-b border-[#222]">
          <div className="flex items-center gap-2" onClick={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}>
            <GoyeLogo size={36} className="text-[#FFD700]" />
            <div>
              <div className="text-[10px] text-[#FFD700] font-bold">RC BN3583773</div>
              <div className="text-[9px] text-gray-400">www.gasv.store</div>
              <div className="text-[9px] text-gray-400">goye@gasv.store</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 bg-[#111] border border-[#333] rounded-lg text-[#FFD700]"><CheckCircle size={16}/></button>
            <button className="p-1.5 bg-[#111] border border-[#333] rounded-lg text-white"><Scan size={16}/></button>
            <button className="p-1.5 bg-[#111] border border-[#333] rounded-lg text-red-500"><Video size={16}/></button>
            <button className="p-1.5 bg-[#111] border border-[#333] rounded-lg text-white"><MoreVertical size={16}/></button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide bg-[#111] p-2">
          <div className="flex gap-2 min-w-max">
            {['HOME', 'SHOP', 'eSIM', 'ACADEMY', 'CONTRACTS', 'PROMPTS', 'DOWNLOADS', 'SUPPORT'].map((t) => (
              <button 
                key={t}
                onClick={() => { setTab(t.toLowerCase()); window.location.hash = t.toLowerCase(); }}
                className={\`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition \${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-[#FFD700] text-black shadow-md' : 'text-gray-400 hover:text-white bg-black border border-[#333]'}\`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>
`;
code = code.replace(oldHeaderRegex, newHeader);

// add Lucide imports
const importRegex = /import {([^}]+)} from 'lucide-react'/;
code = code.replace(importRegex, (match, p1) => {
  return `import {${p1}, Scan, QrCode, Smartphone, MoreVertical, Bot, LayoutDashboard} from 'lucide-react'`;
});

// 2. Replace the HeroSection
const oldHeroRegex = /const HeroSection = \(\{ onLogoTap, onPlayVideo \}: any\) => \([\s\S]*?\);\n/;
const newHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
  <div className="bg-[#000] border-b-2 border-[#FFD700] p-6 text-center">
    <div className="flex flex-col gap-2 mb-6">
      <div className="bg-[#111] border border-[#333] text-[#10B981] text-[10px] font-bold py-1.5 px-3 rounded-full mx-auto flex items-center gap-2">
        <span>⚡ 100% DIGITAL PRODUCTS STORE</span>
      </div>
      <div className="bg-[#111] border border-[#333] text-gray-300 text-[10px] font-bold py-1.5 px-3 rounded-full mx-auto">
        BN3583773 • https://www.gasv.store
      </div>
      <div className="bg-[#111] border border-[#FFD700]/30 text-[#FFD700] text-[10px] font-bold py-1.5 px-3 rounded-full mx-auto flex items-center gap-2">
        <span>🛡️ Instant Delivery 190+ Countries</span>
      </div>
    </div>
    <div onClick={onLogoTap} className="inline-block cursor-pointer">
      <GoyeLogo size={60} className="mx-auto mb-2 text-[#FFD700]"/>
      <h1 className="text-white text-3xl font-black tracking-widest mb-1">GOYE STORE GLOBAL</h1>
      <h2 className="text-[#FFD700] text-xl font-bold uppercase tracking-[0.1em] mb-4">SIRWISE AI WEB3 ACADEMY</h2>
    </div>
    <div className="grid grid-cols-1 gap-4 mt-6 max-w-[420px] mx-auto">
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden text-left">
        <div className="text-4xl mb-2">🤖</div>
        <h3 className="text-[#FFD700] font-bold text-lg">AI Mastery</h3>
        <p className="text-gray-400 text-xs mb-3">Master AI and machine learning for business</p>
        <button className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden text-left">
        <div className="text-4xl mb-2">💰</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Crypto & DeFi</h3>
        <p className="text-gray-400 text-xs mb-3">Deep dive into decentralized finance and trading</p>
        <button className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl relative overflow-hidden text-left">
        <div className="text-4xl mb-2">π</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Pi Network GCV</h3>
        <p className="text-gray-400 text-xs mb-3">Understanding Pi Network at $314,159</p>
        <button className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
    </div>
  </div>
);\n`;
if (code.match(oldHeroRegex)) {
  code = code.replace(oldHeroRegex, newHero);
}

// 3. Quick Access and Payment Badges (add before footer)
const quickAccessCode = `
      {/* Payment Badges & Quick Access */}
      <div className="p-4 border-t border-[#333] bg-[#0a0a0a]">
        <h3 className="text-center text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Secured Payments</h3>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <div className="bg-[#111] border border-[#333] py-1 px-3 rounded-lg text-white text-[10px] font-bold">💳 Paystack</div>
          <div className="bg-[#111] border border-[#333] py-1 px-3 rounded-lg text-white text-[10px] font-bold">💳 Flutterwave</div>
          <div className="bg-[#111] border border-[#333] py-1 px-3 rounded-lg text-[#10B981] text-[10px] font-bold">💎 Crypto</div>
          <div className="bg-[#111] border border-[#333] py-1 px-3 rounded-lg text-[#8b5cf6] text-[10px] font-bold">π Pi GCV $314k</div>
        </div>
        
        <h3 className="text-center text-[#FFD700] text-sm font-bold mb-4 uppercase tracking-wider">🚀 QUICK ACCESS</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a href="https://www.gasv.store" className="bg-[#111] border border-[#333] p-3 rounded-xl flex flex-col items-center gap-2 text-center hover:border-[#FFD700] transition">
            <Globe className="text-[#FFD700]" size={20}/>
            <span className="text-white text-[10px] font-bold">Website</span>
          </a>
          <a href="#" className="bg-[#111] border border-[#333] p-3 rounded-xl flex flex-col items-center gap-2 text-center hover:border-[#FFD700] transition">
            <Search className="text-blue-400" size={20}/>
            <span className="text-white text-[10px] font-bold">Google</span>
          </a>
          <a href="https://wa.me/2348033584736" target="_blank" className="bg-[#111] border border-[#333] p-3 rounded-xl flex flex-col items-center gap-2 text-center hover:border-[#25D366] transition">
            <MessageCircle className="text-[#25D366]" size={20}/>
            <span className="text-white text-[10px] font-bold">WhatsApp<br/>+234 803 358 4736</span>
          </a>
          <a href="mailto:goye@gasv.store" className="bg-[#111] border border-[#333] p-3 rounded-xl flex flex-col items-center gap-2 text-center hover:border-[#FFD700] transition">
            <Mail className="text-[#FFD700]" size={20}/>
            <span className="text-white text-[10px] font-bold">Email</span>
          </a>
          <button onClick={handleInstallClick} className="col-span-2 bg-[#10B981] p-3 rounded-xl flex flex-col items-center gap-2 text-center hover:bg-[#059669] transition">
            <Download className="text-black" size={20}/>
            <span className="text-black text-xs font-bold">Install App</span>
          </button>
        </div>
      </div>
      <footer`;
code = code.replace('<footer', quickAccessCode);

// 4. Bottom Nav & Floating widgets
const bottomNavCode = `
      {/* Floating Widgets */}
      <div className="fixed bottom-24 right-4 z-[90] flex flex-col gap-3">
        <a href="https://wa.me/2348033584736" target="_blank" className="bg-[#25D366] text-white p-3 rounded-full shadow-lg shadow-[#25D366]/20">
          <MessageCircle size={24}/>
        </a>
        <button className="bg-[#FFD700] text-black p-3 rounded-full shadow-lg shadow-[#FFD700]/20">
          <Bot size={24}/>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] p-2 z-[100] max-w-[420px] mx-auto">
        <div className="flex justify-between items-center px-4">
          <button onClick={() => {setTab('home'); window.location.hash='home'}} className={\`flex flex-col items-center gap-1 \${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <Home size={20}/>
            <span className="text-[9px] font-bold">HOME</span>
          </button>
          <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`flex flex-col items-center gap-1 \${tab === 'shop' || tab === 'esim' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <ShoppingBag size={20}/>
            <span className="text-[9px] font-bold">STORE</span>
          </button>
          <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={\`flex flex-col items-center gap-1 \${tab === 'academy' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <GraduationCap size={20}/>
            <span className="text-[9px] font-bold">ACADEMY</span>
          </button>
          <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`flex flex-col items-center gap-1 \${tab === 'downloads' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <Download size={20}/>
            <span className="text-[9px] font-bold">ORDERS</span>
          </button>
        </div>
      </div>
    </div>
`;
code = code.replace('    </div>\n  );\n}', bottomNavCode + '\n  );\n}');

fs.writeFileSync('src/App.tsx', code);
