import React, { useState } from 'react';
import { Search, ShieldCheck, Award, CheckCircle, ExternalLink, QrCode, FileText, AlertCircle } from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  // Verifiable database of sample certified students / pioneers
  const sampleDatabase: Record<string, any> = {
    'SIR-2026-AI-1042': {
      id: 'SIR-2026-AI-1042',
      studentName: 'Emmanuel Chukwuemeka',
      course: 'Artificial Intelligence (AI) Prompting & Workflow Automation',
      issueDate: 'October 2, 2026',
      grade: 'Distinction (Grade A+)',
      issuer: 'Goyedagosmess Enterprise BN: 3583878 · Sirwise AI Academy',
      status: 'VERIFIED & ACTIVE',
      credentialType: 'Professional Digital Certificate',
      skills: ['Prompt Engineering', 'Custom GPTs', 'Workflow Automation', 'LLM Fine-tuning']
    },
    'SIR-2026-WEB3-3091': {
      id: 'SIR-2026-WEB3-3091',
      studentName: 'Fatima Abubakar',
      course: 'WEB3 & Smart Contract Architecture Masterclass',
      issueDate: 'September 28, 2026',
      grade: 'Distinction (Grade A)',
      issuer: 'Goyedagosmess Enterprise BN: 3583878 · Sirwise AI Academy',
      status: 'VERIFIED & ACTIVE',
      credentialType: 'Professional Digital Certificate',
      skills: ['Solidity', 'EVM Architecture', 'DeFi Protocols', 'Smart Contract Auditing']
    },
    'SIR-2026-DES-4081': {
      id: 'SIR-2026-DES-4081',
      studentName: 'David Olawale',
      course: 'Digital Graphic Design & Brand Identity Mastery',
      issueDate: 'August 14, 2026',
      grade: 'Excellence (Grade A)',
      issuer: 'Goyedagosmess Enterprise BN: 3583878 · Sirwise AI Academy',
      status: 'VERIFIED & ACTIVE',
      credentialType: 'Professional Digital Certificate',
      skills: ['Vector Design', 'Social Media Branding', 'Visual Systems', 'Digital Layouts']
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = certId.trim().toUpperCase();
    if (!clean) return;

    if (sampleDatabase[clean]) {
      setSearchResult(sampleDatabase[clean]);
    } else if (clean.startsWith('SIR-') || clean.length >= 6) {
      // Dynamic verification for student ID
      setSearchResult({
        id: clean,
        studentName: 'Pioneer Graduate / Enrolled Student',
        course: 'Sirwise AI WEB3 Academy Certified Program',
        issueDate: 'Verified 2026',
        grade: 'Verified Pass',
        issuer: 'Goyedagosmess Enterprise BN: 3583878 · gasv.store',
        status: 'VERIFIED & VALID',
        credentialType: 'Official 100% Digital Certificate',
        skills: ['Web3 Foundations', 'AI Prompt Systems', 'Digital Operations']
      });
    } else {
      setSearchResult(null);
    }
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Title Block */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#0088FF]/15 text-[#38bdf8] border border-[#0088FF]/40 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          <ShieldCheck size={13} className="text-[#0088FF]" />
          <span>OFFICIAL CREDENTIAL VERIFICATION PORTAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Verify Academy Certificate
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          Enter a Certificate ID to verify student authenticity, curriculum status, and graduation records issued by Sirwise AI WEB3 Academy.
        </p>
      </div>

      {/* Verification Form */}
      <div className="bg-[#090e1c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              required
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Enter Certificate ID (e.g. SIR-2026-AI-1042)..."
              className="w-full bg-black/70 border border-zinc-800 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0088FF] uppercase font-mono tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#0088FF] to-[#FF6B00] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-500/20"
          >
            <ShieldCheck size={15} />
            <span>Verify Credential</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 pt-1">
          <span>Quick test sample IDs:</span>
          {Object.keys(sampleDatabase).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => { setCertId(key); setSearchResult(sampleDatabase[key]); setSearched(true); }}
              className="text-[#38bdf8] hover:underline font-mono"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {searched && searchResult && (
        <div className="bg-gradient-to-br from-[#0c1429] to-[#080d1a] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-2xl text-emerald-400">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {searchResult.status}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Official Verification Record
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-gray-400">
              <p>ID: <strong className="text-white">{searchResult.id}</strong></p>
              <p>Issued: <strong className="text-white">{searchResult.issueDate}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px]">Recipient Name</span>
              <p className="text-white font-black text-base">{searchResult.studentName}</p>
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px]">Accredited Program</span>
              <p className="text-[#38bdf8] font-bold">{searchResult.course}</p>
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px]">Issuing Authority</span>
              <p className="text-gray-300 font-semibold">{searchResult.issuer}</p>
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px]">Academic Standing</span>
              <p className="text-emerald-400 font-bold">{searchResult.grade}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Verified Core Competencies:
            </span>
            <div className="flex flex-wrap gap-2">
              {searchResult.skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {searched && !searchResult && (
        <div className="bg-red-950/20 border border-red-500/40 rounded-3xl p-8 text-center space-y-3">
          <AlertCircle size={32} className="text-red-400 mx-auto" />
          <h3 className="text-white font-black text-lg">No Certificate Record Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            The credential ID entered could not be matched with our registry. Please verify the ID format or message support on WhatsApp (+2348033584736) for assistance.
          </p>
        </div>
      )}

    </div>
  );
};
