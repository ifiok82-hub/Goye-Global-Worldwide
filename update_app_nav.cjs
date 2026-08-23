const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Top nav buttons
code = code.replace(
  "className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition flex items-center gap-2 ${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}`}",
  "className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition transform active:scale-95 flex items-center gap-2 ${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}`}"
);

// Bottom nav buttons
code = code.replace(/className=\{\`flex flex-col items-center justify-center min-w-\[50px\] gap-1 transition /g, 
  "className={`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 ");

fs.writeFileSync('src/App.tsx', code);
