// GOYE Support & Contact Helper

export const GOYE_SUPPORT_EMAIL = 'goye@gasv.store';
export const GOYE_WEBSITE_URL = 'https://www.gasv.store';
export const GOYE_BUSINESS_PHONE = '2348033584736'; // GOYE Official Business WhatsApp (never displayed raw in UI)

/**
 * Primary Support: Triggers mailto with auto-filled subject and body
 */
export function openGoyeEmailSupport(subject: string = 'Hello GOYE!', body: string = '') {
  const mailtoUrl = `mailto:${GOYE_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  window.location.href = mailtoUrl;
}

/**
 * Secondary Support: Triggers WhatsApp Business intent directly without webview/browser popups,
 * with graceful fallback to mailto if WhatsApp application is not installed.
 */
export function openGoyeWhatsAppSupport(messageText: string = 'Hello GOYE! I need support.') {
  const encodedMsg = encodeURIComponent(messageText);
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Attempt WhatsApp deep link intent
    const deepLinkUrl = `whatsapp://send?phone=${GOYE_BUSINESS_PHONE}&text=${encodedMsg}`;
    const startTime = Date.now();
    
    window.location.href = deepLinkUrl;

    // Fallback timer if WhatsApp application is not installed on mobile
    setTimeout(() => {
      if (Date.now() - startTime < 1500) {
        openGoyeEmailSupport(`[WhatsApp Direct] ${messageText}`, `Regarding GOYE inquiry: ${messageText}`);
      }
    }, 1200);
  } else {
    // Desktop official web intent
    const webUrl = `https://wa.me/${GOYE_BUSINESS_PHONE}?text=${encodedMsg}`;
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}
