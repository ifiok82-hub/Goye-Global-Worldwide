import React, { useState } from 'react';
import { X, Sparkles, Download, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface FreeLeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTripwire?: () => void;
  onToast?: (message: string) => void;
}

export default function FreeLeadMagnetModal({ isOpen, onClose, onClaimTripwire, onToast }: FreeLeadMagnetModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return val && val.includes('@') && val.includes('.') && val.trim().length > 4;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const cleanEmail = email.trim();
    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save lead to backend database
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          sourceDomain: window.location.hostname || 'gasv.store'
        })
      });

      const data = await response.json();

      // 2. Persist locally to prevent duplicate nagging
      localStorage.setItem('sirwise_lead_captured', 'true');
      localStorage.setItem('user_email', cleanEmail);
      localStorage.setItem('customer_email', cleanEmail);

      // 3. Trigger instant PDF download
      triggerPdfDownload();

      setIsSuccess(true);
      if (onToast) onToast('🎉 Instant access granted! Download starting...');
    } catch (err: any) {
      console.warn('Lead capture network fallback:', err);
      // Local fallback
      localStorage.setItem('sirwise_lead_captured', 'true');
      localStorage.setItem('user_email', cleanEmail);
      triggerPdfDownload();
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerPdfDownload = () => {
    const downloadUrl = 'https://www.gasv.store/downloads/sirwise_ai_masterclass_v1.pdf';
    
    // Create hidden anchor for instant download trigger
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = '5_Minute_AI_Prompt_Blueprint_Sirwise.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border-2 border-[#FFD700] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,215,0,0.25)] text-white overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#1f1f1f] text-gray-400 hover:text-white rounded-full hover:bg-[#333] transition"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-full text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> Free Instant Access
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Free Download: <span className="text-[#FFD700]">The 5-Minute AI Prompt Blueprint</span> for Entrepreneurs
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-6 font-medium">
              Save 15+ hours a week automating your business, marketing, and sales copy using battle-tested AI prompts.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 mb-6 bg-[#161616] p-4 rounded-2xl border border-[#2A2A2A]">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>10 High-Yield AI Prompts</strong> to automate content & email marketing</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>Copy-Paste Formulas</strong> compatible with ChatGPT, Gemini, & Claude</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>Instant Free PDF Download</strong> — No credit card required</span>
              </div>
            </div>

            {/* Lead Capture Form */}
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Your Best Email Address
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black border border-[#333] p-4 rounded-xl text-white focus:border-[#FFD700] outline-none text-sm font-medium transition"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#ffe033] hover:to-[#ffb733] text-black font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Unlocking Access...</span>
                ) : (
                  <>
                    <Zap size={20} className="fill-black" />
                    <span>Get Free Instant Access</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
              <ShieldCheck size={14} className="text-[#10B981]" />
              <span>100% Privacy Guaranteed. Zero Spam.</span>
            </div>
          </div>
        ) : (
          /* Success Screen & Tripwire Intro */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFD700]">
              <Download size={32} />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">🎉 Access Granted!</h3>
            <p className="text-gray-300 text-sm mb-6">
              Your <strong>5-Minute AI Prompt Blueprint PDF</strong> download has been triggered automatically.
            </p>

            <button
              onClick={triggerPdfDownload}
              className="w-full bg-[#222] hover:bg-[#333] border border-[#FFD700] text-[#FFD700] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm mb-6 transition"
            >
              <Download size={16} />
              <span>Download PDF Again</span>
            </button>

            {/* Tripwire Special Offer */}
            <div className="bg-gradient-to-b from-[#1a180a] to-[#111] border-2 border-[#FFD700] rounded-2xl p-5 text-left mb-6 shadow-inner">
              <div className="inline-block bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                LIMITED-TIME FIRST VISIT OFFER
              </div>
              <h4 className="text-white font-black text-lg mb-1">
                The Ultimate Web3 & AI Starter Toolkit
              </h4>
              <p className="text-gray-300 text-xs mb-3">
                Get 25 High-Yield Prompts, Web3 Wallet Security Cheatsheet + VIP Access Pass for just <span className="text-[#FFD700] font-black text-sm">₦2,500 ($3.00)</span> today!
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onClaimTripwire) onClaimTripwire();
                }}
                className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition"
              >
                <span>Get Starter Toolkit for ₦2,500</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-xs underline"
            >
              Close and browse website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
