const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const footerStart = code.indexOf('<footer id="support"');
const footerEnd = code.indexOf('</footer>') + 9;

const newFooter = `<footer id="support" style={{background:'linear-gradient(180deg,#0a0a0a 0%,#000 100%)', borderTop:'3px solid #FFD700', padding:'0', marginTop:'50px', overflow:'hidden'}}>
        {/* Top gold shine line */}
        <div style={{height:'2px', background:'linear-gradient(90deg, transparent, #FFD700, transparent)'}}></div>
        
        <div style={{padding:'35px 15px 20px'}}>
          <div style={{maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'30px', alignItems:'start'}}>
            
            {/* Column 1: Brand & Identity */}
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}
                   onMouseDown={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
                   onMouseUp={() => clearTimeout(adminPressTimer.current)}
                   onMouseLeave={() => clearTimeout(adminPressTimer.current)}
                   onTouchStart={() => { const t = setTimeout(()=>setShowAdminLogin(true), 2000); adminPressTimer.current = t; }}
                   onTouchEnd={() => clearTimeout(adminPressTimer.current)}>
                <GoyeLogo size={40} className="text-[#FFD700]"/>
                <div>
                  <h3 style={{color:'#FFD700', fontSize:'16px', fontWeight:'900', margin:0, letterSpacing:'1px', lineHeight:'1.2'}}>GOYE GLOBAL WORLDWIDE</h3>
                  <p style={{color:'#888', fontSize:'10px', fontWeight:'bold', margin:0, letterSpacing:'2px'}}>RC BN3583773</p>
                </div>
              </div>
              <p style={{color:'#aaa', fontSize:'12px', lineHeight:'1.6', marginBottom:'20px'}}>
                Your trusted gateway to premium digital products, AI mastery, and Web3 education.
              </p>
              <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#fff', fontSize:'12px', marginBottom:'10px'}}>
                <Globe size={14} className="text-[#FFD700]"/> www.gasv.store
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#fff', fontSize:'12px'}}>
                <Mail size={14} className="text-[#FFD700]"/> goye@gasv.store
              </div>
            </div>

            {/* Column 2: Trust & Badges */}
            <div>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px', borderLeft:'3px solid #FFD700', paddingLeft:'10px'}}>Secure Payments</h4>
              <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>💳 Paystack</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>💳 Flutterwave</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#fff', fontSize:'11px', fontWeight:'bold'}}>🅿️ PayPal</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#10B981', fontSize:'11px', fontWeight:'bold'}}>💎 Crypto USDC</div>
                <div style={{background:'#111', border:'1px solid #333', padding:'8px 12px', borderRadius:'8px', color:'#8b5cf6', fontSize:'11px', fontWeight:'bold'}}>π Pi GCV</div>
              </div>
            </div>

            {/* Column 3: Quick Links & Support */}
            <div>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px', borderLeft:'3px solid #FFD700', paddingLeft:'10px'}}>Quick Access</h4>
              <ul style={{listStyle:'none', padding:0, margin:0, color:'#aaa', fontSize:'12px', lineHeight:'2.5'}}>
                <li><a href="https://www.gasv.store" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold'}}>🌐 https://www.gasv.store</a></li>
                <li style={{cursor:'pointer'}} onClick={() => setTab('academy')}>🎓 AI Web3 Academy</li>
                <li style={{cursor:'pointer'}} onClick={() => setTab('shop')}>🛒 Store & eSIM</li>
              </ul>
              <a href="https://wa.me/2348033584736?text=Hello GOYE Support" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#25D366', color:'#fff', padding:'10px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'12px', fontWeight:'bold', marginTop:'15px'}}>
                <MessageCircle size={16}/> WhatsApp Support
              </a>
            </div>

            {/* Column 4: QR Code */}
            <div style={{textAlign:'center'}}>
              <h4 style={{color:'#fff', fontSize:'14px', fontWeight:'bold', marginBottom:'15px'}}>Scan to Share</h4>
              <RealQRCode />
            </div>
            
          </div>
        </div>

        <div style={{background:'#000', borderTop:'1px solid #222', padding:'15px', textAlign:'center'}}>
          <p style={{color:'#666', fontSize:'11px', margin:0}}>
            © 2026 Goyedagosmess Enterprise • Sirwise AI Web3 Academy • Trusted Worldwide • RC BN3583773
          </p>
        </div>
      </footer>`;

code = code.substring(0, footerStart) + newFooter + code.substring(footerEnd);
fs.writeFileSync('src/App.tsx', code);
