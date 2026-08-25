const fs = require('fs');
const file = 'src/components/UnifiedCheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /if \(auth\.currentUser\) \{[\s\S]*?const userRef = doc\(db, 'users', auth\.currentUser\.uid\);/g;

const newCode = `const activeUserStr = localStorage.getItem('goye_active_user');
        if (activeUserStr) {
          const activeUser = JSON.parse(activeUserStr);
          const userRef = doc(db, 'users', activeUser.uid);`;

if(code.match(regex)) {
  code = code.replace(regex, newCode);
  fs.writeFileSync(file, code);
  console.log("Patched UnifiedCheckoutModal auth bypass");
} else {
  console.log("Could not find checkout auth to patch");
}
