// GOYE Support & Contact Helper
export const GOYE_WEBSITE_URL = 'https://www.gasv.store';

/**
 * Primary Support: Email support to goyedagosmess@gmail.com
 */
export function openGoyeEmailSupport(subject: string = 'Hello GOYE Inquiry RC BN3583773', body: string = '') {
  const mailtoUrl = `mailto:goyedagosmess@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

/**
 * Secondary Support: Triggers WhatsApp support directly
 */
export function openGoyeWhatsAppSupport(messageText: string = 'Hello GOYE! I need support.') {
  const encodedMsg = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/2348033584736?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}


