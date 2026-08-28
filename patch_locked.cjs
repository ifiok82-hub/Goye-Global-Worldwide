const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

const regex = /<h2 className="text-white text-2xl font-black mb-3">Payment Required<\/h2>[\s\S]*?<\/button>/;
const replacement = `<h2 className="text-[#FFD700] text-2xl font-black mb-3">🔒 Locked</h2>
        <p className="text-gray-400 text-sm mb-8">Access is restricted. Please purchase to unlock Academy progress, modules, Sirwise AI Tutor, Live Class (Google Meet) and Certificates.</p>
        <button onClick={() => setShowPaymentModal(true)} className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-xl w-full max-w-[300px] cursor-pointer pointer-events-auto z-10 touch-manipulation">
          Start Learning
        </button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
