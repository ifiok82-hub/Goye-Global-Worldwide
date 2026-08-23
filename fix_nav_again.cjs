const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newNav = `<div className="flex bg-[#111] p-1.5 rounded-2xl border border-[#333] shadow-inner shrink-0">
            <button onClick={() => setTab('home')} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'home' || tab === 'academy' ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#e5c100]' : 'text-[#888] hover:text-[#FFD700] border border-transparent'}\`}><GraduationCap size={16}/> Academy</button>
            <button onClick={() => setTab('shop')} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'shop' || tab === 'esim' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}\`}><ShoppingBag size={16}/> Store & eSIM</button>
            <button onClick={() => { setTab('downloads'); window.scrollTo({top:0, behavior:"smooth"}); }} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'downloads' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}\`}><Download size={16}/> My Downloads</button>
            {isAdmin && (
              <button onClick={() => setTab('admin')} className={\`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ml-1 \${tab.startsWith('admin') ? 'bg-[#2a2a2a] text-[#FFD700] shadow-md border border-[#444]' : 'text-[#888] hover:text-[#FFD700] border border-transparent'}\`}>
                <Settings size={14}/> Admin
              </button>
            )}
          </div>`;

code = code.replace(/<div className="flex bg\[#111\] p-1\.5 rounded-2xl border border\[#333\] shadow-inner shrink-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/, newNav + '\n        </div>\n      </header>');

fs.writeFileSync('src/App.tsx', code);
