// GOYE Support & Contact Helper (Server-side redirection secured)

export const GOYE_WEBSITE_URL = 'https://www.gasv.store';

/**
 * Primary Support: Redirects to secure server-side contact portal or posts message
 */
export function openGoyeEmailSupport(subject: string = 'Hello GOYE!', body: string = '') {
  window.location.href = '/contact.html';
}

/**
 * Secondary Support: Triggers WhatsApp via secure server-side redirect (/go/whatsapp)
 * completely hiding raw phone numbers from client-side source code.
 */
export function openGoyeWhatsAppSupport(messageText: string = 'Hello GOYE! I need support.') {
  const encodedMsg = encodeURIComponent(messageText);
  const redirectUrl = `/go/whatsapp?text=${encodedMsg}`;
  window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}

