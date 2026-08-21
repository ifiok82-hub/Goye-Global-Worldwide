const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variable
if (!code.includes('const [showEsimVideoModal, setShowEsimVideoModal]')) {
  code = code.replace(
    "const [showAiModal, setShowAiModal] = useState(false);",
    "const [showAiModal, setShowAiModal] = useState(false);\n  const [showEsimVideoModal, setShowEsimVideoModal] = useState(false);"
  );
}

// 2. Add import for EsimVideoModal
if (!code.includes('import EsimVideoModal')) {
  code = code.replace(
    "import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';",
    "import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';\nimport EsimVideoModal from './components/EsimVideoModal';"
  );
}

// 3. Render EsimVideoModal
const modalRender = `      {showEsimVideoModal && <EsimVideoModal onClose={() => setShowEsimVideoModal(false)} />}\n      <div id="videoModal"`;
if (!code.includes('<EsimVideoModal')) {
  code = code.replace('      <div id="videoModal"', modalRender);
}

// 4. Update the onClick in eSIM section to trigger state instead of innerHTML
const regexEsimOnClick = /<div onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); const m = document\.getElementById\("videoModal"\); if\(m\) \{ m\.style\.display="flex"; m\.innerHTML=\`[\s\S]*?className="mt-6 aspect-video bg-black rounded-xl border-2 border-\[#333\] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-\[#FFD700\]\/50 transition-colors shadow-2xl">/;

const newEsimOnClick = `<div onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEsimVideoModal(true); }} className="mt-6 aspect-video bg-black rounded-xl border-2 border-[#333] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer hover:border-[#FFD700]/50 transition-colors shadow-2xl">`;

if (regexEsimOnClick.test(code)) {
  code = code.replace(regexEsimOnClick, newEsimOnClick);
  console.log("eSIM onClick handler patched.");
} else {
  console.log("Could not find eSIM onClick handler!");
}

fs.writeFileSync('src/App.tsx', code);
