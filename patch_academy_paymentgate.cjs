const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

// Insert {paymentGate} at the beginning of the returned div
code = code.replace(/<div id="dashboard" className="w-full">/, '<div id="dashboard" className="w-full">\n      {paymentGate}');

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
