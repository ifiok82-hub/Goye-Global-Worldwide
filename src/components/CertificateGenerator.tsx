import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

export default function CertificateGenerator({ userProfile, onToast }: any) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const studentName = `${userProfile?.firstName || 'Student'} ${userProfile?.surname || ''}`.trim();
  const issueDate = new Date().toISOString().split('T')[0];
  const certId = `GASV-CERT-${userProfile?.uid?.substring(0,6) || 'XXXX'}-${Math.floor(Math.random() * 9000 + 1000)}`;
  

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    if(onToast) onToast('Generating High-Resolution Certificate...');

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#0b0f19',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Sirwise_AI_Web3_Certificate_${userProfile?.surname || 'Student'}.pdf`);
      
      if(onToast) onToast('Certificate Downloaded Successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      if(onToast) onToast('Error generating certificate');
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="bg-[#FFD700] text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition transform active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
      >
        <Download size={24} />
        {isGenerating ? 'GENERATING PDF...' : 'DOWNLOAD E-CERTIFICATE'}
      </button>
      <p className="text-gray-400 text-xs mt-2 text-center">Your official verified Web3 & AI credential</p>

      {/* Hidden Certificate DOM for html2canvas to render */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div 
          ref={certificateRef}
          style={{
            width: '1200px',
            height: '850px',
            backgroundColor: '#0b0f19',
            padding: '40px',
            boxSizing: 'border-box',
            fontFamily: 'sans-serif',
            position: 'relative'
          }}
        >
          {/* Outer Border */}
          <div style={{
            width: '100%',
            height: '100%',
            border: '4px solid #eab308',
            position: 'relative',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Inner Border */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              right: '15px',
              bottom: '15px',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              pointerEvents: 'none'
            }}></div>

            <div style={{
              color: '#eab308',
              letterSpacing: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Sirwise AI Web3 Academy
            </div>
            
            <h1 style={{
              color: '#ffffff',
              fontSize: '48px',
              fontWeight: '900',
              margin: '0 0 5px 0',
              letterSpacing: '2px',
              textAlign: 'center'
            }}>
              CERTIFICATE OF DIGITAL COMPETENCY
            </h1>
            <p style={{ color: '#888', fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '60px' }}>
              Proudly Presented To
            </p>

            <h2 style={{
              color: '#eab308',
              fontSize: '64px',
              fontWeight: '900',
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
              borderBottom: '2px solid #eab308',
              paddingBottom: '10px',
              textAlign: 'center',
              width: '80%'
            }}>
              {studentName}
            </h2>

            <p style={{ color: '#ccc', fontSize: '18px', textAlign: 'center', maxWidth: '800px', lineHeight: '1.6', marginBottom: '60px' }}>
              for successfully completing the 4-week interactive virtual training curriculum in modern technology, 
              artificial intelligence, digital creation, and web3 fundamentals.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '80px' }}>
              <div style={{ padding: '8px 16px', border: '1px solid #eab308', borderRadius: '30px', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤖 AI & Prompt Engineering
              </div>
              <div style={{ padding: '8px 16px', border: '1px solid #eab308', borderRadius: '30px', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎨 Digital Asset Creation
              </div>
              <div style={{ padding: '8px 16px', border: '1px solid #eab308', borderRadius: '30px', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌐 Web3 & Cyber Safety
              </div>
            </div>

            {/* Footer / Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', marginTop: 'auto', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '5px' }}>
                  {issueDate}
                </div>
                <div style={{ color: '#888', fontSize: '14px' }}>Date of Issuance</div>
              </div>
              <div style={{ textAlign: 'center', width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', marginBottom: '8px' }}>
                  <img src={"https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.gasv.store/verify"} alt="QR" style={{width:'80px', height:'80px', display:'block'}} />
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '2px' }}>ID: {certId}</div>
                <div style={{ color: '#eab308', fontSize: '12px', fontWeight: 'bold' }}>gasv.store/verify</div>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '5px', lineHeight: '1.2' }}>
                  Sirwise AI Web3 Academy<br/>GOYE Global Worldwide RC BN3583773
                </div>
                <div style={{ color: '#888', fontSize: '14px' }}>Verified by Blockchain</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
