const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const floatingRegex = /\{\/\* Floating Widgets \*\/\}[\s\S]*?\{\/\* Bottom Navigation \*\/\}/;
const newFloating = `{/* Floating Widgets */}
      <div className="fixed bottom-20 left-4 z-[90]">
        <a href="https://wa.me/2348033584736" target="_blank" className="bg-[#10B981] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative transition hover:scale-105">
          <MessageCircle size={28}/>
          <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-[#111]"></div>
        </a>
      </div>
      <div className="fixed bottom-20 right-4 z-[90]">
        <button className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative transition hover:scale-105">
          <Bot size={28}/>
          <div className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-[#111]"></div>
        </button>
      </div>

      {/* Bottom Navigation */}`;

code = code.replace(floatingRegex, newFloating);
fs.writeFileSync('src/App.tsx', code);
