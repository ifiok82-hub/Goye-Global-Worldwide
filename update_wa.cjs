const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const waLink = `<a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'12px', textDecoration:'none', fontSize:'14px', fontWeight:'bold'}}>
            <MessageCircle size={18}/> WhatsApp Support
          </a>`;

const newWaLink = `<button onClick={() => {
            if (!navigator.onLine) {
              showToast('You are currently offline. Please reconnect to launch support.');
              return;
            }
            window.open('/api/support-chat?text=Hello GOYE Support', '_blank');
          }} style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:'bold'}}>
            <MessageCircle size={18}/> WhatsApp Support
          </button>`;

code = code.replace(waLink, newWaLink);
fs.writeFileSync(file, code);
console.log("Updated WA link");
