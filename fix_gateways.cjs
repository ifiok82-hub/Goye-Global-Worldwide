const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

code = code.replace(
  "const handler = (window as any).PaystackPop.setup({",
  "if (!(window as any).PaystackPop) return onToast ? onToast('Payment gateway is loading. Please wait a moment and try again.') : alert('Payment gateway is loading. Please wait a moment and try again.');\n    const handler = (window as any).PaystackPop.setup({"
);

code = code.replace(
  "const handler = (window as any).FlutterwaveCheckout({",
  "if (!(window as any).FlutterwaveCheckout) return onToast ? onToast('Payment gateway is loading. Please wait a moment and try again.') : alert('Payment gateway is loading. Please wait a moment and try again.');\n    const handler = (window as any).FlutterwaveCheckout({"
);

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
