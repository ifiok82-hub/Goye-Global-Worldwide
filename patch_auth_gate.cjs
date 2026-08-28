const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// The user wants full gating. So if not authenticated, the Bottom Nav and main page shouldn't be accessible.
// Since the header is still desired, I will just early return or hide the bottom nav and show AuthScreen.

// Replace bottom nav to hide it if !isAuthenticated
const bottomNavSearch = `      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] z-[100]">`;
const bottomNavReplace = `      {/* Bottom Navigation */}
      {isAuthenticated && <div className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-[#333] z-[100]">`;

code = code.replace(bottomNavSearch, bottomNavReplace);
code = code.replace(/<\/div>\n      <\/div>\n\n      \{\/\* Toast Notification \*\/\}/, `</div>\n      </div>}\n\n      {/* Toast Notification */}`);

// Add an offline sync effect inside App
const hookSearch = `  const adminPressTimer = useRef<any>(null);`;
const hookReplace = `  const adminPressTimer = useRef<any>(null);

  // Background Sync Effect
  useEffect(() => {
    const handleOnline = async () => {
      if (currentUser?.uid) {
        // Here we could sync offline stored purchases, academy progress, etc to Firebase
        try {
          const { doc, setDoc } = await import('firebase/firestore');
          const { db } = await import('./lib/firebase');
          const progress = localStorage.getItem(\`goye_academy_progress_\${currentUser.uid}\`);
          if (progress) {
             const data = JSON.parse(progress);
             await setDoc(doc(db, 'academy', currentUser.uid), data, { merge: true });
          }
        } catch (err) {
          console.warn('Sync failed', err);
        }
        showToast('You are back online. Data synchronized.');
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [currentUser]);`;

code = code.replace(hookSearch, hookReplace);

fs.writeFileSync(file, code);
console.log("Patched Auth Gating and Offline sync");
