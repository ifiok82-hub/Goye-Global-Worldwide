const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\(tab === 'home' \|\| tab === 'academy'\) && \([\s\S]*?\{\(tab === 'shop' \|\| tab === 'esim'\) && \([\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const genericRendering = `
        {(tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500">
            {tab === 'home' && <HeroSection onLogoTap={() => {
              const newCount = adminTapCount + 1;
              setAdminTapCount(newCount);
              if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
              setTimeout(() => setAdminTapCount(0), 3000);
            }} />}
            
            <h2 className="text-white text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block mt-8">
              {tab === 'shop' ? 'All Digital Products' : 
               tab === 'esim' ? 'Global eSIMs' : 
               tab === 'academy' ? 'Academy Courses' : 
               tab === 'contracts' ? 'Contracts & Visas' : 
               tab === 'prompts' ? 'AI Prompts' : 
               'Store'}
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {products.filter((p: any) => tab === 'shop' || tab === 'home' || p.category === tab).map((product: any) => (
                <div key={product.id} className="bg-[#111] border border-[#333] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FFD700] transition relative overflow-hidden">
                  {product.badge && <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">{product.badge}</div>}
                  <div>
                    <div className="text-4xl mb-4">{product.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{product.name}</h3>
                    {product.description && <p className="text-gray-400 text-sm mb-4">{product.description}</p>}
                    {product.data && (
                      <div className="flex gap-2 mb-3">
                        <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.data}</span>
                        <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-lg border border-[#444]">{product.days}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-[#222]">
                    <div className="text-[#10B981] font-black text-2xl mb-4">\${product.price}</div>
                    {hasAccess(product.id) ? (
                      <button onClick={() => {
                        showToast('Access granted! Downloading...');
                        // Handle download/access logic here
                        if (product.category === 'academy') {
                          const m = document.getElementById('videoModal');
                          if(m) m.style.display = 'flex';
                        }
                      }} className="w-full bg-[#222] border border-[#10B981] text-[#10B981] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Download size={18}/> Access & Download
                      </button>
                    ) : (
                      <button onClick={() => setSelectedProduct(product)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Lock size={18}/> Unlock & Buy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
`;

code = code.replace(regex, genericRendering.trim());

fs.writeFileSync('src/App.tsx', code);
