const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="absolute top-\[80px\] right-\[10px\] bg-\[#111\] border border-\[#FFD700\] rounded-xl shadow-2xl z-\[99999\] w-\[200px\] overflow-hidden">/;
const replacement = `<div className="absolute top-[80px] right-[10px] bg-[#111] border border-[#FFD700] rounded-xl shadow-2xl z-[99999] w-[200px] overflow-hidden">
                <button onClick={() => setShowMoreMenu(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white pointer-events-auto z-10"><X size={16} /></button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
