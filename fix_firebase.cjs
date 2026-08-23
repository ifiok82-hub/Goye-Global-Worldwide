const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace("import { getFirestore } from 'firebase/firestore';", "import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';");
code = code.replace(
  "export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);", 
  "export const db = initializeFirestore(app, { localCache: memoryLocalCache() }, firebaseConfig.firestoreDatabaseId);"
);

fs.writeFileSync('src/lib/firebase.ts', code);
