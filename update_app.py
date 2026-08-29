import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# 1. Update top header buttons
old_nav = """            <button onClick={() => { document.getElementById('programs')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Programs</button>
            <button onClick={() => { document.getElementById('our-method')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Our method</button>
            <button onClick={() => { document.getElementById('community')?.scrollIntoView({behavior:'smooth'}) }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Community</button>
            <button onClick={() => { if(!isAuthenticated) setTab('auth'); else { setTab('academy'); setTimeout(()=>document.getElementById('dashboard')?.scrollIntoView({behavior:'smooth'}), 100); } }} className="text-[#FFD700] bg-black font-bold text-[10px] hover:bg-black/80 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Student dashboard <ChevronRight size={10} /></button>
            <button onClick={() => { setTab('academy'); }} className="text-white bg-blue-900 font-bold text-[10px] hover:bg-blue-800 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Start learning <ChevronRight size={10} /></button>"""

new_nav = """            <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("programs-section") || document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Programs</button>
            <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("our-method-section") || document.getElementById("our-method"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Our method</button>
            <button onClick={() => { window.open("https://wa.me/2348033584736?text=Join%20Sirwise%20Community", "_blank"); }} className="text-black font-bold text-[10px] hover:bg-black/10 px-2 py-1 rounded cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Community</button>
            <button onClick={() => { if(!isAuthenticated) setTab("auth"); else { setTab("academy"); setTimeout(()=>document.getElementById("dashboard")?.scrollIntoView({behavior:"smooth"}), 100); } }} className="text-[#FFD700] bg-black font-bold text-[10px] hover:bg-black/80 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Student dashboard <ChevronRight size={10} /></button>
            <button onClick={() => { if(localStorage.getItem("sirwise_paid") !== "true") { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); } else { setTab("academy"); } }} className="text-white bg-blue-900 font-bold text-[10px] hover:bg-blue-800 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer pointer-events-auto touch-manipulation z-[100] relative">Start learning <ChevronRight size={10} /></button>"""

code = code.replace(old_nav, new_nav)

# 2. Update Explore the programs banner
old_explore = """        <button onClick={() => { const el = document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }} className="w-full bg-[#FFD700] text-black text-center text-[10px] font-black py-1 cursor-pointer pointer-events-auto z-[100] relative block">
          EXPLORE THE PROGRAMS →
        </button>"""

new_explore = """        <button onClick={() => { setTab("home"); setTimeout(() => { const el = document.getElementById("programs-section") || document.getElementById("programs"); if(el) el.scrollIntoView({behavior: "smooth"}); }, 100); }} className="w-full bg-[#FFD700] text-black text-center text-[10px] font-black py-1 cursor-pointer pointer-events-auto z-[100] relative block hover:bg-[#ffe033]">
          EXPLORE THE PROGRAMMES →
        </button>"""

code = code.replace(old_explore, new_explore)

# 3. Insert sections right after HeroSection
old_hero_mount = """            {tab === 'home' && <HeroSection onLogoTap={() => {
              const newCount = adminTapCount + 1;
              setAdminTapCount(newCount);
              if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
              setTimeout(() => setAdminTapCount(0), 3000);
            }} />}"""

sections_html = """            {tab === 'home' && (
              <>
                <HeroSection onLogoTap={() => {
                  const newCount = adminTapCount + 1;
                  setAdminTapCount(newCount);
                  if (newCount >= 5) { setShowAdminLogin(true); setAdminTapCount(0); }
                  setTimeout(() => setAdminTapCount(0), 3000);
                }} />

                {/* Programs Section */}
                <div id="programs-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <h2 className="text-[#FFD700] text-xl font-black mb-2 text-center uppercase tracking-wider">Academic Programmes</h2>
                  <p className="text-gray-400 text-xs text-center mb-6">4-Week Masterclasses for Global Pupils Aged 8-18</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🤖</div>
                        <h3 className="text-white font-bold mb-1 text-base">Sirwise AI & Prompt Engineering</h3>
                        <p className="text-gray-400 text-xs mb-4">Master AI prompts, homework assistance, research tools, and smart automation.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🎨</div>
                        <h3 className="text-white font-bold mb-1 text-base">Digital Asset Creation</h3>
                        <p className="text-gray-400 text-xs mb-4">Create digital art, storytelling, ebooks, and interactive multimedia projects.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🔐</div>
                        <h3 className="text-white font-bold mb-1 text-base">Web3 & Cyber Safety</h3>
                        <p className="text-gray-400 text-xs mb-4">Blockchain basics, digital identity security, NFT credentials, and online privacy.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#333] hover:border-[#FFD700] transition flex flex-col justify-between">
                      <div>
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="text-white font-bold mb-1 text-base">Capstone & Certification</h3>
                        <p className="text-gray-400 text-xs mb-4">Build your final project and receive an official blockchain-verified diploma.</p>
                      </div>
                      <button onClick={() => { setSelectedProduct({ id: "academy", name: "Sirwise AI Web3 Academy 4-Week", price: 49.99, category: "academy" }); setShowCheckoutModal(true); }} className="bg-[#FFD700] text-black text-xs font-bold w-full py-2.5 rounded-xl hover:bg-[#ffe033] cursor-pointer pointer-events-auto">Start Learning ($49.99)</button>
                    </div>
                  </div>
                </div>

                {/* Our Method Section */}
                <div id="our-method-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <h2 className="text-[#3b82f6] text-xl font-black mb-2 text-center uppercase tracking-wider">Our Teaching Method</h2>
                  <p className="text-gray-400 text-xs text-center mb-6">How Sirwise AI Guarantees Success for Every Pupil</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🤖</div>
                      <h4 className="text-white font-bold text-sm mb-1">24/7 AI Guidance</h4>
                      <p className="text-gray-400 text-xs">Personalized tutor providing step-by-step interactive lessons and feedback anytime.</p>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🛠️</div>
                      <h4 className="text-white font-bold text-sm mb-1">Hands-On Projects</h4>
                      <p className="text-gray-400 text-xs">Learn by creating real digital art, stories, apps, and Web3 portfolio items.</p>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <div className="text-2xl mb-2">🎓</div>
                      <h4 className="text-white font-bold text-sm mb-1">Verified Diploma</h4>
                      <p className="text-gray-400 text-xs">Tamper-proof certificate with QR verification under RC BN3583773.</p>
                    </div>
                  </div>
                </div>

                {/* Community Section */}
                <div id="community-section" className="mt-8 mb-8 border-t border-[#333] pt-6 scroll-mt-24">
                  <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-6 rounded-2xl border border-[#FFD700] text-center">
                    <h2 className="text-[#FFD700] text-xl font-black mb-2 uppercase">Join Global Pupil Community</h2>
                    <p className="text-gray-300 text-xs mb-4">Connect with pupils and parents across 190+ countries in our safe community group.</p>
                    <a href="https://wa.me/2348033584736?text=Join%20Sirwise%20Community" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-black px-6 py-3 rounded-xl text-xs hover:bg-[#20ba5a] transition">
                      💬 Join WhatsApp Community
                    </a>
                  </div>
                </div>
              </>
            )}"""

code = code.replace(old_hero_mount, sections_html)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("App.tsx successfully updated!")
