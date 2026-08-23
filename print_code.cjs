const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(150, 300).join('\n'));
