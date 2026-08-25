const fs = require('fs');
const file = 'src/components/ReferralDashboardModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const shareCode = `  const handleShare = async (platform: string) => {
    const text = 'Join GOYE Global and access premium digital products & Web3 academy!\\n';
    const url = referralLink;
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title: 'GOYE Global', text, url });
        if(onToast) onToast('Thanks for sharing!');
      } catch (err) { console.error('Share failed', err); }
      return;
    }
    
    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = \`https://wa.me/?text=\${encodeURIComponent(text + url)}\`;
    if (platform === 'twitter') shareUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(url)}\`;
    if (platform === 'facebook') shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`;
    if (platform === 'telegram') shareUrl = \`https://t.me/share/url?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(text)}\`;
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };`;

if (!code.includes('handleShare')) {
  code = code.replace(
    "  const copyToClipboard = () => {",
    shareCode + "\n\n  const copyToClipboard = () => {"
  );
  
  const originalLinkDisplay = `<div className="flex items-center gap-2">
              <div className="flex-1 bg-black rounded-xl p-3 text-[#FFD700] font-mono text-xs overflow-x-auto border border-[#222]">
                {referralLink}
              </div>
              <button onClick={copyToClipboard} className="bg-[#FFD700] p-3 rounded-xl text-black hover:bg-yellow-400 transition-colors active:scale-95 shrink-0">
                <Copy size={18} />
              </button>
            </div>`;
            
  const newLinkDisplay = `<div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-black rounded-xl p-3 text-[#FFD700] font-mono text-xs overflow-x-auto border border-[#222]">
                {referralLink}
              </div>
              <button onClick={copyToClipboard} className="bg-[#FFD700] p-3 rounded-xl text-black hover:bg-yellow-400 transition-colors active:scale-95 shrink-0">
                <Copy size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-2">
              <button onClick={() => handleShare('whatsapp')} className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:text-black transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </button>
              <button onClick={() => handleShare('twitter')} className="bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button onClick={() => handleShare('facebook')} className="bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button onClick={() => handleShare('telegram')} className="bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#0088cc] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-16.49l-1.748 10.941c-.131.579-.481.721-.974.444l-2.695-1.986-1.3 1.25c-.144.144-.265.265-.544.265l.194-2.748 5.003-4.52c.218-.194-.047-.302-.338-.108l-6.183 3.889-2.66-.83c-.579-.181-.591-.579.121-.856l10.395-4.004c.481-.176.907.108.729.863z"/></svg>
              </button>
              <button onClick={() => handleShare('native')} className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 p-2 rounded-xl flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </button>
            </div>`;
            
  code = code.replace(originalLinkDisplay, newLinkDisplay);
  
  fs.writeFileSync(file, code);
  console.log("Patched Share");
}
