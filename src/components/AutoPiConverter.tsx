import { useEffect } from 'react';

// V2 - Handles split prices: ₦25,000 in one span + ($18) in another span
// And converts ENROLL -> LOCK - X Pi + wires Pi payment
export default function AutoPiConverter() {
  useEffect(() => {
    const toPi = (naira?: number, usd?: number) => {
      if (usd && usd > 0) return Math.max(1, Math.ceil(usd / 30));
      if (naira && naira > 0) return Math.max(1, Math.ceil((naira / 1500) / 30));
      return 2;
    };

    const convertAll = () => {
      // 1. Fix Paystack text
      document.body.innerHTML = document.body.innerHTML.replace(/Pay securely with Paystack, Flutterwave, 【entity-PayPal¦canonical_name=PayPal】, or direct 【entity-OPay¦canonical_name=OPay】\./g, 'Pay securely with Pi.');
      // Note: innerHTML replace runs once, then we use DOM walk below for prices

      // 2. Find ALL leaf elements with ₦ or $
      const all = Array.from(document.querySelectorAll('body *'));
      all.forEach((el: any) => {
        if (el.children.length > 0) return; // only leaf nodes
        const txt = (el.textContent || '').trim();
        if (!txt) return;
        if (txt.includes('Pi') && !txt.includes('₦') && !txt.includes('$')) return;

        // Case A: ₦25,000 alone
        const nairaOnly = txt.match(/^₦\s?([\d,]+)$/);
        // Case B: ($18) alone
        const usdOnly = txt.match(/^\(\$([\d.]+)\)$/);
        // Case C: ₦25,000 ($18) together
        const both = txt.match(/₦\s?([\d,]+).*\$([\d.]+)/);

        if (both) {
          const pi = toPi(parseFloat(both[1].replace(/,/g, '')), parseFloat(both[2]));
          el.textContent = `${pi} Pi`;
          el.style.color = '#FFD700';
          el.style.fontWeight = '900';
        } else if (nairaOnly) {
          const pi = toPi(parseFloat(nairaOnly[1].replace(/,/g, '')), undefined);
          el.textContent = `${pi} Pi`;
          el.style.color = '#FFD700';
          el.style.fontWeight = '900';
        } else if (usdOnly) {
          const pi = toPi(undefined, parseFloat(usdOnly[1]));
          el.textContent = `${pi} Pi`;
          el.style.color = '#FFD700';
          el.style.fontWeight = '900';
        }
        // Hide the second part: if ₦ part converted, hide the ($18) sibling
        if (nairaOnly || both) {
          const parent = el.parentElement;
          if (parent) {
            Array.from(parent.children).forEach((sib: any) => {
              if (sib !== el && /\(\$\d/.test(sib.textContent || '')) sib.style.display = 'none';
              if (sib !== el && sib.textContent?.includes('STANDARD TUITION')) sib.style.display = 'none';
            });
          }
        }
      });

      // 3. Convert ENROLL buttons -> LOCK - 2 Pi
      const buttons = Array.from(document.querySelectorAll('button, a'));
      buttons.forEach((btn: any) => {
        const t = (btn.textContent || '').trim().toUpperCase();
        if (t.includes('ENROLL')) {
          // Find price in same card to calculate Pi
          const card = btn.closest('div');
          const cardText = card?.parentElement?.textContent || '';
          const usdM = cardText.match(/\$([\d.]+)/);
          const nairaM = cardText.match(/₦\s?([\d,]+)/);
          let pi = 2;
          if (usdM) pi = toPi(undefined, parseFloat(usdM[1]));
          else if (nairaM) pi = toPi(parseFloat(nairaM[1].replace(/,/g, '')), undefined);
          btn.textContent = `🔒 LOCK - ${pi} Pi`;
          btn.style.background = '#FFD700';
          btn.style.color = '#000';
          // Store Pi for payment
          btn.dataset.piPrice = String(pi);
          btn.dataset.piConverted = '1';
        }
      });
    };

    convertAll();
    const obs = new MutationObserver(() => convertAll());
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => obs.disconnect();
  }, []);
  return null;
}
