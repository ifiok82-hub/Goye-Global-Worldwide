const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<SirwiseAITeacher isOpen=\{showSirwiseBot\} onClose=\{\(\) => setShowSirwiseBot\(false\)\} \/>/;
const replacement = `<SirwiseAITeacher isOpen={showSirwiseBot} onClose={() => setShowSirwiseBot(false)} />
      
      {showQRModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white p-6 rounded-3xl w-[90%] max-w-[300px] border-4 border-[#FFD700] flex flex-col items-center relative">
            <button onClick={() => setShowQRModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-black mb-4">Scan Me</h3>
            <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.gasv.store"} alt="QR" className="w-[200px] h-[200px]" />
            <div className="text-black font-bold mt-2 text-sm flex items-center gap-1"><Globe size={16} className="text-blue-500"/> www.gasv.store</div>
          </div>
        </div>
      )}

      {showScanModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center relative">
            <button onClick={() => setShowScanModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-white mb-4">QR Scanner</h3>
            <div className="w-full aspect-square bg-black border-2 border-[#10B981] border-dashed flex flex-col items-center justify-center text-gray-500 mb-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 w-full h-[2px] bg-[#10B981] animate-[scan_2s_ease-in-out_infinite]"></div>
                Scanning...
            </div>
            <input type="text" placeholder="Or enter code manually..." className="w-full bg-black border border-[#333] text-white p-3 rounded-xl mb-4" />
            <button onClick={() => { showToast('Scan processing...'); setShowScanModal(false); }} className="w-full bg-[#10B981] text-black font-bold py-3 rounded-xl">Verify Scan</button>
          </div>
        </div>
      )}

      {showReferralModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#FFD700] p-6 rounded-3xl w-[90%] max-w-[400px] flex flex-col items-center relative">
            <button onClick={() => setShowReferralModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-[#FFD700] mb-4 text-xl">Referral & Earn</h3>
            <p className="text-gray-400 text-sm text-center mb-4">Invite friends and earn rewards when they enroll in the Academy.</p>
            <div className="bg-black border border-[#333] w-full p-3 rounded-xl text-white text-center text-xs font-mono break-all mb-4 select-all">
              https://www.gasv.store?ref={currentUser?.uid || 'guest'}
            </div>
            <button onClick={() => { navigator.clipboard.writeText('https://www.gasv.store?ref='+(currentUser?.uid||'guest')); showToast('Copied to clipboard!'); }} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4">Copy Referral Link</button>
            <div className="w-full flex justify-between items-center bg-[#222] p-4 rounded-xl border border-[#333]">
              <span className="text-gray-400 font-bold">Total Earnings:</span>
              <span className="text-[#10B981] font-black text-xl">$0.00</span>
            </div>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[300px] flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowLanguageModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-white mb-4">Select Language</h3>
            {['English', 'French (Français)', 'Spanish (Español)', 'Arabic (العربية)', 'Hindi (हिन्दी)'].map(lang => (
               <button key={lang} onClick={() => { showToast(lang + ' selected'); setShowLanguageModal(false); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222]">{lang}</button>
            ))}
          </div>
        </div>
      )}

      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#111] border border-[#333] p-6 rounded-3xl w-[90%] max-w-[300px] flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowCurrencyModal(false)} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h3 className="font-black text-white mb-4">Select Currency</h3>
            {['USD $', 'NGN ₦', 'GBP £', 'EUR €', 'CAD C$', 'AUD A$', 'INR ₹', 'ZAR R'].map(curr => (
               <button key={curr} onClick={() => { const code = curr.split(' ')[0]; localStorage.setItem('goye_currency', code); setCurrentCurrency(code); showToast('Currency set to ' + code); setShowCurrencyModal(false); window.location.reload(); }} className="w-full text-left p-3 border-b border-[#222] text-white hover:bg-[#222] font-bold">{curr}</button>
            ))}
          </div>
        </div>
      )}`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
