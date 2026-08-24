const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [products, setProducts] = useState(ALL_PRODUCTS);",
  `const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('CUSTOM_PRODUCTS') || '[]');
    return [...ALL_PRODUCTS, ...custom];
  });`
);

fs.writeFileSync('src/App.tsx', code);
