import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Users, MousePointerClick, DollarSign, Wallet, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export default function ReferralDashboardModal({ onClose, onToast, currentUser, userProfile }: any) {
  const [stats, setStats] = useState({ clicks: 0, signups: 0, usd: 0, ngn: 0, pi: 0 });
  const [loading, setLoading] = useState(true);

  // Withdrawal states
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const referralCode = userProfile?.referralCode || currentUser?.uid?.substring(0,8).toUpperCase() || 'UNKNOWN';
  const referralLink = `https://gasv.store/?ref=\${referralCode}`;

  useEffect(() => {
    // 1. DUAL-STORAGE ARCHITECTURE (LOCALSTORAGE + FIREBASE/CLOUD)
    const localStats = localStorage.getItem(`goye_ref_stats_\${referralCode}`);
    if (localStats) {
      setStats(JSON.parse(localStats));
      setLoading(false);
    }
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'affiliates', referralCode);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        const newStats = {
          clicks: data.clicks || 0,
          signups: data.signups || 0,
          usd: data.usd || 0,
          ngn: data.ngn || 0,
          pi: data.pi || 0
        };
        setStats(newStats);
        localStorage.setItem(`goye_ref_stats_\${referralCode}`, JSON.stringify(newStats));
      } else {
        // Initialize if doesn't exist
        setDoc(docRef, { clicks: 0, signups: 0, usd: 0, ngn: 0, pi: 0, owner: currentUser.uid, createdAt: serverTimestamp() }, { merge: true });
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, referralCode]);

  const handleShare = async (platform: string) => {
    const text = 'Join GOYE Global and access premium digital products & Web3 academy!\n';
    const url = referralLink;
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title: 'GOYE Global', text, url });
        if(onToast) onToast('Thanks for sharing!');
      } catch (err) { console.error('Share failed', err); }
      return;
    }
    
    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + url)}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if (platform === 'telegram') shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    if(onToast) onToast('Referral link copied!');
  };

  const handleWithdrawRequest = async (e: any) => {
    e.preventDefault();
    if (!withdrawDetails) return onToast('Please enter payout details');
    if (stats.usd < 10) return onToast('Minimum payout is $10');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'payout_requests'), {
        userId: currentUser.uid,
        referralCode,
        method: withdrawMethod,
        details: withdrawDetails,
        amountUsd: stats.usd,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      onToast('Withdrawal request submitted!');
      setShowWithdraw(false);
    } catch (e: any) {
      onToast(e.message || 'Failed to submit request');
    }
    setSubmitting(false);
  };
  
  if (!currentUser) {
    // 3. UNBLOCK GUEST ACCESS (Introduce the program)
    return (
      <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#111] rounded-3xl w-full max-w-md border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.2)] p-8 text-center relative overflow-hidden">
           <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-gray-400 hover:text-white transition-colors z-20">
            <X size={20} />
          </button>
          
          <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full mx-auto flex items-center justify-center mb-6">
             <DollarSign size={40} className="text-[#FFD700]" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-4">Earn 20% Global Commission</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join the GOYE Global Affiliate Program. Get your unique Surname Referral Link and earn instant 20% commission on every course, digital product, and eSIM sold through your link.
          </p>
          
          <button onClick={() => window.location.reload()} className="w-full bg-[#FFD700] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform">
            Log In / Sign Up to Start Earning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111] rounded-3xl w-full max-w-md border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.2)] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111]/90 backdrop-blur-xl p-4 border-b border-[#333] flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-black text-[#FFD700] uppercase tracking-wider">Referral Dashboard</h2>
            <p className="text-xs text-gray-400 font-medium">Earn 20% on all sales</p>
          </div>
          <button onClick={onClose} className="bg-black p-2 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="bg-black/50 border border-[#333] p-4 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">Your Surname Link</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-black rounded-xl p-3 text-[#FFD700] font-mono text-xs overflow-x-auto border border-[#222]">
                {referralLink}
              </div>
              <button onClick={copyToClipboard} className="bg-[#FFD700] p-3 rounded-xl text-black hover:bg-yellow-400 transition-colors active:scale-95 shrink-0">
                <Copy size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-2">
              <button onClick={() => handleShare('whatsapp')} className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:text-black transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </button>
              <button onClick={() => handleShare('twitter')} className="bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button onClick={() => handleShare('facebook')} className="bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button onClick={() => handleShare('telegram')} className="bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#0088cc] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-16.49l-1.748 10.941c-.131.579-.481.721-.974.444l-2.695-1.986-1.3 1.25c-.144.144-.265.265-.544.265l.194-2.748 5.003-4.52c.218-.194-.047-.302-.338-.108l-6.183 3.889-2.66-.83c-.579-.181-.591-.579.121-.856l10.395-4.004c.481-.176.907.108.729.863z"/></svg>
              </button>
              <button onClick={() => handleShare('native')} className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black border border-[#222] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <MousePointerClick className="text-blue-400 mb-2" size={24} />
              <div className="text-2xl font-black text-white">{stats.clicks}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total Clicks</div>
            </div>
            <div className="bg-black border border-[#222] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <Users className="text-green-400 mb-2" size={24} />
              <div className="text-2xl font-black text-white">{stats.signups}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sign Ups</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-[#FFD700] font-bold uppercase tracking-wider mb-1">Available Earnings</p>
                <div className="text-4xl font-black text-white">${stats.usd.toFixed(2)}</div>
                <div className="text-sm text-gray-400 mt-1 font-medium space-x-2">
                  <span>₦{stats.ngn.toLocaleString()}</span>
                  <span className="text-[#34d399]">{stats.pi.toFixed(2)} Pi</span>
                </div>
              </div>
              <Wallet className="text-[#FFD700] opacity-50" size={40} />
            </div>

            <button 
              onClick={() => setShowWithdraw(!showWithdraw)}
              className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl mt-2 active:scale-95 transition-transform"
            >
              WITHDRAW FUNDS
            </button>
          </div>

          {showWithdraw && (
            <form onSubmit={handleWithdrawRequest} className="bg-black border border-[#333] p-4 rounded-2xl space-y-4 animate-fade-in">
              <h3 className="text-white font-bold">Request Payout</h3>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setWithdrawMethod('bank')} className={`py-2 rounded-lg text-xs font-bold transition-colors \${withdrawMethod === 'bank' ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-white'}`}>Bank / Momo</button>
                <button type="button" onClick={() => setWithdrawMethod('crypto')} className={`py-2 rounded-lg text-xs font-bold transition-colors \${withdrawMethod === 'crypto' ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-white'}`}>USDC Crypto</button>
                <button type="button" onClick={() => setWithdrawMethod('pi')} className={`py-2 rounded-lg text-xs font-bold transition-colors col-span-2 \${withdrawMethod === 'pi' ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-white'}`}>Pi Network</button>
              </div>
              <input 
                required 
                type="text" 
                placeholder={withdrawMethod === 'crypto' ? 'USDC Wallet Address' : withdrawMethod === 'pi' ? 'Pi Wallet Address' : 'Bank Account / Phone Number'} 
                className="w-full bg-[#111] border border-[#333] p-3 rounded-xl text-white text-sm focus:border-[#FFD700] outline-none"
                value={withdrawDetails}
                onChange={e => setWithdrawDetails(e.target.value)}
              />
              <button type="submit" disabled={submitting} className="w-full bg-white text-black font-bold py-3 rounded-xl">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
