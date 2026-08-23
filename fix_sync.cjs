const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importFirebase = `import { db } from './lib/firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';\n`;

if (!code.includes('import { db }')) {
    code = code.replace("import { GoyeLogo } from './components/GoyeLogo';", "import { GoyeLogo } from './components/GoyeLogo';\n" + importFirebase);
}

const useEffectHook = `  useEffect(() => {
    // 1. Firebase Real-time listeners (onSnapshot)
    const productsRef = collection(db, 'store_products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        // Seed Firestore if empty
        ESIM_PRODUCTS.forEach(p => setDoc(doc(db, 'store_products', p.id), p));
      } else {
        setEsimProducts(snapshot.docs.map(d => d.data() as typeof ESIM_PRODUCTS[0]));
      }
    }, (error) => console.error("Firestore error store_products:", error));

    const coursesRef = collection(db, 'academy_courses');
    const unsubCourses = onSnapshot(coursesRef, (snapshot) => {
      if (snapshot.empty) {
        ACADEMY_COURSES.forEach(c => setDoc(doc(db, 'academy_courses', c.id), c));
      } else {
        setAcademyCourses(snapshot.docs.map(d => d.data() as typeof ACADEMY_COURSES[0]));
      }
    }, (error) => console.error("Firestore error academy_courses:", error));

    return () => {
      unsubProducts();
      unsubCourses();
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {`;

code = code.replace(`  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {`, useEffectHook);

fs.writeFileSync('src/App.tsx', code);
