const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="flex gap-2 min-w-max">',
  '<div className="flex flex-nowrap w-max overflow-visible">'
);

code = code.replace(
  "className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition transform active:scale-95 flex items-center gap-2 ${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}`}",
  "className={`mr-2 px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition transform active:scale-95 flex items-center gap-2 ${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}`}"
);

fs.writeFileSync('src/App.tsx', code);
