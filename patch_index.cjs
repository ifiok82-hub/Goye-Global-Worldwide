const fs = require('fs');
const file = 'index.html';
let code = fs.readFileSync(file, 'utf8');

const script = `
    <script>
      const originalError = console.error;
      console.error = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('[vite]')) return;
        originalError.apply(console, args);
      };
    </script>
`;

if (!code.includes('originalError = console.error')) {
  code = code.replace('<head>', '<head>' + script);
  fs.writeFileSync(file, code);
  console.log("Patched index.html");
}
