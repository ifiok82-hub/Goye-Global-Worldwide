const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

code = code.replace(/sanitizedHash/g, "cryptoTxHash");

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
