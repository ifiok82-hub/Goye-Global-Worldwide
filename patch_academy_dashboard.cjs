const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

const regexEarlyReturn = /if \(!isEnrolled\) \{[\s\S]*?\}\n/g;
code = code.replace(regexEarlyReturn, '');

const regexIsEnrolledCheck = /if \(localStorage.getItem\('sirwise_paid'\) === 'true' \|\| userProfile\?.is_academy_enrolled\) \{/;
const repIsEnrolledCheck = `if (localStorage.getItem('sirwise_paid') === 'true' && localStorage.getItem('payment_verified') === 'true') {`;
code = code.replace(regexIsEnrolledCheck, repIsEnrolledCheck);

const regexHandleEnrollSuccess = /localStorage.setItem\('sirwise_paid', 'true'\);/;
const repHandleEnrollSuccess = `localStorage.setItem('sirwise_paid', 'true');
    localStorage.setItem('payment_verified', 'true');`;
code = code.replace(regexHandleEnrollSuccess, repHandleEnrollSuccess);

const regexModuleRender = /\{MODULES\.map\(\(mod\) => \{[\s\S]*?<\/div>\n            \);\n          \}\)\}/;
const repModuleRender = `{MODULES.map((mod) => {
            const isCompleted = isEnrolled && progress.includes(mod.id);
            return (
              <div key={mod.id} className="bg-[#111] rounded-[16px] p-[20px] transition-all" style={{ border: isEnrolled ? "2px solid #FFD700" : "2px solid #333" }}>
                <div className="flex justify-between items-start mb-4">
                  <div className={\`text-xs font-bold px-2 py-1 rounded-lg \${!isEnrolled ? 'bg-[#222] text-gray-500' : isCompleted ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#222] text-gray-400'}\`}>
                    MODULE {mod.id}
                  </div>
                  <button onClick={() => isEnrolled && toggleModule(mod.id)} className="transition transform active:scale-90">
                    {!isEnrolled ? <Lock className="text-gray-500" size={24} /> : isCompleted ? <CheckCircle className="text-[#10B981]" size={24} /> : <Circle className="text-gray-500" size={24} />}
                  </button>
                </div>
                <h4 className="font-bold text-lg mb-2 leading-tight text-white">{mod.title} {!isEnrolled && <span className="text-red-500 text-sm ml-2">🔒 Locked</span>}</h4>
                <p className="text-gray-500 text-sm mb-6">{mod.desc}</p>
                
                <button onClick={() => { if(!isEnrolled) setShowPaymentModal(true); else if(!isCompleted) toggleModule(mod.id); }} className={\`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer pointer-events-auto z-10 \${!isEnrolled ? 'bg-[#FFD700] text-black hover:bg-yellow-400' : isCompleted ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/20'}\`}>
                  {!isEnrolled ? (\`Unlock Now \${displaySymbol}\${localPrice}\`) : isCompleted ? 'COMPLETED' : <><Play size={16} fill="currentColor" /> Start Learning</>}
                </button>
              </div>
            );
          })}`;
code = code.replace(regexModuleRender, repModuleRender);

const regexCertGen = /<CertificateGenerator isCompleted=\{isCompleted\} userProfile=\{userProfile\} \/>/;
const repCertGen = `<CertificateGenerator isCompleted={isCompleted} isEnrolled={isEnrolled} userProfile={userProfile} priceUSD={priceUSD} displaySymbol={displaySymbol} localPrice={localPrice} onUnlock={() => setShowPaymentModal(true)} />`;
code = code.replace(regexCertGen, repCertGen);

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
