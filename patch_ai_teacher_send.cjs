const fs = require('fs');
let code = fs.readFileSync('src/components/SirwiseAITeacher.tsx', 'utf8');

const oldBtn = /<button key=\{topic\} onClick=\{.*?\} className="bg-\[\#222\] border border-\[\#333\] hover:border-\[\#FFD700\] text-white text-xs px-3 py-1\.5 rounded-full transition">\s*\{topic\}\s*<\/button>/s;

const newBtn = `<button key={topic} onClick={() => { setInput(topic); setTimeout(() => document.getElementById('ai-send-btn')?.click(), 100); }} className="bg-[#222] border border-[#333] hover:border-[#FFD700] text-white text-xs px-3 py-1.5 rounded-full transition">
                  {topic}
                </button>`;

code = code.replace(oldBtn, newBtn);

const sendBtnRegex = /<button onClick=\{handleSend\} disabled=\{.*?\} className="bg-\[\#FFD700\] text-black p-3 rounded-xl disabled:opacity-50">/;
code = code.replace(sendBtnRegex, '<button id="ai-send-btn" onClick={handleSend} disabled={isTyping || (!input.trim() && userAccessStatus !== "free" && queriesUsed < 3)} className="bg-[#FFD700] text-black p-3 rounded-xl disabled:opacity-50">');

fs.writeFileSync('src/components/SirwiseAITeacher.tsx', code);
