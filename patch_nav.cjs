const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add IDs to sections
code = code.replace('<div className="px-4 mt-8 mb-12">', '<div id="academy" className="px-4 mt-8 mb-12">');
code = code.replace('<div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Instant Global eSIM Data</h2>', '<div id="esim" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Instant Global eSIM Data</h2>');
code = code.replace('<div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Digital Shop</h2>', '<div id="shop" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Digital Shop</h2>');
code = code.replace('{tab === \'contracts\' && (', '{(tab === \'home\' || tab === \'contracts\') && (');
code = code.replace('<div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Contract Generator</h2>', '<div id="contracts" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Contract Generator</h2>');
code = code.replace('{tab === \'prompts\' && (', '{(tab === \'home\' || tab === \'prompts\') && (');
code = code.replace('<div className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Prompt Store</h2>', '<div id="prompts" className="px-4 animate-in fade-in duration-500 mt-4 mb-8">\n            <div className="text-center mb-8">\n              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">AI Prompt Store</h2>');

// 2. Add toast state
if (!code.includes('const [toast, setToast]')) {
  code = code.replace('const [processing, setProcessing] = useState(false);', 'const [processing, setProcessing] = useState(false);\n  const [toast, setToast] = useState({message: "", show: false});\n  const showToast = (msg: string) => { setToast({message: msg, show: true}); setTimeout(()=>setToast({message: "", show: false}), 3000); };');
}

// 3. Fix yellow buttons
// Watch How eSIM Works
code = code.replace('<div className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">', '<div onClick={() => { alert("Video: eSIM QR scan instantly 190+ countries - Buy eSIM at shop below"); setTimeout(()=>document.getElementById("esim")?.scrollIntoView({behavior:"smooth"}), 100); }} className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">');

// Download Free (eBook)
code = code.replace(
  '<button onClick={() => { const email = prompt(\'Enter email to download:\'); if(email) alert(\'eBook sent to \' + email); }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition">Download Free</button>',
  '<button onClick={() => { const email = prompt(\'Enter email to download:\'); if(email) { const existing = JSON.parse(localStorage.getItem(\'goye_purchased_digital_products\') || \'[]\'); existing.push({name: "5 Ways to Make Money with AI 2024 eBook", date: new Date().toISOString()}); localStorage.setItem(\'goye_purchased_digital_products\', JSON.stringify(existing)); showToast("eBook downloaded! Check DOWNLOADS tab"); setTab("downloads"); } }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition cursor-pointer">Download Free</button>'
);

// Claim Free Trial
code = code.replace(
  '<button onClick={() => { const email = prompt(\'Enter email to claim:\'); if(email) alert(\'eSIM QR sent to \' + email); }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition">Claim Free Trial</button>',
  '<button onClick={() => { const email = prompt(\'Enter email to claim:\'); if(email) { const code = "TRIAL-1GB-"+Math.random().toString(36).substr(2,5).toUpperCase(); const existing = JSON.parse(localStorage.getItem(\'goye_purchased_digital_products\') || \'[]\'); existing.push({name: "Free eSIM 1GB Trial QR", code, date: new Date().toISOString()}); localStorage.setItem(\'goye_purchased_digital_products\', JSON.stringify(existing)); alert("Your Free Trial QR Code: " + code + " - Use at checkout! First 100 users only!"); setTimeout(()=>document.getElementById("esim")?.scrollIntoView({behavior:"smooth"}), 100); } }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition cursor-pointer">Claim Free Trial</button>'
);

// Watch Free Lesson
code = code.replace(
  '<button onClick={() => alert(\'Starting video player...\')} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition flex justify-center items-center gap-1">Watch Free Lesson</button>',
  '<button onClick={() => { alert("AI Course Module 1: Introduction to AI - Free Preview"); setTimeout(()=>document.getElementById("academy")?.scrollIntoView({behavior:"smooth"}), 100); }} className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-yellow-500 transition flex justify-center items-center gap-1 cursor-pointer">Watch Free Lesson</button>'
);

