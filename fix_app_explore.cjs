const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="w-full bg-\[#FFD700\] text-black text-center text-\[10px\] font-black py-1 cursor-pointer pointer-events-auto z-\[100\] relative" onClick=\{[\s\S]*?\}>\s*EXPLORE THE PROGRAMS →\s*<\/button>/g;
const rep = `<button onClick={() => { const el = document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }} className="w-full bg-[#FFD700] text-black text-center text-[10px] font-black py-1 cursor-pointer pointer-events-auto z-[100] relative block">
          EXPLORE THE PROGRAMS →
        </button>`;

code = code.replace(regex, rep);
fs.writeFileSync('src/App.tsx', code);
