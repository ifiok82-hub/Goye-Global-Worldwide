import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Users, MousePointerClick, DollarSign, Wallet, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReferralDashboardModal({ onClose, onToast }: any) {
  const [userId, setUserId] = useState('');
  const [stats, setStats] = useState({ clicks: 0, signups: 0, usd: 0, ngn: 0, pi: 0 });
  const [loading, setLoading] = useState(true);

  // Withdrawal states
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      
      let user = auth.currentUser;
      if (!user) {
        try {
          const cred = await signInAnonymously(auth);
          user = cred.user;
        } catch (e) {
          if(onToast) onToast('Please log in to use the referral system.');
          onClose();
          return;
        }
      }

      setUserId(user.uid);

      try {
        const refDoc = doc(db, 'referrals', user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setStats({
            clicks: data.clicks || 0,
            signups: data.signups || 0,
            usd: data.usd || 0,
            ngn: data.ngn || 0,
            pi: data.pi || 0
          });
        }
      } catch (e) {
        console.error("Error fetching stats", e);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const referralLink = `https://www.gasv.store?ref=${userId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    if(onToast) onToast('Referral link copied!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Get the best eSIMs and Web3 Academy courses at GOYE Store Global! ${encodeURIComponent(referralLink)}`);
  };

  const handleWithdrawRequest = async () => {
    if (!withdrawDetails.trim()) {
      if(onToast) onToast('Please enter withdrawal destination details.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'payout_requests'), {
        userId,
        method: withdrawMethod,
        details: withdrawDetails,
        usdBalance: stats.usd,
        ngnBalance: stats.ngn,
        piBalance: stats.pi,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      if(onToast) onToast('Withdrawal request submitted successfully!');
      setShowWithdraw(false);
    } catch (e) {
      console.error(e);
      if(onToast) onToast('Error submitting request.');
    }
    setSubmitting(false);
  };

  const canWithdraw = stats.usd >= 10 || stats.ngn >= 16000 || stats.pi >= 1;

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#FFD700] rounded-2xl w-full max-w-md relative overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        
        <div className="bg-[#000] border-b border-[#333] p-4 flex items-center justify-between z-10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">🤝 Referral & Earn</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!showWithdraw ? (
            <>
              <p className="text-gray-400 text-sm mb-6">Earn up to 20% commission on every course and eSIM purchase made through your link.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black border border-[#333] p-4 rounded-xl text-center">
                  <MousePointerClick className="text-[#3b82f6] mx-auto mb-2" size={20} />
                  <div className="text-white text-xl font-bold">{stats.clicks}</div>
                  <div className="text-[10px] text-gray-500 font-bold">TOTAL CLICKS</div>
                </div>
                <div className="bg-black border border-[#333] p-4 rounded-xl text-center">
                  <Users className="text-[#10B981] mx-auto mb-2" size={20} />
                  <div className="text-white text-xl font-bold">{stats.signups}</div>
                  <div className="text-[10px] text-gray-500 font-bold">TOTAL SIGNUPS</div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl mb-6">
                <div className="text-[10px] text-gray-500 font-bold mb-2">LIFETIME COMMISSION EARNED</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[#FFD700] text-2xl font-black">${Number(stats.usd).toFixed(2)}</div>
                    <div className="text-gray-400 text-xs mt-1">NGN {Number(stats.ngn).toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#8b5cf6] font-bold">{Number(stats.pi).toFixed(4)} π</div>
                    <div className="text-gray-600 text-[10px] mt-1">Pending payout</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowWithdraw(true)} 
                  disabled={!canWithdraw}
                  className={`w-full mt-4 py-2 rounded-lg font-bold text-sm ${canWithdraw ? 'bg-[#FFD700] text-black hover:bg-[#e6c200]' : 'bg-[#333] text-gray-500'} transition`}
                >
                  {canWithdraw ? '💸 Request Withdrawal' : 'Balance too low (Min $10)'}
                </button>
              </div>

              <div className="mb-2 text-[10px] text-gray-500 font-bold uppercase">Your Unique Affiliate Link</div>
              <div className="flex items-center gap-2 mb-6">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink} 
                  className="w-full bg-black border border-[#333] p-3 rounded-xl text-[#FFD700] text-sm focus:outline-none"
                />
                <button onClick={copyLink} className="bg-[#222] p-3 rounded-xl text-white hover:bg-[#333] transition">
                  <Copy size={20} />
                </button>
              </div>

              
              <div className="mb-2 mt-6 text-[10px] text-gray-500 font-bold uppercase">Share on Socials</div>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={shareWhatsApp} className="bg-[#25D366] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#1da851] transition" title="WhatsApp">
                  <MessageCircle size={20} />
                </button>
                <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Get the best eSIMs and Web3 Academy courses at GOYE Store Global!')}`)} className="bg-[#0088cc] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#0077b5] transition" title="Telegram">
                  <Share2 size={20} />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Get the best eSIMs and Web3 Academy courses at GOYE Store Global!')}`)} className="bg-[#000000] border border-[#333] text-white p-3 rounded-xl flex items-center justify-center hover:border-gray-500 transition" title="X (Twitter)">
                  <X size={20} />
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`)} className="bg-[#1877F2] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#166fe5] transition" title="Facebook">
                  <Facebook size={20} />
                </button>
              </div>
              
              <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'GOYE Store', text: 'Get courses and eSIMs!', url: referralLink });
                  } else {
                    if(onToast) onToast('Sharing not supported on this device');
                  }
                }} className="w-full mt-4 bg-[#3b82f6] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2563eb] transition">
                  <Share2 size={18} /> More Share Options...
                </button>

            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-white font-bold mb-4">Request Payout</h3>
              <p className="text-gray-400 text-xs mb-4">You have ${Number(stats.usd).toFixed(2)} | NGN {Number(stats.ngn).toFixed(2)} | {Number(stats.pi).toFixed(4)} π available.</p>
              
              <div className="mb-4">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">WITHDRAWAL METHOD</label>
                <select 
                  value={withdrawMethod} 
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full bg-black border border-[#333] p-3 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD700]"
                >
                  <option value="bank">Bank Account (NGN)</option>
                  <option value="crypto">Crypto Wallet (USDC/ERC-20)</option>
                  <option value="pi">Pi Network Wallet</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">DESTINATION DETAILS</label>
                <textarea 
                  value={withdrawDetails} 
                  onChange={(e) => setWithdrawDetails(e.target.value)}
                  placeholder={withdrawMethod === 'bank' ? "Bank Name, Account Number, Account Name" : "Enter your Wallet Address"}
                  className="w-full bg-black border border-[#333] p-3 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD700] min-h-[100px]"
                ></textarea>
              </div>

              <button 
                onClick={handleWithdrawRequest} 
                disabled={submitting}
                className="w-full bg-[#10B981] text-black font-bold py-3 rounded-xl mb-4 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button onClick={() => setShowWithdraw(false)} className="w-full text-gray-400 text-xs underline">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
