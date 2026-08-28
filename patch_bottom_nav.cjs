const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newNav = `{/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#0a0a0a] border-t border-[#222] z-[5000] flex overflow-x-auto items-center justify-between px-2 pb-safe w-full max-w-[420px] mx-auto hide-scrollbar pointer-events-auto">
        <button onClick={() => {setTab('home'); window.location.hash='home'}} className={\`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
          <Home size={24} />
          <span className="text-[9px] font-bold">HOME</span>
        </button>
        <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'shop' || tab === 'esim' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
          <ShoppingBag size={24} />
          <span className="text-[9px] font-bold">SHOP</span>
        </button>
        <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={\`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'academy' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
          <GraduationCap size={24} />
          <span className="text-[9px] font-bold">ACADEMY</span>
        </button>
        <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'downloads' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
          <Download size={24} />
          <span className="text-[9px] font-bold">DOWNLOADS</span>
        </button>
        <a href="https://wa.me/2348033584736" target="_blank" className="min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 text-gray-500 hover:text-[#25D366]">
          <MessageCircle size={24} />
          <span className="text-[9px] font-bold">SUPPORT</span>
        </a>
      </nav>
      {/* Floating Widgets */}`;

const navRegex = /\{isAuthenticated && <div className="fixed bottom-0 left-0 right-0 bg-\[#000\] border-t border-\[#333\] z-\[5000\] pb-safe pointer-events-auto">.*?<\/svg>\s*<span className="text-\[10px\] font-bold">MY DOWNLOADS<\/span>\s*<\/button>\s*<\/div>\s*<\/div>}/s;

code = code.replace(navRegex, newNav);
fs.writeFileSync('src/App.tsx', code);
