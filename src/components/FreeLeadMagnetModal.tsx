import React, { useState } from 'react';
import { X, Sparkles, Download, ArrowRight, ShieldCheck, CheckCircle2, Zap, Loader2, FileText, Copy, Check, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import ShareBlueprintSection from './ShareBlueprintSection';

interface FreeLeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTripwire?: () => void;
  onToast?: (message: string) => void;
}

const BLUEPRINT_TEXT_CONTENT = `================================================================================
          THE 5-MINUTE AI PROMPT BLUEPRINT FOR ENTREPRENEURS (TEASER)
        Save 15+ Hours/Week Automating Marketing, Sales & Operations
                 Powered by Sirwise AI Web3 Academy (RC BN3583878)
                            www.gasv.store
================================================================================

[PAGE 1: COVER]
🎁 FREE BLUEPRINT ACCESS | RC BN3583878
Title: The 5-Minute AI Prompt Blueprint for Entrepreneurs
Publisher: Sirwise AI Web3 Academy
Official Site: https://www.gasv.store | Contact: goyedagosmess@gmail.com

--------------------------------------------------------------------------------
[PAGE 2: WHAT YOU WILL GET IN THE NEXT 5 MINUTES]
--------------------------------------------------------------------------------
1. TEASER PROMPT 1: High-Converting Sales & Copy Generator (1 of 4 core prompts).
2. REAL CASE STUDY: How a student built a ₦450,000/mo agency using AI automation.
3. ACADEMY ROADMAP: What 109+ entrepreneurs unlock in the full 8-Module Masterclass.

--------------------------------------------------------------------------------
[PAGE 3: TEASER PROMPT 1 - COPY & PASTE SALES PROMPT]
--------------------------------------------------------------------------------
Goal: Create a high-converting offer post for Instagram, WhatsApp & Facebook in 30s.

COPY & PASTE THIS PROMPT:
"Act as a direct-response marketing expert trained by Ogilvy. Write 3 short, 
high-converting social media sales posts promoting [INSERT YOUR PRODUCT NAME].
- Target Audience: [INSERT TARGET AUDIENCE, e.g. Small Business Owners / Freelancers]
- Key Transformation: [INSERT MAIN BENEFIT, e.g. Saves 15 hours every week]
- Tone: Energetic, authoritative, persuasive.
- Include 3 bullet point benefits and end with a clear Call to Action (CTA) 
  directing readers to message on WhatsApp or visit [INSERT YOUR WEBSITE]."

--------------------------------------------------------------------------------
[PAGE 4: ⚠️ THIS IS ONLY PROMPT 1 OF 50+ INSIDE ACADEMY]
--------------------------------------------------------------------------------
Here is what you are missing in the Free Version:
🔒 Prompts 2-50: Proposal Generators, Upwork/Fiverr Bidding, TikTok Scripts (LOCKED)
🔒 Module 3: No-Code AI Automation with Zapier & Make.com (LOCKED)
🔒 Module 5: Web3 Wallet Setup + Pi Network + Cyber Safety (LOCKED)
🔒 Module 8: Capstone Project + Blockchain-Verified Certificate + Portfolio (LOCKED)

--------------------------------------------------------------------------------
[PAGE 5: CASE STUDY - FROM FREE BLUEPRINT TO $300/WEEK]
--------------------------------------------------------------------------------
Student Story: Chinedu from Lagos, Nigeria
"I downloaded the Free Blueprint and got my first client inquiry. But when they asked 
for custom AI workflow automation, I was stuck. I enrolled in the Sirwise AI Web3 
Academy $49.99 (₦74,985) full course. Within 14 days of completing Module 3 & 8, 
I secured a $300 Fiverr automation contract!"

--------------------------------------------------------------------------------
[PAGE 6: NEXT STEPS - UPGRADE TO FULL ACADEMY $49.99]
--------------------------------------------------------------------------------
Your Free Blueprint is only 10% of the puzzle. Unlock the remaining 90% today!

🎓 SIRWISE AI WEB3 ACADEMY - 8 FULL GLOBAL MODULES
- Price: $49.99 USD = ₦74,985 Lifetime Access (190+ Countries)
- Special Link: https://www.gasv.store/#academy?from=blueprint
- USDC Base Address: 0xdc7f804B36aB672Ec31642dF418F29e73281b040
- OPay Bank Transfer: Account 6113541882 GOYEDAGOSMESS ENTERPRISE
- Global Cards: Paystack & Flutterwave Supported
- 100% Secure SSL | Official Contact: goyedagosmess@gmail.com | RC BN3583878

--------------------------------------------------------------------------------
[PAGE 7: ACADEMY PAYWALL & VIDEO TOUR LINK]
--------------------------------------------------------------------------------
Scan or click to watch the 2-minute Academy Tour video and unlock all 8 modules:
👉 https://www.gasv.store/#academy

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
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      // Header Banner
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFillColor(212, 175, 55);
      doc.rect(0, 40, 210, 3, 'F');

      doc.setTextColor(255, 215, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('THE 5-MINUTE AI PROMPT BLUEPRINT', 105, 18, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Save 15+ Hours/Week Automating Marketing, Sales & Operations', 105, 26, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(212, 175, 55);
      doc.text('Sirwise AI Web3 Academy | RC BN3583878 | www.gasv.store', 105, 33, { align: 'center' });

      let y = 52;

      // Welcome Banner
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(12, y, 186, 22, 3, 3, 'F');
      doc.setTextColor(34, 34, 34);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('WELCOME TO YOUR OFFICIAL AI BLUEPRINT', 16, y + 7);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const welcomeText = 'This guide contains battle-tested prompt frameworks compatible with ChatGPT, Google Gemini, and Claude. Copy & paste these exact templates to cut daily business tasks down from hours to minutes.';
      const splitWelcome = doc.splitTextToSize(welcomeText, 178);
      doc.text(splitWelcome, 16, y + 13);

      y += 30;

      const addPrompt = (num: number, title: string, goal: string, promptText: string) => {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFillColor(17, 17, 17);
        doc.rect(12, y, 186, 8, 'F');
        doc.setTextColor(255, 215, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`PROMPT ${num}: ${title.toUpperCase()}`, 16, y + 5.5);
        y += 10;

        doc.setTextColor(0, 100, 0);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Goal: ${goal}`, 16, y);
        y += 5;

        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(200, 200, 200);
        const lines = doc.splitTextToSize(promptText, 176);
        const blockHeight = lines.length * 4.5 + 6;
        doc.roundedRect(12, y, 186, blockHeight, 2, 2, 'FD');
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(8.5);
        doc.setFont('courier', 'normal');
        doc.text(lines, 16, y + 5);
        y += blockHeight + 10;
      };

      addPrompt(1, 'High-Converting Social Media Copy', 'Create 5 engaging social media posts in 30 seconds', promptsList[0].prompt);
      addPrompt(2, '60-Second Client Proposal Writer', 'Turn raw requirements into a professional service proposal', promptsList[1].prompt);
      addPrompt(3, 'Automated Customer Support & FAQ Engine', 'Generate clear answers for Email or WhatsApp', promptsList[2].prompt);
      addPrompt(4, 'Viral Headline & Hook Generator', 'Generate magnetic titles for ads, emails & landing pages', promptsList[3].prompt);

      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFillColor(255, 215, 0);
      doc.rect(12, y, 186, 26, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('WHAT IS NEXT? UPGRADE TO FULL ACADEMY ACCESS', 16, y + 7);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Ready to take your business to the next level? Upgrade to the full 8-Module Masterclass for $49.99:', 16, y + 13);
      doc.text('• Learning Academy: https://www.gasv.store/#academy', 16, y + 18);
      doc.text('• Digital Store & Checkout: https://www.gasv.store', 16, y + 22);

      doc.setFillColor(17, 17, 17);
      doc.rect(0, 280, 210, 17, 'F');
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(8);
      doc.text('© Goyedagosmess Enterprise | Sirwise AI Web3 Academy | RC BN3583878 | goyedagosmess@gmail.com', 105, 289, { align: 'center' });

      doc.save('5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf');
      
      if (onToast) onToast('📁 Blueprint PDF downloaded successfully!');
    } catch (e) {
      console.warn('PDF generation fallback:', e);
      window.location.href = '/downloads/5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf';
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

    // 1. Determine location / country for lead record
    let country = 'Nigeria';
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      country = d.country_name || 'Nigeria';
    } catch (e) {}

    const timestampIso = new Date().toISOString();

    // 2. Direct Async Handler to Database API /api/leads
    try {
      if ((window as any).trackLead) {
        (window as any).trackLead({
          name: cleanName,
          email: cleanEmail,
          country: country,
          source: '5-Minute AI Prompt Blueprint',
          action: 'Downloaded Free Blueprint - Needs Academy Reminder',
          link: 'https://www.gasv.store/#academy?lead=' + cleanEmail
        });
      }
      if ((window as any).trackClick) {
        (window as any).trackClick('download_free_blueprint', { email: cleanEmail, name: cleanName });
      }
      if ((window as any).sendAutoReply) {
        (window as any).sendAutoReply(cleanEmail, cleanName);
      }
    } catch (e) {
      console.warn('Direct async lead submission notice:', e);
    }

    // 3. CAPTURE TO LOCALSTORAGE & ACADEMY FUNNEL
    localStorage.setItem('user_email', cleanEmail);
    localStorage.setItem('customer_email', cleanEmail);
    localStorage.setItem('lead_name', cleanName);
    localStorage.setItem('user_name', cleanName);
    localStorage.setItem('lead_captured_date', timestampIso);
    localStorage.setItem('lead_source', 'Free 5-Minute AI Prompt Blueprint');
    localStorage.setItem('sirwise_lead_captured', 'true');

    const lead = {
      name: cleanName,
      email: cleanEmail,
      country: country,
      product: 'Free Blueprint - Not Yet Paid',
      status: 'Free Lead - Course Reminder',
      date: new Date().toLocaleDateString('en-GB'),
      date_wat: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
      source: '5-Minute AI Prompt Blueprint',
      academy_reminder: true,
      needs_payment: true
    };

    // Save to leads list for Academy reminder
    let leads = JSON.parse(localStorage.getItem('academy_leads') || '[]');
    if (!Array.isArray(leads)) leads = [];
    leads.unshift(lead);
    localStorage.setItem('academy_leads', JSON.stringify(leads.slice(0, 200)));

    let capturedLeads = JSON.parse(localStorage.getItem('captured_leads') || '[]');
    if (!Array.isArray(capturedLeads)) capturedLeads = [];
    capturedLeads.unshift(lead);
    localStorage.setItem('captured_leads', JSON.stringify(capturedLeads.slice(0, 200)));

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
      timestamp: timestampIso
    });
    localStorage.setItem('live_traffic_activity', JSON.stringify(traffic.slice(0, 200)));

    // 4. Background Email Backup (FormSubmit AJAX - non-blocking)
    try {
      fetch('https://formsubmit.co/ajax/goyedagosmess@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'New Free Lead - ' + cleanName + ' (' + cleanEmail + ') - 5-Minute AI Prompt Blueprint',
          Name: cleanName,
          Email: cleanEmail,
          Country: country,
          Source: '5-Minute AI Prompt Blueprint',
          Date: lead.date_wat,
          Action: 'Send Academy course reminder to enroll $49.99',
          Link: 'www.gasv.store/academy?lead=' + cleanEmail
        })
      }).catch(() => {});
    } catch (e) {}

    // Trigger live dashboard metric refresh
    if (typeof window !== 'undefined') {
      if (typeof (window as any).refreshConversionRate === 'function') {
        (window as any).refreshConversionRate();
      }
      if (typeof (window as any).checkAcademyLeadsConversion === 'function') {
        (window as any).checkAcademyLeadsConversion();
      }
    }

    setIsSubmitting(false);

    if (onToast) {
      onToast('✅ Success ' + cleanName + '! Blueprint sent to ' + cleanEmail + '. Opening Academy...');
    }

    // Close modal
    onClose();

    // Trigger download
    triggerInstantDownload();

    // Trigger conversion overlay page (Video + Paywall)
    setTimeout(() => {
      if ((window as any).getFreeBlueprintAfterDownload) {
        (window as any).getFreeBlueprintAfterDownload();
      } else if ((window as any).goToAcademyPaywall) {
        (window as any).goToAcademyPaywall();
      }
    }, 400);
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
              <Sparkles size={14} /> TRIPWIRE MICRO-OFFER ($1 / 0.000003 Pi)
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Get the <span className="text-[#FFD700]">AI Starter & Global Travel Pass</span> for $1 / 0.000003 Pi
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-6 font-medium">
              3 High-Impact Copy-Paste Prompts + 1GB Travel eSIM Trial + 1-Day Access to Sirwise AI Academy.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 mb-6 bg-[#161616] p-4 rounded-2xl border border-[#2A2A2A]">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>3 High-Impact Copy-Paste Prompts</strong> for ChatGPT, Claude & Gemini</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>1GB Global Travel eSIM Trial</strong> for 190+ countries instant activation</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span><strong>1-Day Full VIP Access Pass</strong> to Sirwise AI Web3 Academy</span>
              </div>
            </div>

            {/* Direct Micro-Offer Claim Button */}
            <div className="space-y-3 mb-6">
              <button 
                type="button" 
                onClick={() => {
                  if (onClaimTripwire) {
                    onClaimTripwire();
                  } else {
                    onClose();
                  }
                }}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', color: 'black', borderRadius: '16px', fontWeight: 900, fontSize: '16px', cursor: 'pointer', border: 'none' }}
                className="hover:brightness-110 active:scale-95 transition shadow-[0_0_25px_rgba(255,215,0,0.4)] flex items-center justify-center gap-2"
              >
                <span>⚡ Claim Pass Now for $1 / 0.000003 Pi (₦1,500)</span>
                <ArrowRight size={18} />
              </button>
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
                100% Privacy Guaranteed. Zero Spam. Official: goyedagosmess@gmail.com RC BN3583878
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


