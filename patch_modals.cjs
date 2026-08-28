const fs = require('fs');

const patchModal = (filePath, stateSetterName) => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace the fixed inset-0 div with an onClick handler if it doesn't already have one
    if (!code.includes('onClick={onClose}')) {
        code = code.replace(
            /className="fixed inset-0 (bg-black\/[^"]+) z-\[?[0-9]+\]? [^"]+"/g, 
            (match) => match + ' onClick={onClose}'
        );
        // Prevent clicks inside the modal content from bubbling up and closing the modal
        code = code.replace(
            /className="(bg-\[#[a-fA-F0-9]+\] border[^"]+w-full max-w-[^"]+ relative[^"]*)"/g,
            (match) => match + ' onClick={(e) => e.stopPropagation()}'
        );
        fs.writeFileSync(filePath, code);
    }
};

patchModal('src/components/QRModal.tsx', 'onClose');
patchModal('src/components/ScanModal.tsx', 'onClose');
patchModal('src/components/VoiceModal.tsx', 'onClose');
patchModal('src/components/LanguageModal.tsx', 'onClose');
patchModal('src/components/CurrencyModal.tsx', 'onClose');

// For UnifiedCheckoutModal
let checkoutFile = 'src/components/UnifiedCheckoutModal.tsx';
let checkoutCode = fs.readFileSync(checkoutFile, 'utf8');
if (!checkoutCode.includes('onClick={onClose}')) {
    checkoutCode = checkoutCode.replace(
        '<div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-4 overflow-y-auto">',
        '<div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>'
    );
    checkoutCode = checkoutCode.replace(
        '<div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8">',
        '<div className="bg-[#111] border border-[#333] rounded-[24px] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative my-8" onClick={(e) => e.stopPropagation()}>'
    );
    fs.writeFileSync(checkoutFile, checkoutCode);
}

console.log("Patched modals to support background dismissal");
