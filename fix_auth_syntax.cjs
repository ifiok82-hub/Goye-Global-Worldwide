const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

code = code.replace(/\) : \(\s*\{\/\* Country Selector \(Searchable\) \*\/\}/g, `) : ( <> {/* Country Selector (Searchable) */}`);
code = code.replace(/<\/div>\s*<div className="flex gap-2">/g, `</div> <div className="flex gap-2">`);
code = code.replace(/placeholder="WhatsApp Number" \/>\s*<\/div>\s*\)/g, `placeholder="WhatsApp Number" /> </div> </> )`);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
