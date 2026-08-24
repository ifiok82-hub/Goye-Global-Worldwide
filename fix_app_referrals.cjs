const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add LanguageModal import
const importsToAdd = `
import LanguageModal from './components/LanguageModal';
`;
code = code.replace("import VoiceModal from './components/VoiceModal';", "import VoiceModal from './components/VoiceModal';\nimport LanguageModal from './components/LanguageModal';");

// Update states
code = code.replace(
  "const [showMoreMenu, setShowMoreMenu] = useState(false);",
  "const [showMoreMenu, setShowMoreMenu] = useState(false);\n  const [showLanguageModal, setShowLanguageModal] = useState(false);"
);

// Update useEffect for ref
const oldRefEffect = /useEffect\(\(\) => \{\s+const params = new URLSearchParams\(window\.location\.search\);\s+const ref = params\.get\('ref'\);\s+if \(ref\) \{\s+localStorage\.setItem\('referred_by', ref\);\s+\}\s+\}, \[\]\);/;

const newRefEffect = `
  useEffect(() => {
    const trackReferral = async () => {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        // Set cookie for 30 days
        const d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        document.cookie = "referred_by=" + ref + ";expires=" + d.toUTCString() + ";path=/";
        localStorage.setItem('referred_by', ref);
        
        // Check if we already counted this IP/session click
        if (!sessionStorage.getItem('ref_clicked_' + ref)) {
          sessionStorage.setItem('ref_clicked_' + ref, 'true');
          try {
            const { doc, getDoc, setDoc, updateDoc, increment } = require('firebase/firestore');
            const refDoc = doc(db, 'referrals', ref);
            const snap = await getDoc(refDoc);
            if (snap.exists()) {
              await updateDoc(refDoc, { clicks: increment(1) });
            } else {
              await setDoc(refDoc, { clicks: 1, signups: 0, usd: 0, ngn: 0, pi: 0, payouts: [] });
            }
          } catch (e) {
            console.error("Failed to track referral click", e);
          }
        }
      }
    };
    trackReferral();
  }, []);
`;
code = code.replace(oldRefEffect, newRefEffect.trim());

// Update header button to show LanguageModal instead of Toast
code = code.replace(
  "showToast('Language Switcher coming soon!'); setShowMoreMenu(false);",
  "setShowLanguageModal(true); setShowMoreMenu(false);"
);

// Add LanguageModal to the JSX
code = code.replace(
  "{showVoiceModal && <VoiceModal onClose={() => setShowVoiceModal(false)} onResult={(res: string) => { setSearchQuery(res); showToast('Voice: ' + res); }} />}",
  "{showVoiceModal && <VoiceModal onClose={() => setShowVoiceModal(false)} onResult={(res: string) => { setSearchQuery(res); showToast('Voice: ' + res); }} />}\n      {showLanguageModal && <LanguageModal onClose={() => setShowLanguageModal(false)} />}"
);

fs.writeFileSync('src/App.tsx', code);
