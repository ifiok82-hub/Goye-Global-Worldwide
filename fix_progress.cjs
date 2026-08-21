const fs = require('fs');
let code = fs.readFileSync('src/components/EsimVideoModal.tsx', 'utf8');
code = code.replace("width: `\\${progress}%`", "width: `${progress}%`");
code = code.replace("width: \\`\\${progress}%\\`", "width: `${progress}%`");
code = code.replace("width: '\\`\\${progress}%\\`'", "width: `${progress}%`");
fs.writeFileSync('src/components/EsimVideoModal.tsx', code);
