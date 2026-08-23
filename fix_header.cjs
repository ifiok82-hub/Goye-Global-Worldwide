const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const topBar = `      <header className="bg-[#000] sticky top-0 z-[50] border-b border-[#222]">
        <div className="bg-[#FFD700] text-black py-2 px-4 flex flex-col md:flex-row items-center justify-between text-[11px] md:text-xs font-bold font-mono text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <Globe size={14} /> GOYE Global Worldwide | RC BN3583773
          </div>
          <div className="flex items-center gap-3">
            <span>www.gasv.store</span>
            <span className="hidden md:inline">|</span>
            <span>goye@gasv.store</span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">`;

code = code.replace(
  '<header className="bg-[#000] p-3 sticky top-0 z-[50] border-b border-[#222]">\n        <div className="flex justify-center mt-2 overflow-x-auto pb-2 scrollbar-hide">',
  topBar
);

fs.writeFileSync('src/App.tsx', code);
