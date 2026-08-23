const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "onClick={() => alert('Download starting...')}",
  "onClick={() => { showToast('Download starting...'); setTimeout(() => { const a = document.createElement('a'); a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; a.download = item.productName + '.txt'; a.click(); }, 1500); }}"
);
fs.writeFileSync('src/App.tsx', code);
