const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{/* Bottom Navigation */}');
if(startIdx !== -1) {
  code = code.substring(0, startIdx) + `{/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] z-[100]">
        <div className="flex justify-between items-center px-4 py-2 overflow-x-auto scrollbar-hide w-full gap-6">
          <button onClick={() => {setTab('home'); window.location.hash='home'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'home' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <Home size={22} className={tab === 'home' ? 'fill-transparent' : ''}/>
            <span className="text-[10px] font-bold">HOME</span>
          </button>
          <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'shop' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <ShoppingBag size={22}/>
            <span className="text-[10px] font-bold">SHOP</span>
          </button>
          <button onClick={() => {setTab('esim'); window.location.hash='esim'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'esim' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <Globe size={22}/>
            <span className="text-[10px] font-bold">eSIM</span>
          </button>
          <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'academy' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <GraduationCap size={22}/>
            <span className="text-[10px] font-bold">ACADEMY</span>
          </button>
          <button onClick={() => {setTab('contracts'); window.location.hash='contracts'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'contracts' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <FileText size={22}/>
            <span className="text-[10px] font-bold">CONTRACTS</span>
          </button>
          <button onClick={() => {setTab('prompts'); window.location.hash='prompts'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'prompts' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <MessageCircle size={22}/>
            <span className="text-[10px] font-bold">PROMPTS</span>
          </button>
          <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'downloads' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <Download size={22}/>
            <span className="text-[10px] font-bold">DOWNLOADS</span>
          </button>
          <button onClick={() => {setTab('support'); window.location.hash='support'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition \${tab === 'support' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <MessageCircle size={22}/>
            <span className="text-[10px] font-bold">SUPPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
}`;
}

fs.writeFileSync('src/App.tsx', code);
