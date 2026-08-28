const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace header
const oldHeaderRegex = /<header style=\{\{ position: 'sticky'.*?<\/header>/s;
const newHeader = `<header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', background: '#FFD700', minHeight: '60px', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 999 }}>
            {!isAuthenticated ? (
                <button onClick={() => setTab('auth')} className="px-3 py-1 bg-white text-black text-xs font-bold rounded shadow-md border border-gray-300">Login / Register</button>
            ) : (
                <div className="flex flex-col items-center justify-center bg-white border border-[#333] rounded-full w-[36px] h-[36px] cursor-pointer overflow-hidden shadow-md" onClick={() => { setShowMoreMenu(!showMoreMenu); }}>
                    {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="User" className="w-full h-full object-cover" /> : <User size={16} className="text-black" />}
                </div>
            )}
        </div>
        <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}>
            <GoyeLogo size={40} className="text-black mb-1" />
            <h1 className="text-black font-black text-sm leading-tight uppercase">GOYE Global Worldwide</h1>
            <div className="text-[10px] text-black font-bold">RC BN3583773</div>
            <div className="text-[10px] text-black font-bold">www.gasv.store</div>
            <div className="text-[10px] text-black font-bold">goye@gasv.store</div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => setShowQRModal(true)} className="flex items-center gap-1 bg-black text-[#FFD700] px-2 py-1 rounded text-[10px] font-bold"><Camera size={12} /> QR</button>
            <button onClick={() => setShowScanModal(true)} className="flex items-center gap-1 bg-black text-[#10B981] px-2 py-1 rounded text-[10px] font-bold"><Search size={12} /> Scan</button>
            <button onClick={() => setShowVoiceModal(true)} className="flex items-center gap-1 bg-black text-[#3b82f6] px-2 py-1 rounded text-[10px] font-bold"><Mic size={12} /> Record</button>
            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-[10px] font-bold"><MoreHorizontal size={12} /> More</button>
        </div>
        {showMoreMenu && (
            <div className="absolute top-[80px] right-[10px] bg-[#111] border border-[#333] rounded-xl shadow-2xl z-[5000] w-[200px] overflow-hidden">
                <button onClick={() => { setShowReferralModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Users size={16} className="text-[#FFD700]"/> 🤝 Referral & Earn</button>
                <button onClick={() => { setShowLanguageModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Globe size={16} className="text-[#3b82f6]"/> 🌐 Language</button>
                <button onClick={() => { setShowCurrencyModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><DollarSign size={16} className="text-[#10B981]"/> 💱 Currency ({currentCurrency})</button>
                <button onClick={handlePushNotification} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Bell size={16} className="text-[#FF8C00]"/> 🔔 Notifications</button>
                <button onClick={() => { showToast('Terms & Privacy opened.'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><FileText size={16} className="text-[#10B981]"/> 📄 Terms & Privacy</button>
                <button onClick={handleInstallClick} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Smartphone size={16} className="text-[#8b5cf6]"/> 📲 Install App</button>
                <button onClick={() => { localStorage.removeItem('goye_active_user'); setIsAuthenticated(false); setCurrentUser(null); setTab('auth'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#222] flex items-center gap-2"><Lock size={16} className="text-red-500"/> 🚪 Log Out</button>
            </div>
        )}
      </header>`;

code = code.replace(oldHeaderRegex, newHeader);

// Clean up the leftover old buttons that were below the old header
const startToken = `<div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end pt-1 relative w-full sm:w-auto">`;
const endToken = `</div>\n            )}`;
if(code.includes(startToken)) {
   const before = code.substring(0, code.indexOf(startToken));
   // find the closing of this block
   const blockRegex = /<div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end pt-1 relative w-full sm:w-auto">.*?<\/div>\s*\}\)\s*<\/div>/s;
   code = code.replace(blockRegex, '');
}

fs.writeFileSync('src/App.tsx', code);
