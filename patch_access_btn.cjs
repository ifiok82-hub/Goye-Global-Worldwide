const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldButton = `<button onClick={() => { showToast('Download starting...'); setTimeout(() => { const a = document.createElement('a'); a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; a.download = item.productName + '.txt'; a.click(); }, 1500); }} className="bg-[#10B981] text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center">
                          <Download size={16}/> Access
                        </button>`;

const newButton = `<button onClick={() => { 
                          showToast('Download starting...'); 
                          const a = document.createElement('a'); 
                          a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; 
                          a.download = (item.productName || 'product').replace(/\\s+/g, '_') + '_delivery.txt'; 
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }} className="bg-[#10B981] text-black font-black py-2 px-6 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center transition-transform active:scale-95">
                          <Download size={16}/> Download Now
                        </button>`;

if(code.includes(oldButton)) {
  code = code.replace(oldButton, newButton);
  fs.writeFileSync(file, code);
  console.log("Patched Access button to Download Now");
} else {
  console.log("Could not find Access button");
}
