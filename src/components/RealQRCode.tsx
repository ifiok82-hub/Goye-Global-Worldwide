import React, { useState, ReactNode } from 'react';
import { Download, X } from 'lucide-react';

export default function RealQRCode({ className = "", customTrigger }: { className?: string, customTrigger?: ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  const downloadQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Download the composite or at least the API one. For the best result, we'll download the API one.
    fetch('https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://www.gasv.store')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'GOYE_Global_QR_BN3583773.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('Failed to download QR code.'));
  };

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setShowModal(true)} className={`inline-block cursor-pointer ${className}`}>
          {customTrigger}
        </div>
      ) : (
        <div 
          onClick={() => setShowModal(true)}
          className={`bg-white p-3 rounded-[16px] border-[3px] border-[#FFD700] inline-block cursor-pointer hover:scale-105 transition-transform ${className}`}
          style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
        >
          <div className="relative inline-block w-full max-w-[280px] min-w-[150px]">
            <img loading="lazy" 
              src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.gasv.store" 
              alt="GOYE Global QR - RC BN3583773" 
              className="w-full h-auto block rounded-lg"
              id="goyeRealQR"
              style={{ width: '100%', maxWidth: '280px' }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-[6px] w-[50px] h-[50px] flex items-center justify-center">
              <span style={{ fontSize: '30px' }} className="leading-none">🌐</span>
            </div>
          </div>
          <p className="text-black text-center font-bold mt-2 text-[12px]">Scan Me - www.gasv.store</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setShowModal(false); }}>
          <div className="bg-[#000] p-6 rounded-[25px] border-[3px] border-[#FFD700] max-w-[360px] w-full flex flex-col items-center relative" style={{boxShadow:'0 0 40px rgba(255,215,0,0.3)'}} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
            
            <div className="bg-white p-3 rounded-[16px] border-[3px] border-[#FFD700] inline-block w-full max-w-[280px] mt-4">
              <div className="relative inline-block w-full">
                <img loading="lazy" 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://www.gasv.store" 
                  alt="GOYE Global QR - RC BN3583773" 
                  className="w-full h-auto block rounded-lg"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 w-[70px] h-[70px] flex items-center justify-center">
                  <span style={{ fontSize: '42px' }} className="leading-none">🌐</span>
                </div>
              </div>
            </div>
            
            <p className="text-[#FFD700] font-bold text-center mt-5 text-[18px]">Scan to join GOYE Global</p>
            <p className="text-white font-bold text-center mt-1">www.gasv.store - RC BN3583773</p>
            <p className="text-[#10B981] text-[14px] text-center font-bold mt-2 mb-5">WhatsApp 24/7 Support</p>
            
            <button onClick={downloadQR} className="bg-[#FFD700] text-black w-full py-3 rounded-xl font-bold hover:bg-yellow-400 transition flex justify-center items-center gap-2">
              <Download size={18} /> Download QR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
