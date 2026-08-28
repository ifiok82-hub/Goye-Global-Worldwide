const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const regex = /<div className="w-full flex flex-col py-12 items-center justify-center p-4 relative overflow-hidden">[\s\S]*?<div className="bg-\[#111\] p-8 rounded-3xl border border-\[#333\] w-full max-w-md z-10 relative shadow-2xl">/g;

const replacement = `<div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-5 overflow-y-auto pointer-events-auto">
      <div className="bg-[#111] p-6 rounded-3xl border border-[#FFD700] w-[90%] max-w-[380px] max-h-[90vh] overflow-y-auto z-[1001] relative shadow-2xl pointer-events-auto">
        <button onClick={() => { window.location.hash='home'; }} className="absolute top-4 right-4 text-gray-500 font-bold hover:text-white cursor-pointer z-20">X</button>
        `;

code = code.replace(regex, replacement);

const btnLoginRegex = /<button type="submit" disabled=\{loading\} className="w-full bg-\[#FFD700\] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition">/g;
const btnLoginRep = `<button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-yellow-400 transition cursor-pointer pointer-events-auto touch-manipulation z-5">
              SECURE LOGIN`;
code = code.replace(btnLoginRegex, btnLoginRep);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
