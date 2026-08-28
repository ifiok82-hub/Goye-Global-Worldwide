const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFormat = /const formatPrice = \(usdPrice: number\) => \{.*?  \};/s;
const newFormat = `const formatPrice = (usdPrice: number) => {
    const curr = exchangeRates.find(c => c.code === currentCurrency) || CURRENCIES[0];
    if (curr.code === 'USD' || curr.code === 'USDC') return \`\${curr.symbol}\${usdPrice.toFixed(2)}\`;
    const converted = usdPrice * curr.rate;
    if (curr.code === 'PI') return \`$\${usdPrice.toFixed(2)} (~\${converted.toFixed(6)} \${curr.symbol})\`;
    return \`$\${usdPrice.toFixed(2)} (~\${curr.symbol}\${converted.toFixed(0)})\`;
  };`;

code = code.replace(oldFormat, newFormat);
fs.writeFileSync('src/App.tsx', code);
