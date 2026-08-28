const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

// Allow clicking background to close modal to prevent being stuck on a black screen
code = code.replace(
  '<div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4 overflow-y-auto">',
  '<div className="fixed inset-0 bg-black/90 z-[5000] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>'
);
// Stop propagation on inner container
code = code.replace(
  '<div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8">',
  '<div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8" onClick={e => e.stopPropagation()}>'
);

fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
