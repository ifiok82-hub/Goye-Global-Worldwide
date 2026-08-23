const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

code = code.replace(/validEmail/g, 'email');

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
