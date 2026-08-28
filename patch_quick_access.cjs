const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexEmail = /<a href="mailto:goye@gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-\[#FFD700\] border border-transparent transition">[\s\S]*?<\/a>/g;
const replacementEmail = `<a href="mailto:goye@gasv.store" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#FFD700] border border-transparent transition">
              <div className="flex items-center gap-4">
                <Mail className="text-[#3b82f6]" size={20}/>
                <span className="text-gray-300 text-[13px]">Email</span>
              </div>
              <span className="bg-[#111] text-white px-4 py-2 rounded-lg text-[13px] font-bold border border-[#333]">📧 Email Support</span>
            </a>`;

const regexWa = /<a href="https:\/\/wa.me\/2348033584736" target="_blank" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-\[#25D366\] border border-transparent transition">[\s\S]*?<\/a>/g;
const replacementWa = `<a href="https://wa.me/2348033584736?text=Hello%20Sirwise%20AI%20Web3%20Academy%20RC%20BN3583773" target="_blank" className="bg-black rounded-xl p-4 flex items-center justify-between hover:border-[#25D366] border border-transparent transition">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-[#25D366]" size={20}/>
                <span className="text-gray-300 text-[13px]">WhatsApp</span>
              </div>
              <span className="bg-[#111] text-[#25D366] px-4 py-2 rounded-lg text-[13px] font-bold border border-[#333]">💬 Chat on WhatsApp</span>
            </a>`;

code = code.replace(regexEmail, replacementEmail);
code = code.replace(regexWa, replacementWa);

fs.writeFileSync('src/App.tsx', code);
