const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navCode = `
      {isAuthenticated && <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] z-[5000] pb-safe pointer-events-auto">
        <div className="flex justify-around items-center p-3">
          <button onClick={() => {setTab('academy'); window.location.hash='academy'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'academy' ? 'text-[#FFD700]' : 'text-gray-500'}\`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span className="text-[10px] font-bold">ACADEMY</span>
          </button>
          <button onClick={() => {setTab('shop'); window.location.hash='shop'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'shop' || tab === 'esim' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path></svg>
            <span className="text-[10px] font-bold">STORE & eSIM</span>
          </button>
          <button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`flex flex-col items-center justify-center min-w-[50px] gap-1 transition transform active:scale-90 active:opacity-70 \${tab === 'downloads' ? 'text-gray-300' : 'text-gray-500'}\`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            <span className="text-[10px] font-bold">MY DOWNLOADS</span>
          </button>
        </div>
      </div>
      {/* Floating Widgets */}`;

code = code.replace("{/* Floating Widgets */}", navCode);
fs.writeFileSync('src/App.tsx', code);
