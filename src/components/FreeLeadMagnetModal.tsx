import React, { useState } from 'react';
import { X, Sparkles, Download, ArrowRight, ShieldCheck, CheckCircle2, Zap, Loader2, FileText, Copy, Check, Eye } from 'lucide-react';

interface FreeLeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTripwire?: () => void;
  onToast?: (message: string) => void;
}

const BLUEPRINT_TEXT_CONTENT = `================================================================================
          THE 5-MINUTE AI PROMPT BLUEPRINT FOR ENTREPRENEURS
        Save 15+ Hours/Week Automating Marketing, Sales & Operations
                 Powered by Sirwise AI Web3 Academy
================================================================================

WELCOME!
Thank you for downloading the official AI Prompt Blueprint. This short guide 
contains battle-tested prompt frameworks compatible with ChatGPT, Google Gemini, 
and Claude. Use these exact copy-paste templates to cut your daily business 
tasks down from hours to minutes.

--------------------------------------------------------------------------------
PROMPT 1: THE HIGH-CONVERTING SOCIAL MEDIA COPY GENERATOR
--------------------------------------------------------------------------------
Goal: Create 5 engaging social media posts for your business in 30 seconds.

COPY & PASTE THIS PROMPT:
"Act as a direct-response marketing expert. Write 5 short, high-converting 
social media posts promoting [INSERT YOUR PRODUCT/SERVICE NAME]. 
- Target Audience: [INSERT TARGET AUDIENCE, e.g., Small Business Owners / Creators]
- Main Benefit: [INSERT MAIN BENEFIT, e.g., Saves 5 hours a week]
- Tone: Professional, energetic, and persuasive.
- Structure: Start each post with a strong hook, followed by 3 key bullet points 
  showing the value, and end with a clear Call to Action (CTA) directing readers 
  to visit [INSERT YOUR WEBSITE URL]."

--------------------------------------------------------------------------------
PROMPT 2: THE 60-SECOND CLIENT PROPOSAL WRITER
--------------------------------------------------------------------------------
Goal: Turn raw client requirements into a professional service proposal instantly.

COPY & PASTE THIS PROMPT:
"Act as a senior business consultant. Generate a structured, professional project 
proposal based on these details:
- Client Problem: [INSERT CLIENT PROBLEM]
- Offered Solution: [INSERT YOUR SOLUTION]
- Key Deliverables: [LIST 2-3 DELIVERABLES]
- Timeline: [INSERT TIMELINE, e.g., 7 Days]
Structure the output into 4 clear sections: Executive Summary, Project Scope, 
Timeline & Milestones, and Next Steps. Keep the language concise and compelling."

--------------------------------------------------------------------------------
PROMPT 3: THE AUTOMATED CUSTOMER SUPPORT & FAQ ENGINE
--------------------------------------------------------------------------------
Goal: Generate clear answers for customer questions to use in emails or WhatsApp.

COPY & PASTE THIS PROMPT:
"Act as a helpful customer support representative for [INSERT YOUR COMPANY NAME]. 
Write a polite, reassuring response to a customer asking: '[INSERT CUSTOMER QUESTION]'.
- Ensure the answer addresses their main concern clearly.
- Provide reassurance about security and instant delivery.
- Keep the response under 100 words and end with an offer to help further."

--------------------------------------------------------------------------------
PROMPT 4: THE VIRAL HEADLINE & HOOK GENERATOR
--------------------------------------------------------------------------------
Goal: Generate attention-grabbing titles for emails, ads, or landing pages.

COPY & PASTE THIS PROMPT:
"Generate 10 magnetic headlines for a page selling [INSERT PRODUCT NAME]. 
Use proven psychological triggers (curiosity, urgency, speed, and simplicity). 
Avoid spammy words. Focus on the transformation the customer gets after using the product."

--------------------------------------------------------------------------------
WHAT IS NEXT?
--------------------------------------------------------------------------------
Ready to take your business to the next level? 

Upgrade to our "Ultimate Web3 & AI Starter Toolkit" for just ₦2,500 ($3.00) 
or explore our full online masterclasses at:
- Learning Academy: https://sirwise.online
- Digital Store & Checkout: https://gasv.store

© Goyedagosmess Enterprise | Sirwise AI Web3 Academy
================================================================================`;

