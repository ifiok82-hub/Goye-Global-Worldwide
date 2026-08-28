const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className="min-h-screen bg-\[#000\] text-gray-200 font-sans pb-40 w-full max-w-\[100vw\] overflow-x-hidden">/,
  '<div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-[120px] w-full max-w-[420px] mx-auto overflow-y-auto overflow-x-hidden relative box-border">'
);

fs.writeFileSync('src/App.tsx', code);
