const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldQuickRegex = /\{\/\* Payment Badges & Quick Access \*\/\}[\s\S]*?<footer id="support"/;
const newQuick = `{/* Payment Badges & Quick Access */}
      <div className="p-4 bg-[#0a0a0a] pt-12 pb-24">
        <div className="text-center text-gray-400 text-[11px] font-medium mb-6 leading-loose">
          connecting 190+ Countries Instantly.<br/>
          26 Courses From $9.99 • UK Visa $89.99<br/>
          Sirwise AI Web3 Academy 24/7
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-[#FFD700] text-[11px] font-bold flex items-center gap-2">
            <CreditCard size={14}/> Paystack
          </div>
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-gray-300 text-[11px] font-bold">
            Flutterwave
          </div>
          <div className="bg-[#111] border border-[#333] py-2 px-5 rounded-full text-[#10B981] text-[11px] font-bold flex items-center gap-1.5">
            <span className="font-serif">₿</span> Crypto
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <div className="bg-[#111] border border-[#333] py-2 px-6 rounded-full text-[#a855f7] text-[11px] font-bold">
            π Pi GCV $314k
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="border border-[#10B981]/30 bg-[#064e3b]/20 py-2.5 px-6 rounded-xl text-[#34d399] text-[11px] font-bold flex items-center gap-2">
            ⚡ Instant Delivery 190+ Countries • 24/7 Support
          </div>
        </div>

        <div className="bg-[#111] rounded-[2rem] p-6 max-w-md mx-auto border border-[#222]">
          <h3 className="text-center text-white text-base font-bold mb-6 flex items-center justify-center gap-2">
            🚀 QUICK ACCESS
          </h3>
          <div className="flex flex-col gap-3">
            <a href="https://www.gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Globe className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Website</span>
              </div>
              <span className="text-[#FFD700] text-[13px] font-bold">https://www.gasv.store</span>
            </a>
            
            <a href="#" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Search className="text-gray-400" size={20}/>
                <span className="text-gray-300 text-[13px]">Google</span>
              </div>
              <span className="text-gray-300 text-[13px]">GOYE Global Worldwide</span>
            </a>

            <a href="https://wa.me/2348033584736" target="_blank" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#25D366] border border-transparent transition">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-white" size={20}/>
                <span className="text-gray-300 text-[13px]">WhatsApp</span>
              </div>
              <span className="text-[#10B981] text-[13px] font-bold">+234 803 358 4736</span>
            </a>

            <a href="mailto:goye@gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Mail className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Email</span>
              </div>
              <span className="text-gray-400 text-[13px]">goye@gasv.store</span>
            </a>

            <button onClick={handleInstallClick} className="bg-black rounded-xl p-4 flex items-center justify-between w-full hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Smartphone className="text-gray-400" size={20}/>
                <span className="text-gray-300 text-[13px]">Install</span>
              </div>
              <span className="text-[#FFD700] text-[13px] font-bold">Install Now</span>
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-[#555] text-[10px] leading-relaxed">
              © 2026 Goyedagosmess Enterprise<br/>
              Sirwise AI Web3 Academy<br/>
              Trusted Worldwide • RC BN3583773
            </p>
          </div>
        </div>
      </div>
      <footer id="support"`;

code = code.replace(oldQuickRegex, newQuick);
fs.writeFileSync('src/App.tsx', code);
