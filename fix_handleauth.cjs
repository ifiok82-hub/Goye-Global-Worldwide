const fs = require('fs');
const file = 'src/components/AuthScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /const handleAuth = async \(e: React\.FormEvent\) => \{[\s\S]*?setLoading\(false\);\n  \};/;

const newHandleAuth = `const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const emailToUse = getEmailToUse();
      
      if (isLogin) {
        const registeredUsersStr = localStorage.getItem('goye_registered_users');
        const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        
        const localUser = registeredUsers.find((u: any) => u.contact === contact || u.contact === emailToUse || u.contact === \`\${countryCode}\${contact}\`);
        
        if (localUser && localUser.password === password) {
           const user = { uid: localUser.uid || 'local_' + emailToUse, email: emailToUse, getIdToken: async () => 'mock_token' };
           
           localStorage.setItem('goye_auth_token', 'mock_token');
           localStorage.setItem('goye_user_profile', JSON.stringify(localUser));
           localStorage.setItem('goye_active_user', JSON.stringify(localUser));
           
           onAuthenticated(user, localUser);
        } else {
           setError(
             <div className="flex flex-col items-center gap-2">
               <span>Account not found. Please click Register to create your account.</span>
               <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold w-full max-w-[200px]">Register Now</button>
             </div>
           );
           setLoading(false);
           return;
        }
      } else {
        if (!firstName || !surname || !username || !contact || !password) {
          throw new Error('All fields are required');
        }
        
        const refCode = generateRefCode(surname, username);
        const contactValue = authMethod === 'email' ? contact : \`\${countryCode}\${contact}\`;
        const uid = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const profileData: any = {
          firstName,
          surname,
          username,
          contact: contactValue,
          authMethod,
          referralCode: refCode,
          inviterCode: inviter,
          createdAt: new Date().toISOString(),
          plan: 'free',
          walletBalance: 0,
          is_verified: false,
          password: password,
          uid: uid
        };

        const registeredUsersStr = localStorage.getItem('goye_registered_users');
        const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        
        // Prevent duplicate registration
        if(registeredUsers.some((u: any) => u.contact === contactValue)) {
            throw new Error('An account with this email/phone already exists. Please login.');
        }
        
        registeredUsers.push(profileData);
        localStorage.setItem('goye_registered_users', JSON.stringify(registeredUsers));

        // Sync to Firestore Users collection
        try { await setDoc(doc(db, 'users', uid), profileData); } catch(e) { console.warn('Firestore sync delayed', e); }

        localStorage.setItem('goye_user_session', JSON.stringify(profileData));
        localStorage.setItem('goye_pending_uid', uid);
        localStorage.setItem('goye_pending_email', emailToUse);
        
        // Generate mock OTP
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('goye_mock_otp', mockOtp);
        
        setNeedsVerification(true);
        setResendCooldown(60);
        
        // Temporarily display OTP to user
        setTimeout(() => {
          alert("Your verification code is: " + mockOtp);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };`;

code = code.replace(regex, newHandleAuth);
fs.writeFileSync(file, code);
console.log("Restored handleAuth");
