const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const antiTampering = `
// 4. Client-Side Security & Anti-Tampering
if (process.env.NODE_ENV === 'production') {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.warn('🔒 GOYE Security Notice: Inspection disabled. 256-Bit SSL Encrypted.');
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's')) {
      e.preventDefault();
    }
  });
}
`;

code = code.replace("createRoot(", antiTampering + "\ncreateRoot(");
fs.writeFileSync('src/main.tsx', code);
