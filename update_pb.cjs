const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  '<div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-24 max-w-[420px] mx-auto border-x border-[#222]">',
  '<div className="min-h-screen bg-[#000] text-gray-200 font-sans pb-40 max-w-[420px] mx-auto border-x border-[#222]">'
);
fs.writeFileSync('src/App.tsx', code);
