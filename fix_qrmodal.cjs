const fs = require('fs');
let code = fs.readFileSync('src/components/QRModal.tsx', 'utf8');

code = code.replace(
  'const logoDataUrl = "data:image/svg+xml;base64," + btoa(goyeLogoSvg);',
  'const logoDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(goyeLogoSvg);'
);

fs.writeFileSync('src/components/QRModal.tsx', code);
