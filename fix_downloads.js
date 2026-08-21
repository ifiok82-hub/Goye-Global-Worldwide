import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const useEfectOld1 = `const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_downloads') || '[]');
    setPurchasedItems([...purchased, ...freeDownloads.map(d => ({ productName: d.title, ref: d.type, date: d.date }))]);`;
const useEfectNew1 = `const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_free_downloads') || '[]');
    setPurchasedItems(purchased);
    // free is not loaded in purchasedItems anymore
    setFreeItems(freeDownloads);`;

const useEfectOld2 = `const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_downloads') || '[]');
    setPurchasedItems([...purchased, ...freeDownloads.map((d: any) => ({ productName: d.title, ref: d.type, date: d.date }))]);`;
const useEfectNew2 = `const purchased = JSON.parse(localStorage.getItem('goye_purchased_digital_products') || '[]');
    const freeDownloads = JSON.parse(localStorage.getItem('goye_free_downloads') || '[]');
    setPurchasedItems(purchased);
    setFreeItems(freeDownloads);`;

// Also add const [freeItems, setFreeItems] = useState<any[]>([]);
code = code.replace(`const [purchasedItems, setPurchasedItems] = useState<any[]>([]);`, `const [purchasedItems, setPurchasedItems] = useState<any[]>([]);\n  const [freeItems, setFreeItems] = useState<any[]>([]);`);

if (code.includes(useEfectOld1)) code = code.replace(useEfectOld1, useEfectNew1);
if (code.includes(useEfectOld2)) code = code.replace(useEfectOld2, useEfectNew2);

const downloadsTabOld = `{purchasedItems.length === 0 ? (
              <div className="bg-[#111] border border-white/10 p-8 rounded-2xl text-center text-gray-400">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                <p>No purchases yet. Your unlocked items will appear here forever.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedItems.map((order, i) => (
                  <div key={i} className="bg-[#111] border border-green-500/20 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500"/> {order.productName}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">Order Ref: <span className="font-mono text-[#FFD700]">{order.ref}</span> • {new Date(order.purchaseDate || order.date).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto z-[100] relative">
                      <button onClick={() => handleDownload(order)} className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                        <Download size={14}/> Download
                      </button>
                      <button onClick={() => alert('Access link has been resent to your email!')} className="flex-1 md:flex-none px-4 py-2 bg-[#222] text-white border border-[#333] rounded-lg text-xs hover:bg-[#333] transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                        <Mail size={14}/> Resend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}`;

const handleFreeDownload = `const handleFreeDownload = (title) => {
    if (title.includes("eBook")) {
      const content = "5 WAYS TO MAKE MONEY WITH AI 2024\\n\\nBy Goye Global & Sirwise AI Web3 Academy\\nRC BN3583773\\n\\n1. AI Freelancing - Offer ChatGPT services on Fiverr $50-$500 per gig\\n2. AI eBooks - Create eBooks with AI and sell on GOYE Store\\n3. AI Course Creation - Teach what you learn\\n4. eSIM Reselling - Buy $9.99 sell $19.99 worldwide\\n5. Prompt Engineering - Sell prompts $5-$50\\n\\nFull 20-page guide available after download...\\n\\nContact: https://www.gasv.store - Support 24/7";
      const blob = new Blob([content], {type: "text/plain"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download="5_Ways_To_Make_Money_With_AI_2024_FREE_eBook.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      alert("✅ FREE eBook Downloaded! Check your Downloads folder!");
    } else {
      alert("✅ Free Trial Code applied: " + title);
    }
  };
`;

const handlePaidDownload = `const handlePaidDownload = (order) => {
    const m = document.getElementById("videoModal"); 
    if(m) { 
      m.style.display="flex"; 
      m.innerHTML=\`<div style="background:#000; border:2px solid #FFD700; border-radius:16px; padding:20px; max-width:400px; width:95%; max-height:80vh; overflow-y:auto; text-align:left;"><h2 style="color:#FFD700; font-weight:bold; margin-bottom:10px;">💳 Access Details: Paid Verified</h2><div style="background:#111; padding:15px; border-radius:10px; margin:10px 0; border-left:4px solid #FFD700;"><p style="color:white; font-weight:bold; font-size:14px;">\${order.productName}</p><p style="color:#aaa; font-size:11px;">Ref: \${order.ref}</p></div><div style="background:#000; padding:15px; border-radius:10px;"><p style="color:white; font-size:14px; margin-bottom:8px;">✅ Payment Confirmed (Paystack/Flutterwave/Crypto)</p><p style="color:white; font-size:14px; margin-bottom:8px;">📧 QR Code / Access Link sent to your email.</p><p style="color:white; font-size:14px; margin-bottom:8px;">Need help? Contact support.</p></div><button onclick="document.getElementById('videoModal').style.display='none'" style="background:transparent; color:#aaa; border:1px solid #444; width:100%; padding:8px; border-radius:8px; margin-top:8px; cursor:pointer;">Close</button></div>\`; 
    }
  };
`;

const downloadsTabNew = `{/* Free Gifts Section */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-l-4 border-green-500 pl-2">
                🎁 FREE GIFTS - No Payment
              </h3>
              {freeItems.length === 0 ? (
                <div className="bg-[#111] border border-green-500/10 p-4 rounded-xl text-center text-gray-500 text-sm">
                  No free gifts claimed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {freeItems.map((item, i) => (
                    <div key={i} className="bg-[#111] border border-green-500/30 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500"/> {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Claimed: {item.date}</p>
                      </div>
                      <button onClick={() => { ${handleFreeDownload.replace(/\n/g, '')} handleFreeDownload(item.title); }} className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto shrink-0 w-full md:w-auto">
                        <Download size={14}/> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paid Purchases Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-l-4 border-[#FFD700] pl-2">
                💳 MY PAID PURCHASES
              </h3>
              {purchasedItems.length === 0 ? (
                <div className="bg-[#111] border border-white/10 p-8 rounded-2xl text-center text-gray-400">
                  <Lock className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                  <p>No purchases yet. Your unlocked items will appear here forever.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchasedItems.map((order, i) => (
                    <div key={i} className="bg-[#111] border border-[#FFD700]/20 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-white font-bold text-lg flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#FFD700]"/> {order.productName}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Order Ref: <span className="font-mono text-[#FFD700]">{order.ref}</span> • {new Date(order.purchaseDate || order.date).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto z-[100] relative">
                        <button onClick={() => { ${handlePaidDownload.replace(/\n/g, '')} handlePaidDownload(order); }} className="flex-1 md:flex-none px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 rounded-lg text-xs font-bold hover:bg-[#FFD700]/20 transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                          <CheckCircle size={14}/> View Details
                        </button>
                        <button onClick={() => alert('Access link has been resent to your email!')} className="flex-1 md:flex-none px-4 py-2 bg-[#222] text-white border border-[#333] rounded-lg text-xs hover:bg-[#333] transition flex items-center justify-center gap-1 cursor-pointer pointer-events-auto">
                          <Mail size={14}/> Resend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>`;

if (code.includes(downloadsTabOld)) {
  code = code.replace(downloadsTabOld, downloadsTabNew);
  console.log("downloads tab updated");
}

fs.writeFileSync('src/App.tsx', code);
