const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Language modal
code = code.replace(/<button onClick=\{\(\) => setShowLanguageModal\(false\)\} className="absolute top-2 right-2 text-gray-500 font-bold">X<\/button>/g, 
  '<button onClick={() => setShowLanguageModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>');

code = code.replace(/<button key=\{lang\} onClick=\{\(\) => \{ showToast\(lang \+ ' selected'\); setShowLanguageModal\(false\); \}\} className="w-full text-left p-3 border-b border-\[#222\] text-white hover:bg-\[#222\]">/g, 
  '<button key={lang} onClick={() => { showToast(lang + \' selected\'); setShowLanguageModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] cursor-pointer pointer-events-auto z-[100] font-bold">');

// Currency modal
code = code.replace(/<button onClick=\{\(\) => setShowCurrencyModal\(false\)\} className="absolute top-2 right-2 text-gray-500 font-bold">X<\/button>/g, 
  '<button onClick={() => setShowCurrencyModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>');

code = code.replace(/<button key=\{curr\} onClick=\{\(\) => \{ localStorage\.setItem\('goye_currency', curr\); setCurrentCurrency\(curr\); showToast\('Currency set to ' \+ curr\); setShowCurrencyModal\(false\); window\.location\.reload\(\); \}\} className="w-full text-left p-3 border-b border-\[#222\] text-white hover:bg-\[#222\] font-bold">/g, 
  '<button key={curr} onClick={() => { localStorage.setItem(\'goye_currency\', curr); setCurrentCurrency(curr); showToast(\'Currency set to \' + curr); setShowCurrencyModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] font-bold cursor-pointer pointer-events-auto z-[100]">');

fs.writeFileSync('src/App.tsx', code);
