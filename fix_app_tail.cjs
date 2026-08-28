const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{showCurrencyModal && \([\s\S]*/;
const rep = `{showCurrencyModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[300px] flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowCurrencyModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-white mb-4">Select Currency</h3>
            {['USD', 'NGN', 'GBP', 'EUR', 'CAD', 'AUD', 'INR', 'ZAR'].map(curr => (
               <button key={curr} onClick={() => { localStorage.setItem('goye_currency', curr); setCurrentCurrency(curr); showToast('Currency set to ' + curr); setShowCurrencyModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] font-bold">{curr}</button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Nav */}
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
        <a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" className="min-w-[60px] flex-shrink-0 flex flex-col items-center justify-center gap-1 transition transform active:scale-90 active:opacity-70 text-gray-500 hover:text-[#25D366]">
          <MessageCircle size={24} />
          <span className="text-[9px] font-bold">SUPPORT</span>
        </a>
      </nav>
      {/* Floating Widgets */}
      <div className="fixed bottom-[90px] right-[20px] z-[99999] cursor-pointer pointer-events-auto">
        <button onClick={() => setShowSirwiseBot(true)} className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black">
          🤖
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#10B981] text-black px-6 py-3 rounded-full font-bold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(regex, rep);
fs.writeFileSync('src/App.tsx', code);
