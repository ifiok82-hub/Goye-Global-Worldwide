import React from 'react';
import { X, Sparkles, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PostPurchaseUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptUpsell: () => void;
}

export default function PostPurchaseUpsellModal({ isOpen, onClose, onAcceptUpsell }: PostPurchaseUpsellModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border-2 border-[#FFD700] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,215,0,0.3)] text-white overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#1f1f1f] text-gray-400 hover:text-white rounded-full hover:bg-[#333] transition"
        >
          <X size={20} />
        </button>

        {/* Top Urgency Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD700] text-black text-xs font-black uppercase tracking-wider rounded-full mb-4">
          <Zap size={14} className="fill-black" /> ONE-TIME SPECIAL UPGRADE (50% OFF TODAY)
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
          Get the Complete <span className="text-[#FFD700]">1,000 Viral AI Prompts Mega-Pack</span> for ₦29,900
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm mb-5">
          Regular Price <span className="line-through text-gray-500">₦59,985 ($39.99)</span> — <strong className="text-[#FFD700]">Save 50% Right Now!</strong>
        </p>

        {/* Value Proposition Box */}
        <div className="bg-[#141414] border border-[#2D2D2D] rounded-2xl p-4 space-y-2.5 mb-6 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5 text-gray-200">
            <CheckCircle2 size={16} className="text-[#FFD700] shrink-0 mt-0.5" />
            <span><strong>1,000 Master Prompts</strong> for Marketing, Coding, Copywriting & E-Commerce</span>
          </div>
          <div className="flex items-start gap-2.5 text-gray-200">
            <CheckCircle2 size={16} className="text-[#FFD700] shrink-0 mt-0.5" />
            <span><strong>Micro-SaaS & Web3 Startup Frameworks</strong> to generate recurring revenue</span>
          </div>
          <div className="flex items-start gap-2.5 text-gray-200">
            <CheckCircle2 size={16} className="text-[#FFD700] shrink-0 mt-0.5" />
            <span><strong>Lifetime Updates & Community Access</strong> included with zero subscription fees</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAcceptUpsell}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#ffe033] hover:to-[#ffb733] text-black font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-transform active:scale-95"
          >
            <span>🚀 Upgrade My Order for ₦29,900 ($19.99)</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onClose}
            className="w-full bg-[#1b1b1b] hover:bg-[#252525] text-gray-400 hover:text-white font-bold py-3 px-6 rounded-xl text-xs transition"
          >
            No thanks, take me to my download
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-[11px]">
          <ShieldCheck size={14} className="text-[#10B981]" />
          <span>Guaranteed 100% Secure Checkout via Paystack & Flutterwave</span>
        </div>
      </div>
    </div>
  );
}
