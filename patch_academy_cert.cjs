const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

const regexCertGen = /\{\(\!isEnrolled \|\| percentComplete < 100\) \? \([\s\S]*?\} \/>\n          \)\}/;
const repCertGen = `<CertificateGenerator isCompleted={percentComplete === 100} isEnrolled={isEnrolled} userProfile={userProfile} priceUSD={priceUSD} displaySymbol={displaySymbol} localPrice={localPrice} onUnlock={() => setShowPaymentModal(true)} onToast={onToast} />`;
code = code.replace(regexCertGen, repCertGen);

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
