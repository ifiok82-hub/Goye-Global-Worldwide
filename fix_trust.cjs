const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const targetStr = `              {bankDetails && (
                <button onClick={() => setActiveGateway('bank')} className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl hover:border-white/30 transition text-center text-sm font-bold text-gray-300">
                  Manual Bank Transfer (Payoneer)
                </button>
              )}`;

const replacementStr = `              {bankDetails && (
                <button onClick={() => setActiveGateway('bank')} className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl hover:border-white/30 transition text-center text-sm font-bold text-gray-300">
                  Manual Bank Transfer (Payoneer)
                </button>
              )}

              <div className="flex justify-center items-center gap-4 mt-6">
                <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                  <ShieldCheck size={14} /> 100% Secure Checkout
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Lock size={14} /> SSL Encrypted
                </div>
              </div>`;

if(code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  console.log("Trust badges added to UnifiedCheckoutModal.");
} else {
  console.log("Could not find target string in UnifiedCheckoutModal!");
}

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
