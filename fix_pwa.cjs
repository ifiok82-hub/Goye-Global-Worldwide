const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const pwaLogic = `
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };
`;

if (!code.includes('deferredPrompt')) {
  code = code.replace(
    "const [purchasedItems, setPurchasedItems] = useState<any[]>([]);",
    "const [purchasedItems, setPurchasedItems] = useState<any[]>([]);" + pwaLogic
  );
  
  code = code.replace(
    "<button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 ${tab === 'downloads' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}`}><Download size={16}/> My Downloads</button>",
    `<button onClick={() => {setTab('downloads'); window.location.hash='downloads'}} className={\`whitespace-nowrap px-6 py-3 rounded-xl text-[13px] uppercase tracking-wider font-bold transition flex items-center gap-2 \${tab === 'downloads' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#444]' : 'text-[#888] hover:text-white border border-transparent'}\`}><Download size={16}/> My Downloads</button>
            {isInstallable && (
              <button onClick={handleInstallClick} className="whitespace-nowrap px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ml-1 bg-[#10B981] text-black shadow-md border border-[#059669]">
                <Download size={14}/> Install App
              </button>
            )}`
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
