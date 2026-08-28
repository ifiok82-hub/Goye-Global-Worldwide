const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h4 style=\{\{color:'#fff', fontSize:'18px', fontWeight:'bold', marginBottom:'20px'\}\}>Scan to Share<\/h4>[\s\S]*?<div style=\{\{marginTop:'30px'\}\}>/;

const replacement = `<div className="qr-container" style={{maxWidth: '200px', width: '90%', margin: '20px auto', display: 'block', position: 'relative', zIndex: 1, padding: '8px', background: 'white', border: '3px solid #FFD700', borderRadius: '24px'}}>
          <div style={{position:'relative'}}>
            <img loading="lazy" src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store" alt="GOYE QR" style={{width:'100%', height:'auto', display:'block', borderRadius:'16px'}} />
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'white', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.2)'}}>
              <span style={{fontSize:'24px', color:'#3b82f6'}}>🌐</span>
            </div>
          </div>
          <p style={{color:'#000', fontWeight:'bold', marginTop:'8px', fontSize:'12px', marginBottom:'0', textAlign:'center'}}>Scan Me<br/>www.gasv.store</p>
        </div>
        
        <div style={{marginTop:'30px'}}>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
