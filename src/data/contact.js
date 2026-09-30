/**
 * Contact configuration.
 *
 * Every channel that is still unconfirmed stays in a clearly-marked
 * "not configured" state, so the UI never links to a fake profile.
 *
 * To configure, either edit the fallbacks below or add the matching
 * NEXT_PUBLIC_* variable to `.env.local` (see `.env.example`).
 */

const env = process.env;

const read = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Contact details supplied by the owner. Each one can still be overridden with
 * the matching NEXT_PUBLIC_* variable in `.env.local` (see `.env.example`);
 * the values below are the fallbacks that ship with the site.
 */
const EMAIL = read(env.NEXT_PUBLIC_CONTACT_EMAIL) || 'snehasmitapradhan02@gmail.com';
const PHONE = read(env.NEXT_PUBLIC_CONTACT_PHONE);
/** WhatsApp needs the country code and digits only — +91 7896541230 → 917896541230. */
const WHATSAPP = read(env.NEXT_PUBLIC_WHATSAPP_NUMBER) || '917896541230';

/**
 * SINGLE SOURCE OF TRUTH for every social link in the portfolio.
 *
 * The hero, footer and contact sections all read from here, so a URL is
 * never hard-coded in more than one place. Each value can still be
 * overridden with the matching NEXT_PUBLIC_* variable.
 */
export const socialLinks = {
  linkedin:
    read(env.NEXT_PUBLIC_LINKEDIN_URL) || 'https://www.linkedin.com/in/snehasmita-pradhan-1481aa39b/',
  instagram:
    read(env.NEXT_PUBLIC_INSTAGRAM_URL) || 'https://www.instagram.com/aahens_._/',
  // TODO: VERIFY DATA — no confirmed GitHub profile yet. This is a safe
  // placeholder that keeps the button clickable and visible. Replace the
  // string below (or set NEXT_PUBLIC_GITHUB_URL) with the real profile URL.
  github: read(env.NEXT_PUBLIC_GITHUB_URL) || 'https://github.com/',
};

export const contact = {
  email: EMAIL,
  /** Display-only phone, e.g. `+91 98XX XXX XXX`. */
  phone: PHONE,
  phoneDisplay: PHONE || 'Bhubaneswar, Odisha',
  location: 'Bhubaneswar, Odisha',
  emailSubject: 'New Portfolio Inquiry — [Inquiry Type]',

  availability: {
    label: 'Open to',
    /**
     * TODO: VERIFY DATA — replace with the owner's confirmed availability
     * wording before launch. Empty on purpose: nothing is invented. While it
     * is empty the UI falls back to `profile.tagline` (a positioning
     * statement) instead of asserting an unconfirmed availability.
     */
    value: '',
  },

  /**
   * WhatsApp deep link.
   * Number must be digits only, country code included, no "+" or spaces.
   */
  whatsapp: {
    number: WHATSAPP,
    /** Default message used anywhere a plain WhatsApp CTA appears. */
    defaultMessage:
      "Hello Snehasmita, I came across your portfolio and would like to discuss a recruitment/project opportunity.",
    /** Slightly different copy for the hero CTA. */
    heroMessage:
      "Hello Snehasmita, I came across your portfolio and would like to discuss a recruitment/project opportunity.",
  },

  social: {
    linkedin: { label: 'LinkedIn', url: socialLinks.linkedin, handle: 'LinkedIn' },
    github: { label: 'GitHub', url: socialLinks.github, handle: 'GitHub' },
    instagram: { label: 'Instagram', url: socialLinks.instagram, handle: 'Instagram' },
    email: { label: 'Email', address: EMAIL },
    whatsapp: { label: 'WhatsApp', number: WHATSAPP },
  },

  /** The inquiry types offered in the contact form. */
  inquiryTypes: [
    { value: 'hiring', label: 'Hiring', blurb: 'A role you need filled.' },
    { value: 'recruitment', label: 'Recruitment', blurb: 'Recruitment or coordination support.' },
    { value: 'technical-project', label: 'Technical Project', blurb: 'A website or application to build.' },
    { value: 'collaboration', label: 'Collaboration', blurb: 'Working together on something.' },
    { value: 'general', label: 'General Inquiry', blurb: 'Anything else.' },
  ],

  /** Contact rail items rendered on the left of the contact section. */
  channels: [
    { id: 'email', label: 'Email', detail: EMAIL, kind: 'email' },
    { id: 'whatsapp', label: 'WhatsApp', detail: 'Direct message', kind: 'whatsapp' },
    { id: 'linkedin', label: 'LinkedIn', detail: 'Professional profile', kind: 'linkedin' },
    { id: 'github', label: 'GitHub', detail: 'Code & projects', kind: 'github' },
  ],
};

export default contact;
