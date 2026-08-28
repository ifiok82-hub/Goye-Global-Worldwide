import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Lock } from 'lucide-react';

export default function CertificateGenerator({ isCompleted, isEnrolled, userProfile, priceUSD, displaySymbol, localPrice, onUnlock }: any) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    if (!isEnrolled) {
      if (onUnlock) onUnlock();
      return;
    }
    if (!isCompleted) {
      alert("Please complete all modules to unlock your certificate.");
      return;
    }

    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 600]
      });

      // Background
      doc.setFillColor(11, 15, 25);
      doc.rect(0, 0, 800, 600, 'F');
      
      // Border
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(4);
      doc.rect(20, 20, 760, 560);

      const pupilName = userProfile?.firstName || userProfile?.pupilName || 'Student Name';
      const issueDate = new Date().toISOString().split('T')[0];

      // Texts
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(16);
      doc.text('SIRWISE AI WEB3 ACADEMY', 400, 80, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text('CERTIFICATE OF DIGITAL COMPETENCY', 400, 140, { align: 'center' });

      doc.setTextColor(150, 150, 150);
      doc.setFontSize(14);
      doc.text('Proudly Presented To', 400, 200, { align: 'center' });

      doc.setTextColor(255, 215, 0);
      doc.setFontSize(48);
      doc.text(pupilName, 400, 260, { align: 'center' });
      
      // Line under name
      doc.setLineWidth(1);
      doc.line(200, 280, 600, 280);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(14);
      doc.text('for successfully completing the 4-week interactive virtual training curriculum', 400, 320, { align: 'center' });
      doc.text('in modern technology, artificial intelligence, digital creation, and web3 fundamentals.', 400, 340, { align: 'center' });

      // Badges
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(12);
      doc.text('AI & Prompt Engineering   |   Digital Asset Creation   |   Web3 & Cyber Safety', 400, 420, { align: 'center' });

      // Footer
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(issueDate, 150, 500, { align: 'center' });
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.text('Date of Issuance', 150, 520, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('GOYE Global Worldwide RC BN3583773', 650, 500, { align: 'center' });
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.text('Verified by Blockchain', 650, 520, { align: 'center' });
      
      // QR simulation text
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(10);
      doc.text('Verify at: www.gasv.store/verify', 400, 520, { align: 'center' });

      doc.save(`${pupilName.replace(/\s+/g, '_')}_Sirwise_Certificate.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error generating certificate. Please try again.');
    }
    setIsGenerating(false);
  };

  if (!isEnrolled) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <button 
          onClick={onUnlock}
          className="bg-[#222] text-gray-500 font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer pointer-events-auto z-10"
        >
          <Lock size={24} />
          Payment Required {displaySymbol}{localPrice}
        </button>
        <p className="text-gray-500 text-xs mt-2 text-center">Enroll to unlock your certificate</p>
      </div>
    );
  }

  if (!isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <button 
          disabled
          className="bg-[#222] text-gray-500 font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 opacity-70"
        >
          <Lock size={24} />
          DOWNLOAD E-CERTIFICATE
        </button>
        <p className="text-[#FFD700] text-xs mt-2 text-center font-bold">Complete all modules to unlock</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="bg-[#FFD700] text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition cursor-pointer pointer-events-auto z-10 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
      >
        <Download size={24} />
        {isGenerating ? 'GENERATING PDF...' : 'DOWNLOAD E-CERTIFICATE'}
      </button>
      <p className="text-gray-400 text-xs mt-2 text-center">Your official verified Web3 & AI credential</p>
    </div>
  );
}
