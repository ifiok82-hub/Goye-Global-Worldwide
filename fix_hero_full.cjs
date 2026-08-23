const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const heroStart = code.indexOf('const HeroSection =');
const heroEnd = code.indexOf(';\n\nconst ContractGeneratorModal', heroStart) + 1;

const newHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: { onLogoTap?: () => void, onPlayVideo?: () => void }) => (
  <div className="bg-[#000] border-b-2 border-[#FFD700] p-6 text-center">
    <div onClick={onLogoTap} className="inline-block cursor-pointer">
      <GoyeLogo size={60} className="mx-auto mb-2 text-[#FFD700]"/>
      <h1 className="text-[#FFD700] text-3xl font-black tracking-widest mb-1">SIRWISE AI WEB3 ACADEMY</h1>
      <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-4">GOYE Global Worldwide - RC BN3583773</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl">
        <div className="text-4xl mb-2">🤖</div>
        <h3 className="text-[#FFD700] font-bold text-lg">AI Mastery</h3>
        <p className="text-gray-400 text-xs mb-3">Master AI and machine learning for business</p>
        <button onClick={() => window.location.hash='#academy'} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl">
        <div className="text-4xl mb-2">💰</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Crypto & DeFi</h3>
        <p className="text-gray-400 text-xs mb-3">Deep dive into decentralized finance and trading</p>
        <button onClick={() => window.location.hash='#academy'} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
      <div className="bg-[#111] border-2 border-[#FFD700] p-5 rounded-2xl">
        <div className="text-4xl mb-2">π</div>
        <h3 className="text-[#FFD700] font-bold text-lg">Pi Network GCV</h3>
        <p className="text-gray-400 text-xs mb-3">Understanding Pi Network at $314,159</p>
        <button onClick={() => window.location.hash='#academy'} className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl hover:scale-105 transition">Start Learning</button>
      </div>
    </div>
  </div>
);`;

code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
fs.writeFileSync('src/App.tsx', code);
