const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const regex = /if \(product\.category === 'academy' && \(window as any\)\.unlockAcademy\) \{\s*\(window as any\)\.unlockAcademy\(\);\s*\}/g;
const rep = `if (product.category === 'academy') {
          localStorage.setItem('sirwise_paid', 'true');
          localStorage.setItem('payment_verified', 'true');
          localStorage.setItem('payment_date', new Date().toISOString());
          if ((window as any).unlockAcademy) (window as any).unlockAcademy();
          if (onToast) onToast("Payment Successful! Academy Unlocked!");
        }`;
code = code.replace(regex, rep);

// Let's also make sure pointer-events-auto is on the buttons
code = code.replace(/<button onClick=\{payWithPaystack\} className="[^"]*"/g, '<button onClick={payWithPaystack} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');
code = code.replace(/<button onClick=\{payWithFlutterwave\} className="[^"]*"/g, '<button onClick={payWithFlutterwave} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');
code = code.replace(/<button onClick=\{payWithPayPal\} className="[^"]*"/g, '<button onClick={payWithPayPal} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');
code = code.replace(/<button onClick=\{\(\) => setActiveGateway\('crypto'\)\} className="[^"]*"/g, '<button onClick={() => setActiveGateway(\'crypto\')} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');
code = code.replace(/<button onClick=\{\(\) => setActiveGateway\('pi'\)\} className="[^"]*"/g, '<button onClick={() => setActiveGateway(\'pi\')} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');
code = code.replace(/<button onClick=\{\(\) => setActiveGateway\('manual'\)\} className="[^"]*"/g, '<button onClick={() => setActiveGateway(\'manual\')} className="bg-[#FFD700] text-black font-bold h-[50px] w-full mt-2 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"');

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
