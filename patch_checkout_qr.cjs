const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

if (!code.includes('import RealQRCode')) {
  code = code.replace(
    "import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw } from 'lucide-react';",
    "import { X, ShieldCheck, Lock, Upload, Copy, CheckCircle, RefreshCw } from 'lucide-react';\nimport RealQRCode from './RealQRCode';"
  );
}

const oldImg = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://www.gasv.store&color=000000&bgcolor=FFFFFF&qzone=1&margin=10&format=png&ecc=H" alt="GOYE QR" className="w-16 h-16 mx-auto mt-2 border border-[#FFD700] rounded-lg bg-white p-1" />`;

code = code.replace(oldImg, `<RealQRCode className="transform scale-75 origin-top mt-2" />`);

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
