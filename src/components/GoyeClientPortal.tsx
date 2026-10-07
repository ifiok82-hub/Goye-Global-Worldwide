import React, { useState } from 'react';
import { User, FileText, DollarSign, MessageSquare, Clock, Download, Plus, CheckCircle2, Shield, FolderOpen, Headphones } from 'lucide-react';

interface GoyeClientPortalProps {
  onOpenLeadForm: () => void;
  onOpenConsultation: () => void;
}

export const GoyeClientPortal: React.FC<GoyeClientPortalProps> = ({
  onOpenLeadForm,
  onOpenConsultation
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'quotes' | 'docs' | 'messages' | 'support'>('overview');

  // Load client profile from localStorage if exists
  const [clientProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('goye_active_user') || '{}');
    } catch (e) {
      return {};
    }
  });

  return (
    <section id="client-portal" className="py-16 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Portal Header */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
              <User size={28} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-black uppercase border border-cyan-800">
                <span>Verified Client Hub</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {clientProfile?.name || clientProfile?.contact || 'Client Dashboard'}
              </h2>
              <p className="text-xs text-gray-300">
                {clientProfile?.contact || 'Manage service requests, quotes, project documents, and support.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenLeadForm}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md hover:bg-cyan-400 transition"
            >
              <Plus size={14} />
              <span>New Service Request</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-800 text-gray-200 font-bold text-xs border border-slate-700 hover:bg-slate-700 transition"
            >
              Book Strategy Call
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: <User size={14} /> },
            { id: 'projects', label: 'Project Status', icon: <Clock size={14} /> },
            { id: 'quotes', label: 'Quotes & Proposals', icon: <DollarSign size={14} /> },
            { id: 'docs', label: 'Project Documents', icon: <FolderOpen size={14} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={14} /> },
            { id: 'support', label: 'Support Requests', icon: <Headphones size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-gray-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Active Service Requests</span>
              <p className="text-3xl font-black text-white">01</p>
              <p className="text-xs text-cyan-400 font-semibold">Status: Under Review / Proposal Preparation</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Pending Proposals & Quotes</span>
              <p className="text-3xl font-black text-amber-400">01</p>
              <p className="text-xs text-gray-400">Request a quote anytime</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Assigned Account Manager</span>
              <p className="text-sm font-bold text-white">GOYE Client Operations Team</p>
              <a href="mailto:goye@gasv.store" className="text-xs text-cyan-400 underline">goye@gasv.store</a>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white">Project Status & Milestones</h3>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                  DISCOVERY & SCOPING
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Digital Client Acquisition Platform Setup</h4>
                <p className="text-xs text-gray-400">Requirement intake received. Proposal and quotation in progress.</p>
              </div>
              <button
                onClick={onOpenConsultation}
                className="px-3.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/20"
              >
                Schedule Review
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white">Quotation & Proposal Center</h3>
            <p className="text-xs text-gray-300">
              Proposals are prepared custom for each client requirement. No hardcoded or false pricing.
            </p>
            <button
              onClick={onOpenLeadForm}
              className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs uppercase"
            >
              Request New Quotation
            </button>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-center py-12">
            <FolderOpen size={36} className="text-cyan-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Project Documents Hub</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Project specifications, technical blueprints, and delivery files will appear here once your project is active.
            </p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white">Direct Client Messaging</h3>
            <p className="text-xs text-gray-300">
              Communicate directly with your project manager via WhatsApp or email.
            </p>
            <a
              href="https://wa.me/2348000000000?text=Hello%20GOYE%20DIGITAL%20Team,%20I%20have%20a%20question%20regarding%20my%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
            >
              <MessageSquare size={16} />
              <span>Open WhatsApp Client Chat</span>
            </a>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black uppercase text-white">Client Technical Support</h3>
            <p className="text-xs text-gray-300">
              Need assistance with your live website or AI assistant? Submit a support request or email goye@gasv.store.
            </p>
            <a
              href="mailto:goye@gasv.store?subject=CLIENT%20SUPPORT%20REQUEST"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold text-xs"
            >
              <Headphones size={16} />
              <span>Email Support (goye@gasv.store)</span>
            </a>
          </div>
        )}

      </div>
    </section>
  );
};
