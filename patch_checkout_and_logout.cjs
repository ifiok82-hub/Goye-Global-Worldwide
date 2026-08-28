const fs = require('fs');
let appFile = 'src/App.tsx';
let checkoutFile = 'src/components/UnifiedCheckoutModal.tsx';

let appCode = fs.readFileSync(appFile, 'utf8');
let checkoutCode = fs.readFileSync(checkoutFile, 'utf8');

// 1. Fix UnifiedCheckoutModal z-index to be high enough and avoid pt-20 pushing content off screen
checkoutCode = checkoutCode.replace(/z-\[40\] pt-20/g, 'z-[5000]');
fs.writeFileSync(checkoutFile, checkoutCode);

// 2. Add Logout button to the More Menu in App.tsx
const moreMenuEndSearch = `                <button onClick={handleInstallClick} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#222] flex items-center gap-2"><Smartphone size={16} className="text-[#8b5cf6]"/> 📲 Install App</button>
              </div>`;
              
const moreMenuEndReplace = `                <button onClick={handleInstallClick} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#222] flex items-center gap-2"><Smartphone size={16} className="text-[#8b5cf6]"/> 📲 Install App</button>
                <button onClick={() => { localStorage.removeItem('goye_active_user'); setIsAuthenticated(false); setCurrentUser(null); setTab('auth'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#222] flex items-center gap-2"><Lock size={16} className="text-red-500"/> 🚪 Log Out</button>
              </div>`;

if(appCode.includes('📲 Install App')) {
    appCode = appCode.replace(moreMenuEndSearch, moreMenuEndReplace);
}

// 3. Make sure the User Icon also allows logging out
const userIconSearch = `onClick={() => setTab('home')}`;
const userIconReplace = `onClick={() => { setShowMoreMenu(!showMoreMenu); }}`;
appCode = appCode.replace(userIconSearch, userIconReplace);

fs.writeFileSync(appFile, appCode);
console.log("Patched checkout modal and added logout");
