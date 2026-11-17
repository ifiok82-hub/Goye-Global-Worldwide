import { useEffect } from 'react';

// AutoPiConverter - Pure DOM text-node walker
// NEVER modifies innerHTML and never creates full-screen overlays
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

          if (text.includes('₦') || (text.includes('$') && !text.includes('Pi'))) {
            text = text.replace(/₦\s*([\d,]+(?:\.\d+)?)\s*(?:\(\s*\$?\s*([\d,]+(?:\.\d+)?)\s*\))?/gi, (_m, nairaVal, usdVal) => {
              const n = parseFloat((nairaVal || '').replace(/,/g, ''));
              const u = usdVal ? parseFloat(usdVal.replace(/,/g, '')) : undefined;
              const pi = toPi(n, u);
              return `${pi} Pi`;
            });

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

        for (const item of nodesToUpdate) {
          item.node.nodeValue = item.text;
        }
      } catch {
        // fail-safe
      }
    };

    convertAll();
    const interval = setInterval(convertAll, 1500);
    const obs = new MutationObserver(() => convertAll());
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      clearInterval(interval);
      obs.disconnect();
    };
  }, []);

  return <span style={{ pointerEvents: 'none', position: 'static' }} aria-hidden="true" />;
}
