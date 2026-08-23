const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const brokenTarget = `        />
      )}
                {tab === 'admin' && (`;

const fixedWrapper = `        />
      )}
      {isAdmin && tab.startsWith('admin') && (
        <div className="animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                {tab === 'admin' && (`;

code = code.replace(brokenTarget, fixedWrapper);
fs.writeFileSync('src/App.tsx', code);
