const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "const [currentCurrency, setCurrentCurrency] = useState('USD');";
const replace = "const [currentCurrency, setCurrentCurrency] = useState(localStorage.getItem('goye_preferred_currency') || 'USD');";
code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
