const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex justify-center gap-4 mt-2">/;
const replacement = `<div className="flex flex-wrap justify-center gap-2 mt-3 px-2 z-[60] relative" style={{ pointerEvents: 'auto' }}>
            <button onClick={() => { document.getElementById('programs')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Programs</button>
            <button onClick={() => { document.getElementById('our-method')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Our method</button>
            <button onClick={() => { document.getElementById('community')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Community</button>
            <button onClick={() => { if(!isAuthenticated) setTab('auth'); else { setTab('academy'); setTimeout(()=>document.getElementById('dashboard')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="text-[#FFD700] bg-black font-bold text-[10px] hover:bg-black/80 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Student dashboard <ChevronRight size={10} /></button>
            <button onClick={() => { setTab('academy'); }} className="text-white bg-blue-900 font-bold text-[10px] hover:bg-blue-800 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Start learning <ChevronRight size={10} /></button>
            <button onClick={() => setShowReferralModal(true)} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Referral</button>
        </div>
        <div className="w-full bg-[#FFD700] text-black text-center text-[10px] font-black py-1 cursor-pointer pointer-events-auto z-[100] relative" onClick={() => document.getElementById('programs')?.scrollIntoView({behavior:'smooth'})}>
          EXPLORE THE PROGRAMS →
        </div>
        <div className="flex justify-center gap-4 mt-2 z-[60] relative pointer-events-auto">`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
