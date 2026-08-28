const fs = require('fs');
const file = 'vite.config.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "registerType: 'autoUpdate',",
  "registerType: 'autoUpdate',\n        workbox: { maximumFileSizeToCacheInBytes: 5000000 },"
);

fs.writeFileSync(file, code);
console.log("Patched vite.config.ts");
