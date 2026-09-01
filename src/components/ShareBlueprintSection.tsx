import React, { useState } from 'react';
import { Copy, Check, Share2, Send } from 'lucide-react';

interface ShareBlueprintSectionProps {
  onToast?: (message: string) => void;
  compact?: boolean;
}

export const SHARE_TEXT = "Get the Free 5-Minute AI Prompt Blueprint for Entrepreneurs to save 15+ hours/week! Download yours here: https://gasv.store";
export const SHARE_URL = "https://gasv.store";

export default function ShareBlueprintSection({ onToast, compact = false }: ShareBlueprintSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    if (onToast) {
      onToast('Link Copied!');
    }
    setTimeout(() => setCopied(false), 2500);

    // Track share click analytics
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'Share Blueprint',
          target: 'Copy Link Button',
          referrer: document.referrer || 'direct'
        })
      }).catch(() => {});
    } catch (e) {}
  };

  const handleSocialShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onToast) {
      onToast(`Sharing to ${platform}...`);
    }

    // Log share action
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'Share Blueprint',
          target: `Share via ${platform}`,
          referrer: document.referrer || 'direct'
        })
      }).catch(() => {});
    } catch (e) {}
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;

  if (compact) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-3 sm:p-4 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#FFD700] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Share2 size={14} /> One-Click Share Blueprint
          </span>
          <span className="text-gray-400 text-[10px]">Spread the word & get rewards</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* WhatsApp */}
          <button
            onClick={() => handleSocialShare('WhatsApp', whatsappUrl)}
            className="bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Send size={14} />
            <span>WhatsApp</span>
          </button>

          {/* X / Twitter */}
          <button
            onClick={() => handleSocialShare('X (Twitter)', twitterUrl)}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>X (Twitter)</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialShare('Facebook', facebookUrl)}
            className="bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 text-[#1877F2] font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleSocialShare('LinkedIn', linkedinUrl)}
            className="bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/50 text-[#0A66C2] font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.48 1.48 0 1 0 0 2.96 1.48 1.48 0 0 0 0-2.96z"/>
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`col-span-2 sm:col-span-1 border font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/20'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border-2 border-[#FFD700]/60 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden my-8 max-w-4xl mx-auto shadow-[0_0_30px_rgba(255,215,0,0.15)]">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-full text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-3">
        <Share2 size={16} /> Share & Refer Entrepreneurs
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
        Share The <span className="text-[#FFD700]">5-Minute AI Prompt Blueprint</span>
      </h3>
      <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
        Help fellow business owners save 15+ hours/week with battle-tested AI prompts. One tap to share on your favorite network!
      </p>

      {/* Share Quote Preview Box */}
      <div className="bg-black/80 border border-[#2a2a2a] rounded-2xl p-4 mb-6 text-left max-w-2xl mx-auto font-mono text-xs text-gray-300">
        <span className="text-[#FFD700] font-bold block mb-1">Pre-Loaded Share Message:</span>
        "{SHARE_TEXT}"
      </div>

      {/* Share Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
        {/* WhatsApp */}
        <button
          onClick={() => handleSocialShare('WhatsApp', whatsappUrl)}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Send size={18} className="fill-black" />
          <span>WhatsApp</span>
        </button>

        {/* X (Twitter) */}
        <button
          onClick={() => handleSocialShare('X (Twitter)', twitterUrl)}
          className="bg-white hover:bg-gray-200 text-black font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X (Twitter)</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleSocialShare('Facebook', facebookUrl)}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleSocialShare('LinkedIn', linkedinUrl)}
          className="bg-[#0A66C2] hover:bg-[#0958a8] text-white font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.48 1.48 0 1 0 0 2.96 1.48 1.48 0 0 0 0-2.96z"/>
          </svg>
          <span>LinkedIn</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-black'
              : 'bg-[#FFD700] hover:bg-yellow-400 text-black'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
}
