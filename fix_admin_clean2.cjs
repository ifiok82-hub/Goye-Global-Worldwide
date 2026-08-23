const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const orphanedTags = `              </div>
          </div>
        </div>
      )}
      <footer id="support"`;

code = code.replace(orphanedTags, `      <footer id="support"`);
fs.writeFileSync('src/App.tsx', code);
