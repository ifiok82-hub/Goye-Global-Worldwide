const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

// Replace the internal paymentGate usage with onPurchase
code = code.replace(/const paymentGate = showPaymentModal[\s\S]*?<\/div>\n    \)\;/m, '');
code = code.replace(/<div id="dashboard" className="w-full">\n      \{paymentGate\}/, '<div id="dashboard" className="w-full">');
code = code.replace(/setShowPaymentModal\(true\)/g, "onPurchase({ id: 'academy', name: 'Sirwise AI Web3 Academy 4-Week', price: 49.99, category: 'academy' })");

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
