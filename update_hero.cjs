const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeroRegex = /const HeroSection = \(\{ onLogoTap, onPlayVideo \}: any\) => \([\s\S]*?\);\n/;
const newHero = `const HeroSection = ({ onLogoTap, onPlayVideo }: any) => (
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
);\n`;

code = code.replace(oldHeroRegex, newHero);
fs.writeFileSync('src/App.tsx', code);
