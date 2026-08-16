import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Zap, ZapOff } from 'lucide-react';

export default function QRScannerModal({ onClose, onScan }: { onClose: () => void, onScan: (text: string) => void }) {
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      (decodedText) => {
        if (!hasScannedRef.current) {
          hasScannedRef.current = true;
          onClose();
          setTimeout(() => onScan(decodedText), 100);
        }
      },
      (errorMessage) => {
        // ignore continuous scanning errors
      }
    ).then(() => {
      // Check for torch support after start
      try {
        const track = (scanner as any).getRunningTrack ? (scanner as any).getRunningTrack() : null;
        if (track) {
          const capabilities = track.getCapabilities();
          if (capabilities && capabilities.torch) {
            setHasTorch(true);
          }
        }
      } catch(e) { console.log(e); }
    }).catch((err) => {
      console.error("Camera start failed", err);
    });

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, [onClose, onScan]);

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    const newState = !torchOn;
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newState } as any]
      });
      setTorchOn(newState);
    } catch (err) {
      console.error("Failed to toggle torch", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] p-5 rounded-2xl border border-[#FFD700]/30 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg flex items-center gap-2">📷 Auto Scanner</h3>
            <p className="text-gray-400 text-[10px]">Align QR code within the frame</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-black rounded-full p-2 border border-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden border-2 border-[#FFD700]/50 bg-black aspect-square max-h-[350px] flex items-center justify-center w-full">
          <div id="qr-reader" className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full"></div>
          
          {/* Scan Overlay UI */}
          <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-black/40">
            <div className="w-full h-full relative border-2 border-[#FFD700]/50 rounded-lg">
              <div className="absolute w-full h-[2px] bg-[#FFD700] shadow-[0_0_15px_#FFD700] left-0" style={{ animation: 'scanLine 2s linear infinite' }}></div>
            </div>
          </div>

          {/* Torch Button */}
          {hasTorch && (
            <button 
              onClick={toggleTorch}
              className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur border border-white/20 p-3 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {torchOn ? <Zap className="text-[#FFD700]" size={24}/> : <ZapOff className="text-gray-400" size={24}/>}
            </button>
          )}
        </div>

        <div className="mt-6 text-center bg-black/50 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-[#10B981] font-bold mb-1 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Scanning automatically...
          </p>
          <p className="text-[10px] text-gray-500">Powered by GOYE Auto-Detect</p>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scanLine {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          #qr-reader { border: none !important; }
          #qr-reader__dashboard_section_csr { display: none !important; }
          #qr-reader__dashboard_section_swaplink { display: none !important; }
        `}} />
      </div>
    </div>
  );
}
