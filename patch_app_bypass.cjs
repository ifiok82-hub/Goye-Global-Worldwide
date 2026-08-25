const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\n    \/\/ 3\. PERSISTENT LOCAL SESSION check[\s\S]*?return unsub;\n  \}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    // 3. PERSISTENT LOCAL SESSION check
    const activeUserStr = localStorage.getItem("goye_active_user");
    if (activeUserStr) {
       try {
         const activeUser = JSON.parse(activeUserStr);
         if (activeUser && activeUser.contact) {
            setIsAuthenticated(true);
            setCurrentUser({ uid: activeUser.uid || 'local_' + activeUser.contact, email: activeUser.contact });
            setUserProfile(activeUser);
         } else {
            setIsAuthenticated(false);
         }
       } catch(e) {
         setIsAuthenticated(false);
       }
    } else {
       setIsAuthenticated(false);
    }
    setAuthLoading(false);
  }, []);`;

if(code.match(regex)) {
  code = code.replace(regex, newUseEffect);
  fs.writeFileSync(file, code);
  console.log("Patched App.tsx to completely bypass Firebase Auth state");
} else {
  console.log("Could not find App.tsx useEffect to patch");
}
