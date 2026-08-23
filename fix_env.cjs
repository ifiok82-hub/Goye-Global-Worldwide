const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

code = code.replace("process.env.NODE_ENV === 'production'", "import.meta.env.PROD");

fs.writeFileSync('src/main.tsx', code);
