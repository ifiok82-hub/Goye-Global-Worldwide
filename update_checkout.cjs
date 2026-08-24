const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

if (!code.includes("import { db } from '../lib/firebase';")) {
  code = code.replace(
    "import { X, Lock, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';",
    "import { X, Lock, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';\nimport { db } from '../lib/firebase';\nimport { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';"
  );
}

const oldOrderSaving = /const order = \{[\s\S]*?const downloads = JSON\.parse\(localStorage\.getItem\('goye_digital_products_orders'\) \|\| '\[\]'\);[\s\S]*?setSuccess\(true\);\n      \}, 2500\);\n    \}/;

const newOrderSaving = `const order = {
      id: Date.now().toString(),
      ref: ref,
      productId: product.id,
      productName: product.name,
      amount: priceUSD,
      method: method,
      status: isPending ? 'pending' : 'completed',
      date: new Date().toISOString(),
      customerEmail: email
    };
    
    const saveToDb = async () => {
      try {
        await addDoc(collection(db, 'orders'), order);
      } catch (e) {
        console.error('Error saving order to db', e);
      }
    };
    
    if (isPending) {
      const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
      downloads.push(order);
      localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
      
      saveToDb();
      
      alert('Transaction Submitted! Pending secure webhook verification. Check "My Downloads" tab later.');
      onClose();
    } else {
      if (onToast) onToast("Initiating Secure Webhook Verification...");
      
      // Simulate backend webhook verification delay
      setTimeout(() => {
        const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
        downloads.push(order);
        localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
        
        saveToDb();
        
        if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");
        setSuccess(true);
      }, 2500);
    }`;

code = code.replace(oldOrderSaving, newOrderSaving);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
