import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, RefreshCw, Layers, TrendingUp, Zap, HelpCircle } from 'lucide-react';

interface Recommendation {
  category: string;
  title: string;
  reason: string;
  action: string;
  slug: string;
}

interface GoyeAiAssessmentProps {
  onOpenConsultation: () => void;
  onSelectService: (slug: string) => void;
}

export const GoyeAiAssessment: React.FC<GoyeAiAssessmentProps> = ({
  onOpenConsultation,
  onSelectService
}) => {
  const [step, setStep] = useState(1);
  const [hasWebsite, setHasWebsite] = useState('no');
  const [primaryGoal, setPrimaryGoal] = useState('get_more_leads');
  const [mainChallenge, setMainChallenge] = useState('low_traffic');
  const [businessType, setBusinessType] = useState('Service Business');
  const [currentMonthlyInquiries, setCurrentMonthlyInquiries] = useState('moderate');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    headline: string;
    summary: string;
    recommendations: Recommendation[];
    disclaimer: string;
  } | null>(null);

  const handleRunAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/goye/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasWebsite,
          primaryGoal,
          mainChallenge,
          businessType,
          currentMonthlyInquiries
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data);
        setStep(3);
      } else {
        setStep(3);
      }
    } catch (e) {
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <section id="assessment" className="py-20 bg-slate-950 text-white relative border-y border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-800">
              <Bot size={14} />
              <span>Interactive Diagnostic Tool</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Discover What Your Business Needs
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              Answer 4 quick questions about your business operations to receive instant AI recommendations for BUILD, AUTOMATE, or GROW strategies.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold uppercase text-cyan-400 mb-2">
                  1. Does your business currently have an active website or portal?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'no', label: 'No Website / Launching New' },
                    { id: 'outdated', label: 'Yes, but outdated or slow' },
                    { id: 'yes', label: 'Yes, modern website active' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHasWebsite(opt.id)}
                      className={`p-4 rounded-xl border text-xs font-bold text-left transition ${
                        hasWebsite === opt.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-cyan-400 mb-2">
                  2. What is your primary operational or business goal?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'get_more_leads', label: 'Attract & acquire more high-value clients' },
                    { id: 'automate_support', label: 'Automate repetitive support & inquiries' },
                    { id: 'brand_repositioning', label: 'Reposition brand & launch custom portal' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPrimaryGoal(opt.id)}
                      className={`p-4 rounded-xl border text-xs font-bold text-left transition ${
                        primaryGoal === opt.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-400 transition"
                >
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold uppercase text-cyan-400 mb-2">
                  3. What is your biggest current bottleneck or operational challenge?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'low_traffic', label: 'Low website visitor traffic or search visibility' },
                    { id: 'support_overload', label: 'Overwhelmed answering repetitive FAQs manually' },
                    { id: 'after_hours', label: 'Losing prospective clients outside office hours' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMainChallenge(opt.id)}
                      className={`p-4 rounded-xl border text-xs font-bold text-left transition ${
                        mainChallenge === opt.id
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-cyan-400 mb-2">
                  4. What type of business do you operate?
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Professional Service Provider">Professional Service Provider / Consultancy</option>
                  <option value="Small / Medium Business">Small / Medium Business</option>
                  <option value="School or Educational Academy">School or Educational Academy</option>
                  <option value="Hotel / Restaurant / Hospitality">Hotel / Restaurant / Hospitality</option>
                  <option value="Real Estate & Property Agency">Real Estate & Property Agency</option>
                  <option value="Clinic or Healthcare Facility">Clinic or Healthcare Facility</option>
                  <option value="NGO / Non-Profit Organization">NGO / Non-Profit Organization</option>
                  <option value="E-Commerce Store">E-Commerce Store</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 font-bold text-xs"
                >
                  Back
                </button>

                <button
                  onClick={handleRunAssessment}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:opacity-90 transition"
                >
                  {loading ? (
                    <span>Analyzing Requirements...</span>
                  ) : (
                    <>
                      <Bot size={16} />
                      <span>Generate AI Recommendations</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-black text-sm uppercase">
                  <Sparkles size={16} />
                  <span>{results?.headline || 'Tailored AI Digital Strategy'}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {results?.summary || 'Based on your operational answers, we identified high-impact solutions to streamline customer acquisition and workflow.'}
                </p>

                <div className="space-y-4 pt-2">
                  {results?.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          rec.category === 'BUILD' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                          rec.category === 'AUTOMATE' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {rec.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                        <p className="text-xs text-gray-400">{rec.reason}</p>
                      </div>

                      <button
                        onClick={() => onSelectService(rec.slug || 'websites')}
                        className="px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 border border-cyan-500/30 text-xs font-bold shrink-0 transition"
                      >
                        {rec.action}
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 italic pt-2">
                  * {results?.disclaimer || 'Recommendations are tailored guidance for your digital operations and do not constitute guaranteed financial returns.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  <span>Retake Assessment</span>
                </button>

                <button
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Request Your Business Consultation</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
