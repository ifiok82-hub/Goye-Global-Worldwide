const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const securityBadges = `
          {/* Security & Trust Badges */}
          <div className="mt-12 mb-8 bg-[#111] border border-[#333] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center justify-center p-4 bg-black rounded-xl border border-[#222]">
                <ShieldCheck size={24} className="text-[#10B981] mb-2" />
                <h4 className="text-white font-bold text-sm mb-1">Verified Business</h4>
                <p className="text-gray-400 text-xs">RC BN3583773</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-black rounded-xl border border-[#222]">
                <Zap size={24} className="text-[#FFD700] mb-2" />
                <h4 className="text-white font-bold text-sm mb-1">Instant Automated Delivery</h4>
                <p className="text-gray-400 text-xs">Zero manual wait times</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-black rounded-xl border border-[#222]">
                <Lock size={24} className="text-[#8b5cf6] mb-2" />
                <h4 className="text-white font-bold text-sm mb-1">Scam-Proof Direct Gateway</h4>
                <p className="text-gray-400 text-xs">256-Bit SSL Encrypted</p>
              </div>
            </div>
          </div>
`;

code = code.replace(/<div className="text-center mt-12 mb-16">/m, securityBadges + "\n        <div className=\"text-center mt-12 mb-16\">");
fs.writeFileSync('src/App.tsx', code);
