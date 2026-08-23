const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const bottomNavRegex = /\{\/\* Bottom Navigation \*\/\}[\s\S]*?<\/div>\n    <\/div>\n  \);\n\}/;
const newBottomNav = `{/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] pb-safe z-[100]">
        <div className="flex justify-between items-center px-2 py-2 overflow-x-auto scrollbar-hide max-w-full gap-2">
          <button onClick={() => {setTab('home'); window.location.hash='home'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <Home size={20}/>
            <span className="text-[9px] font-bold">HOME</span>
          </button>
          <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'shop' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <ShoppingBag size={20}/>
            <span className="text-[9px] font-bold">SHOP</span>
          </button>
          <button onClick={() => {setTab('esim'); window.location.hash='esim'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'esim' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <Globe size={20}/>
            <span className="text-[9px] font-bold">eSIM</span>
          </button>
          <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'academy' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <GraduationCap size={20}/>
            <span className="text-[9px] font-bold">ACADEMY</span>
          </button>
          <button onClick={() => {setTab('contracts'); window.location.hash='contracts'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'contracts' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <FileText size={20}/>
            <span className="text-[9px] font-bold">CONTRACTS</span>
          </button>
          <button onClick={() => {setTab('prompts'); window.location.hash='prompts'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'prompts' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <MessageCircle size={20}/>
            <span className="text-[9px] font-bold">PROMPTS</span>
          </button>
          <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'downloads' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <Download size={20}/>
            <span className="text-[9px] font-bold">DOWNLOADS</span>
          </button>
          <button onClick={() => {setTab('support'); window.location.hash='support'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 \${tab === 'support' ? 'text-gray-400' : 'text-gray-500'}\`}>
            <MessageCircle size={20}/>
            <span className="text-[9px] font-bold">SUPPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(bottomNavRegex, newBottomNav);
fs.writeFileSync('src/App.tsx', code);
