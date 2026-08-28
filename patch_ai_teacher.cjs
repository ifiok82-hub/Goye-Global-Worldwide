const fs = require('fs');
let code = fs.readFileSync('src/components/SirwiseAITeacher.tsx', 'utf8');

const target = "{messages.map((msg, idx) => (";
const replace = `
          {messages.length === 1 && userAccessStatus !== 'free' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {['Explain AI Basics', 'Teach Digital Creation', 'What is Web3?', 'Guide my Final Project'].map(topic => (
                <button key={topic} onClick={() => setInput(topic)} className="bg-[#222] border border-[#333] hover:border-[#FFD700] text-white text-xs px-3 py-1.5 rounded-full transition">
                  {topic}
                </button>
              ))}
            </div>
          )}
          {messages.map((msg, idx) => (
`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/SirwiseAITeacher.tsx', code);
