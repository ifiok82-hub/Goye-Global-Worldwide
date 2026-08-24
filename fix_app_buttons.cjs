const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import QRModal from './components/QRModal';
import ScanModal from './components/ScanModal';
import ReferralDashboardModal from './components/ReferralDashboardModal';
import VoiceModal from './components/VoiceModal';
`;

code = code.replace("import { GoyeLogo } from './components/GoyeLogo';", importsToAdd + "import { GoyeLogo } from './components/GoyeLogo';");

// Add URL param listener for referrals inside the component body, and states
const stateInsert = `
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referred_by', ref);
    }
  }, []);
`;

code = code.replace("const [isInstallable, setIsInstallable] = useState(false);", "const [isInstallable, setIsInstallable] = useState(false);" + stateInsert);


// Fix header buttons
const oldHeaderButtons = /<div className="flex items-center gap-2 flex-wrap justify-end max-w-\[140px\] pt-1">[\s\S]*?<\/div>/;
const newHeaderButtons = `
          <div className="flex items-center gap-2 flex-wrap justify-end max-w-[140px] pt-1 relative">
            <button onClick={() => setShowQRModal(true)} className="flex flex-col items-center justify-center bg-[#111] border border-[#FFD700] rounded-xl w-[42px] h-[42px] hover:bg-[#222]">
              <Camera size={14} className="text-[#9ca3af]" />
              <span className="text-[#FFD700] text-[8px] font-bold mt-1">QR</span>
            </button>
            <button onClick={() => setShowScanModal(true)} className="flex flex-col items-center justify-center bg-[#111] border border-[#10B981] rounded-xl w-[42px] h-[42px] hover:bg-[#222]">
              <Search size={14} className="text-[#3b82f6]" />
              <span className="text-[#10B981] text-[8px] font-bold mt-1">Scan</span>
            </button>
            <button onClick={() => setShowVoiceModal(true)} className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px] hover:bg-[#222]">
              <Mic size={14} className="text-[#3b82f6]" />
              <span className="text-white text-[8px] font-bold mt-1">Record</span>
            </button>
            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex flex-col items-center justify-center bg-[#111] border border-[#333] rounded-xl w-[42px] h-[42px] hover:bg-[#222]">
              <MoreHorizontal size={14} className="text-white" />
              <span className="text-white text-[8px] font-bold mt-1">More</span>
            </button>
            
            {showMoreMenu && (
              <div className="absolute top-[50px] right-0 bg-[#111] border border-[#333] rounded-xl shadow-2xl z-[5000] w-[200px] overflow-hidden">
                <button onClick={() => { setShowReferralModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Users size={16} className="text-[#FFD700]"/> 🤝 Referral & Earn</button>
                <button onClick={() => { showToast('Language Switcher coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Globe size={16} className="text-[#3b82f6]"/> 🌐 Language</button>
                <button onClick={() => { showToast('Terms & Privacy opened.'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><FileText size={16} className="text-[#10B981]"/> 📄 Terms & Privacy</button>
                <button onClick={handleInstallClick} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#222] flex items-center gap-2"><Smartphone size={16} className="text-[#8b5cf6]"/> 📲 Install App</button>
              </div>
            )}
          </div>
`;

code = code.replace(oldHeaderButtons, newHeaderButtons);

// Add REFERRALS to the array of tabs
const oldTabsArray = /\['HOME', 'SHOP', 'eSIM', 'ACADEMY', 'CONTRACTS', 'PROMPTS', 'DOWNLOADS', 'SUPPORT'\]\.map\(\(t\) => \(/;
const newTabsArray = `['HOME', 'SHOP', 'eSIM', 'ACADEMY', 'REFERRALS', 'CONTRACTS', 'PROMPTS', 'DOWNLOADS', 'SUPPORT'].map((t) => (`;
code = code.replace(oldTabsArray, newTabsArray);

// In the map function, we need to handle 'REFERRALS' click differently or just let it set tab. Actually, let's open modal on click if it's 'REFERRALS'.
const oldTabOnClick = /onClick=\{\(\) => \{ setTab\(t\.toLowerCase\(\)\); window\.location\.hash = t\.toLowerCase\(\); \}\}/;
const newTabOnClick = `onClick={() => { if(t === 'REFERRALS') { setShowReferralModal(true); return; } setTab(t.toLowerCase()); window.location.hash = t.toLowerCase(); }}`;
code = code.replace(oldTabOnClick, newTabOnClick);

// Add icon for REFERRALS
const oldTabIcons = /\{t === 'ACADEMY' && <GraduationCap size=\{14\}\/>\}/;
const newTabIcons = `{t === 'ACADEMY' && <GraduationCap size={14}/>}\n                {t === 'REFERRALS' && <Users size={14} className="text-[#FFD700]"/>}`;
code = code.replace(oldTabIcons, newTabIcons);

// Add the modals at the end of the return statement before the final </div>
const oldFinalDiv = /<SirwiseAITeacher/g;
const modalsToAdd = `
      {showQRModal && <QRModal onClose={() => setShowQRModal(false)} />}
      {showScanModal && <ScanModal onClose={() => setShowScanModal(false)} onScanResult={(res: string) => { showToast('Scanned: ' + res); }} />}
      {showReferralModal && <ReferralDashboardModal onClose={() => setShowReferralModal(false)} onToast={showToast} />}
      {showVoiceModal && <VoiceModal onClose={() => setShowVoiceModal(false)} onResult={(res: string) => { setSearchQuery(res); showToast('Voice: ' + res); }} />}
      
      <SirwiseAITeacher
`;

code = code.replace(oldFinalDiv, modalsToAdd.trim());

fs.writeFileSync('src/App.tsx', code);
