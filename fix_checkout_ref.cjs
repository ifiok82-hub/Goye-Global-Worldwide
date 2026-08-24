const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const oldSuccess = /const handleSuccess = \(ref: string, method: string, isPending: boolean = false\) => \{/;
const newSuccess = `const handleSuccess = (ref: string, method: string, isPending: boolean = false) => {
    // Check for referral
    const referredBy = localStorage.getItem('referred_by');
    if (referredBy && !isPending) {
      // simulate commission points
      let signups = parseInt(localStorage.getItem('ref_signups') || '0') + 1;
      let comUsd = parseFloat(localStorage.getItem('ref_com_usd') || '0') + (priceUSD * 0.2); // 20% commission
      let comNgn = parseFloat(localStorage.getItem('ref_com_ngn') || '0') + (priceNGN * 0.2);
      
      localStorage.setItem('ref_signups', signups.toString());
      localStorage.setItem('ref_com_usd', comUsd.toFixed(2));
      localStorage.setItem('ref_com_ngn', comNgn.toFixed(0));
    }
`;

code = code.replace(oldSuccess, newSuccess);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
