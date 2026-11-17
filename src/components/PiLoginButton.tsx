import React, { useState, useEffect } from 'react';
import { loginWithPi, logoutPi, isPiEnvironment } from '../lib/piAuth';

export default function PiLoginButton() {
  const [user, setUser] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('pi_username_trusted') : null
  );

  useEffect(() => {
    const syncAuth = () => {
      setUser(localStorage.getItem('pi_username_trusted'));
    };
    window.addEventListener('piAuthChanged', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('piAuthChanged', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogin = async () => {
    if (!isPiEnvironment()) {
      alert('Please open goyestoreuwg6251.pinet.com inside Pi Browser > Pi Apps > GOYE Store');
      return;
    }
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
        <span>✅ Signed in as @{user}</span>
        <button type="button" onClick={handleLogout} className="ml-2 underline text-xs cursor-pointer">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-sm tracking-widest py-3.5 px-4 rounded-full cursor-pointer transition active:scale-[0.99]"
    >
      🔐 Sign in with Pi
    </button>
  );
}
