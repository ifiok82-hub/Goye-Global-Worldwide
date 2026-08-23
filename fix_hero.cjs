const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHero = code.substring(
  code.indexOf('const HeroSection = '),
  code.indexOf('const UnifiedCheckoutModal') // Not exactly, wait, UnifiedCheckoutModal is imported
);

const oldHeroEnd = code.indexOf('const', code.indexOf('const HeroSection = ') + 10);
// Wait, I can just replace the HeroSection completely using regex or string manipulation.
