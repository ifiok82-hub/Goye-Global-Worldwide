const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const replacement = `
            {/* Country Selector (Searchable) */}
            <div className="relative z-50">
              <div 
                className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm flex items-center justify-between cursor-pointer"
                onClick={() => document.getElementById('country-dropdown').classList.toggle('hidden')}
              >
                <span>{COUNTRIES.find(c => c.phone === countryCode)?.flag || '🌍'} {COUNTRIES.find(c => c.phone === countryCode)?.name || 'Select Country'} ({countryCode})</span>
                <span className="text-xs text-gray-500">▼</span>
              </div>
              <div id="country-dropdown" className="hidden absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#333] rounded-xl max-h-60 overflow-y-auto shadow-2xl z-[100]">
                <div className="sticky top-0 bg-[#111] p-2 border-b border-[#333]">
                  <input 
                    type="text" 
                    placeholder="Search country..." 
                    className="w-full bg-black border border-[#222] rounded-lg py-2 px-3 text-white text-xs outline-none"
                    onChange={(e) => {
                      const q = e.target.value.toLowerCase();
                      document.querySelectorAll('.country-item').forEach(el => {
                        el.style.display = el.innerText.toLowerCase().includes(q) ? 'block' : 'none';
                      });
                    }}
                  />
                </div>
                {COUNTRIES.map(c => (
                  <div 
                    key={c.code} 
                    className="country-item p-3 text-sm text-white hover:bg-[#222] cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setCountryCode(c.phone);
                      document.getElementById('country-dropdown').classList.add('hidden');
                      // Update active user state to reflect country currency globally
                      if(c.currency) localStorage.setItem('goye_currency', c.currency);
                    }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="text-gray-500 ml-auto">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="bg-[#222] text-white py-3 px-3 rounded-xl flex items-center text-sm font-bold min-w-[80px] justify-center border border-[#333]">
                {countryCode}
              </div>
              <div className="relative flex-1">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="tel" placeholder="WhatsApp / Phone Number" value={contact} onChange={e=>setContact(e.target.value.replace(/[^0-9\s-]/g, ''))} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input required type="number" min="8" max="18" placeholder="Age (8-18)" className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" />
              </div>
              <div className="relative flex-1 z-40">
                <select className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors appearance-none">
                  <option value="">Timezone</option>
                  <option value="WAT">WAT (Lagos)</option>
                  <option value="GMT">GMT (London)</option>
                  <option value="EST">EST (New York)</option>
                  <option value="PST">PST (California)</option>
                  <option value="IST">IST (India)</option>
                  <option value="SAST">SAST (SA)</option>
                  <option value="EAT">EAT (Kenya)</option>
                  <option value="GST">GST (Dubai)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <input type="text" placeholder="Your School Name (Optional)" className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" />
            </div>
`;

const regex = /<div className="flex gap-2">\s*<select\s*value={countryCode}[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AuthScreen.tsx', code);
