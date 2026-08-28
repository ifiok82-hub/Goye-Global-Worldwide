const fs = require('fs');
const file = 'src/components/ReferralDashboardModal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "// Replaced below",
  "const referralCode = userProfile?.surname || userProfile?.username || 'ENYIEMA';"
);

fs.writeFileSync(file, code);
console.log("Patched referral dashboard syntax");
