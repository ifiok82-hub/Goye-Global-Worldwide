const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
code = code.replace("import LanguageModal from './components/LanguageModal';", "import LanguageModal from './components/LanguageModal';\nimport CurrencyModal, { CURRENCIES } from './components/CurrencyModal';\nimport { Bell, DollarSign } from 'lucide-react';");

// States
code = code.replace(
  "const [showLanguageModal, setShowLanguageModal] = useState(false);",
  "const [showLanguageModal, setShowLanguageModal] = useState(false);\n  const [showCurrencyModal, setShowCurrencyModal] = useState(false);\n  const [currentCurrency, setCurrentCurrency] = useState('USD');"
);

// Push Notifications Function
const pushNotifFn = `
  const handlePushNotification = () => {
    if (!('Notification' in window)) {
      showToast('Push notifications are not supported in this browser.');
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('GOYE Store', {
          body: 'You are now subscribed to notifications!',
          icon: '/logo.png'
        });
        showToast('Push notifications enabled!');
      } else {
        showToast('Notification permission denied.');
      }
    });
    setShowMoreMenu(false);
  };
`;
code = code.replace("const handleInstallClick = () => {", pushNotifFn + "\n  const handleInstallClick = () => {");

// Add to More Menu
const oldMoreMenu = /<button onClick=\{\(\) => \{ showToast\('Terms & Privacy opened\.'\); setShowMoreMenu\(false\); \}\} className="w-full text-left px-4 py-3 border-b border-\[\#222\] text-sm text-white hover:bg-\[\#222\] flex items-center gap-2"><FileText size=\{16\} className="text-\[\#10B981\]"\/> 📄 Terms & Privacy<\/button>/;
const newMoreMenu = `
                <button onClick={() => { setShowCurrencyModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><DollarSign size={16} className="text-[#10B981]"/> 💱 Currency ({currentCurrency})</button>
                <button onClick={handlePushNotification} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><Bell size={16} className="text-[#FF8C00]"/> 🔔 Enable Notifications</button>
                <button onClick={() => { showToast('Terms & Privacy opened.'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 border-b border-[#222] text-sm text-white hover:bg-[#222] flex items-center gap-2"><FileText size={16} className="text-[#10B981]"/> 📄 Terms & Privacy</button>
`;
code = code.replace(oldMoreMenu, newMoreMenu.trim());

// Render CurrencyModal
code = code.replace(
  "{showLanguageModal && <LanguageModal onClose={() => setShowLanguageModal(false)} />}",
  "{showLanguageModal && <LanguageModal onClose={() => setShowLanguageModal(false)} />}\n      {showCurrencyModal && <CurrencyModal onClose={() => setShowCurrencyModal(false)} currentCurrency={currentCurrency} onSelectCurrency={setCurrentCurrency} />}"
);

// Currency formatting utility
const currencyFormatHelper = `
  const formatPrice = (usdPrice: number) => {
    const curr = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];
    const converted = usdPrice * curr.rate;
    if (curr.code === 'PI') return \`\${converted.toFixed(6)} \${curr.symbol}\`;
    return \`\${curr.symbol}\${converted.toFixed(2)}\`;
  };
`;
code = code.replace("const handleInstallClick = () => {", currencyFormatHelper + "\n  const handleInstallClick = () => {");

// Replace literal $ signs in products list with formatPrice
// Example: <div className="text-xl text-[#FFD700] font-black">${product.price}</div>
code = code.replace(/<div className="text-xl text-\[\#FFD700\] font-black">\$\{product\.price\}<\/div>/g, '<div className="text-xl text-[#FFD700] font-black">{formatPrice(product.price)}</div>');
code = code.replace(/<div className="text-xl font-black mb-1">\$\{product\.price\}<\/div>/g, '<div className="text-xl font-black mb-1">{formatPrice(product.price)}</div>');

fs.writeFileSync('src/App.tsx', code);
