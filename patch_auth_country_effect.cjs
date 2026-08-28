const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const target = "const [countryCode, setCountryCode] = useState('+1');";
const replace = `const [countryCode, setCountryCode] = useState('+1');
  
  useEffect(() => {
      const c = COUNTRIES.find(c => c.phone === countryCode);
      if (c && window.localStorage) {
          localStorage.setItem('goye_preferred_currency', c.currency);
      }
  }, [countryCode]);`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/AuthScreen.tsx', code);