// 4. Update Bottom Nav logic & fix overlapping
code = code.replace(
  '<div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#333] flex items-center overflow-x-auto p-2 z-[50] pb-safe scrollbar-hide"',
  '<div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#333] flex items-center overflow-x-auto p-2 z-[1000] pb-safe scrollbar-hide pointer-events-auto"'
);

// Nav buttons
const navItems = [
  { tab: 'home', icon: '<Home size={20}', text: 'HOME', id: 'top' },
  { tab: 'shop', icon: '<ShoppingBag size={20}', text: 'SHOP', id: 'shop' },
  { tab: 'esim', icon: '<Globe size={20}', text: 'eSIM', id: 'esim' },
  { tab: 'academy', icon: '<GraduationCap size={20}', text: 'ACADEMY', id: 'academy' },
  { tab: 'contracts', icon: '<FileText size={20}', text: 'CONTRACTS', id: 'contracts' },
  { tab: 'prompts', icon: '<MessageCircle size={20}', text: 'PROMPTS', id: 'prompts' },
];

let navReplacement = '';
navItems.forEach(item => {
  navReplacement += `        <button onClick={(e) => { e.preventDefault(); setTab('home'); setTimeout(() => { if('${item.id}'==='top') window.scrollTo({top:0, behavior:'smooth'}); else document.getElementById('${item.id}')?.scrollIntoView({behavior:'smooth'}); }, 50); }} className={\`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer \${tab === 'home' || tab === '${item.tab}' ? 'text-[#FFD700]' : 'text-[#888]'}\`}>\n          ${item.icon} className="mb-1 mx-auto"/>\n          <div className="text-[9px] font-bold whitespace-nowrap">${item.text}</div>\n        </button>\n`;
});

// Replace the old nav buttons block
const startNavIndex = code.indexOf('<button onClick={() => setTab(\'home\')');
const endNavIndex = code.indexOf('<button onClick={() => { trackClick(\'nav\', \'My Downloads\')');
if (startNavIndex > -1 && endNavIndex > -1) {
  code = code.substring(0, startNavIndex) + navReplacement + code.substring(endNavIndex);
}

// Ensure Downloads is working
code = code.replace(
  '<button onClick={() => { trackClick(\'nav\', \'My Downloads\'); setTab(\'downloads\'); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] ${tab === \'downloads\' ? \'text-[#FFD700]\' : \'text-[#888]\'}`}>',
  '<button onClick={(e) => { e.preventDefault(); trackClick(\'nav\', \'My Downloads\'); setTab(\'downloads\'); window.scrollTo({top:0, behavior:"smooth"}); }} className={`text-center flex flex-col items-center justify-center p-1 min-w-[70px] cursor-pointer ${tab === \'downloads\' ? \'text-[#FFD700]\' : \'text-[#888]\'}`}>'
);

// Ensure Support works
code = code.replace(
  '<button onClick={() => { trackClick(\'external\', \'Email goye@gasv.store\'); window.location.href=\'mailto:goye@gasv.store\'; }} className="text-center flex flex-col items-center justify-center p-1 min-w-[70px] text-[#888]">',
  '<button onClick={(e) => { e.preventDefault(); window.location.href="https://wa.me/2348033584736?text=Hello GOYE Support"; }} className="text-center flex flex-col items-center justify-center p-1 min-w-[70px] text-[#888] hover:text-[#FFD700] cursor-pointer">'
);

// 5. Fix overlapping buttons
code = code.replace(
  'className="fixed bottom-24 right-4 z-[90] bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform"',
  'className="fixed bottom-[100px] right-[16px] z-[998] bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform cursor-pointer"'
);

code = code.replace(
  'className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] z-[99] hover:scale-110 transition flex items-center justify-center group"',
  'className="fixed bottom-[100px] left-[16px] bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] z-[998] hover:scale-110 transition flex items-center justify-center group cursor-pointer"'
);

// Insert Toast JSX just before </main> or at the end of the return
code = code.replace('</main>', `</main>\n      {toast.show && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-black border-2 border-[#FFD700] text-white px-6 py-3 rounded-xl font-bold shadow-2xl animate-in slide-in-from-top-4">{toast.message}</div>}`);

fs.writeFileSync('src/App.tsx', code);
