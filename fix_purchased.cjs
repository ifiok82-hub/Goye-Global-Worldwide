const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setPurchasedItems(JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]'));",
  "const items = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');\n    setPurchasedItems(Array.isArray(items) ? items : []);"
);

fs.writeFileSync('src/App.tsx', code);
