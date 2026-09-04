import React, { useState } from 'react';
import { X, Sparkles, Download, ArrowRight, ShieldCheck, CheckCircle2, Zap, Loader2, FileText, Copy, Check, Eye } from 'lucide-react';
import ShareBlueprintSection from './ShareBlueprintSection';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInModalReader, setShowInModalReader] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const triggerInstantDownload = () => {
    try {
      const blob = new Blob([BLUEPRINT_TEXT_CONTENT], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '5-Minute-AI-Prompt-Blueprint-Sirwise.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      if (onToast) onToast('📁 Blueprint downloaded to your device!');
    } catch (e) {
      console.warn('Blob download fallback:', e);
      window.open('https://www.gasv.store/downloads/5-minute-ai-prompt-blueprint.pdf', '_blank');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Delete leak / invalid emails & validate name
    if (!cleanName || cleanName.length < 2) {
      alert('Enter your full name');
      setErrorMessage('Enter your full name');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.') || cleanEmail.includes('ifiok82') || cleanEmail.includes('godswilloyoho') || cleanEmail === 'goyedagos@' || cleanEmail.includes('null') || cleanEmail.includes('ico')) {
      alert('Enter valid complete email e.g. you@gmail.com');
      setErrorMessage('Enter valid complete email e.g. you@gmail.com');
      return;
    }

    if (cleanEmail.includes('goyedagos@') && !cleanEmail.includes('.com')) {
      alert('Enter full email with .com');
      setErrorMessage('Enter full email with .com');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send POST to /api/leads/subscribe
      await fetch('/api/leads/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          source: 'Free 5-Minute AI Prompt Blueprint',
          sourceDomain: window.location.hostname || 'gasv.store'
        })
      });
    } catch (e) {}

    // CAPTURE TO ACADEMY FUNNEL - COURSE REMINDER
    localStorage.setItem('user_email', cleanEmail);
    localStorage.setItem('customer_email', cleanEmail);
    localStorage.setItem('lead_name', cleanName);
    localStorage.setItem('user_name', cleanName);
    localStorage.setItem('lead_captured_date', new Date().toISOString());
    localStorage.setItem('lead_source', 'Free 5-Minute AI Prompt Blueprint');
    localStorage.setItem('sirwise_lead_captured', 'true');

    // Determine location for lead record
    let country = 'Nigeria';
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      country = d.country_name || 'Nigeria';
    } catch (e) {}

    const lead = {
      name: cleanName,
      email: cleanEmail,
      country: country,
      product: 'Free Blueprint - Not Yet Paid',
      status: 'Free Lead - Course Reminder',
      date: new Date().toLocaleDateString('en-GB'),
      date_wat: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
      source: '5-Minute Blueprint',
      academy_reminder: true,
      needs_payment: true
    };

    // Save to leads list for Academy reminder
    let leads = JSON.parse(localStorage.getItem('academy_leads') || '[]');
    if (!Array.isArray(leads)) leads = [];
    leads.unshift(lead);
    localStorage.setItem('academy_leads', JSON.stringify(leads.slice(0, 200)));

    // Save to registered_customers
    let users = JSON.parse(localStorage.getItem('registered_customers') || '[]');
    if (!Array.isArray(users)) users = [];
    users.unshift({ ...lead, customer_name: cleanName, id: 'FREE-' + Date.now() });
    localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 200)));

    // Save to live_traffic_activity
    let traffic = JSON.parse(localStorage.getItem('live_traffic_activity') || '[]');
    if (!Array.isArray(traffic)) traffic = [];
    traffic.unshift({
      id: 'LEAD-' + Date.now(),
      location: country === 'Nigeria' ? '🇳🇬 NG (Lagos)' : '🌍 ' + country,
      page: 'Free Blueprint Download',
      customer_name: cleanName,
      email: cleanEmail,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('live_traffic_activity', JSON.stringify(traffic.slice(0, 200)));

    // Send to goyedagosmess@gmail.com - Official
    try {
      await fetch('https://formsubmit.co/ajax/goyedagosmess@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'New Free Lead - ' + cleanName + ' - ' + cleanEmail + ' - Needs Academy Reminder',
          message: 'New Lead Captured\nName: ' + cleanName + '\nEmail: ' + cleanEmail + '\nCountry: ' + country + '\nSource: 5-Minute AI Prompt Blueprint\nDate: ' + lead.date_wat + '\nAction: Send Academy course reminder to enroll $49.99\nLink: www.gasv.store/academy?lead=' + cleanEmail
        })
      });
    } catch (e) {}

    setIsSubmitting(false);

    // After capture - DO NOT just download and leave - REDIRECT TO ACADEMY WITH UPSELL
    alert('✅ Success ' + cleanName + '! Blueprint sent to ' + cleanEmail + '\n\nOpening your FREE Academy preview + Course Reminder...');

    // Close modal
    onClose();

    // Trigger download
    triggerInstantDownload();

    // Redirect to Academy with course reminder message
    setTimeout(() => {
      window.location.href = '#academy?free_lead=' + encodeURIComponent(cleanEmail) + '&name=' + encodeURIComponent(cleanName) + '&reminder=true';
    }, 1200);
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
            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input 
                  type="text" 
                  id="leadName" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name" 
                  style={{ width: '100%', height: '50px', borderRadius: '12px', padding: '12px', background: '#222', color: 'white', border: '1px solid #333' }} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Your Best Email Address
                </label>
                <input 
                  type="email" 
                  id="leadEmail" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com - YOUR BEST EMAIL ADDRESS" 
                  style={{ width: '100%', height: '50px', borderRadius: '12px', padding: '12px', background: '#222', color: 'white', border: '1px solid #333' }} 
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
                style={{ width: '100%', height: '60px', background: '#FFD700', color: 'black', borderRadius: '16px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', border: 'none', marginTop: '10px' }}
              >
                {isSubmitting ? '⚡ Processing...' : '⚡ Get Free Instant Access + Academy Preview'}
              </button>

              <p style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
                100% Privacy Guaranteed. Zero Spam. Official: goyedagosmess@gmail.com RC BN3583773
              </p>
            </form>
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

            {/* One-Click Social Sharing Section */}
            <div className="mb-4 text-left">
              <ShareBlueprintSection compact onToast={onToast} />
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


