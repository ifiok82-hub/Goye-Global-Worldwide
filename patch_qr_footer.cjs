const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldQr = /<div className="qr-container">.*?<p style={{color:'#000', fontWeight:'bold', marginTop:'10px', fontSize:'14px', marginBottom:'0'}}>Scan Me - www\.gasv\.store<\/p>\s*<\/div>/s;

const newQr = `<div className="qr-container" style={{maxWidth: '280px', width: '90%', margin: '20px auto', height: 'auto', display: 'block', position: 'relative', zIndex: 1, padding: '16px', background: 'white', border: '3px solid #FFD700', borderRadius: '24px'}}>
          <div style={{position:'relative'}}>
            <img loading="lazy" src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store" alt="GOYE QR" style={{width:'100%', height:'auto', display:'block', borderRadius:'16px'}} />
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'white', borderRadius:'50%', width:'60px', height:'60px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.2)'}}>
              <span style={{fontSize:'36px', color:'#3b82f6'}}>🌐</span>
            </div>
          </div>
          <p style={{color:'#000', fontWeight:'bold', marginTop:'16px', fontSize:'16px', marginBottom:'0', textAlign:'center'}}>Scan Me - www.gasv.store</p>
        </div>`;

code = code.replace(oldQr, newQr);
fs.writeFileSync('src/App.tsx', code);
