const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = 'className="absolute top-[80px] right-[10px] bg-[#111] border border-[#333] rounded-xl shadow-2xl z-[5000] w-[200px] overflow-hidden"';
const replace = 'className="absolute top-[80px] right-[10px] bg-[#111] border border-[#FFD700] rounded-xl shadow-2xl z-[99999] w-[200px] overflow-hidden"';

code = code.replace(target, replace);

// Fix AI Teacher duplicate bots just in case
const botStr2 = /<button onClick=\{\(\) => setIsAiTeacherOpen\(true\)\} className="fixed bottom-\[90px\] right-\[20px\] w-\[60px\] h-\[60px\] bg-\[\#FFD700\] rounded-full flex items-center justify-center text-3xl shadow-\[0_0_20px_rgba\(255,215,0,0\.4\)\] z-\[99\] hover:scale-110 transition cursor-pointer pointer-events-auto">\s*🤖\s*<\/button>/g;
code = code.replace(botStr2, ''); // clear any of this specific old one

fs.writeFileSync('src/App.tsx', code);
