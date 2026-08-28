const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFooter = /<div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>.*?<\/footer>/s;

const newFooter = `<div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Paystack</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Flutterwave</span>
            <span className="bg-[#111] text-[#FFD700] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">PayPal</span>
            <span className="bg-[#111] text-[#10B981] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Crypto USDC</span>
            <span className="bg-[#111] text-[#8b5cf6] text-[10px] px-3 py-1 rounded-full border border-[#333] font-bold">Pi GCV $314k</span>
          </div>
          <p style={{color:'#666', fontSize:'11px', margin:0, lineHeight:'1.5'}}>
            © 2026 Goyedagosmess Enterprise<br/>Sirwise AI Web3 Academy • Trusted Worldwide • RC BN3583773
          </p>
        </div>
      </footer>`;

code = code.replace(oldFooter, newFooter);
fs.writeFileSync('src/App.tsx', code);
