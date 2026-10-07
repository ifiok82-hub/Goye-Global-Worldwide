import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Calendar, Clock, MessageSquare, Mail, Building2, User, Phone, Globe } from 'lucide-react';

interface GoyeConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePreSelect?: string;
}

export const GoyeConsultationModal: React.FC<GoyeConsultationModalProps> = ({
  isOpen,
  onClose,
  servicePreSelect
}) => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [businessChallenge, setBusinessChallenge] = useState('');
  const [serviceRequired, setServiceRequired] = useState(servicePreSelect || 'Websites & Business Platforms');
  const [preferredTime, setPreferredTime] = useState('As soon as possible');
  const [preferredContact, setPreferredContact] = useState('WhatsApp');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please enter your Full Name, Email, and WhatsApp / Phone number.');
      return;
    }

    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      businessName: businessName.trim() || 'Individual / Business',
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      businessChallenge: businessChallenge.trim(),
      serviceRequired,
      preferredTime,
      preferredContact
    };

    try {
      const res = await fetch('/api/goye/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Error booking consultation. Please try again.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again or reach us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white relative shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6 space-y-1">
          <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
            GOYE DIGITAL • Consultation Booking
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Let's Build Your Digital Business
          </h2>
          <p className="text-xs text-gray-300">
            Book a free 1-on-1 strategy call with our digital solution architects.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 size={36} />
            </div>
            
            <h3 className="text-xl font-black text-white">Consultation Request Received</h3>
            
            <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
              Thank you. Your request has been received. Our team will review it and contact you.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/2348033584736?text=Hello%20GOYE%20DIGITAL,%20I%20just%20booked%20a%20consultation%20for%20${encodeURIComponent(businessName || fullName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 transition"
              >
                <MessageSquare size={16} />
                <span>Message Direct on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-gray-200 font-bold text-xs border border-slate-700 hover:bg-slate-700 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business / Organization"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nigeria, United Kingdom"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Primary Service Required
                </label>
                <select
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Websites & Business Platforms">Websites & Business Platforms</option>
                  <option value="Web Applications & Custom Portals">Web Applications & Custom Portals</option>
                  <option value="AI Customer Support Assistants">AI Customer Support Assistants</option>
                  <option value="WhatsApp Business Automation">WhatsApp Business Automation</option>
                  <option value="Workflow & Business Automation">Workflow & Business Automation</option>
                  <option value="Digital Lead Generation & SEO">Digital Lead Generation & SEO</option>
                  <option value="Branding & Corporate Identity">Branding & Corporate Identity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Preferred Consultation Time
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="As soon as possible">As soon as possible</option>
                  <option value="Morning (9 AM - 12 PM WAT)">Morning (9 AM - 12 PM WAT)</option>
                  <option value="Afternoon (12 PM - 4 PM WAT)">Afternoon (12 PM - 4 PM WAT)</option>
                  <option value="Evening (4 PM - 7 PM WAT)">Evening (4 PM - 7 PM WAT)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Preferred Channel
                </label>
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="WhatsApp">WhatsApp Chat / Voice</option>
                  <option value="Email">Email Proposal</option>
                  <option value="Google Meet">Google Meet Video Call</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Main Business Challenge
              </label>
              <textarea
                rows={3}
                value={businessChallenge}
                onChange={(e) => setBusinessChallenge(e.target.value)}
                placeholder="Briefly describe what challenge you want to solve..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {loading ? (
                  <span>Booking Consultation...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Request Free Consultation</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-4">
              <a
                href="https://wa.me/2348000000000?text=Hello%20GOYE%20DIGITAL,%20I%20would%20like%20to%20book%20a%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <MessageSquare size={12} />
                <span>WhatsApp Direct</span>
              </a>
              <span>•</span>
              <a href="mailto:goye@gasv.store" className="text-cyan-400 hover:underline flex items-center gap-1 font-bold">
                <Mail size={12} />
                <span>goye@gasv.store</span>
              </a>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
