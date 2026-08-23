const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for RealQRCode
if (!code.includes('import RealQRCode')) {
  code = code.replace(
    "import EsimVideoModal from './components/EsimVideoModal';",
    "import EsimVideoModal from './components/EsimVideoModal';\nimport RealQRCode from './components/RealQRCode';"
  );
}

// 2. Remove old REAL_QR declaration if it exists
code = code.replace(/const REAL_QR = "https:\/\/api\.qrserver\.com[^"]+";/g, '');

// 3. Replace QR in About section (Line ~1029)
code = code.replace(
  /<div className="bg-black p-4 rounded-xl border border-\[#FFD700\] inline-block mb-4">\s*<img src=\{REAL_QR\} alt="GOYE Official QR" className="w-32 h-32 mx-auto rounded-lg mb-2 bg-white p-1" \/>\s*<p className="text-\[#FFD700\] font-bold text-xs">Our Official QR<\/p>\s*<p className="text-gray-400 text-\[10px\]">Scan to Verify<\/p>\s*<\/div>/g,
  '<RealQRCode />'
);

// 4. Replace in QR Modal (Wait, we can just remove the old showQRModal entirely or replace its content, but our new component handles the modal itself. Let's find showQRModal uses)
code = code.replace(/<button[^>]*onClick=\{\(\)=>setShowQRModal\(true\)\}[^>]*>[\s\S]*?<\/button>/g, '<RealQRCode />');

// Remove old showQRModal definition
code = code.replace(/const \[showQRModal, setShowQRModal\] = useState\(false\);/g, '');

// Remove old showQRModal render block
code = code.replace(/\{showQRModal && \([\s\S]*?\}\)/, '');

// 5. Replace QR in footer
code = code.replace(
  /<div style=\{\{background:'#fff', padding:'10px', borderRadius:'16px', display:'inline-block', boxShadow:'0 5px 20px rgba\(0,0,0,0\.3\)'\}\}>\s*<img src=\{REAL_QR\} style=\{\{width:'150px', height:'150px', display:'block', borderRadius:'8px'\}\} \/>\s*<\/div>/g,
  '<RealQRCode />'
);

fs.writeFileSync('src/App.tsx', code);
