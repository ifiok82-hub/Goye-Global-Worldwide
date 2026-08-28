const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

code = code.replace(/<input type="text" placeholder="Your School Name \(Optional\)" className="w-full bg-black\/50 border border-\[#333\] focus:border-\[#FFD700\] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" \/>\s*<\/div>\s*\)\}/g, `<input type="text" placeholder="Your School Name (Optional)" className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" /> </div> </> )}`);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
