const fs = require('fs');
let code = fs.readFileSync('src/components/ReferralDashboardModal.tsx', 'utf8');

code = code.replace("import { auth, db } from '../lib/firebase';", "import { auth, db } from '../lib/firebase';\nimport { signInAnonymously } from 'firebase/auth';");
const fetchStatsReplacement = `
      let user = auth.currentUser;
      if (!user) {
        try {
          const cred = await signInAnonymously(auth);
          user = cred.user;
        } catch (e) {
          if(onToast) onToast('Please log in to use the referral system.');
          onClose();
          return;
        }
      }
`;
code = code.replace(/const user = auth\.currentUser;\s+if \(!user\) \{[\s\S]*?return;\s+\}/, fetchStatsReplacement);

fs.writeFileSync('src/components/ReferralDashboardModal.tsx', code);
