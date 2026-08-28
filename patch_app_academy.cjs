const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import for AcademyDashboard
if (!code.includes('import AcademyDashboard')) {
  code = code.replace(
    "import HeroSection from './components/HeroSection';",
    "import HeroSection from './components/HeroSection';\nimport AcademyDashboard from './components/AcademyDashboard';"
  );
}

// Replace the rendering block
const regex = /<h2 className="text-white text-2xl font-black mb-6 border-b border-\[#333\] pb-2 inline-block mt-8">[\s\S]*?<div className="grid grid-cols-1 gap-6">[\s\S]*?<\/div>\n            <\/div>/;

const newRender = `{tab === 'academy' ? (
              <AcademyDashboard 
                currentUser={currentUser} 
                userProfile={userProfile} 
                onPurchase={(item: any) => { setSelectedProduct(item); setShowCheckout(true); }}
                onToast={showToast}
              />
            ) : (
              <>
                <h2 className="text-white text-2xl font-black mb-6 border-b border-[#333] pb-2 inline-block mt-8">
                  {tab === 'shop' ? 'All Digital Products' : 
                   tab === 'esim' ? 'Global eSIMs' : 
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
                            if (product.category === 'academy') {
                              const m = document.getElementById('videoModal');
                              if(m) m.style.display = 'flex';
                            } else {
                              const a = document.createElement('a');
                              a.href = 'data:text/plain;charset=utf-8,Access%20granted!%20This%20is%20your%20digital%20product%20content.';
                              a.download = \`\${product.name}.txt\`;
                              a.click();
                            }
                          }} className="w-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#10B981]/30">
                            <Download size={18}/> Access Content
                          </button>
                        ) : (
                          <button onClick={() => { setSelectedProduct(product); setShowCheckout(true); }} className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400">
                            <ShoppingCart size={18}/> Buy & Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}`;

if(code.match(regex)) {
  code = code.replace(regex, newRender);
  fs.writeFileSync(file, code);
  console.log("Patched App.tsx with AcademyDashboard");
} else {
  console.log("Could not find render block in App.tsx");
}
