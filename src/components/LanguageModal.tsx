import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function LanguageModal({ onClose }: any) {
  useEffect(() => {
    // Check if script already exists
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,fr,es,ar,ha,yo,ig', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      };
    } else if ((window as any).google && (window as any).google.translate) {
      // Re-initialize if possible or just let the existing one be
      document.getElementById('google_translate_element')!.innerHTML = '';
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,fr,es,ar,ha,yo,ig', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#3b82f6] rounded-2xl w-full max-w-sm relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)]">
        <div className="bg-[#000] border-b border-[#333] p-4 flex items-center justify-between z-10">
          <h2 className="text-white font-bold text-lg">Select Language</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm mb-6">Choose your preferred language:</p>
          <div id="google_translate_element" className="bg-white p-2 rounded-lg inline-block text-black"></div>
          <p className="text-[#3b82f6] text-[10px] mt-8 font-bold">Powered by Google Translate</p>
        </div>
      </div>
    </div>
  );
}
