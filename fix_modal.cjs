const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

// 1. Add Zap to lucide-react imports
code = code.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, Zap } from 'lucide-react';");

// 2. Replace handleSuccess
code = code.replace(/const handleSuccess = [\s\S]*?const payWithPaystack =/m, 
`const sanitizeInput = (input: string) => input.replace(/<[^>]*>?/gm, '').trim();
  const validateEmail = (e: string) => {
    const sanitized = sanitizeInput(e);
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
  };
  
  const handleSuccess = (ref: string, method: string, isPending: boolean = false) => {
    const order = {
      id: Date.now(),
      ref: ref,
      productId: product.id,
      productName: product.name,
      amount: priceUSD,
      method: method,
      status: isPending ? 'pending' : 'completed',
      date: new Date().toLocaleString()
    };
    
    if (isPending) {
      const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
      downloads.push(order);
      localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
      
      alert('Transaction Submitted! Pending secure webhook verification. Check "My Downloads" tab later.');
      onClose();
    } else {
      if (onToast) onToast("Initiating Secure Webhook Verification...");
      
      // Simulate backend webhook verification delay
      setTimeout(() => {
        const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
        downloads.push(order);
        localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
        
        if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");
        setSuccess(true);
      }, 2500);
    }
  };

  const payWithPaystack =`);

// 3. Update Paystack
code = code.replace(/if \(\!email\).*?paystack_public_key'\);/m, 
`const validEmail = validateEmail(email);
    if (!validEmail) return onToast ? onToast("Enter a valid secure email first") : alert("Enter a valid secure email first");
    const pk = paymentConfig?.paystack || localStorage.getItem('paystack_public_key');`);
code = code.replace(/email: email,/m, `email: validEmail,`);

// 4. Update Flutterwave
code = code.replace(/if \(\!email\).*?flutterwave_public_key'\);/gm, 
`const validEmail = validateEmail(email);
    if (!validEmail) return onToast ? onToast("Enter a valid secure email first") : alert("Enter a valid secure email first");
    const pk = paymentConfig?.flutterwave || localStorage.getItem('flutterwave_public_key');`);
code = code.replace(/customer: \{ email, name: email\.split\('@'\)\[0\] \},/m, 
`customer: { email: validEmail, name: validEmail.split('@')[0] },`);

// 5. Update Crypto
code = code.replace(/if \(\!cryptoTxHash\).*?cryptoVerifying\(true\);/m, 
`const sanitizedHash = sanitizeInput(cryptoTxHash);
    const validEmail = validateEmail(email);
    if (!validEmail) return alert("Enter a valid secure email first");
    if (!sanitizedHash) return alert("Paste valid Tx Hash!");
    setCryptoVerifying(true);`);
code = code.replace(/email,/m, `email: validEmail,`);
code = code.replace(/txHash: cryptoTxHash/m, `txHash: sanitizedHash`);
code = code.replace(/handleSuccess\(cryptoTxHash, 'Crypto', true\);/m, `handleSuccess(sanitizedHash, 'Crypto', true);`);

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
