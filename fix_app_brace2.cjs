const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const errorLine = "{product.badge && <div className=\"absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl\">{product.badge}</div>";
const fixLine = "{product.badge && <div className=\"absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl\">{product.badge}</div>}";

code = code.replace(errorLine, fixLine);
fs.writeFileSync('src/App.tsx', code);
