const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("const { doc, getDoc, setDoc, updateDoc, increment } = require('firebase/firestore');", "");
code = code.replace("import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';", "import { doc, getDoc, setDoc, updateDoc, increment, deleteDoc, collection, onSnapshot } from 'firebase/firestore';");

fs.writeFileSync('src/App.tsx', code);
