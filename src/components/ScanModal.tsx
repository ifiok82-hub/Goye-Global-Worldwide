import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScanModal({ onClose, onScanResult }: any) {
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    
    scannerRef.current.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      (decodedText) => {
        if (scannerRef.current && scannerRef.current.isScanning) {
           scannerRef.current.stop().then(() => {
              if (onScanResult) onScanResult(decodedText);
              onClose();
           });
        }
      },
      (errorMessage) => {
        // parse errors silently
      }
    ).catch(err => {
      setError("Failed to access camera. Please grant permissions.");
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Failed to stop html5Qrcode. ", error);
        });
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#10B981] rounded-2xl w-full max-w-sm relative overflow-hidden">
        <div className="bg-[#000] border-b border-[#333] p-4 flex items-center justify-between z-10">
          <h2 className="text-[#10B981] font-bold text-lg">Scan QR Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 bg-white text-black min-h-[300px]">
          <div id="reader" className="w-full"></div>
          {error && <p className="text-red-500 text-sm mt-2 font-bold text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
