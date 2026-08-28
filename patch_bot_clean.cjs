const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will insert it where the Floating Widgets section is
const floatingWidgets = /{?\/\* Floating Widgets \*\/}?/;

const newWidgets = `{/* Floating Widgets */}
      <div className="fixed bottom-[90px] right-[20px] z-[99999] cursor-pointer pointer-events-auto">
        <button onClick={() => setIsAiTeacherOpen(true)} className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative transition hover:scale-105 active:scale-95 border-2 border-black text-2xl font-black">
          🤖
        </button>
      </div>`;

if(code.match(floatingWidgets)) {
  const oldWidgetsRegex = /\{\/\* Floating Widgets \*\/\}.*?<\/div>\s*<\/div>/s;
  code = code.replace(oldWidgetsRegex, newWidgets);
} else {
  // just insert before Toast
  const toastStr = "{/* Toast Notification */}";
  code = code.replace(toastStr, newWidgets + '\n      ' + toastStr);
}

fs.writeFileSync('src/App.tsx', code);
