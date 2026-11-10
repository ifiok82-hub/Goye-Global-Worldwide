import React, { useEffect } from 'react';
import { convertPriceString } from '../lib/piCurrency';

export const AutoPiConverter: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const ignoredTags = new Set(['INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'NOSCRIPT']);

    const scanAndConvert = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if ((text.includes('₦') || text.includes('$') || text.includes('NGN') || text.includes('USD')) && !/(\bpi\b|π)/i.test(text)) {
          // Replace price occurrences inside the text node
          const converted = text
            .replace(/(?:₦|NGN)\s*([0-9,]+(?:\.[0-9]+)?)/gi, (match) => {
              const res = convertPriceString(match);
              return res || match;
            })
            .replace(/(?:\$|USD)\s*([0-9,]+(?:\.[0-9]+)?)/gi, (match) => {
              const res = convertPriceString(match);
              return res || match;
            });

          if (converted !== text) {
            node.textContent = converted;
          }
        }
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (ignoredTags.has(el.tagName)) return;
        for (let i = 0; i < el.childNodes.length; i++) {
          scanAndConvert(el.childNodes[i]);
        }
      }
    };

    // Initial pass
    scanAndConvert(document.body);

    // Observe dynamic changes
    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      try {
        for (const m of mutations) {
          if (m.type === 'childList') {
            m.addedNodes.forEach((n) => scanAndConvert(n));
          } else if (m.type === 'characterData') {
            scanAndConvert(m.target);
          }
        }
      } finally {
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default AutoPiConverter;
