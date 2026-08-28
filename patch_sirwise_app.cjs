const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexState = /const \[showSplash, setShowSplash\] = useState\(true\);/;
const repState = `const [showSplash, setShowSplash] = useState(true);
  const [showSirwiseBot, setShowSirwiseBot] = useState(false);`;
code = code.replace(regexState, repState);

const regexFooter = /\{\/\* Fixed Bottom Nav \*\/\}/;
const repFooter = `<div className="fixed bottom-[90px] right-[10px] z-[99] pointer-events-auto">
        <button onClick={() => setShowSirwiseBot(true)} className="bg-[#FFD700] w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] border-2 border-black animate-bounce cursor-pointer pointer-events-auto">
          <span className="text-3xl">🤖</span>
        </button>
      </div>
      <SirwiseAITeacher isOpen={showSirwiseBot} onClose={() => setShowSirwiseBot(false)} />
      
      {/* Fixed Bottom Nav */}`;
code = code.replace(regexFooter, repFooter);

fs.writeFileSync('src/App.tsx', code);
