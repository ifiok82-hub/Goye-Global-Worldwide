import React from 'react';
import { ArrowLeft, Shield, FileText, RefreshCw, Mail, MessageSquare, AlertCircle } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
  setTab: (tab: string) => void;
}

export const TermsPage: React.FC<LegalPageProps> = ({ onBack, setTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl transition cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Platform</span>
      </button>

      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="border-b border-zinc-800 pb-6 space-y-2">
          <div className="inline-block bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
            TERMS & CONDITIONS
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-400">
            Effective: 6 Oct 2026 · goyedagosmessenterprise@gmail.com · WhatsApp: +2348033584736
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">1.</span> Services Covered
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              All 13 specializations: WEB3 & Blockchain Training, AI Training & Solutions, Smart Contract Development, Crypto & DeFi Education, Graphic Design soft copy, Digital ID Card Design soft copy, E-Passport & Digital Document Design, Digital Marketing & Online Business, UI/UX Design & Web Dev Training, E-PINs & Recharge digital delivery, Digital Typing & Desktop Publishing, Digital Documentation & Archiving, and Sirwise AI WEB3 Academy Certification Programs. All delivered digitally via Email and WhatsApp.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">2.</span> Delivery Terms
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              24-72 hours for design services. Instant or within 24 hours for course access. Training conducted online via Zoom / Google Meet.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">3.</span> Payments & Billing
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Via OPay secure gateway. Prices in NGN.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">4.</span> Customer Responsibilities
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Customers must provide accurate info and review drafts promptly.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">5.</span> Support & Inquiries
            </h2>
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 text-xs space-y-2 font-mono">
              <p className="text-gray-300">
                Email: <strong className="text-white">goyedagosmessenterprise@gmail.com</strong>
              </p>
              <p className="text-gray-300">
                WhatsApp: <strong className="text-white">+2348033584736</strong>
              </p>
              <p className="text-emerald-400">
                Response SLA: Within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400">
          <button onClick={() => setTab('privacy')} className="hover:text-[#FFD700] transition cursor-pointer">Privacy Policy →</button>
          <span>•</span>
          <button onClick={() => setTab('refund')} className="hover:text-[#FFD700] transition cursor-pointer">Refund Policy →</button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<LegalPageProps> = ({ onBack, setTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl transition cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Platform</span>
      </button>

      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="border-b border-zinc-800 pb-6 space-y-2">
          <div className="inline-block bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
            PRIVACY POLICY
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">
            Effective: 6 Oct 2026 · goyedagosmessenterprise@gmail.com
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">1.</span> Information We Collect
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Name, phone, email, WhatsApp, payment reference, images/text for design, and learning progress.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">2.</span> Use of Information
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              To process orders, deliver digital files, grant course access, issue certificates, and provide support.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">3.</span> Payment Security
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Processed by OPay. We do not store card PIN.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">4.</span> Data Sharing & Confidentiality
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Only OPay for payment processing. We never sell or trade customer data.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">5.</span> Retention
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Order and certificate data retained for verification. Design files 30 days after delivery.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">6.</span> Your Rights
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Request correction/deletion via <strong className="text-white">goyedagosmessenterprise@gmail.com</strong> or WhatsApp <strong className="text-white">+2348033584736</strong>.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400">
          <button onClick={() => setTab('terms')} className="hover:text-[#FFD700] transition cursor-pointer">Terms & Conditions →</button>
          <span>•</span>
          <button onClick={() => setTab('refund')} className="hover:text-[#FFD700] transition cursor-pointer">Refund Policy →</button>
        </div>
      </div>
    </div>
  );
};

export const RefundPage: React.FC<LegalPageProps> = ({ onBack, setTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl transition cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Platform</span>
      </button>

      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="border-b border-zinc-800 pb-6 space-y-2">
          <div className="inline-block bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
            REFUND POLICY
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Refund Policy
          </h1>
          <p className="text-xs text-gray-400">
            Effective: 6 Oct 2026 · goyedagosmessenterprise@gmail.com · WhatsApp: +2348033584736
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">1.</span> Graphic Design & Digital ID
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              No refund after work starts. 2 free revisions included. Free correction if our error.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">2.</span> WEB3 Academy Courses & Digital Products & Certificates
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              No refund after access/login granted or certificate issued. If technical fault from our side, we fix access or offer alternative. Double payment refunded in 72 hours.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">3.</span> E-PINs, Airtime, Data
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              No refund after PIN/code delivered via email/WhatsApp. If code fails, replace within 24 hours after verification.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">4.</span> Refund Payout Method
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Refunds if approved paid to original method via OPay in 5-7 days. Gateway charges non-refundable.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">5.</span> How to Request
            </h2>
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 text-xs space-y-1 text-gray-300 font-mono">
              <p>Email: <strong className="text-white">goyedagosmessenterprise@gmail.com</strong></p>
              <p>WhatsApp: <strong className="text-white">+2348033584736</strong></p>
              <p>Include: Order ID, payment reference, and reason.</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FFD700]">6.</span> Non-Refundable Items
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              All digital services after work started or access granted.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400">
          <button onClick={() => setTab('terms')} className="hover:text-[#FFD700] transition cursor-pointer">Terms & Conditions →</button>
          <span>•</span>
          <button onClick={() => setTab('privacy')} className="hover:text-[#FFD700] transition cursor-pointer">Privacy Policy →</button>
        </div>
      </div>
    </div>
  );
};
