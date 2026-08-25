const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\n    const unsub = onAuthStateChanged\(auth, async \(user\) => \{[\s\S]*?    \}\);\n    return unsub;\n  \}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    // 3. PERSISTENT LOCAL SESSION check
    let hasLocalSession = false;
    const activeUserStr = localStorage.getItem("goye_active_user");
    if (activeUserStr) {
       try {
         const activeUser = JSON.parse(activeUserStr);
         if (activeUser && activeUser.contact) {
            setIsAuthenticated(true);
            setCurrentUser({ uid: activeUser.uid || 'local_' + activeUser.contact, email: activeUser.contact });
            setUserProfile(activeUser);
            setAuthLoading(false);
            hasLocalSession = true;
         }
       } catch(e) {}
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!hasLocalSession) {
        if (user) {
          if (user.emailVerified || user.email?.includes("@gasv.store.phone")) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            const prof = localStorage.getItem("goye_user_profile");
            if (prof) setUserProfile(JSON.parse(prof));
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
        setAuthLoading(false);
      }
    });
    return unsub;
  }, []);`;

if(code.match(regex)) {
  code = code.replace(regex, newUseEffect);
  fs.writeFileSync(file, code);
  console.log("Patched App.tsx session handling");
} else {
  console.log("Could not find App.tsx useEffect");
}
