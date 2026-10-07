import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, Send, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onToast: (msg: string, type?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      onToast('Please fill out all required fields.', 'error');
      return;
    }

    setSent(true);
    onToast('Message dispatched! We reply within 24 hours.', 'success');
  };

  const directWhatsAppUrl = `https://wa.me/2348033584736?text=${encodeURIComponent(
    `Hello Goyedagosmess Enterprise Support! My name is ${name || 'Inquirer'}. ${message || 'I would like to inquire about your digital services.'}`
  )}`;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          DIRECT CUSTOMER & STUDENT DESK
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Contact Digital Support
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          Need custom graphic design, Web3 smart contract consultations, or course access? Reach our direct digital support channels. Response guaranteed within 24 hours.
        </p>
      </div>

      {/* Direct Contact Cards (NO Physical Address) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Official Email */}
        <div className="bg-[#090e1c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0088FF]/15 border border-[#0088FF]/40 text-[#0088FF] flex items-center justify-center text-xl">
              <Mail size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Official Digital Inbox
              </span>
              <h3 className="text-lg font-black text-white">Email Inquiries</h3>
            </div>
            <p className="text-xs text-gray-300 break-all font-mono">
              goyedagosmessenterprise@gmail.com
            </p>
            <p className="text-[11px] text-gray-500">
              For corporate proposals, course registrations, soft copy design briefs, and accounting verification.
            </p>
          </div>

          <a
            href="mailto:goyedagosmessenterprise@gmail.com"
            className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl border border-zinc-700 transition"
          >
            <Mail size={14} />
            <span>Open Email App</span>
          </a>
        </div>

        {/* Card 2: WhatsApp Live */}
        <div className="bg-[#090e1c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl">
              <MessageSquare size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Instant Chat & Support
              </span>
              <h3 className="text-lg font-black text-white">WhatsApp Live Desk</h3>
            </div>
            <p className="text-xs text-emerald-400 font-bold font-mono">
              +2348033584736
            </p>
            <p className="text-[11px] text-gray-500">
              Instant soft-copy delivery confirmation, OPay payment verification, student onboarding, and live assistance.
            </p>
          </div>

          <a
            href="https://wa.me/2348033584736?text=Hello%20Goye%20Store%20Support!%20I%20need%20assistance%20with%20digital%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            <MessageSquare size={14} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Operational Policy & Response Hours */}
      <div className="bg-[#070b14] border border-zinc-800/80 rounded-2xl p-5 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-[#38bdf8] shrink-0" />
          <div>
            <strong className="text-white block uppercase tracking-wide">Digital Response Hours:</strong>
            <span>Monday – Saturday: 8:00 AM – 8:00 PM WAT · Maximum 24-hour turnaround</span>
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-gray-500">
          gasv.store · Global Support
        </div>
      </div>

      {/* Interactive Form */}
      <div className="bg-[#090e1c] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">
          Send a Digital Message
        </h3>

        {sent ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle size={36} className="text-emerald-400 mx-auto" />
            <h4 className="text-white font-black text-lg">Message Submitted!</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Thank you for contacting Goyedagosmess Enterprise. We have logged your request and will reply via email or WhatsApp within 24 hours.
            </p>
            <div className="pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-black font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl"
              >
                <MessageSquare size={14} />
                <span>Follow up on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mary Okon"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mary@gmail.com"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Custom Digital ID Card Design soft copy request"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Your Message / Project Details *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your request or inquiry here..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0088FF] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0088FF] to-[#FF6B00] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Send size={14} />
              <span>Submit Digital Inquiry</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
