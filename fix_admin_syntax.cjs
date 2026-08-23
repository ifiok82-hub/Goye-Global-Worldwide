const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const brokenPart = `      }</p>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={40} className="text-white"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Active Users</p>
                    <p className="text-white text-3xl font-black z-10">{activeUsers}</p>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#10B981]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={40} className="text-[#10B981]"/></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">System Status</p>
                    <p className="text-[#10B981] text-lg font-black z-10 mt-1">100% HEALTHY</p>
                  </div>
                </div>`;

const fixedPart = `
                {tab === 'admin' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><span className="text-[#FFD700] text-4xl">💰</span></div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Total Revenue</p>
                      <p className="text-[#FFD700] text-3xl font-black z-10">$ {totalSales.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><ShoppingCart size={40} className="text-[#FFD700]"/></div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Total Orders</p>
                      <p className="text-white text-3xl font-black z-10">{orders.length}</p>
                    </div>
                    <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={40} className="text-white"/></div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">Active Users</p>
                      <p className="text-white text-3xl font-black z-10">{activeUsers}</p>
                    </div>
                    <div className="bg-[#111] border border-[#333] p-5 rounded-xl flex flex-col justify-center relative overflow-hidden group hover:border-[#10B981]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={40} className="text-[#10B981]"/></div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 z-10">System Status</p>
                      <p className="text-[#10B981] text-lg font-black z-10 mt-1">100% HEALTHY</p>
                    </div>
                  </div>
                )}
`;

code = code.replace(brokenPart, fixedPart);
fs.writeFileSync('src/App.tsx', code);
