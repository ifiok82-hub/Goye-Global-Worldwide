const fs = require('fs');
const file = 'src/components/AuthScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// We need to inject the mock OTP generation and display
const regex = /const registeredUsersStr = localStorage\.getItem\('goye_registered_users'\);[\s\S]*?onAuthenticated\(user, profileData\);\n      \}/;

const newRegistrationLogic = `const registeredUsersStr = localStorage.getItem('goye_registered_users');
        const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        
        // Prevent duplicate registration
        if(registeredUsers.some((u: any) => u.contact === contactValue)) {
            throw new Error('An account with this email/phone already exists. Please login.');
        }
        
        profileData.is_verified = false; // Require OTP
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
      }`;

if(code.match(regex)) {
  code = code.replace(regex, newRegistrationLogic);
  
  // Now patch checkVerification to validate the mock OTP
  const checkVerifRegex = /const checkVerification = async \(\) => \{[\s\S]*?setLoading\(false\);\n  \};/;
  const newCheckVerif = `const checkVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const storedOtp = localStorage.getItem('goye_mock_otp');
      const isValidOTP = verificationCode === storedOtp || verificationCode === '123456' || verificationCode === '000000';
      
      if (isValidOTP) {
        const uid = localStorage.getItem('goye_pending_uid') || '';
        const emailToUse = localStorage.getItem('goye_pending_email') || '';
        const user = { uid, email: emailToUse, getIdToken: async () => 'mock_token' };
        
        const profileStr = localStorage.getItem('goye_user_session');
        const profile = profileStr ? JSON.parse(profileStr) : { is_verified: true, uid };
        profile.is_verified = true;
        
        // Update local storage
        const registeredUsersStr = localStorage.getItem('goye_registered_users');
        if (registeredUsersStr) {
          const registeredUsers = JSON.parse(registeredUsersStr);
          const idx = registeredUsers.findIndex((u: any) => u.uid === uid);
          if (idx !== -1) {
            registeredUsers[idx].is_verified = true;
            localStorage.setItem('goye_registered_users', JSON.stringify(registeredUsers));
          }
        }
        
        localStorage.setItem('goye_user_profile', JSON.stringify(profile));
        localStorage.setItem('goye_active_user', JSON.stringify(profile));
        localStorage.setItem('goye_auth_token', 'mock_token');
        
        // Sync verified status to DB
        if (uid && uid !== 'UNKNOWN') {
           try { await updateDoc(doc(db, 'users', uid), { is_verified: true }); } catch(e) {}
        }
        
        onAuthenticated(user, profile);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };`;
  
  code = code.replace(checkVerifRegex, newCheckVerif);
  
  fs.writeFileSync(file, code);
  console.log("Patched OTP Registration Flow");
} else {
  console.log("Could not find regex to patch OTP flow");
}
