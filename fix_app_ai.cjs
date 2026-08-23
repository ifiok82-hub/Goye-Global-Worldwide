const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import the component
code = code.replace(
  "import { GoyeLogo } from './components/GoyeLogo';", 
  "import { GoyeLogo } from './components/GoyeLogo';\nimport SirwiseAITeacher from './components/SirwiseAITeacher';"
);

// Add states
code = code.replace(
  "const [isInstallable, setIsInstallable] = useState(false);",
  "const [isInstallable, setIsInstallable] = useState(false);\n  const [isAiTeacherOpen, setIsAiTeacherOpen] = useState(false);\n  const userAccessStatus = purchasedItems.length > 0 ? 'paid' : 'free';"
);

// Update button (it was at <div className="fixed bottom-20 right-4 z-[90]">)
const oldButtonRegex = /<div className="fixed bottom-20 right-4 z-\[90\]">[\s\S]*?<\/button>\s*<\/div>/;
const newButton = `
      <div className="fixed bottom-[80px] right-[16px] z-[9999] cursor-pointer pointer-events-auto">
        <button onClick={() => setIsAiTeacherOpen(true)} className="bg-[#FFD700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative transition hover:scale-105 active:scale-95">
          <Bot size={28}/>
          <div className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-[#111] animate-pulse"></div>
        </button>
      </div>

      <SirwiseAITeacher 
        isOpen={isAiTeacherOpen} 
        onClose={() => setIsAiTeacherOpen(false)} 
        userAccessStatus={userAccessStatus} 
        onUnlockClick={() => {
          setIsAiTeacherOpen(false);
          setTab('academy');
          window.location.hash = 'academy';
        }} 
      />
`;

code = code.replace(oldButtonRegex, newButton.trim());

fs.writeFileSync('src/App.tsx', code);
