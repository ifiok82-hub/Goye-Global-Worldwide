const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('const [exchangeRates')) {
  code = code.replace(
    "const [currentCurrency, setCurrentCurrency] = useState('USD');",
    `const [currentCurrency, setCurrentCurrency] = useState('USD');\n  const [exchangeRates, setExchangeRates] = useState(CURRENCIES);\n\n  useEffect(() => {\n    fetch('https://api.exchangerate-api.com/v4/latest/USD')\n      .then(res => res.json())\n      .then(data => {\n        if (data && data.rates) {\n          setExchangeRates(prev => prev.map(c => c.code !== 'PI' && data.rates[c.code] ? { ...c, rate: data.rates[c.code] } : c));\n        }\n      })\n      .catch(e => console.error('Exchange rate error:', e));\n  }, []);`
  );
  
  code = code.replace(
    `<CurrencyModal onClose={() => setShowCurrencyModal(false)} currentCurrency={currentCurrency} onSelectCurrency={setCurrentCurrency} />`,
    `<CurrencyModal onClose={() => setShowCurrencyModal(false)} currentCurrency={currentCurrency} onSelectCurrency={setCurrentCurrency} rates={exchangeRates} />`
  );
  
  fs.writeFileSync(file, code);
  console.log("Patched App.tsx for currency");
}
