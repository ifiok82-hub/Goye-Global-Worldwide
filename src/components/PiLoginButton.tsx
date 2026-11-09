import React, { useState } from 'react';
import { loginWithPi } from '../lib/piAuth';

export default function PiLoginButton() {
  const [user, setUser] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('pi_username') : null
  );

  const handleLogin = async () => {
    const verified = await loginWithPi();
    if (verified?.username) {
      setUser(verified.username);
      alert(`Signed in as @${verified.username}`);
    }
  };

  if (user) {
    return (
      <div className="w-full bg-[#FFD700] text-black text-center py-3 font-black text-sm">
        ✅ Signed in as @{user}
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-sm tracking-widest py-3.5 px-4 rounded-full"
    >
      🔐 Sign in with Pi
    </button>
  );
}
