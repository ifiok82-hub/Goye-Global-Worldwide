import React, { useState } from 'react';
import { Specialization } from '../data/specializations';
import { X, Clock, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { startPiPayment } from '../lib/piPayment';
import ProductGradientImage from './ProductGradientImage';

interface ServiceBookingModalProps {
  service: Specialization;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  service,
  onClose,
  onToast
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalPiPrice = service.piPrice || 2;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !whatsapp.trim()) {
      onToast('Please fill all required contact fields.', 'error');
      return;
    }
    setStep('payment');
  };

  const handlePiPay = async () => {
    setIsProcessing(true);
    const ok = await startPiPayment(
      {
        id: service.id,
        title: `Booking: ${service.title}`,
        piPrice: finalPiPrice
      },
      (txid?: string) => {
        saveBooking(txid || 'PI-' + Date.now());
      },
      {
        onCancel: () => setIsProcessing(false),
        onError: () => setIsProcessing(false)
      }
    );
    if (!ok) {
      setIsProcessing(false);
    }
  };

  const saveBooking = (ref: string) => {
    setPaymentRef(ref);
    const orderData = {
      id: 'GD-' + Math.floor(100000 + Math.random() * 900000),
      serviceId: service.id,
      serviceName: service.title,
      clientName: fullName,
      clientEmail: email,
      clientWhatsapp: whatsapp,
      brief: projectBrief,
      paymentRef: ref,
      amountPi: finalPiPrice,
      date: new Date().toISOString(),
      status: 'VERIFIED_PAID'
    };

    const existing = JSON.parse(localStorage.getItem('goye_service_orders') || '[]');
    existing.unshift(orderData);
    localStorage.setItem('goye_service_orders', JSON.stringify(existing));
    localStorage.setItem(`paid_${service.id}`, 'true');

    setIsProcessing(false);
    setStep('confirmed');
    onToast('Pi Payment verified! Booking confirmed.', 'success');
  };

  const getWhatsappLink = () => {
    const text = `Hello Goye Store Support! I booked:
*${service.title}*
Amount: ${finalPiPrice} Pi
Client: ${fullName}
Email: ${email}
WhatsApp: ${whatsapp}
Pi TX / Ref: ${paymentRef || 'Verified Pi Payment'}
Notes: ${projectBrief || 'None'}
Please commence digital specialization.`;
    return `https://wa.me/2348033584736?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0f1d] border border-[#FFD700]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white relative shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white bg-zinc-900/80 p-2 rounded-full border border-zinc-800 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 mb-6">
          <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
            <ProductGradientImage
              src={service.image}
              alt={service.imageAlt || service.title}
              category={service.category}
              title={service.title}
              height="144px"
            />
            <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded">
              🔒 LOCKED ACCESS
            </div>
          </div>
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
            <span className="text-[#FFD700] font-black">
              {finalPiPrice} Pi
            </span>
          </div>
        </div>

        {/* Step 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2 text-gray-300">
              <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[#FFD700]">
                <Sparkles size={13} /> Deliverables & Scope
              </p>
              <ul className="space-y-1 text-gray-400">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FFD700] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Adekunle"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
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
                placeholder="Describe your design specifics, requirements, or preferred schedule..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-wider py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
            >
              <span>Continue to Pi Payment ({finalPiPrice} Pi)</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="space-y-5">
            <div className="bg-black border-2 border-[#FFD700] rounded-2xl p-5 space-y-3 text-center">
              <span className="text-[11px] font-black uppercase text-[#FFD700] tracking-wider block">
                Pi Network Direct Checkout
              </span>
              <p className="text-3xl font-black text-[#FFD700]">
                {finalPiPrice} Pi
              </p>
              <p className="text-xs text-gray-300">
                Service: <strong>{service.title}</strong>
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 9999, cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('LOCK CLICKED', service.id);
                alert('LOCK clicked - starting Pi payment');
                handlePiPay();
              }}
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black uppercase text-sm tracking-wider py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>{isProcessing ? 'Processing in Pi Wallet...' : `🔒 LOCK - ${finalPiPrice} Pi`}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 text-xs font-bold py-3 rounded-xl transition"
            >
              Back to Details
            </button>
          </div>
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
              <p>Price: {finalPiPrice} Pi</p>
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
