const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure showVoiceModal exists in state
if (!code.includes('const [showVoiceModal, setShowVoiceModal] = useState(false);')) {
  code = code.replace(/const \[showScanModal, setShowScanModal\] = useState\(false\);/, 
    'const [showScanModal, setShowScanModal] = useState(false);\n  const [showVoiceModal, setShowVoiceModal] = useState(false);\n  const [showQRModal, setShowQRModal] = useState(false);');
}

// Replace the placeholder Scan modal with the actual ScanModal, VoiceModal, QRModal
const scanRegex = /\{showScanModal && \([\s\S]*?Verify Scan<\/button>\n          <\/div>\n        <\/div>\n      \)\}/m;

const modalRenders = `
      {showScanModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <ScanModal onClose={() => setShowScanModal(false)} onScanResult={(res) => { alert(res); setShowScanModal(false); }} />
        </div>
      )}

      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#3b82f6] p-6 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center relative">
            <button onClick={() => setShowVoiceModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer pointer-events-auto z-[100]">X</button>
            <h3 className="font-black text-[#3b82f6] mb-4">Record Capstone</h3>
            <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-gray-500 mb-4 rounded-xl border border-[#222]">
              <Mic size={48} className="text-[#3b82f6] mb-2" />
              <span>Camera & Mic</span>
            </div>
            <button onClick={() => { showToast('Recording started (simulated)...'); setTimeout(()=> { showToast('Recording saved!'); setShowVoiceModal(false); }, 3000); }} className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl cursor-pointer pointer-events-auto z-[100]">Start Recording</button>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white border-[3px] border-[#FFD700] p-6 rounded-[24px] w-[250px] flex flex-col items-center relative cursor-pointer pointer-events-auto z-[100]" onClick={() => setShowQRModal(false)}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.gasv.store" alt="GOYE QR" style={{width:'200px', height:'200px', display:'block', borderRadius:'16px'}} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <span className="text-2xl text-[#3b82f6]">🌐</span>
            </div>
            <p className="text-black font-bold mt-2 text-[14px] text-center mb-0 leading-tight">Scan Me<br/>www.gasv.store</p>
          </div>
        </div>
      )}
`;

code = code.replace(scanRegex, modalRenders);

// Let's also add the QR Top button if missing in the header
if (!code.includes('<QrCode size={12} /> QR')) {
    code = code.replace(/<button onClick=\{\(\) => setShowScanModal\(true\)\}/, 
    '<button onClick={() => setShowQRModal(true)} className="flex items-center gap-1 bg-black text-[#FFD700] px-2 py-1 rounded text-[10px] font-bold cursor-pointer pointer-events-auto z-[100]"><QrCode size={12} /> QR</button>\n            <button onClick={() => setShowScanModal(true)}');
}

fs.writeFileSync('src/App.tsx', code);
