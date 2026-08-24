import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const goyeLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF275" />
      <stop offset="25%" stopColor="#FFD700" />
      <stop offset="75%" stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#FF8C00" />
    </linearGradient>
    <path id="textPath" d="M 28,100 A 72,72 0 0,1 172,100" fill="transparent" />
  </defs>
  <circle cx="100" cy="100" r="96" fill="#000000" stroke="url(#goldGradient)" stroke-width="6"/>
  <circle cx="100" cy="100" r="84" fill="transparent" stroke="url(#goldGradient)" stroke-width="1" opacity="0.6"/>
  <text fill="url(#goldGradient)" font-family="sans-serif" font-weight="bold" font-size="13" letter-spacing="3">
    <textPath href="#textPath" startOffset="50%" text-anchor="middle">SIRWISE AI • WEB3 • ACADEMY</textPath>
  </text>
  <text x="100" y="115" fill="url(#goldGradient)" font-family="sans-serif" font-weight="900" font-size="48" text-anchor="middle" letter-spacing="1">GOYE</text>
  <text x="100" y="140" fill="url(#goldGradient)" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle" letter-spacing="1">STORE GLOBAL</text>
</svg>
`;

const logoDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(goyeLogoSvg);

export default function QRModal({ onClose }: any) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  
  const downloadQR = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "GOYE_Store_QR.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border-2 border-[#FFD700] rounded-2xl w-full max-w-sm text-center p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          <X size={24} />
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Share Store QR</h2>
        <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <QRCodeCanvas 
            id="qrCode" 
            ref={qrRef}
            value="https://www.gasv.store" 
            size={200} 
            level={"H"}
            imageSettings={{
              src: logoDataUrl,
              x: undefined,
              y: undefined,
              height: 48,
              width: 48,
              excavate: true,
            }}
          />
        </div>
        <p className="text-gray-400 text-sm mb-6">Scan to visit www.gasv.store directly!</p>
        <button onClick={downloadQR} className="bg-[#FFD700] text-black w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <Download size={18} /> Download QR Code
        </button>
      </div>
    </div>
  );
}
