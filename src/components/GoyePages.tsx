import React from 'react';
import { Shield, Target, Cpu, CheckCircle, ArrowRight, MessageCircle, HelpCircle, FileText, Lock } from 'lucide-react';
import { FAQS as GOYE_FAQ } from '../data/goyeServices';

interface PageProps {
  onOpenConsultation: () => void;
  setTab: (tab: string) => void;
}

export const GoyeAboutPage: React.FC<PageProps> = ({ onOpenConsultation, setTab }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800 tracking-wider">
          About GOYE DIGITAL
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          AI-Powered Digital Solutions for Growing Businesses
        </h1>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          GOYE DIGITAL is a technology-driven client solutions provider helping entrepreneurs, organizations, and enterprises build modern web platforms, automate operations with artificial intelligence, and scale online presence.
        </p>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center font-bold">
            <Target size={20} />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Build</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            High-performance web applications, business portals, and e-commerce platforms crafted for conversion and mobile excellence.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">
            <Cpu size={20} />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Automate</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Custom AI assistants, WhatsApp automation, and automated workflow triggers that cut response times and reduce manual repetitive tasks.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Grow</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Targeted digital marketing systems, SEO optimization, and branding strategies designed to attract qualified business clients.
          </p>
        </div>
      </div>

      {/* Verified Principles / Transparency */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Our Operational Standards
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <CheckCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Real Tailored Engineering</strong>
              Every website, AI system, or workflow automation is custom-configured to solve your specific operational bottlenecks.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <CheckCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Transparent Scope & Quotations</strong>
              Clear project milestones, straightforward timelines, and dedicated consultation before contract sign-off.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <CheckCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Global Client Capability</strong>
              Engineered to support businesses in North America, Europe, Africa, and international markets.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <CheckCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Ongoing Optimization</strong>
              Post-launch support, performance monitoring, and maintenance solutions to ensure sustained growth.
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-black text-white uppercase">Ready to Transform Your Digital Operations?</h3>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Book a free consultation with our team to discuss your project requirements, technical challenges, and growth goals.
        </p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-8 py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
        >
          Book Your Free Consultation <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export const GoyeFaqPage: React.FC<PageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Got Questions? We Have Answers.
        </h1>
        <p className="text-xs text-gray-400">
          Learn how GOYE DIGITAL delivers websites, AI assistants, and automation systems for client acquisition.
        </p>
      </div>

      <div className="space-y-4">
        {GOYE_FAQ.map((faq, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <HelpCircle size={16} className="shrink-0" />
              {faq.q}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h4 className="text-sm font-bold text-white uppercase">Still Have Specific Questions About Your Business?</h4>
        <p className="text-xs text-gray-400">Our solution architects are available for direct WhatsApp or email consultations.</p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
        >
          Speak With An Expert
        </button>
      </div>
    </div>
  );
};

export const GoyeCaseStudiesPage: React.FC<PageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">
        📂
      </div>
      
      <div className="space-y-3">
        <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
          Verified Work & Proof
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Client Case Studies Coming Soon
        </h1>
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
          We are currently organizing detailed project breakdowns, architecture documentation, and verified client transformation stories for upcoming publication.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
        <h3 className="text-xs font-bold text-white uppercase border-b border-slate-800 pb-2">
          Want To Be Our Next Featured Case Study?
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Partner with GOYE DIGITAL to build your business website, integrate AI customer support, or automate your sales workflows.
        </p>
        <button
          onClick={onOpenConsultation}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition"
        >
          Start Your Project Today
        </button>
      </div>
    </div>
  );
};

export const GoyePrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-gray-300 text-xs leading-relaxed">
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h1 className="text-2xl font-black text-white uppercase">Privacy Policy</h1>
        <p className="text-gray-400">Effective Date: September 2026 | GOYE DIGITAL (https://gasv.store)</p>
      </div>

      <p>
        At GOYE DIGITAL, accessible from https://gasv.store, one of our main priorities is the privacy of our visitors and clients. This Privacy Policy document outlines the types of information collected and recorded by GOYE DIGITAL and how we use it.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">1. Information We Collect</h2>
      <p>
        When you submit a lead request, book a consultation, or complete an AI assessment on our platform, we collect information provided voluntarily, including:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Full Name and Business/Organization Name</li>
        <li>Email address and WhatsApp/Phone contact number</li>
        <li>Country and Business Type</li>
        <li>Project requirements, budget preferences, and challenge descriptions</li>
      </ul>

      <h2 className="text-sm font-bold text-white uppercase mt-4">2. How We Use Your Information</h2>
      <p>We use collected lead and consultation data strictly for business operations, including:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Reviewing project requirements and providing custom technical quotations</li>
        <li>Contacting you via WhatsApp, email, or phone regarding your consultation request</li>
        <li>Delivering tailored service recommendations and client onboarding</li>
        <li>Maintaining secure client project records in our dashboard</li>
      </ul>

      <h2 className="text-sm font-bold text-white uppercase mt-4">3. Data Protection & Non-Disclosure</h2>
      <p>
        GOYE DIGITAL does not sell, trade, or rent client contact information or project specifications to third-party marketing brokers. All client communications and project documentation remain confidential.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">4. Contact Us</h2>
      <p>
        If you have additional questions or require more information about our Privacy Policy, please contact us via email at goye@gasv.store or via official WhatsApp support.
      </p>
    </div>
  );
};

export const GoyeTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-gray-300 text-xs leading-relaxed">
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h1 className="text-2xl font-black text-white uppercase">Terms of Service</h1>
        <p className="text-gray-400">Effective Date: September 2026 | GOYE DIGITAL (https://gasv.store)</p>
      </div>

      <p>
        Welcome to GOYE DIGITAL! These terms and conditions outline the rules and regulations for the use of GOYE DIGITAL's Website and Services located at https://gasv.store.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">1. Scope of Services</h2>
      <p>
        GOYE DIGITAL provides digital engineering services, including business website development, web application design, AI assistant integration, WhatsApp workflow automation, and digital marketing consultation. Service deliverables, milestones, and fees are governed by formal project quotes approved prior to execution.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">2. Consultation & Quotations</h2>
      <p>
        Consultation bookings and quote requests submitted via https://gasv.store are non-binding requests for project evaluation. Formal contracts and service level agreements (SLAs) will be executed following scope review.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">3. Intellectual Property</h2>
      <p>
        All custom source code, design mockups, and AI configurations developed for clients become client intellectual property upon full settlement of project milestone invoices as outlined in individual service agreements.
      </p>

      <h2 className="text-sm font-bold text-white uppercase mt-4">4. Governing Law</h2>
      <p>
        These terms shall be governed by and construed in accordance with applicable commercial laws. Any inquiries regarding terms of service can be directed to goye@gasv.store.
      </p>
    </div>
  );
};
