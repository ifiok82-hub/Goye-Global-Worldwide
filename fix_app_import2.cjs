const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';", "import { collection, onSnapshot, setDoc, doc, getDoc, updateDoc, increment } from 'firebase/firestore';");

fs.writeFileSync('src/App.tsx', code);
