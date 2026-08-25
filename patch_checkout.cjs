const fs = require('fs');
const file = 'src/components/UnifiedCheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldDelay = `// Simulate backend webhook verification delay
      setTimeout(() => {
        const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
        downloads.push(order);
        localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
        
        saveToDb();
        
        if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");
        setSuccess(true);
      }, 2500);`;

const newDelay = `// Simulate backend webhook verification delay
      setTimeout(() => {
        const downloads = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
        downloads.push(order);
        localStorage.setItem('goye_digital_products_orders', JSON.stringify(downloads));
        
        saveToDb();
        
        if (onToast) onToast("✅ Webhook Verified. Securing Download Access.");
        
        setTimeout(() => {
          if (onToast) onToast("📧 Sending Automated Email & 📱 WhatsApp Receipt...");
        }, 800);
        
        setSuccess(true);
      }, 2000);`;

if(code.includes(oldDelay)) {
  code = code.replace(oldDelay, newDelay);
  fs.writeFileSync(file, code);
  console.log("Patched UnifiedCheckoutModal delay");
} else {
  console.log("Could not find old delay code");
}
