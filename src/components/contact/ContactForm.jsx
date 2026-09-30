'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Send } from 'lucide-react';

import Icon from '@/components/ui/Icon';
import MagneticButton from '@/components/ui/MagneticButton';
import SocialButtons from '@/components/ui/SocialButtons';
import useReducedMotion from '@/hooks/useReducedMotion';
import { contact } from '@/data/contact';
import {
  EMAIL_FALLBACK_MESSAGE,
  buildMailtoUrl,
  isEmailConfigured,
  sendInquiry,
} from '@/lib/email';
import { buildMessageForInquiry, buildWhatsAppUrl } from '@/lib/whatsapp';
import { cn, isValidEmail } from '@/lib/utils';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  inquiryType: '',
  message: '',
};

const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  inquiryType: 'Inquiry Type',
  message: 'Message',
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email.';
  else if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.inquiryType) errors.inquiryType = 'Please choose an inquiry type.';
  if (!values.message.trim()) errors.message = 'Please add a short message.';
  else if (values.message.trim().length < 12) errors.message = 'A little more detail would help.';
  return errors;
}

/**
 * Contact form.
 *
 * Front-end only. When EmailJS credentials are present the form sends
 * through EmailJS; otherwise it clearly says so and offers a WhatsApp or
 * mailto fallback using the same corporate template. It never crashes and
 * never silently pretends to have sent anything.
 */
export default function ContactForm() {
  const reduced = useReducedMotion();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState('');
  const [touched, setTouched] = useState(false);

  const emailReady = isEmailConfigured();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (touched) {
      setErrors((current) => ({ ...current, [name]: validate({ ...values, [name]: value })[name] }));
    }
  };

  const handleBlur = (event) => {
    setTouched(true);
    const { name } = event.target;
    setErrors((current) => ({ ...current, [name]: validate(values)[name] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      setNotice('Please fix the highlighted fields and try again.');
      const firstField = Object.keys(found)[0];
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    setStatus('sending');
    setNotice('');

    const result = await sendInquiry(values);

    if (result.ok) {
      setStatus('success');
      setNotice('Thank you — your message has been sent. I will get back to you shortly.');
      setValues(EMPTY);
      setTouched(false);
      return;
    }

    setStatus('error');
    setNotice(
      result.reason === 'not-configured'
        ? EMAIL_FALLBACK_MESSAGE
        : 'The message could not be sent just now. Please use WhatsApp or email below.',
    );
  };

  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp.number,
    buildMessageForInquiry(values.inquiryType, values.name || null),
  );
  const mailtoHref = buildMailtoUrl(values);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--bg-elevated)_80%,transparent)] p-5 shadow-[var(--shadow-card)] md:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[1.25rem] font-bold tracking-tight">Send a message</h3>
        <p className="text-[13px] text-muted">
          {emailReady
            ? 'Fill this in and it will land directly in my inbox.'
            : 'The form is ready — add EmailJS credentials to enable direct delivery.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="contact-name"
          name="name"
          label="Name"
          value={values.name}
          error={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          required
        />
        <Field
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          required
        />
        <Field
          id="contact-phone"
          name="phone"
          type="tel"
          label="Phone"
          value={values.phone}
          error={errors.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="tel"
        />
        <Field
          id="contact-company"
          name="company"
          label="Company"
          value={values.company}
          error={errors.company}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="organization"
        />
      </div>

      {/* inquiry type */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-1 text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
          Inquiry Type
        </legend>
        <div className="flex flex-wrap gap-2">
          {contact.inquiryTypes.map((type) => {
            const isActive = values.inquiryType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                id={type.value === contact.inquiryTypes[0].value ? 'contact-inquiryType' : undefined}
                aria-pressed={isActive}
                onClick={() => {
                  setValues((current) => ({ ...current, inquiryType: type.value }));
                  setErrors((current) => ({ ...current, inquiryType: undefined }));
                }}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[12px] font-medium tracking-wide transition-all duration-300',
                  isActive
                    ? 'border-accent bg-accent/12 text-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_10%,transparent)]'
                    : 'border-line text-muted hover:border-accent/50 hover:text-text',
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>
        {errors.inquiryType && (
          <p role="alert" className="flex items-center gap-1.5 text-[12px] text-accent-4">
            <Icon name="scan" className="size-3.5" />
            {errors.inquiryType}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell me a little about the role, the project or what you need support with."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={cn(
            'w-full resize-y rounded-[var(--radius-sm)] border bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-[14px] text-text transition-colors duration-300 placeholder:text-muted-2/70 focus:border-accent focus:outline-none',
            errors.message ? 'border-accent-4' : 'border-line',
          )}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="flex items-center gap-1.5 text-[12px] text-accent-4">
            <Icon name="scan" className="size-3.5" />
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <MagneticButton type="submit" variant="primary" size="md" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <span
                  className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Sending
              </>
            ) : (
              <>
                <Send className="size-4" strokeWidth={1.8} />
                Send Message
              </>
            )}
          </MagneticButton>

          {whatsappHref && (
            <MagneticButton as="a" href={whatsappHref} target="_blank" rel="noreferrer noopener" variant="whatsapp" size="md">
              <Icon name="whatsapp" className="size-4" />
              Chat on WhatsApp
            </MagneticButton>
          )}

          {mailtoHref && (
            <MagneticButton as="a" href={mailtoHref} variant="ghost" size="md">
              <Icon name="message" className="size-4" />
              Use email app
            </MagneticButton>
          )}
        </div>

        <AnimatePresence mode="wait">
          {notice && (
            <motion.p
              key={notice}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              role="status"
              className={cn(
                'flex items-start gap-2 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-[12.5px] leading-relaxed',
                status === 'success'
                  ? 'border-[color-mix(in_oklab,var(--accent-2)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_8%,transparent)] text-text-soft'
                  : 'border-[color-mix(in_oklab,var(--accent-4)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent-4)_8%,transparent)] text-text-soft',
              )}
            >
              <Icon
                name={status === 'success' ? 'check' : 'scan'}
                className={cn('mt-0.5 size-3.5 shrink-0', status === 'success' ? 'text-accent-2' : 'text-accent-4')}
              />
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <SocialButtons variant="icons" exclude={['whatsapp']} />
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function Field({ id, name, label, error, required, className, ...props }) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cn(
          'h-12 w-full rounded-[var(--radius-sm)] border bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 text-[14px] text-text transition-colors duration-300 placeholder:text-muted-2/70 focus:border-accent focus:outline-none',
          error ? 'border-accent-4' : 'border-line',
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-[12px] text-accent-4">
          <Icon name="scan" className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export { FIELD_LABELS };
