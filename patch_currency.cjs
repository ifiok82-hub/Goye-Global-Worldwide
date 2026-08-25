const fs = require('fs');
const file = 'src/components/CurrencyModal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export default function CurrencyModal({ onClose, currentCurrency, onSelectCurrency }: any) {`,
  `export default function CurrencyModal({ onClose, currentCurrency, onSelectCurrency, rates }: any) {\n  const displayRates = rates || CURRENCIES;`
);

code = code.replace(
  `{CURRENCIES.map(curr => (`,
  `{displayRates.map((curr: any) => (`
);

fs.writeFileSync(file, code);
console.log("Patched CurrencyModal");
