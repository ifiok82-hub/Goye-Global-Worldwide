const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldButtonAccess = `                    {hasAccess(product.id) ? (
                      <button onClick={() => {
                        showToast('Access granted! Downloading...');
                        // Handle download/access logic here
                        if (product.category === 'academy') {
                          const m = document.getElementById('videoModal');
                          if(m) m.style.display = 'flex';
                        }
                      }} className="w-full bg-[#222] border border-[#10B981] text-[#10B981] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Download size={18}/> Access & Download
                      </button>
                    ) : (
                      <button onClick={() => setSelectedProduct(product)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Lock size={18}/> Unlock & Buy
                      </button>
                    )}`;
                    
const newButtonAccess = `                    {hasAccess(product.id) ? (
                      <button onClick={() => {
                        showToast('Access granted! Downloading...');
                        if (product.category === 'academy') {
                          const m = document.getElementById('videoModal');
                          if(m) m.style.display = 'flex';
                        } else {
                          // Direct 1-click download via data URI fallback
                          const a = document.createElement('a');
                          a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.';
                          a.download = product.name.replace(/\\s+/g, '_') + '_delivery.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }
                      }} className="w-full bg-[#10B981] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                        <Download size={18}/> Download Now
                      </button>
                    ) : (
                      <button onClick={() => setSelectedProduct(product)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                        <Lock size={18}/> Buy & Unlock
                      </button>
                    )}`;

const oldModalRender = `<UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => setSelectedProduct(null)} onToast={showToast} />`;
const newModalRender = `<UnifiedCheckoutModal product={selectedProduct} paymentConfig={paymentConfig} onClose={() => {
          setSelectedProduct(null);
          const items = JSON.parse(localStorage.getItem('goye_digital_products_orders') || '[]');
          setPurchasedItems(Array.isArray(items) ? items : []);
        }} onToast={showToast} />`;

if(code.includes(oldButtonAccess)) {
  code = code.replace(oldButtonAccess, newButtonAccess);
  code = code.replace(oldModalRender, newModalRender);
  fs.writeFileSync(file, code);
  console.log("Patched App.tsx buttons and modal close");
} else {
  console.log("Could not find old button access code");
}
