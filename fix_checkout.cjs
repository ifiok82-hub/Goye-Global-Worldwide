const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const regex = /const priceNGN = priceUSD \* 1600; \/\/ Paystack \*1600 NGN exchange rate/g;
const replacement = `const priceNGN = priceUSD * 1600; // Paystack *1600 NGN exchange rate
  
  const userCurrency = localStorage.getItem('goye_currency') || 'USD';
  const rates:any = { NGN: 1500, GBP: 0.79, EUR: 0.92, INR: 83, CAD: 1.35, AUD: 1.52, ZAR: 18, GHS: 13, KES: 130, AED: 3.67, BRL: 5.0, MXN: 17.0 };
  const rate = rates[userCurrency] || 1;
  const localPrice = (priceUSD * rate).toFixed(2);
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
