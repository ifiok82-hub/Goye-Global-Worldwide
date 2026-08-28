const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add AcademyDashboard and ShoppingCart imports
if (!code.includes('import AcademyDashboard')) {
  code = code.replace(
    "import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';",
    "import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';\nimport AcademyDashboard from './components/AcademyDashboard';"
  );
}

if (!code.includes('ShoppingCart')) {
  code = code.replace(
    "ShoppingBag,",
    "ShoppingBag, ShoppingCart,"
  );
}

// Remove setShowCheckout calls
code = code.replace(/setShowCheckout\(true\);/g, '');

fs.writeFileSync(file, code);
console.log("Patched App.tsx imports and setShowCheckout");
