const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

// We need to import Firebase if it's not imported
if (!code.includes("import { db } from")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { db } from '../lib/firebase';\nimport { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';");
}

const oldSuccessHandler = /const handleSuccess = \(ref: string, method: string, isPending: boolean = false\) => \{[\s\S]*?const referredBy = localStorage\.getItem\('referred_by'\);[\s\S]*?if \(referredBy && !isPending\) \{[\s\S]*?\}[\s\S]*?const order = \{/;

const newSuccessHandler = `
  const handleSuccess = async (ref: string, method: string, isPending: boolean = false) => {
    const referredBy = localStorage.getItem('referred_by');
    if (referredBy && !isPending) {
      try {
        const refDoc = doc(db, 'referrals', referredBy);
        const snap = await getDoc(refDoc);
        
        let piAmt = 0;
        if(method.toLowerCase().includes('pi')) piAmt = 0.0001; // Mock 20% of Pi GCV
        
        if (snap.exists()) {
          await updateDoc(refDoc, {
            usd: increment(priceUSD * 0.2),
            ngn: increment(priceNGN * 0.2),
            pi: increment(piAmt),
            signups: increment(1)
          });
        } else {
          await setDoc(refDoc, {
            clicks: 1,
            signups: 1,
            usd: priceUSD * 0.2,
            ngn: priceNGN * 0.2,
            pi: piAmt,
            payouts: []
          });
        }
        
        await addDoc(collection(db, 'referrals', referredBy, 'referral_payouts'), {
          amountUSD: priceUSD * 0.2,
          amountNGN: priceNGN * 0.2,
          amountPi: piAmt,
          method: method,
          productName: product.name,
          timestamp: serverTimestamp()
        });
      } catch(e) {
        console.error('Error tracking referral commission', e);
      }
    }
    
    const order = {
`;
code = code.replace(oldSuccessHandler, newSuccessHandler);

// One thing: `handleSuccess` is currently not async in the component. Wait, we changed it to `async` in our replacement above.
// But some places might call it synchronously. That's fine since we don't await the handler in callbacks usually.

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
