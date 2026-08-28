const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHero = /const HeroSection = \(\{ onLogoTap, onPlayVideo \}: any\) => \(\s*<div.*?<\/div>\s*\);/s;
const newHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
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
);`;

code = code.replace(oldHero, newHero);
fs.writeFileSync('src/App.tsx', code);
