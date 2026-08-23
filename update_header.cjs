const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeaderRegex = /<header className="bg-\[#000\] sticky top-0 z-\[50\] border-b border-\[#333\]">[\s\S]*?<\/header>/;
const newHeader = `
      <header className="bg-[#000] sticky top-0 z-[50] border-b border-[#333]">
        <div className="flex items-start justify-between p-3 border-b border-[#222]">
          <div className="flex items-start gap-3 cursor-pointer" onClick={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}>
            <GoyeLogo size={48} className="text-[#FFD700] mt-1" />
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-sm leading-tight">GOYE<br/>Global<br/>Worldwide</h1>
              <div className="text-[10px] text-gray-400 mt-1">RC BN3583773</div>
              <div className="text-[10px] text-[#FFD700]">www.gasv.store</div>
              <div className="text-[10px] text-gray-400">goye@gasv.store</div>
              <div className="text-[10px] text-gray-400">goyedagosmess@gmail.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end max-w-[140px] pt-1">
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#FFD700] rounded-xl w-[42px] h-[42px]">
              <Camera size={14} className="text-[#9ca3af]" />
              <span className="text-[#FFD700] text-[8px] font-bold mt-1">QR</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#10B981] rounded-xl w-[42px] h-[42px]">
              <Search size={14} className="text-[#3b82f6]" />
              <span className="text-[#10B981] text-[8px] font-bold mt-1">Scan</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px]">
              <Mic size={14} className="text-[#3b82f6]" />
              <span className="text-white text-[8px] font-bold mt-1">Record</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px]">
              <MoreHorizontal size={14} className="text-white" />
              <span className="text-white text-[8px] font-bold mt-1">More</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide bg-[#111] p-2">
          <div className="flex gap-2 min-w-max">
            {['HOME', 'SHOP', 'eSIM', 'ACADEMY', 'CONTRACTS', 'PROMPTS', 'DOWNLOADS', 'SUPPORT'].map((t) => (
              <button 
                key={t}
                onClick={() => { setTab(t.toLowerCase()); window.location.hash = t.toLowerCase(); }}
                className={\`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition flex items-center gap-2 \${tab.toUpperCase() === t || (tab==='home' && t==='HOME') ? 'bg-transparent text-white border border-white' : 'text-gray-400 hover:text-white bg-transparent'}\`}
              >
                {t === 'HOME' && <Home size={14}/>}
                {t === 'SHOP' && <ShoppingBag size={14}/>}
                {t === 'eSIM' && <Globe size={14}/>}
                {t === 'ACADEMY' && <GraduationCap size={14}/>}
                {t === 'CONTRACTS' && <FileText size={14}/>}
                {t === 'PROMPTS' && <MessageCircle size={14}/>}
                {t === 'DOWNLOADS' && <Download size={14}/>}
                {t === 'SUPPORT' && <MessageCircle size={14}/>}
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>
`;

code = code.replace(oldHeaderRegex, newHeader.trim());
fs.writeFileSync('src/App.tsx', code);
