import React, { useState } from 'react';
import { X, CheckCircle, Copy, MessageSquare, ShieldCheck, Clock, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Specialization } from '../data/specializations';

interface ServiceBookingModalProps {
  service: Specialization;
  onClose: () => void;
  onToast: (msg: string, type?: string) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  service,
  onClose,
  onToast
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [copied, setCopied] = useState(false);

  const opayAccount = '6113541882';
  const opayName = 'GOYEDAGOSMESS ENTERPRISE';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Account number copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !whatsapp) {
      onToast('Please fill in your name, email, and WhatsApp number.', 'error');
      return;
    }
    setStep('payment');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentRef.trim()) {
      onToast('Please enter your OPay transaction reference or sender name.', 'error');
      return;
    }

    // Save locally
    const orderData = {
      id: 'GD-' + Math.floor(100000 + Math.random() * 900000),
      serviceId: service.id,
      serviceName: service.title,
      clientName: fullName,
      clientEmail: email,
      clientWhatsapp: whatsapp,
      brief: projectBrief,
      paymentRef: paymentRef,
      amountNGN: service.priceNGN,
      date: new Date().toISOString(),
      status: 'PENDING_VERIFICATION'
    };

    const existing = JSON.parse(localStorage.getItem('goye_service_orders') || '[]');
    existing.unshift(orderData);
    localStorage.setItem('goye_service_orders', JSON.stringify(existing));

    setStep('confirmed');
    onToast('Booking submitted successfully! Proceeding to WhatsApp confirmation.', 'success');
  };

  const getWhatsappLink = () => {
    const text = `Hello Goye Store Support! I booked:
*${service.title}*
Amount: ₦${service.priceNGN.toLocaleString('en-US')}
Client: ${fullName}
Email: ${email}
WhatsApp: ${whatsapp}
OPay Payment Ref: ${paymentRef || 'Pending/Paid'}
Notes: ${projectBrief || 'None'}
Please verify and commence digital service.`;
    return `https://wa.me/2348033584736?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0f1d] border border-[#0088FF]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white relative shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white bg-zinc-900/80 p-2 rounded-full border border-zinc-800 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 mb-6">
          {service.imageUrl && (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
              <img
                src={service.imageUrl}
                alt={service.imageAlt || service.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                {service.badge || 'VERIFIED SPECIALIZATION'}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Specialization #{service.number} · {service.category}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {service.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1 text-[#FFD700]">
              <Clock size={12} /> {service.turnaround}
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">
              ₦{service.priceNGN.toLocaleString('en-US')} NGN (~${service.priceUSD})
            </span>
          </div>
        </div>

        {/* Step 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2 text-gray-300">
              <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[#0088FF]">
                <Sparkles size={13} /> Deliverables & Scope
              </p>
              <ul className="space-y-1 text-gray-400">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#FF6B00] font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-amber-400/90 font-bold pt-1">
                Notice: 100% digital soft copy delivered via Email and WhatsApp within 24-72 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Adekunle"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Email Address (for soft copy) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. samuel@gmail.com"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                WhatsApp Phone Number (with country code) *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+2348012345678"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                Project Brief / Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                placeholder="Describe your design specifics, ID details, or preferred training schedule..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0088FF] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0088FF] to-[#00b4d8] hover:from-blue-600 hover:to-cyan-600 text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <span>Continue to OPay Secure Payment</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            <div className="bg-gradient-to-br from-emerald-950/40 to-black border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                  OPay Direct Merchant Transfer
                </span>
                <span className="text-base font-black text-white">
                  ₦{service.priceNGN.toLocaleString('en-US')}
                </span>
              </div>

              <div className="bg-black/80 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Bank:</span>
                  <strong className="text-white">OPay (PayCom)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#FFD700] text-sm font-mono tracking-wider">{opayAccount}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(opayAccount)}
                      className="text-gray-400 hover:text-white p-1 rounded transition"
                      title="Copy Account Number"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Name:</span>
                  <strong className="text-white text-right">{opayName}</strong>
                </div>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed">
                1. Open your OPay app or bank app and transfer <strong>₦{service.priceNGN.toLocaleString('en-US')}</strong> to the account above.<br />
                2. Copy your OPay Transaction ID or sender name and paste below to submit.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                OPay Transaction Reference / Sender Name *
              </label>
              <input
                type="text"
                required
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="e.g. OPAY-TX-982187 or 'Transferred from Samuel A.'"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-gray-300 text-xs font-bold py-3 rounded-xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Confirm & Submit Order</span>
                <CheckCircle size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed */}
        {step === 'confirmed' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase">
                Booking Recorded Successfully!
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Your order for <strong className="text-white">{service.title}</strong> has been received by Goyedagosmess Enterprise. Turnaround is 24-72 hours.
              </p>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 text-xs text-left space-y-1.5 font-mono text-gray-300">
              <p>Reference: <strong className="text-[#FFD700]">{paymentRef}</strong></p>
              <p>Client: {fullName}</p>
              <p>Email: {email}</p>
              <p>WhatsApp: {whatsapp}</p>
            </div>

            <a
              href={getWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-500 text-black font-black uppercase text-xs tracking-wider py-3.5 rounded-xl transition shadow-lg cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Send Receipt on WhatsApp Now</span>
            </a>

            <button
              onClick={onClose}
              className="block w-full text-xs text-gray-400 hover:text-white pt-2 transition"
            >
              Done / Return to Platform
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
