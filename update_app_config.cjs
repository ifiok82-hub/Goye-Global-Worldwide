const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const [adminTapCount, setAdminTapCount] = useState(0);
  const adminPressTimer = useRef<any>(null);`;

const newConfigState = `  const [adminTapCount, setAdminTapCount] = useState(0);
  const adminPressTimer = useRef<any>(null);
  const [paymentConfig, setPaymentConfig] = useState<any>({
    paystack: localStorage.getItem('paystack_public_key') || '',
    flutterwave: localStorage.getItem('flutterwave_public_key') || '',
    crypto: localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4',
    pi: localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('PAYMENT_CONFIG');
      if (stored) {
        setPaymentConfig(JSON.parse(stored));
      }
    } catch (e) {}

    const unsub = onSnapshot(doc(db, 'settings', 'payments'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPaymentConfig(data);
        localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(data));
        localStorage.setItem('paystack_public_key', data.paystack || '');
        localStorage.setItem('flutterwave_public_key', data.flutterwave || '');
        localStorage.setItem('crypto_wallet', data.crypto || '');
        localStorage.setItem('pi_wallet', data.pi || '');
      }
    });
    return () => unsub();
  }, []);`;

code = code.replace(targetStr, newConfigState);

// Now update UnifiedCheckoutModal call
code = code.replace(
  '<UnifiedCheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />',
  '<UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} />'
);

fs.writeFileSync('src/App.tsx', code);
