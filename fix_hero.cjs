const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update HeroSection definition
code = code.replace(
  "const HeroSection = ({ onLogoTap }: { onLogoTap?: () => void }) => (",
  "const HeroSection = ({ onLogoTap, onPlayVideo }: { onLogoTap?: () => void, onPlayVideo?: () => void }) => ("
);

// Update setShowEsimVideoModal(true) in HeroSection to onPlayVideo?.()
code = code.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); setShowEsimVideoModal\(true\); \}\}/,
  "onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlayVideo?.(); }}"
);

// Update HeroSection usage
code = code.replace(
  "<HeroSection onLogoTap={()=>{",
  "<HeroSection onPlayVideo={() => setShowEsimVideoModal(true)} onLogoTap={()=>{"
);

fs.writeFileSync('src/App.tsx', code);
