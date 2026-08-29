const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<button onClick=\{\(\) => \{ setSelectedProduct\(product\);  \}\} className="w-full bg-\[#FFD700\] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400">/g, 
  '<button onClick={() => { setSelectedProduct(product); }} className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 cursor-pointer pointer-events-auto z-10 touch-manipulation">');

code = code.replace(/<button onClick=\{\(\) => \{[\s\S]*?\}\} className="w-full bg-\[#10B981\]\/20 text-\[#10B981\] border border-\[#10B981\]\/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-\[#10B981\]\/30">/g, 
  (match) => match.replace('hover:bg-[#10B981]/30"', 'hover:bg-[#10B981]/30 cursor-pointer pointer-events-auto z-10 touch-manipulation"'));

fs.writeFileSync('src/App.tsx', code);
