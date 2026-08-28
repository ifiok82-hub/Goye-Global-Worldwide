const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const oldSelect = /<select \s*value=\{countryCode\}\s*onChange=\{e=>setCountryCode\(e\.target\.value\)\}\s*className="bg-black\/50 border border-\[\#333\] focus:border-\[\#FFD700\] rounded-xl py-3 px-2 text-white text-sm outline-none w-\[90px\]"\s*>\s*<option.*?<\/select>/s;

const newSelect = `<select 
                value={countryCode} 
                onChange={e=>setCountryCode(e.target.value)} 
                className="bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-2 text-white text-sm outline-none w-[110px]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.phone}>{c.flag} {c.phone}</option>
                ))}
              </select>`;

code = code.replace(oldSelect, newSelect);
fs.writeFileSync('src/components/AuthScreen.tsx', code);
