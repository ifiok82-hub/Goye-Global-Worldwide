const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "{/* Toast Notification */}";
const replace = `<button onClick={() => setIsAiTeacherOpen(true)} className="fixed bottom-[90px] right-[20px] w-[60px] h-[60px] bg-[#FFD700] rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,215,0,0.4)] z-[99] hover:scale-110 transition cursor-pointer pointer-events-auto">
        🤖
      </button>
      {/* Toast Notification */}`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