export default function FreeLeadMagnetModal({ isOpen, onClose, onClaimTripwire, onToast }: FreeLeadMagnetModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInModalReader, setShowInModalReader] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const triggerInstantDownload = () => {
    try {
      // 1. Client-side Blob download (100% reliable, zero server dependency, never 404s)
      const blob = new Blob([BLUEPRINT_TEXT_CONTENT], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '5-Minute-AI-Prompt-Blueprint.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      if (onToast) onToast('📁 Blueprint downloaded to your device!');
    } catch (e) {
      console.warn('Blob download fallback:', e);
      // Fallback relative route
      window.open('/api/downloads/blueprint', '_blank');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const cleanEmail = email.trim();
    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address e.g. name@example.com');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send POST to /api/leads/subscribe
      await fetch('/api/leads/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          source: 'lead_magnet',
          sourceDomain: window.location.hostname || 'gasv.store'
        })
      });

      // 2. Persist locally
      localStorage.setItem('sirwise_lead_captured', 'true');
      localStorage.setItem('user_email', cleanEmail);
      localStorage.setItem('customer_email', cleanEmail);

      // 3. Trigger instant download & show success UI
      triggerInstantDownload();
      setIsSuccess(true);
      if (onToast) onToast('🎉 Success! Your free blueprint is ready.');
    } catch (err: any) {
      console.warn('Lead subscription network fallback:', err);
      localStorage.setItem('sirwise_lead_captured', 'true');
      localStorage.setItem('user_email', cleanEmail);
      triggerInstantDownload();
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPromptToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    if (onToast) onToast('Copied prompt to clipboard!');
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const promptsList = [
    {
      title: "PROMPT 1: High-Converting Social Media Copy",
      goal: "Create 5 engaging social media posts in 30 seconds",
      prompt: `Act as a direct-response marketing expert. Write 5 short, high-converting social media posts promoting [INSERT YOUR PRODUCT/SERVICE NAME]. 
- Target Audience: [INSERT TARGET AUDIENCE, e.g., Small Business Owners]
- Main Benefit: [INSERT MAIN BENEFIT, e.g., Saves 5 hours a week]
- Tone: Professional, energetic, and persuasive.
- Structure: Start each post with a strong hook, followed by 3 key bullet points showing the value, and end with a clear Call to Action (CTA) directing readers to visit [INSERT YOUR WEBSITE URL].`
    },
    {
      title: "PROMPT 2: 60-Second Client Proposal Writer",
      goal: "Turn raw client requirements into a professional proposal",
      prompt: `Act as a senior business consultant. Generate a structured, professional project proposal based on these details:
- Client Problem: [INSERT CLIENT PROBLEM]
- Offered Solution: [INSERT YOUR SOLUTION]
- Key Deliverables: [LIST 2-3 DELIVERABLES]
- Timeline: [INSERT TIMELINE, e.g., 7 Days]
Structure the output into 4 clear sections: Executive Summary, Project Scope, Timeline & Milestones, and Next Steps. Keep the language concise and compelling.`
    },
    {
      title: "PROMPT 3: Automated Customer Support & FAQ Engine",
      goal: "Generate clear customer responses for Email / WhatsApp",
      prompt: `Act as a helpful customer support representative for [INSERT YOUR COMPANY NAME]. Write a polite, reassuring response to a customer asking: '[INSERT CUSTOMER QUESTION]'.
- Ensure the answer addresses their main concern clearly.
- Provide reassurance about security and instant delivery.
- Keep the response under 100 words and end with an offer to help further.`
    },
    {
      title: "PROMPT 4: Viral Headline & Hook Generator",
      goal: "Generate magnetic titles for ads, emails & landing pages",
      prompt: `Generate 10 magnetic headlines for a page selling [INSERT PRODUCT NAME]. Use proven psychological triggers (curiosity, urgency, speed, and simplicity). Avoid spammy words. Focus on the transformation the customer gets after using the product.`
    }
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border-2 border-[#FFD700] rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(255,215,0,0.25)] text-white overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#1f1f1f] text-gray-400 hover:text-white rounded-full hover:bg-[#333] transition z-10"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div className="overflow-y-auto pr-1">
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
                <span><strong>4 Battle-Tested AI Prompts</strong> to automate content, proposals & sales</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>Copy-Paste Formulas</strong> compatible with ChatGPT, Gemini, & Claude</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>Instant Free Download</strong> — No credit card required</span>
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
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#ffe033] hover:to-[#ffb733] text-black font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-black" />
                    <span>Unlocking your free guide...</span>
                  </>
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
          /* Success Screen Modal & Interactive Blueprint Reader */
          <div className="overflow-y-auto pr-1 text-center py-2 animate-fade-in">
            <div className="w-14 h-14 bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-3 text-[#FFD700]">
              <Download size={28} />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">🎉 Success! Your free blueprint is ready.</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-4">
              Your download for <strong>5-Minute-AI-Prompt-Blueprint.txt</strong> has been saved to your device.
            </p>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={triggerInstantDownload}
                className="bg-[#FFD700] hover:bg-yellow-400 text-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition cursor-pointer"
              >
                <Download size={18} />
                <span>Download File Again</span>
              </button>

              <button
                onClick={() => setShowInModalReader(!showInModalReader)}
                className="bg-[#222] hover:bg-[#333] border border-[#FFD700]/60 text-[#FFD700] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition cursor-pointer"
              >
                {showInModalReader ? <FileText size={18} /> : <Eye size={18} />}
                <span>{showInModalReader ? 'Hide Reader' : 'Read Blueprint Here'}</span>
              </button>
            </div>

            {/* Embedded Prompts Reader inside Modal */}
            {showInModalReader && (
              <div className="text-left bg-[#121212] border border-[#333] rounded-2xl p-4 mb-6 space-y-4 max-h-80 overflow-y-auto">
                <div className="border-b border-[#222] pb-2 flex items-center justify-between">
                  <span className="text-[#FFD700] font-bold text-xs uppercase tracking-wider">Blueprint Prompts</span>
                  <span className="text-gray-500 text-[10px]">Tap to Copy</span>
                </div>

                {promptsList.map((p, idx) => (
                  <div key={idx} className="bg-black/60 border border-[#262626] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs">{p.title}</span>
                      <button
                        onClick={() => copyPromptToClipboard(p.prompt, idx)}
                        className="p-1.5 bg-[#222] hover:bg-[#333] text-[#FFD700] rounded-lg text-[10px] flex items-center gap-1 transition shrink-0"
                      >
                        {copiedPromptIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedPromptIndex === idx ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-green-400 font-medium">{p.goal}</p>
                    <pre className="text-[11px] text-gray-300 font-mono bg-[#080808] p-2.5 rounded-lg whitespace-pre-wrap border border-[#1e1e1e]">
                      {p.prompt}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Tripwire Special Offer */}
            <div className="bg-gradient-to-b from-[#1a180a] to-[#111] border-2 border-[#FFD700] rounded-2xl p-4 text-left mb-5 shadow-inner">
              <div className="inline-block bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                LIMITED-TIME FIRST VISIT OFFER
              </div>
              <h4 className="text-white font-black text-base sm:text-lg mb-1">
                The Ultimate Web3 & AI Starter Toolkit
              </h4>
              <p className="text-gray-300 text-xs mb-3">
                Get 25 High-Yield Prompts, Web3 Wallet Security Cheatsheet + VIP Access Pass for just <span className="text-[#FFD700] font-black">₦2,500 ($3.00)</span> today!
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onClaimTripwire) onClaimTripwire();
                }}
                className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition cursor-pointer"
              >
                <span>Get Starter Toolkit for ₦2,500</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-xs underline cursor-pointer"
            >
              Close and browse store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


