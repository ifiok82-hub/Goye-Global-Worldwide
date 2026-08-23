const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

// Update props
code = code.replace(
  'export default function UnifiedCheckoutModal({ product, onClose, paymentConfig }: any) {',
  'export default function UnifiedCheckoutModal({ product, onClose, paymentConfig, onToast }: any) {'
);

// Replace alerts for copying
code = code.replace(
  /alert\('Wallet address copied!'\)/g,
  "if(onToast) onToast('Wallet address copied!'); else alert('Wallet address copied!');"
);

// Replace "alert" for paystack/flutterwave configuration missing (optional, maybe keep it since it's an error)
code = code.replace(
  'return alert("Paystack not configured by admin yet");',
  'return onToast ? onToast("Paystack not configured by admin yet") : alert("Paystack not configured by admin yet");'
);
code = code.replace(
  'return alert("Flutterwave not configured by admin yet");',
  'return onToast ? onToast("Flutterwave not configured by admin yet") : alert("Flutterwave not configured by admin yet");'
);
code = code.replace(
  'return alert("Enter email first");',
  'return onToast ? onToast("Enter email first") : alert("Enter email first");'
);

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
