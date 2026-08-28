const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const oldChoices = /<div className="space-y-3">.*?<\/div>\s*<\/div>\s*\) : activeGateway === 'crypto'/s;

const newChoices = `<div className="space-y-2">
                <button onClick={payWithPaystack} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Pay with Paystack (Global Cards)
                </button>
                <button onClick={payWithFlutterwave} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Flutterwave (Africa)
                </button>
                <button onClick={() => setActiveGateway('crypto')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  USDC Crypto
                </button>
                <button onClick={() => setActiveGateway('pi')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Pi GCV $314k
                </button>
                <button onClick={() => setActiveGateway('bank')} className="w-full h-[50px] bg-[#FFD700] text-black font-bold rounded-xl hover:scale-105 transition flex items-center justify-center pointer-events-auto cursor-pointer">
                  Manual Bank Transfer
                </button>
              </div>
            </div>
          ) : activeGateway === 'crypto'`;

code = code.replace(oldChoices, newChoices);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
