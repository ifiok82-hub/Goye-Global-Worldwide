const fs = require('fs');
const file = 'src/components/UnifiedCheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldSave = `    const saveToDb = async () => {
      try {
        await addDoc(collection(db, 'orders'), order);
      } catch (e) {
        console.error('Error saving order to db', e);
      }
    };`;

const newSave = `    const saveToDb = async () => {
      try {
        await addDoc(collection(db, 'orders'), order);
        // Sync to user's Cloud account under purchased_items
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            purchased_items: arrayUnion(order)
          }).catch(() => {
            // If purchased_items field doesn't exist yet, we can set it via setDoc merge
            setDoc(userRef, { purchased_items: [order] }, { merge: true });
          });
        }
      } catch (e) {
        console.error('Error saving order to db', e);
      }
    };`;

if(code.includes(oldSave)) {
  code = code.replace(oldSave, newSave);
  
  // also add arrayUnion to firestore imports
  code = code.replace(
    "import { addDoc, collection, doc, getDoc, updateDoc, increment, serverTimestamp, setDoc } from 'firebase/firestore';",
    "import { addDoc, collection, doc, getDoc, updateDoc, increment, serverTimestamp, setDoc, arrayUnion } from 'firebase/firestore';"
  );
  
  fs.writeFileSync(file, code);
  console.log("Patched saveToDb");
} else {
  console.log("Could not find saveToDb");
}
