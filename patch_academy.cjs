const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle, Circle, Play, Lock, ChevronRight } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CertificateGenerator from './CertificateGenerator';

const MODULES = [
  { id: 1, title: 'AI & Prompt Engineering', desc: 'Homework assistance, smart research, prompt building.' },
  { id: 2, title: 'Digital Asset Creation', desc: 'Storytelling, graphics, interactive media.' },
  { id: 3, title: 'Web3 & Cyber Safety', desc: 'Online security, digital identity, Web3 basics.' },
  { id: 4, title: 'Capstone Showcase', desc: 'Final interactive project submission.' }
];

export default function AcademyDashboard({ currentUser, userProfile, onPurchase, onToast }: any) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const priceUSD = 49.99;
  const userCurrency = localStorage.getItem('goye_currency') || 'USD';
  const rates:any = { NGN: 1500, GBP: 0.79, EUR: 0.92, INR: 83, CAD: 1.35, AUD: 1.52, ZAR: 18, GHS: 13, KES: 130, AED: 3.67, BRL: 5.0, MXN: 17.0 };
  const rate = rates[userCurrency] || 1;
  const localPrice = (priceUSD * rate).toFixed(2);
  const displaySymbol = userCurrency === 'USD' ? '' : userCurrency + ' ';

  useEffect(() => {
    let enrolled = false;
    if (localStorage.getItem('sirwise_paid') === 'true' || userProfile?.is_academy_enrolled) {
      enrolled = true;
      setIsEnrolled(true);
      const localKey = \`goye_academy_progress_\${currentUser?.uid || 'guest'}\`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        setProgress(JSON.parse(localData).progress || []);
      }
    }
    setLoading(false);
  }, [currentUser, userProfile]);

  const handleEnrollSuccess = () => {
    localStorage.setItem('sirwise_paid', 'true');
    setIsEnrolled(true);
    setShowPaymentModal(false);
    onToast && onToast('Payment Successful! Welcome to Sirwise AI Web3 Academy.');
  };

  const toggleModule = (id: number) => {
    const newProgress = progress.includes(id) 
      ? progress.filter(pid => pid !== id)
      : [...progress, id];
    setProgress(newProgress);
    const localKey = \`goye_academy_progress_\${currentUser?.uid || 'guest'}\`;
    localStorage.setItem(localKey, JSON.stringify({ isEnrolled: true, progress: newProgress }));
  };

  const paymentGate = showPaymentModal && (
    <div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white text-black w-full max-w-[400px] rounded-3xl p-6 max-h-[90vh] overflow-y-auto relative">
        <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-500 font-bold text-xl">X</button>
        <h2 className="text-xl font-black mb-2 text-center">Sirwise AI Web3 Academy Enrollment</h2>
        <div className="text-center mb-6">
          <div className="text-3xl font-black text-[#10B981]">\${priceUSD}</div>
          {userCurrency !== 'USD' && <div className="text-gray-500 text-sm font-bold">Pay {displaySymbol}{localPrice}</div>}
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] rounded-xl flex items-center justify-center gap-2">
            <span className="text-lg">💳</span> Paystack (OPay, Card, Bank)
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] rounded-xl flex items-center justify-center gap-2">
            <span className="text-lg">🌊</span> Flutterwave
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] rounded-xl flex items-center justify-center gap-2">
            <span className="text-lg">P</span> PayPal
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] rounded-xl flex items-center justify-center gap-2">
            <span className="text-lg font-serif">₿</span> Crypto USDC
          </button>
          <button onClick={handleEnrollSuccess} className="bg-[#FFD700] text-black font-bold h-[50px] rounded-xl flex items-center justify-center gap-2">
            <span className="text-lg">π</span> Pi GCV $314k
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="text-center text-gray-500 py-12">Loading academy profile...</div>;

  if (!isEnrolled) {
    return (
      <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-[#222] min-h-[60vh] flex flex-col items-center justify-center text-center">
        {paymentGate}
        <div className="bg-[#111] p-6 rounded-full border border-[#333] mb-6">
          <Lock size={48} className="text-[#FFD700]" />
        </div>
        <h2 className="text-white text-2xl font-black mb-3">Payment Required</h2>
        <p className="text-gray-400 text-sm mb-8">Please enroll to access Sirwise AI Web3 Academy studies and your AI Tutor.</p>
        <button onClick={() => setShowPaymentModal(true)} className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-xl w-full max-w-[300px]">
          Pay Now
        </button>
      </div>
    );
  }

  const percentComplete = Math.round((progress.length / MODULES.length) * 100);

  return (
    <div className="w-full">
      <div className="bg-[#111] rounded-3xl p-8 border border-[#333] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-[#FFD700]/20 rounded-xl flex items-center justify-center border border-[#FFD700]/50">
              <GraduationCap className="text-[#FFD700]" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#FFD700]">SIRWISE AI WEB3 ACADEMY</h2>
              <p className="text-[#FFD700] text-sm font-bold uppercase tracking-widest">Virtual Training Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="bg-[#111] rounded-2xl p-6 border border-[#222] mb-6 opacity-90">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h3 className="text-white font-bold mb-1">Your Progress</h3>
              <p className="text-gray-400 text-xs">Complete all modules to unlock your certificate.</p>
            </div>
            <div className="text-3xl font-black text-[#FFD700]">{isEnrolled ? percentComplete : 0}%</div>
          </div>
          <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-[#333]">
            <div 
              className="h-full bg-[#FFD700] rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: \`\${isEnrolled ? percentComplete : 0}%\` }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="flex flex-col" style={{ gap: "16px" }}>
          {MODULES.map((mod) => {
            const isCompleted = isEnrolled && progress.includes(mod.id);
            return (
              <div key={mod.id} className="bg-[#111] rounded-[16px] p-[20px] transition-all" style={{ border: "2px solid #FFD700" }}>
                <div className="flex justify-between items-start mb-4">
                  <div className={\`text-xs font-bold px-2 py-1 rounded-lg \${isCompleted ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#222] text-gray-400'}\`}>
                    MODULE {mod.id}
                  </div>
                  <button onClick={() => toggleModule(mod.id)} className="transition transform active:scale-90">
                    {isCompleted ? <CheckCircle className="text-[#10B981]" size={24} /> : <Circle className="text-gray-500" size={24} />}
                  </button>
                </div>
                <h4 className="font-bold text-lg mb-2 leading-tight text-white">{mod.title}</h4>
                <p className="text-gray-500 text-sm mb-6">{mod.desc}</p>
                
                <button onClick={() => !isCompleted && toggleModule(mod.id)} className={\`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition \${isCompleted ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/20'}\`}>
                  {isCompleted ? 'COMPLETED' : <><Play size={16} fill="currentColor" /> Start Learning</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Certificate Unlock */}
        <div className="mt-8">
          {(!isEnrolled || percentComplete < 100) ? (
             <div className="bg-[#111] border border-[#333] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Lock size={32} className="text-gray-600 mb-4" />
                <h3 className="text-gray-400 font-bold mb-2">E-Certificate Locked</h3>
                <p className="text-gray-600 text-sm">Enroll and complete all 4 modules to unlock your official Web3 competency certificate.</p>
             </div>
          ) : (
             <CertificateGenerator userProfile={userProfile} onToast={onToast} />
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
