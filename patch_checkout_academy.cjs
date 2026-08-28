const fs = require('fs');
const file = 'src/components/UnifiedCheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacement = `if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");

        setTimeout(() => {
          if (onToast) onToast("📧 Sending Automated Email & 📱 WhatsApp Receipt...");
        }, 800);
        
        if (product.category === 'academy' && (window as any).unlockAcademy) {
           (window as any).unlockAcademy();
        }

        setSuccess(true);`;

code = code.replace(/if \(onToast\) onToast\("✅ Webhook Verified\. Securing Download Access\."\);[\s\S]*?setSuccess\(true\);/, replacement);
fs.writeFileSync(file, code);
console.log("Patched UnifiedCheckoutModal successfully.");
