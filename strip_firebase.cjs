const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ auth, googleAuthProvider, db \} from '\.\/lib\/firebase';/g, '');
code = code.replace(/import \{ signInWithPopup, signOut, onAuthStateChanged, User \} from 'firebase\/auth';/g, '');
code = code.replace(/import \{ doc, setDoc, getDoc, collection, getDocs, query, where, orderBy \} from 'firebase\/firestore';/g, '');

// Replace Firebase handlers with localStorage
code = code.replace(/const handleGoogleLogin = async \(\) => \{[\s\S]*?\};/, `const handleGoogleLogin = () => {
    const fakeUser = { email: 'user@example.com', uid: 'local123', displayName: 'Guest User' };
    setUser(fakeUser);
    localStorage.setItem('goye_user', JSON.stringify(fakeUser));
  };`);

code = code.replace(/const handleLogout = async \(\) => \{[\s\S]*?\};/, `const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('goye_user');
    localStorage.removeItem('goye_admin_auth');
    if (tab.startsWith('admin')) setTab('home');
  };`);

// Replace Firebase useEffect observer
code = code.replace(/const unsubscribe = onAuthStateChanged\(auth, async \(u\) => \{[\s\S]*?\}\);[\s]*return \(\) => unsubscribe\(\);/, `const savedUser = localStorage.getItem('goye_user');
    if (savedUser) setUser(JSON.parse(savedUser));`);

fs.writeFileSync('src/App.tsx', code);
