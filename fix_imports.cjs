const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('ShoppingCart,')) {
  code = code.replace(
    "ShoppingBag,",
    "ShoppingBag, ShoppingCart,"
  );
}

fs.writeFileSync('src/App.tsx', code);

let checkout = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');
if (!checkout.includes('import RealQRCode')) {
  checkout = checkout.replace(
    "import { X,",
    "import RealQRCode from './RealQRCode';\nimport { X,"
  );
}
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', checkout);
