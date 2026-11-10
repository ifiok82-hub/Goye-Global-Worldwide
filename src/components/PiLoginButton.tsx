import React, { useState } from 'react';
import { loginWithPi, logoutPi } from '../lib/piAuth';

export default function PiLoginButton() {
  const [user, setUser] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('pi_username_trusted') : null
  );

  const handleLogin = async () => {
    const verified = await loginWithPi();
    if (verified?.username) {
      setUser(verified.username);
    } else {
      alert('Pi sign-in failed. Please try again in Pi Browser.');
    }
  };

  const handleLogout = () => {
    logoutPi();
    setUser(null);
  };

  if (user) {
    return (
      <div className="w-full bg-[#FFD700] text-black text-center py-3 font-black text-sm flex items-center justify-center gap-2">
        ✅ Signed in as @{user}
        <button onClick={handleLogout} className="ml-2 underline text-xs cursor-pointer">Logout</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-sm tracking-widest py-3.5 px-4 rounded-full cursor-pointer transition active:scale-[0.99]"
    >
      🔐 Sign in with Pi
    </button>
  );
}
