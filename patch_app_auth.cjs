const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. We remove the hard block on rendering app if not authenticated
// Currently: `(!isAuthenticated || tab === 'auth') ? ( ... AuthScreen ... ) : (tab !== 'downloads' ...`
code = code.replace(
`        {(!isAuthenticated || tab === 'auth') ? (
           <div className="px-4 mt-8 animate-in fade-in duration-500">
             <AuthScreen onAuthenticated={(user, profile) => { setIsAuthenticated(true); setCurrentUser(user); setUserProfile(profile); setTab('home'); }} />
           </div>
        ) : (tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500">
            {tab === 'home' && <HeroSection`,
`        {(tab === 'auth') ? (
           <div className="fixed inset-0" style={{background: 'rgba(0,0,0,0.8)', zIndex: 1000}} onClick={() => setTab('home')}>
             <div style={{
               position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
               width: '90%', maxWidth: '350px', background: '#fff', borderRadius: '16px', padding: '24px', zIndex: 1001
             }} onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-black font-bold text-xl">Login</h2>
                 <button onClick={() => setTab('home')} className="text-black"><X size={24}/></button>
               </div>
               <input id="login-email-input" type="email" placeholder="Email" className="w-full bg-gray-100 border border-gray-300 text-black p-3 rounded-xl mb-4" />
               <input id="login-password-input" type="password" placeholder="Password" className="w-full bg-gray-100 border border-gray-300 text-black p-3 rounded-xl mb-6" />
               <button onClick={() => { 
                 const email = document.getElementById('login-email-input').value;
                 const password = document.getElementById('login-password-input').value;
                 if(!email || !password) { setToastMsg('Please enter email and password'); return; }
                 localStorage.setItem('goye_active_user', JSON.stringify({ contact: email })); 
                 window.location.reload(); 
               }} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4">Login</button>
               <div className="text-center">
                 <button className="text-black font-semibold text-sm">Register an account</button>
               </div>
             </div>
           </div>
        ) : null}
        
        {(tab !== 'downloads' && tab !== 'admin' && tab !== 'support') && (
          <div className="px-4 mt-8 animate-in fade-in duration-500 pb-[100px]">
            {!isAuthenticated && tab === 'home' && (
               <div className="bg-[#111] border-2 border-[#FFD700] p-4 rounded-xl mb-6 text-center">
                 <h3 className="text-[#FFD700] font-bold mb-2">Welcome to GOYE Store</h3>
                 <p className="text-sm text-gray-300 mb-4">Please Register or Login to unlock all features.</p>
                 <button onClick={() => setTab('auth')} className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-bold">Register / Login</button>
               </div>
            )}
            {tab === 'home' && <HeroSection`
);

// 2. We need to add X icon import if it's not imported (it should be, but let's make sure, we can use lucide-react X)
if(!code.includes('import { X,')) {
    code = code.replace('import { Globe,', 'import { X, Globe,');
}

// 3. Update the login buttons in the top right to use the new style
code = code.replace(
`            {!isAuthenticated ? (
              <div className="flex items-center gap-2 mr-2">
                <button onClick={() => setTab('auth')} className="px-3 py-1.5 bg-[#222] text-white text-[10px] font-bold rounded-lg border border-[#333] hover:border-[#FFD700]">🔑 Login</button>
                <button onClick={() => setTab('auth')} className="px-3 py-1.5 bg-[#FFD700] text-black text-[10px] font-bold rounded-lg border border-[#FFD700] hover:bg-yellow-400">📝 Register</button>
              </div>`,
`            {!isAuthenticated ? (
              <div style={{ position: 'absolute', top: '-75px', right: '10px', zIndex: 999 }}>
                <button onClick={() => setTab('auth')} className="px-4 py-2 bg-white text-black text-[12px] font-bold rounded-lg shadow-md hover:bg-gray-200">Login / Register</button>
              </div>`
);

fs.writeFileSync('src/App.tsx', code);
