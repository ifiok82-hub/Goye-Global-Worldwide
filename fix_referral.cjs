const fs = require('fs');
let code = fs.readFileSync('src/components/ReferralDashboardModal.tsx', 'utf8');

// Add social icons
code = code.replace("import { X, Copy, Share2, Users, MousePointerClick, DollarSign, Wallet } from 'lucide-react';", "import { X, Copy, Share2, Users, MousePointerClick, DollarSign, Wallet, Facebook, Twitter, MessageCircle } from 'lucide-react';");

const oldShareButtons = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<button onClick=\{shareWhatsApp\}[\s\S]*?WhatsApp[\s\S]*?<\/button>[\s\S]*?<button onClick=\{[\s\S]*?Share\.\.\.[\s\S]*?<\/button>[\s\S]*?<\/div>/;

const newShareButtons = `
              <div className="mb-2 mt-6 text-[10px] text-gray-500 font-bold uppercase">Share on Socials</div>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={shareWhatsApp} className="bg-[#25D366] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#1da851] transition" title="WhatsApp">
                  <MessageCircle size={20} />
                </button>
                <button onClick={() => window.open(\`https://t.me/share/url?url=\${encodeURIComponent(referralLink)}&text=\${encodeURIComponent('Get the best eSIMs and Web3 Academy courses at GOYE Store Global!')}\`)} className="bg-[#0088cc] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#0077b5] transition" title="Telegram">
                  <Share2 size={20} />
                </button>
                <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(referralLink)}&text=\${encodeURIComponent('Get the best eSIMs and Web3 Academy courses at GOYE Store Global!')}\`)} className="bg-[#000000] border border-[#333] text-white p-3 rounded-xl flex items-center justify-center hover:border-gray-500 transition" title="X (Twitter)">
                  <X size={20} />
                </button>
                <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(referralLink)}\`)} className="bg-[#1877F2] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#166fe5] transition" title="Facebook">
                  <Facebook size={20} />
                </button>
              </div>
              
              <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'GOYE Store', text: 'Get courses and eSIMs!', url: referralLink });
                  } else {
                    if(onToast) onToast('Sharing not supported on this device');
                  }
                }} className="w-full mt-4 bg-[#3b82f6] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2563eb] transition">
                  <Share2 size={18} /> More Share Options...
                </button>
`;

code = code.replace(oldShareButtons, newShareButtons);
fs.writeFileSync('src/components/ReferralDashboardModal.tsx', code);
