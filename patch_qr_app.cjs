const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "        <div style={{background:'white', padding:'12px', border:'3px solid #FFD700', borderRadius:'24px', maxWidth:'320px', margin:'0 auto', position:'relative'}}>";
const replace = "        <div className=\"qr-container\">";
code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
