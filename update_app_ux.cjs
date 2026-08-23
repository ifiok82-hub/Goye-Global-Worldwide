const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Toast state
const appStartStr = 'export default function App() {';
const toastStateStr = `
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
`;
if (!code.includes('toastMsg')) {
  code = code.replace(appStartStr, appStartStr + toastStateStr);
}

// 2. Add Toast Component at the end of the return statement
const returnEndStr = '    </div>\n  );\n}';
const toastComponent = `
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#10B981] text-black px-6 py-3 rounded-full font-bold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}
    </div>
  );
}`;
if (!code.includes('Toast Notification')) {
  code = code.replace(returnEndStr, toastComponent);
}

// 3. Update Admin keys trim and use showToast
code = code.replace(
  "const paystack = (document.getElementById('paystack_key') as HTMLInputElement).value;",
  "const paystack = (document.getElementById('paystack_key') as HTMLInputElement).value.trim();"
);
code = code.replace(
  "const flutterwave = (document.getElementById('flutterwave_key') as HTMLInputElement).value;",
  "const flutterwave = (document.getElementById('flutterwave_key') as HTMLInputElement).value.trim();"
);
code = code.replace(
  "const crypto = (document.getElementById('crypto_wallet') as HTMLInputElement).value;",
  "const crypto = (document.getElementById('crypto_wallet') as HTMLInputElement).value.trim();"
);
code = code.replace(
  "const pi = (document.getElementById('pi_wallet') as HTMLInputElement).value;",
  "const pi = (document.getElementById('pi_wallet') as HTMLInputElement).value.trim();"
);

code = code.replace(
  ".then(() => alert('Saved to Firestore & Local Storage!'))",
  ".then(() => showToast('Saved to Firestore & Local Storage!'))"
);
code = code.replace(
  ".catch(e => alert('Saved locally. Firestore error: ' + e.message));",
  ".catch(e => showToast('Saved locally. Firestore error: ' + e.message));"
);

// 4. Update Quick Access padding for overlap fix
code = code.replace('className="p-4 bg-[#0a0a0a] pt-12 pb-24"', 'className="p-4 bg-[#0a0a0a] pt-12 pb-36"');

// 5. Update UnifiedCheckoutModal props
code = code.replace(
  '<UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} />',
  '<UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} onToast={showToast} />'
);

fs.writeFileSync('src/App.tsx', code);
