import { useEffect } from 'react';

// AutoPiConverter - Pure DOM text-node walker
// NEVER modifies innerHTML (which breaks React event listeners)
// Never creates screen overlays
export default function AutoPiConverter() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const toPi = (naira?: number, usd?: number) => {
      if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
      if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
      return 2;
    };

    const convertAll = () => {
      try {
        // 1. Text node walker for leaf elements
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName;
              if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT') {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const nodesToUpdate: { node: Node; text: string }[] = [];
        let currentNode: Node | null;

        while ((currentNode = walker.nextNode())) {
          let text = currentNode.nodeValue || '';
          if (!text.trim()) continue;

          let updated = false;

          // Replace old payment wording if found
          if (text.includes('Paystack') || text.includes('Flutterwave') || text.includes('OPay') || text.includes('PayPal')) {
            text = text.replace(/Pay securely with .*\./gi, 'Pay securely with Pi.');
            updated = true;
          }

          // Replace 0.000003 Pi with 1 Pi
          if (text.includes('0.000003')) {
            text = text.replace(/0\.000003\s*Pi/gi, '1 Pi');
            updated = true;
          }

          // Replace ENROLL / UNLOCK
          if (/\bENROLL\b/i.test(text)) {
            text = text.replace(/\bENROLL\b(?:\s*→)?/gi, '🔒 LOCK - 2 Pi');
            updated = true;
          }

          // Handle Naira / USD in text
          if (text.includes('₦') || (text.includes('$') && !text.includes('Pi'))) {
            // Replace dual pattern like ₦25,000 ($18)
            text = text.replace(/₦\s*([\d,]+(?:\.\d+)?)\s*(?:\(\s*\$?\s*([\d,]+(?:\.\d+)?)\s*\))?/gi, (_m, nairaVal, usdVal) => {
              const n = parseFloat((nairaVal || '').replace(/,/g, ''));
              const u = usdVal ? parseFloat(usdVal.replace(/,/g, '')) : undefined;
              const pi = toPi(n, u);
              return `${pi} Pi`;
            });

            // Replace single $ pattern
            text = text.replace(/\$\s*([\d,]+(?:\.\d+)?)/gi, (_m, usdVal) => {
              const u = parseFloat(usdVal.replace(/,/g, ''));
              const pi = toPi(undefined, u);
              return `${pi} Pi`;
            });

            updated = true;
          }

          if (updated && text !== currentNode.nodeValue) {
            nodesToUpdate.push({ node: currentNode, text });
          }
        }

        // Apply text node updates without disrupting DOM listeners
        for (const item of nodesToUpdate) {
          item.node.nodeValue = item.text;
        }
      } catch (err) {
        // fail-safe
      }
    };

    convertAll();
    const interval = setInterval(convertAll, 1000);
    const obs = new MutationObserver(() => convertAll());
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      clearInterval(interval);
      obs.disconnect();
    };
  }, []);

  return null;
}
