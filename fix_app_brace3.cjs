const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const botSectionRegex = /<button onClick=\{\(\) => setIsAiTeacherOpen\(true\)\} className="bg-\[\#FFD700\] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-\[0_0_20px_rgba\(255,215,0,0\.4\)\] relative transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black">\s*🤖\s*<\/button>\s*<\/div>\}/;

code = code.replace(botSectionRegex, 
`<button onClick={() => setIsAiTeacherOpen(true)} className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black">
          🤖
        </button>
      </div>`);
      
const botSectionRegex2 = /🤖\s*<\/button>\s*<\/div>\}/g;
code = code.replace(botSectionRegex2, `🤖\n        </button>\n      </div>`);

fs.writeFileSync('src/App.tsx', code);
