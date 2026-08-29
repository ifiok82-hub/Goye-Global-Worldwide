const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Scan button
code = code.replace(/<button onClick=\{\(\) => setShowScanModal\(true\)\} className="flex items-center gap-1 bg-black text-\[#10B981\] px-2 py-1 rounded text-\[10px\] font-bold">/g, 
  '<button onClick={() => setShowScanModal(true)} className="flex items-center gap-1 bg-black text-[#10B981] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]">');

// Record button
code = code.replace(/<button onClick=\{\(\) => setShowVoiceModal\(true\)\} className="flex items-center gap-1 bg-black text-\[#3b82f6\] px-2 py-1 rounded text-\[10px\] font-bold">/g, 
  '<button onClick={() => setShowVoiceModal(true)} className="flex items-center gap-1 bg-black text-[#3b82f6] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]">');

// More button
code = code.replace(/<button onClick=\{\(\) => setShowMoreMenu\(!showMoreMenu\)\} className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-\[10px\] font-bold">/g, 
  '<button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]">');

// Profile dropdown
const dropdownRegex = /<div className="absolute top-\[80px\] right-\[10px\] bg-\[#111\] border border-\[#FFD700\] rounded-xl shadow-2xl z-\[99999\] w-\[200px\] overflow-hidden">/g;
const dropdownRep = `<div className="absolute top-[80px] right-[10px] bg-[#111] border border-[#FFD700] rounded-xl shadow-2xl z-[99999] w-[200px] overflow-hidden pointer-events-auto">`;
code = code.replace(dropdownRegex, dropdownRep);

// Replace button classes in the dropdown with `pointer-events-auto`
code = code.replace(/<button onClick=\{\(\) => \{ setShowReferralModal\(true\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={() => { setShowReferralModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{\(\) => \{ setShowLanguageModal\(true\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={() => { setShowLanguageModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{\(\) => \{ setShowCurrencyModal\(true\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={() => { setShowCurrencyModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{handlePushNotification\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={handlePushNotification} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{\(\) => \{ showToast\('Terms & Privacy opened.'\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={() => { showToast(\'Terms & Privacy opened.\'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{handleInstallClick\} className="w-full text-left px-4 py-3 border-b border-\[#222\] text-sm text-white hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={handleInstallClick} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

code = code.replace(/<button onClick=\{\(\) => \{ localStorage\.removeItem\('goye_active_user'\); setIsAuthenticated\(false\); setCurrentUser\(null\); setTab\('auth'\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-\[#222\] flex items-center gap-2">/g, 
  '<button onClick={() => { localStorage.removeItem(\'goye_active_user\'); setIsAuthenticated(false); setCurrentUser(null); setTab(\'auth\'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#222] flex items-center gap-2 cursor-pointer pointer-events-auto z-[100]">');

fs.writeFileSync('src/App.tsx', code);
