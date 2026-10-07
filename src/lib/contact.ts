// GOYE Support & Contact Helper
export const GOYE_WEBSITE_URL = 'https://www.gasv.store';

/**
 * Filter out blocked/invalid emails (ifiok82, godswill, gasv.store, null, ico, incomplete)
 */
export function cleanUserEmail(rawEmail?: string | null): string {
  if (!rawEmail) return '';
  const clean = rawEmail.trim().toLowerCase();
  if (
    clean.includes('goyedagosmess') ||
    clean.includes('goyedagos') ||
    clean.includes('ifiok82') ||
    clean.includes('godswill') ||
    clean.includes('gasv.store') ||
    clean.includes('null') ||
    clean.includes('undefined') ||
    clean.includes('ico') ||
    !clean.includes('@') ||
    !clean.includes('.')
  ) {
    return '';
  }
  return clean;
}

/**
 * Primary Support: Email support to goyedagosmess@gmail.com
 */
export function openGoyeEmailSupport(subject: string = 'Hello GOYE Inquiry RC BN3583878', body: string = '') {
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



