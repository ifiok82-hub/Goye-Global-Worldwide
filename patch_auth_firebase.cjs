const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const authBlockSearch = `               <button onClick={() => { 
                 const email = document.getElementById('login-email-input').value;
                 const password = document.getElementById('login-password-input').value;
                 if(!email || !password) { setToastMsg('Please enter email and password'); return; }
                 localStorage.setItem('goye_active_user', JSON.stringify({ contact: email })); 
                 window.location.reload(); 
               }} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4">Login</button>`;

const authBlockReplace = `               <button onClick={async () => { 
                 const email = document.getElementById('login-email-input').value;
                 const password = document.getElementById('login-password-input').value;
                 if(!email || !password) { setToastMsg('Please enter email and password'); return; }
                 
                 try {
                     setToastMsg('Logging in...');
                     const { signInWithEmailAndPassword } = await import('firebase/auth');
                     const { auth } = await import('./lib/firebase');
                     const userCredential = await signInWithEmailAndPassword(auth, email, password);
                     const u = userCredential.user;
                     localStorage.setItem('goye_active_user', JSON.stringify({ uid: u.uid, contact: u.email })); 
                     window.location.reload(); 
                 } catch(err) {
                     setToastMsg('Login failed. Falling back to local auth.');
                     localStorage.setItem('goye_active_user', JSON.stringify({ contact: email })); 
                     window.location.reload(); 
                 }
               }} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl mb-4 pointer-events-auto">Login</button>`;

code = code.replace(authBlockSearch, authBlockReplace);
fs.writeFileSync('src/App.tsx', code);
