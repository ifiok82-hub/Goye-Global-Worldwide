const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const oldPi = /          \) : \(\n            <div className="animate-in fade-in slide-in-from-right-4">/s;

const newPi = `          ) : activeGateway === 'bank' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[#FFD700] font-bold mb-4">Manual Bank Transfer</h3>
              <p className="text-gray-400 text-xs mb-4">Please transfer the amount to:</p>
              <div className="bg-black p-3 rounded-xl border border-[#333] mb-4">
                <div className="text-white text-sm font-bold">Bank Name: Zenith Bank</div>
                <div className="text-white text-sm font-bold">Account Name: Goyedagosmess Enterprise</div>
                <div className="text-white text-sm font-bold">Account Number: 1010101010</div>
              </div>
              <input 
                placeholder="Upload Receipt or Ref Number" 
                className="w-full bg-black border border-[#333] p-3 rounded-xl text-white mb-4 focus:border-[#FFD700] outline-none"
                value={cryptoTxHash}
                onChange={e => setCryptoTxHash(e.target.value)}
              />
              <button onClick={submitCrypto} disabled={cryptoVerifying} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4 disabled:opacity-50">
                {cryptoVerifying ? 'Verifying...' : 'Submit Receipt'}
              </button>
              <button onClick={() => setActiveGateway(null)} className="mt-4 text-gray-400 text-xs underline block mx-auto">Back to Methods</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4">`;

code = code.replace(oldPi, newPi);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
