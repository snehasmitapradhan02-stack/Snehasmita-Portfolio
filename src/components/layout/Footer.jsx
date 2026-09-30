'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import SocialButtons from '@/components/ui/SocialButtons';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { navigation } from '@/data/navigation';
import { profile } from '@/data/profile';
import { contact } from '@/data/contact';

const year = new Date().getFullYear();

/**
 * Cinematic footer: moving grid, gradient glow, particle drift, an animated
 * rule and a final large wordmark. Compact by design — a footer should close
 * the page, not compete with it.
 */
export default function Footer() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-footer-word] > span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 88%', once: true },
        },
      );

      gsap.fromTo(
        '[data-footer-grid]',
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );

      gsap.to('[data-footer-glow]', {
        xPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <footer
      ref={rootRef}
      className="relative isolate overflow-hidden border-t border-line bg-bg-elevated"
      aria-label="Site footer"
    >
      {/* ---- background system ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          data-footer-grid
          className="absolute inset-x-0 -top-[12%] h-[124%] grid-surface opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
        <div
          data-footer-glow
          className="absolute -bottom-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_62%)] blur-3xl"
        />
        <div className="absolute -top-32 right-[12%] size-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_14%,transparent),transparent_66%)] blur-3xl" />
        <div className="absolute inset-0 dotted-surface opacity-40" />
      </div>

      <div className="container-x relative py-11 md:py-14">
        <div className="flex flex-col gap-8 md:gap-9">
          {/* ---- CTA row ---- */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.3em] text-muted-2 uppercase">
                {contact.availability.value
                  ? contact.availability.label
                  : profile.tagline}
              </span>
              {contact.availability.value && (
                <p className="max-w-[26ch] font-display text-[clamp(1.5rem,4vw,2.35rem)] font-bold tracking-tight text-text">
                  {contact.availability.value}
                </p>
              )}
            </div>
            {/* Instagram is surfaced in the hero only, so the footer row stays as designed. */}
            <SocialButtons
              variant="chips"
              exclude={["instagram"]}
              className="w-full md:w-auto md:max-w-[42rem] md:flex-1"
            />
          </div>

          {/* ---- nav ---- */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-8"
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group relative text-[11px] font-medium tracking-[0.2em] text-muted uppercase transition-colors duration-300 hover:text-text"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-400 group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          {/* ---- wordmark ---- */}
          <div data-footer-word className="overflow-hidden">
            <p
              aria-hidden="true"
              className="flex flex-wrap font-display text-[clamp(2rem,10vw,6.5rem)] leading-[0.88] font-extrabold tracking-[-0.045em] text-transparent"
              style={{
                WebkitTextStroke:
                  "1px color-mix(in oklab, var(--text) 18%, transparent)",
              }}
            >
              <span className="block overflow-hidden">
                <span className="block">{profile.firstName.toUpperCase()}</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block text-gradient-accent">
                  {profile.lastName.toUpperCase()}
                </span>
              </span>
            </p>
          </div>

          {/* ---- base line ---- */}
          <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[1rem] text-muted-2">
              © {year} {profile.fullName}. {profile.primaryRole} &nbsp;|&nbsp;{" "}
              {profile.secondaryRole}.
            </p>
            <p className="text-[1rem] text-gray-200">
              Designed and Developed By :{" "}
              <a
                href="https://www.linkedin.com/in/bibhuprasad-mahapatra-a9a896282/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-accent-4"
              >
                Bibhuprasad Mahapatra
              </a>
            </p>
            <p className="flex items-center gap-2 text-[1rem] text-muted">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-2 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-2" />
              </span>
              {profile.location.label}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </footer>
  );
}
