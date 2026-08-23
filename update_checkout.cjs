const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const regex = /export default function UnifiedCheckoutModal\(\{(.*?)\}\: any\) \{/;
code = code.replace(regex, 'export default function UnifiedCheckoutModal({ product, onClose, paymentConfig }: any) {');

const logicRegex = /const payWithPaystack = \(\) => \{[\s\S]*?const submitCrypto = \(\) => \{/;

const newLogic = `const payWithPaystack = () => {
    if (!email) return alert("Enter email first");
    const pk = paymentConfig?.paystack || localStorage.getItem('paystack_public_key');
    if (!pk) return alert("Paystack not configured by admin yet");
    
    const handler = (window as any).PaystackPop.setup({
      key: pk,
      email: email,
      amount: Math.round(priceNGN * 100),
      currency: 'NGN',
      ref: \`GOYE-PS-\${Date.now()}\`,
      callback: (res: any) => handleSuccess(res.reference, 'Paystack'),
      onClose: () => alert('Payment cancelled')
    });
    handler.openIframe();
  };

  const payWithFlutterwave = () => {
    if (!email) return alert("Enter email first");
    const pk = paymentConfig?.flutterwave || localStorage.getItem('flutterwave_public_key');
    if (!pk) return alert("Flutterwave not configured by admin yet");

    const handler = (window as any).FlutterwaveCheckout({
      public_key: pk,
      tx_ref: \`GOYE-FW-\${Date.now()}\`,
      amount: priceUSD,
      currency: 'USD',
      payment_options: 'card, banktransfer, ussd',
      customer: { email, name: email.split('@')[0] },
      customizations: { title: 'GOYE Store', description: product.name },
      callback: (res: any) => handleSuccess(res.transaction_id, 'Flutterwave'),
      onclose: () => alert('Payment cancelled')
    });
  };

  const submitCrypto = () => {`;

code = code.replace(logicRegex, newLogic);

// crypto address logic
code = code.replace(/0x123\.\.\.CryptoAddress/g, '{paymentConfig?.crypto || localStorage.getItem(\'crypto_wallet\') || \'0xaeed4e48f2146aadd07e85219f209053616e4\'}');
code = code.replace(/GCVWalletAddress\.\.\./g, '{paymentConfig?.pi || localStorage.getItem(\'pi_wallet\') || \'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ\'}');

// copy handlers
const copyCrypto = "navigator.clipboard.writeText(paymentConfig?.crypto || localStorage.getItem('crypto_wallet') || '0xaeed4e48f2146aadd07e85219f209053616e4'); alert('Wallet address copied!');";
const copyPi = "navigator.clipboard.writeText(paymentConfig?.pi || localStorage.getItem('pi_wallet') || 'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ'); alert('Wallet address copied!');";

const cryptoBtnRegex = /<button className="text-gray-400 hover:text-white"><Copy size=\{16\}\/><\/button>/;
// I need to replace the first one with Crypto and the second one with Pi
// Wait, there are two of them, the first is crypto the second is pi.
let isFirst = true;
code = code.replace(/<button className="text-gray-400 hover:text-white"><Copy size=\{16\}\/><\/button>/g, (match) => {
    if (isFirst) {
        isFirst = false;
        return `<button onClick={() => { ${copyCrypto} }} className="text-gray-400 hover:text-white"><Copy size={16}/></button>`;
    } else {
        return `<button onClick={() => { ${copyPi} }} className="text-gray-400 hover:text-white"><Copy size={16}/></button>`;
    }
});

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
