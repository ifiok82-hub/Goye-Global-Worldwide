const fs = require('fs');
let code = fs.readFileSync('src/components/EsimVideoModal.tsx', 'utf8');

if (!code.includes('import RealQRCode')) {
  code = code.replace(
    "import { X, Play, Pause } from 'lucide-react';",
    "import { X, Play, Pause } from 'lucide-react';\nimport RealQRCode from './RealQRCode';"
  );
}

const oldDiv = `<div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GOYE-eSIM-BN3583773-Gasv.Store-Internal" alt="QR Demo" style={{ display: 'block' }}/>
            </div>`;

code = code.replace(oldDiv, `<RealQRCode className="transform scale-90 origin-top" />`);

fs.writeFileSync('src/components/EsimVideoModal.tsx', code);
