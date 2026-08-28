const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

code = code.replace(/<div className="bg-\[#111\] p-6 rounded-full border border-\[#333\] mb-6">/, '');
fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
