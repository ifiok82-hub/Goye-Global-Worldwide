const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '<h2 className="text-white text-2xl font-black mb-6">Admin Dashboard</h2>';

const adminContent = `
            <h2 className="text-white text-2xl font-black mb-6">Admin Dashboard</h2>
            
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 mb-8">
              <h3 className="text-[#FFD700] font-bold mb-4">Payment Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Paystack Public Key (pk_live_...)</label>
                  <input id="paystack_key" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).paystack : localStorage.getItem('paystack_public_key')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Flutterwave Public Key (FLWPUBK-...)</label>
                  <input id="flutterwave_key" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).flutterwave : localStorage.getItem('flutterwave_public_key')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Crypto USDC Wallet Address</label>
                  <input id="crypto_wallet" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).crypto : localStorage.getItem('crypto_wallet')} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pi Network GCV Wallet Address</label>
                  <input id="pi_wallet" type="text" className="w-full bg-black border border-[#333] rounded p-2 text-white" defaultValue={localStorage.getItem('PAYMENT_CONFIG') ? JSON.parse(localStorage.getItem('PAYMENT_CONFIG')).pi : localStorage.getItem('pi_wallet')} />
                </div>
                <button onClick={() => {
                  const paystack = document.getElementById('paystack_key').value;
                  const flutterwave = document.getElementById('flutterwave_key').value;
                  const crypto = document.getElementById('crypto_wallet').value;
                  const pi = document.getElementById('pi_wallet').value;
                  
                  const config = { paystack, flutterwave, crypto, pi };
                  localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(config));
                  
                  localStorage.setItem('paystack_public_key', paystack);
                  localStorage.setItem('flutterwave_public_key', flutterwave);
                  localStorage.setItem('crypto_wallet', crypto);
                  localStorage.setItem('pi_wallet', pi);
                  
                  // Save to Firebase
                  setDoc(doc(db, 'settings', 'payments'), config)
                    .then(() => alert('Saved to Firestore & Local Storage!'))
                    .catch(e => alert('Saved locally. Firestore error: ' + e.message));
                }} className="bg-[#10B981] text-white font-bold px-6 py-2 rounded">
                  SAVE ALL CONFIG
                </button>
              </div>
            </div>
`;

code = code.replace(targetStr, adminContent);
fs.writeFileSync('src/App.tsx', code);
