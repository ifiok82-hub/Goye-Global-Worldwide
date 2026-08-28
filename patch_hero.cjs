const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const HeroSection = \(\{ onLogoTap \}: \{ onLogoTap: \(\) => void \}\) => \([\s\S]*?\n\);\n/;
const replacement = `const HeroSection = ({ onLogoTap }: { onLogoTap: () => void }) => (
  <div className="text-center py-6 relative" id="home">
    <div className="mb-6 flex flex-col items-center justify-center cursor-pointer pointer-events-auto" onClick={onLogoTap}>
      <div className="relative mb-4">
        <GoyeLogo size={100} className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]" />
        <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-black animate-pulse"></div>
      </div>
      <h1 className="text-3xl font-black text-[#FFD700] mb-1 tracking-tighter uppercase leading-none">Sirwise AI</h1>
      <h2 className="text-white text-xl font-bold uppercase tracking-tight leading-none">GOYE Global Worldwide</h2>
    </div>
    
    <div id="programs" className="mt-8 pt-8 border-t border-[#333]">
        <h2 className="text-[#FFD700] text-2xl font-black mb-6 uppercase">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-white font-bold mb-1">AI Mastery</h3>
            <p className="text-gray-400 text-xs mb-4">Master AI and machine learning for business</p>
            <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer pointer-events-auto touch-manipulation z-[10] relative">Start Learning</button>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-white font-bold mb-1">Crypto & DeFi</h3>
            <p className="text-gray-400 text-xs mb-4">Deep dive into decentralized finance and trading</p>
            <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer pointer-events-auto touch-manipulation z-[10] relative">Start Learning</button>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border border-[#333] hover:border-[#FFD700] transition">
            <div className="text-3xl mb-2">π</div>
            <h3 className="text-white font-bold mb-1">Pi Network GCV</h3>
            <p className="text-gray-400 text-xs mb-4">Understanding Pi Network at Global Consensus Value</p>
            <button onClick={() => { window.location.hash = 'academy'; }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2 rounded-lg cursor-pointer pointer-events-auto touch-manipulation z-[10] relative">Start Learning</button>
          </div>
        </div>
    </div>
    
    <div id="our-method" className="mt-12 pt-8 border-t border-[#333] text-left">
        <h2 className="text-[#FFD700] text-2xl font-black mb-4 uppercase">How Sirwise AI Teaches</h2>
        <div className="bg-[#111] p-6 rounded-2xl border border-[#FFD700]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap size={100} /></div>
            <h3 className="text-white font-bold text-lg mb-2 relative z-10">24/7 AI Tutor Access</h3>
            <p className="text-gray-400 text-sm mb-4 relative z-10">Our intelligent Web3 platform gives you personalized pacing, interactive quizzes, and instant grading. Start anytime, anywhere.</p>
        </div>
    </div>
    
    <div id="community" className="mt-12 pt-8 border-t border-[#333] text-left mb-8">
        <h2 className="text-[#10B981] text-2xl font-black mb-4 uppercase">Join The Community</h2>
        <div className="bg-[#111] p-6 rounded-2xl border border-[#10B981]/30">
            <p className="text-gray-400 text-sm mb-4">Connect with thousands of global students. Share insights, get help, and grow together.</p>
            <a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI" target="_blank" className="bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-[10] relative">
                <MessageCircle size={20} /> Chat on WhatsApp
            </a>
        </div>
    </div>
  </div>
);
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
