const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

const regex = /<div className="flex flex-col gap-3 mt-4">[\s\S]*?<\/div>/;
const replacement = `<div className="flex flex-col gap-[8px] mt-4 w-full">
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] w-full rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-10">
            Paystack (OPay, Card, Bank)
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] w-full rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-10">
            Flutterwave (Card, USSD)
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] w-full rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-10">
            PayPal (Zap, Transfer)
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] w-full rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-10">
            Crypto USDC
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] w-full rounded-[12px] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto touch-manipulation z-10">
            Pi GCV $314k
          </button>
        </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
