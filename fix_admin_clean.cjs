const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldWrapper = `{isAdmin && tab.startsWith('admin') && (
        <div className="animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex-1 min-w-0">
                {tab === 'admin' && (`

const newWrapper = `{tab === 'admin' && (`

code = code.replace(oldWrapper, newWrapper);
fs.writeFileSync('src/App.tsx', code);
