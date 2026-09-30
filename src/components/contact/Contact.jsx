'use client';

import { useEffect, useRef } from 'react';

import ContactForm from './ContactForm';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import SocialButtons from '@/components/ui/SocialButtons';
import Icon from '@/components/ui/Icon';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { contact } from '@/data/contact';
import { profile } from '@/data/profile';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const CHANNEL_ICON = {
  email: 'message',
  whatsapp: 'whatsapp',
  linkedin: 'linkedin',
  github: 'github',
};

/**
 * LET'S CONNECT — the communication hub.
 * Contact channels on the left, the working form on the right.
 */
export default function Contact() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const whatsappHref = buildWhatsAppUrl(contact.whatsapp.number, contact.whatsapp.defaultMessage);

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-contact-pulse]',
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 68%', once: true },
        },
      );
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <Section
      id="contact"
      labelledBy="contact-title"
      tone="contact"
      withGlow
      className="border-t border-line"
    >
      <div ref={rootRef} className="flex flex-col gap-8 md:gap-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
          <Reveal y={30}>
            <SectionHeading
              index="11"
              eyebrow="Contact"
              title="Let's"
              accent="connect"
              size="large"
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal y={24}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted lg:pb-2">
              Looking for the right talent, recruitment support, technical collaboration or a
              digital project? Pick whichever fits and I will get back to you.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
          {/* ---------------- channels ---------------- */}
          <Reveal y={26} className="flex flex-col gap-6">
            <ul className="flex flex-col gap-2.5">
              {contact.channels.map((channel) => {
                const detail =
                  channel.kind === 'email'
                    ? contact.email || 'Add your email in src/data/contact.js'
                    : channel.kind === 'whatsapp'
                      ? contact.whatsapp.number
                        ? `+${contact.whatsapp.number}`
                        : 'Add your number in src/data/contact.js'
                      : channel.kind === 'linkedin'
                        ? contact.social.linkedin.url
                          ? 'Professional profile'
                          : 'Add your LinkedIn URL in src/data/contact.js'
                        : contact.social.github.url
                          ? 'Code & projects'
                          : 'Add your GitHub URL in src/data/contact.js';

                const configured =
                  channel.kind === 'email'
                    ? Boolean(contact.email)
                    : channel.kind === 'whatsapp'
                      ? Boolean(whatsappHref)
                      : channel.kind === 'linkedin'
                        ? Boolean(contact.social.linkedin.url)
                        : Boolean(contact.social.github.url);

                return (
                  <li
                    key={channel.id}
                    className="group flex items-center gap-4 rounded-[var(--radius-sm)] border border-line bg-surface/50 px-4 py-3.5 transition-all duration-400 hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--line))] hover:bg-surface"
                  >
                    <span
                      data-contact-pulse
                      className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-line bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] text-accent"
                    >
                      <Icon name={CHANNEL_ICON[channel.id]} className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[13.5px] font-medium text-text">{channel.label}</span>
                      <span
                        className={`truncate text-[11.5px] ${configured ? 'text-muted' : 'text-accent-4/80 italic'}`}
                      >
                        {detail}
                      </span>
                    </span>
                    {!configured && (
                      <span className="size-1.5 shrink-0 rounded-full bg-accent-4" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 rounded-[var(--radius-sm)] border border-line bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-4">
              <span className="text-[10px] tracking-[0.28em] text-muted-2 uppercase">
                {contact.availability.value ? contact.availability.label : profile.tagline}
              </span>
              {contact.availability.value && (
                <p className="text-[14px] leading-relaxed text-text-soft">
                  {contact.availability.value}
                </p>
              )}
              <p className="mt-1 text-[12.5px] text-muted">
                Based in {profile.location.label}, {profile.location.country}.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] tracking-[0.28em] text-muted-2 uppercase">Elsewhere</span>
              <SocialButtons />
            </div>
          </Reveal>

          {/* ---------------- form ---------------- */}
          <Reveal y={26} delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
