const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const enhancedOrders = `        {tab === 'downloads' && (
          <div className="max-w-4xl mx-auto px-4 mt-8 animate-in fade-in duration-500">
            <h2 className="text-[#FFD700] text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block">Order History & Downloads</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111] p-4 rounded-2xl border border-[#222]">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</div>
                <div className="text-2xl font-black text-white">{purchasedItems.length}</div>
              </div>
              <div className="bg-[#111] p-4 rounded-2xl border border-[#222]">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pending</div>
                <div className="text-2xl font-black text-yellow-500">{purchasedItems.filter((i:any) => i.status === 'pending').length}</div>
              </div>
              <div className="bg-[#111] p-4 rounded-2xl border border-[#222]">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Completed</div>
                <div className="text-2xl font-black text-[#10B981]">{purchasedItems.filter((i:any) => i.status !== 'pending').length}</div>
              </div>
            </div>

            {purchasedItems.length === 0 ? (
              <div className="bg-[#111] border border-[#333] rounded-2xl p-12 text-center">
                <Download size={48} className="text-gray-600 mx-auto mb-4"/>
                <p className="text-gray-400">You haven't purchased anything yet.</p>
                <button onClick={() => setTab('shop')} className="mt-4 bg-[#FFD700] text-black font-bold py-2 px-6 rounded-xl">Browse Store</button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedItems.map((item: any, i: number) => (
                  <div key={i} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#FFD700] font-mono mb-1">{item.ref}</div>
                      <h3 className="text-white font-bold text-lg">{item.productName}</h3>
                      <div className="text-gray-400 text-xs mt-1">
                        Date: {item.date} • Method: {item.method} • Status: <span className={item.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>{item.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={() => showToast('Generating invoice...')} className="bg-[#222] text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center">
                         <FileText size={16}/> Invoice
                      </button>
                      {item.status === 'pending' ? (
                        <div className="bg-yellow-900/30 text-yellow-500 border border-yellow-900/50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 flex-1 md:flex-none justify-center">
                          <RefreshCw size={14} className="animate-spin"/> Verifying
                        </div>
                      ) : (
                        <button onClick={() => { showToast('Download starting...'); setTimeout(() => { const a = document.createElement('a'); a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.'; a.download = item.productName + '.txt'; a.click(); }, 1500); }} className="bg-[#10B981] text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 flex-1 md:flex-none justify-center">
                          <Download size={16}/> Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}`;

const regex = /\{tab === 'downloads' && \([\s\S]*?(?=\{\/\* Toast Notification \*\/|\{isAdminAuth)/;
if (code.match(regex)) {
  code = code.replace(regex, enhancedOrders + "\n\n        ");
  fs.writeFileSync(file, code);
  console.log("Patched Orders");
} else {
  console.log("Could not find order history block");
}
