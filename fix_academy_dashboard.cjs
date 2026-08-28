const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

const brokenPart = `  if (loading) return <div className="text-center text-gray-500 py-12">Loading academy profile...</div>;          <div className="bg-[#111] p-6 rounded-full border border-[#333] mb-6">`;
const fixedPart = `  if (loading) return <div className="text-center text-gray-500 py-12">Loading academy profile...</div>;

  // Render the dashboard even if not enrolled, but show locked states.
`;

code = code.replace(brokenPart, fixedPart);

const lockedPart = `          <Lock size={48} className="text-[#FFD700]" />
        </div>
        <h2 className="text-[#FFD700] text-2xl font-black mb-3">🔒 Locked</h2>
        <p className="text-gray-400 text-sm mb-8">Access is restricted. Please purchase to unlock Academy progress, modules, Sirwise AI Tutor, Live Class (Google Meet) and Certificates.</p>
        <button onClick={() => setShowPaymentModal(true)} className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-xl w-full max-w-[300px] cursor-pointer pointer-events-auto z-10 touch-manipulation">
          Start Learning
        </button>
      </div>
    );
  }`;

code = code.replace(lockedPart, '');

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
