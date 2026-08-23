const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { ESIM_PRODUCTS, ACADEMY_COURSES } from './data';",
  "import { ALL_PRODUCTS } from './data';"
);

code = code.replace(
  "const [esimProducts, setEsimProducts] = useState(ESIM_PRODUCTS);",
  "const [products, setProducts] = useState(ALL_PRODUCTS);"
);
code = code.replace(
  "const [academyCourses, setAcademyCourses] = useState(ACADEMY_COURSES);",
  ""
);

// We need to update the onSnapshot logic for products
const oldFirebaseListeners = `    // 1. Firebase Real-time listeners (onSnapshot)
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
    }, (error) => console.error("Firestore error academy_courses:", error));`;

const newFirebaseListeners = `    // 1. Firebase Real-time listeners (onSnapshot)
    const productsRef = collection(db, 'all_products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        ALL_PRODUCTS.forEach(p => setDoc(doc(db, 'all_products', p.id), p));
      } else {
        setProducts(snapshot.docs.map(d => d.data() as typeof ALL_PRODUCTS[0]));
      }
    }, (error) => console.error("Firestore error all_products:", error));`;

code = code.replace(oldFirebaseListeners, newFirebaseListeners);

code = code.replace("unsubProducts();\n      unsubCourses();", "unsubProducts();");

fs.writeFileSync('src/App.tsx', code);
