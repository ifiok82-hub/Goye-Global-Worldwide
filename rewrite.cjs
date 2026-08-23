const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Rewrite HeroSection
const oldHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
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
);`;

const newHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
  <div className="bg-[#000] border-b-2 border-[#FFD700] p-6 text-center">
    <div onClick={onLogoTap} className="inline-block cursor-pointer">
      <GoyeLogo size={60} className="mx-auto mb-2 text-[#FFD700]"/>
      <h1 className="text-[#FFD700] text-3xl font-black tracking-widest mb-1">SIRWISE AI WEB3 ACADEMY</h1>
      <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-4">GOYE Global Worldwide - RC BN3583773</p>
    </div>
    <div className="grid grid-cols-1 gap-4 mt-6 max-w-[420px] mx-auto">
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
);`;

if(code.includes('md:grid-cols-3')) {
  code = code.replace(oldHero, newHero);
}

// 2. Change min-h-screen class
code = code.replace('<div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-24">', '<div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-24 max-w-[420px] mx-auto border-x border-[#222]">');

// 3. Change main max-w
code = code.replace('<main className="max-w-7xl mx-auto pb-12">', '<main className="w-full mx-auto pb-12">');
code = code.replace('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', 'grid grid-cols-1 gap-6');
code = code.replace('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', 'grid grid-cols-1 gap-6');

// 4. Rewrite Footer
const oldFooterStart = '<footer id="support"';
const footerEndIndex = code.indexOf('</footer>') + 9;
const oldFooterFull = code.substring(code.indexOf(oldFooterStart), footerEndIndex);

const newFooter = `<footer id="support" style={{background:'#000', borderTop:'3px solid #FFD700', padding:'40px 15px', marginTop:'50px', textAlign:'center'}}>
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
      </footer>`;

if(oldFooterFull.includes('footer')) {
  code = code.replace(oldFooterFull, newFooter);
}

// Ensure RealQRCode import is removed from App.tsx since we are hardcoding the only QR
code = code.replace("import RealQRCode from './components/RealQRCode';\n", "");

fs.writeFileSync('src/App.tsx', code);
