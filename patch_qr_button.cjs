const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldButton = `<button 
              onClick={(e)=>{ e.stopPropagation(); console.log('QR clicked'); setShowQRModal(true); }} 
              style={{background:'#111', border:'2px solid #FFD700', color:'#FFD700', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
            >
              📷 QR
            </button>`;

const newButton = `<RealQRCode customTrigger={
              <button 
                style={{background:'#111', border:'2px solid #FFD700', color:'#FFD700', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold', cursor:'pointer', zIndex:101, pointerEvents:'auto', position:'relative'}}
              >
                📷 QR
              </button>
            } />`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('src/App.tsx', code);
