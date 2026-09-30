/**
 * Email delivery for the contact form.
 *
 * Front-end only. EmailJS is loaded lazily (dynamic import) so it never
 * lands in the initial bundle, and every credential comes from a
 * NEXT_PUBLIC_* environment variable — nothing private is hardcoded here.
 *
 * Without credentials the form degrades gracefully to a pre-filled `mailto:`
 * using the same corporate template.
 */

import { contact } from '@/data/contact';

export const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

export function isEmailConfigured() {
  return Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey);
}

export const EMAIL_FALLBACK_MESSAGE = 'Email service is not configured yet.';

const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  inquiryType: 'Inquiry Type',
  message: 'Message',
};

const TEMPLATE_KEYS = {
  name: 'from_name',
  email: 'reply_to',
  phone: 'phone',
  company: 'company',
  inquiryType: 'inquiry_type',
  message: 'message',
};

function humanise(value) {
  if (!value) return '—';
  return String(value)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/** Maps form state onto the EmailJS template variables. */
export function buildEmailTemplateParams(values) {
  const params = {};
  Object.keys(FIELD_LABELS).forEach((key) => {
    params[TEMPLATE_KEYS[key]] = values[key] ?? '';
  });
  params.subject = contact.emailSubject.replace('[Inquiry Type]', humanise(values.inquiryType));
  params.to_name = 'Snehasmita Pradhan';
  return params;
}

/** Builds the plain-text corporate email used for the mailto fallback. */
export function buildEmailBody(values) {
  const rows = Object.keys(FIELD_LABELS).map((key) => {
    const value = key === 'inquiryType' ? humanise(values[key]) : values[key];
    return `${FIELD_LABELS[key]}: ${value || '—'}`;
  });

  return [
    'Hello Snehasmita,',
    '',
    'I reached out through your portfolio website.',
    '',
    ...rows,
    '',
    'Thank you,',
    values.name || '',
  ].join('\n');
}

export function buildMailtoUrl(values) {
  if (!contact.email) return null;
  const subject = contact.emailSubject.replace('[Inquiry Type]', humanise(values.inquiryType));
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    buildEmailBody(values),
  )}`;
}

/**
 * Sends the inquiry through EmailJS.
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
export async function sendInquiry(values) {
  if (!isEmailConfigured()) {
    return { ok: false, reason: 'not-configured' };
  }

  try {
    const { default: emailjs } = await import('@emailjs/browser');
    // `emailjs.send` accepts a plain template-params object, which is what
    // `buildEmailTemplateParams` produces. (The form is a controlled React
    // component rather than a real <form> element, so `sendForm` is not
    // usable here and would not serialise these values correctly.)
    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      buildEmailTemplateParams(values),
      { publicKey: emailConfig.publicKey },
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: 'send-failed', error };
  }
}

export { FIELD_LABELS, humanise };
