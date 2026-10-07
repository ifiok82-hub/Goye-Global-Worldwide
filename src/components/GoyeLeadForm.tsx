import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, User, Mail, Phone, Globe, DollarSign, FileText, MessageSquare } from 'lucide-react';

interface GoyeLeadFormProps {
  initialService?: string;
  onSubmitted?: () => void;
}

export const GoyeLeadForm: React.FC<GoyeLeadFormProps> = ({
  initialService,
  onSubmitted
}) => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [businessType, setBusinessType] = useState('Small Business');
  const [budgetRange, setBudgetRange] = useState('$1,500 - $5,000');
  const [projectDescription, setProjectDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState('WhatsApp');

  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : ['Website']
  );

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceOptions = [
    'Website',
    'Web App',
    'Online Store',
    'AI Assistant',
    'WhatsApp Automation',
    'Business Automation',
    'Digital Marketing',
    'SEO',
    'Branding',
    'Other'
  ];

  const handleCheckboxChange = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your Full Name, Email, and WhatsApp / Phone number.');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service requirement.');
      return;
    }

    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      businessName: businessName.trim() || 'Individual / Business',
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      businessType,
      servicesNeeded: selectedServices,
      budgetRange,
      projectDescription: projectDescription.trim(),
      preferredContact
    };

    try {
      const res = await fetch('/api/goye/client-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        if (typeof window !== 'undefined' && (window as any).trackLead) {
          (window as any).trackLead(payload);
        }
        if (onSubmitted) onSubmitted();
      } else {
        setError(data.message || 'Error submitting request. Please try again.');
      }
    } catch (err: any) {
      setError('Network or server connection error. Please try again or contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-form" className="py-16 bg-slate-900/90 border-y border-cyan-900/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-800">
              <Sparkles size={12} />
              <span>Client Acquisition Portal</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Tell Us What Your Business Needs
            </h2>
            
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Fill in your business details below to receive a custom proposal, technical scope, and project timeline.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                <CheckCircle2 size={36} />
              </div>
              
              <h3 className="text-2xl font-black text-white">Request Received</h3>
              
              <p className="text-sm text-gray-200 max-w-md mx-auto leading-relaxed">
                Thank you. Your request has been received. Our team will review it and contact you.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-gray-200 font-bold text-xs border border-slate-700 hover:bg-slate-800 transition"
                >
                  Submit Another Requirement
                </button>

                <a
                  href={`https://wa.me/2348000000000?text=Hello%20GOYE%20DIGITAL,%20I%20just%20submitted%20a%20request%20for%20${encodeURIComponent(businessName || fullName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-500 transition"
                >
                  <MessageSquare size={14} />
                  <span>Notify via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Grid 1: Name & Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-cyan-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <Building2 size={14} className="text-cyan-400" />
                    <span>Business / Organization Name</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Global Ventures"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Grid 2: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <Mail size={14} className="text-cyan-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@business.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <Phone size={14} className="text-cyan-400" />
                    <span>WhatsApp / Phone *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 800 000 0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Grid 3: Country & Business Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-cyan-400" />
                    <span>Country</span>
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Nigeria, Ghana, United Kingdom, USA"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                    <span>Business Type</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="Small Business">Small Business</option>
                    <option value="Startup / Tech">Startup / Tech</option>
                    <option value="Entrepreneur / Professional">Entrepreneur / Professional</option>
                    <option value="School / Educational Institution">School / Educational Institution</option>
                    <option value="Hotel / Hospitality">Hotel / Hospitality</option>
                    <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                    <option value="Clinic / Healthcare">Clinic / Healthcare</option>
                    <option value="Real Estate Agency">Real Estate Agency</option>
                    <option value="Church / Religious Body">Church / Religious Body</option>
                    <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                    <option value="E-Commerce Merchant">E-Commerce Merchant</option>
                    <option value="International Enterprise">International Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Services Needed Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase mb-3">
                  What do you need? (Select all that apply) *
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {serviceOptions.map((service) => {
                    const isChecked = selectedServices.includes(service);
                    return (
                      <label
                        key={service}
                        className={`cursor-pointer p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                          isChecked
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(service)}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-950"
                        />
                        <span className="truncate">{service}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Grid 4: Budget Range & Preferred Contact Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-cyan-400" />
                    <span>Estimated Budget Range</span>
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="$500 - $1,500">$500 - $1,500 (Basic Setup)</option>
                    <option value="$1,500 - $5,000">$1,500 - $5,000 (Standard Business System)</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000 (Advanced Custom Build & AI)</option>
                    <option value="$15,000+">$15,000+ (Enterprise Platform)</option>
                    <option value="Flexible / Request Quote">Flexible / Request Quote First</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                    <span>Preferred Contact Method</span>
                  </label>
                  <select
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email Proposal</option>
                    <option value="Phone Call">Phone Consultation</option>
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-cyan-400" />
                  <span>Project Description & Specific Requirements</span>
                </label>
                <textarea
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your goals, current challenges, desired features, or key requirements..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit My Request</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
