/**
 * WhatsApp deep-link helper.
 *
 * The phone number lives in exactly one place — `src/data/contact.js` —
 * so it never needs to be edited inside a component.
 */

const DEFAULT_BASE = 'https://wa.me/';

/** Strips everything except digits, keeping the country code intact. */
export function normaliseNumber(value) {
  if (typeof value !== 'string') return '';
  const digits = value.replace(/\D/g, '');
  // Drop a leading 00 which wa.me also rejects.
  return digits.replace(/^00/, '');
}

export function isWhatsAppConfigured(number) {
  return normaliseNumber(number).length >= 8;
}

/**
 * Builds a wa.me link with a properly encoded pre-filled message.
 * Returns `null` when no number is configured, so callers can fall back
 * gracefully instead of rendering a dead link.
 */
export function buildWhatsAppUrl(number, message = '') {
  const clean = normaliseNumber(number);
  if (!isWhatsAppConfigured(clean)) return null;

  const params = new URLSearchParams();
  if (message) params.set('text', message);

  const query = params.toString();
  return `${DEFAULT_BASE}${clean}${query ? `?${query}` : ''}`;
}

/** Message used for a specific inquiry type, kept short and professional. */
export function buildMessageForInquiry(inquiryType, name) {
  const opener = name ? `Hello Snehasmita, this is ${name}.` : 'Hello Snehasmita,';
  const typeLabel = inquiryType ? inquiryType.replace(/-/g, ' ').toLowerCase() : 'a general inquiry';
  return `${opener} I came across your portfolio and would like to discuss a ${typeLabel} opportunity.`;
}

export default buildWhatsAppUrl;
