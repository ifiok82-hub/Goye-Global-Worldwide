const fs = require('fs');
const file = 'index.html';
let code = fs.readFileSync(file, 'utf8');

const script = `
    <script>
      const methods = ['log', 'warn', 'error'];
      methods.forEach(method => {
        const orig = console[method];
        console[method] = function(...args) {
          const str = args.map(a => String(a?.message || a)).join(' ');
          if (str.includes('[vite]')) return;
          orig.apply(console, args);
        };
      });
      window.addEventListener('error', e => {
        if (e.message && e.message.includes('[vite]')) e.preventDefault();
      });
    </script>
`;

if (!code.includes('const methods = [')) {
  code = code.replace('<head>', '<head>' + script);
  fs.writeFileSync(file, code);
  console.log("Patched index.html aggressively");
}
