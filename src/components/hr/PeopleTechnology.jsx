'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { peopleTechnology } from '@/data/hrSkills';
import { profile } from '@/data/profile';

/**
 * PEOPLE × TECHNOLOGY — the core differentiator.
 *
 * Two ecosystems orbit a single shared core. A signal packet travels
 * repeatedly across the connection so the link itself feels alive.
 */
export default function PeopleTechnology() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-pt-line]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'expo.out',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      );

      gsap.to('[data-pt-packet]', {
        left: '92%',
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <Section
      id="people-technology"
      labelledBy="pt-title"
      tone="ecosystem"
      className="border-t border-line"
    >
      <div ref={rootRef} className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30} className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            index="05"
            eyebrow="The Differentiator"
            title="People"
            accent="× Technology"
            size="large"
            align="center"
            lead={peopleTechnology.statement}
            className="max-w-3xl"
          />
        </Reveal>

        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center lg:gap-8 xl:gap-10">
          {/* ---------------- PEOPLE ---------------- */}
          <EcosystemColumn
            side="left"
            title={peopleTechnology.people.label}
            description={peopleTechnology.people.description}
            items={peopleTechnology.people.items}
            accent="var(--accent)"
            className="order-1 lg:order-none"
          />

          {/* ---------------- CORE ---------------- */}
          <div className="relative order-3 grid place-items-center lg:order-none">
            <div className="relative grid size-40 place-items-center sm:size-48">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-dashed border-[color-mix(in_oklab,var(--accent)_30%,transparent)]"
                style={{ animation: 'sp-ring-spin 28s linear infinite' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full border border-[color-mix(in_oklab,var(--accent-2)_30%,transparent)]"
                style={{ animation: 'sp-ring-spin-reverse 20s linear infinite' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_62%)] blur-md"
              />
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <span className="font-display text-[clamp(0.95rem,2.2vw,1.15rem)] font-bold tracking-[0.08em] text-gradient-accent">
                  {profile.firstName.toUpperCase()}
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent via-accent-2 to-transparent" />
                <span className="text-[9.5px] tracking-[0.22em] text-muted uppercase">
                  The bridge
                </span>
              </div>
            </div>

            {/* travelling signal — desktop only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 lg:block"
            >
              <span
                data-pt-line
                className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[color-mix(in_oklab,var(--accent)_45%,transparent)] via-accent to-[color-mix(in_oklab,var(--accent-2)_45%,transparent)]"
              />
              <span
                data-pt-packet
                className="absolute -top-[3px] left-0 size-[7px] -translate-x-1/2 rounded-full bg-accent-2 shadow-[0_0_18px_4px_rgba(var(--accent-2-rgb),0.75)]"
              />
            </div>
          </div>

          {/* ---------------- TECHNOLOGY ---------------- */}
          <EcosystemColumn
            side="right"
            title={peopleTechnology.technology.label}
            description={peopleTechnology.technology.description}
            items={peopleTechnology.technology.items}
            accent="var(--accent-2)"
            className="order-2 lg:order-none"
          />
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function EcosystemColumn({ title, description, items, accent, className }) {
  const isLeft = title === 'People';

  return (
    <div className={className}>
      <Reveal
        y={26}
        className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--surface)_78%,transparent)] p-6 transition-colors duration-500 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))] md:p-8"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 size-52 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, ${accent} 20%, transparent), transparent 68%)`,
            [isLeft ? 'left' : 'right']: '-2rem',
          }}
        />

        <div className="relative flex items-center gap-3">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-full border"
            style={{
              borderColor: `color-mix(in oklab, ${accent} 40%, transparent)`,
              color: accent,
            }}
          >
            <Icon name={isLeft ? 'users' : 'cpu'} className="size-[18px]" />
          </span>
          <h3 className="font-display text-[1.35rem] font-bold tracking-tight md:text-[1.6rem]">
            {title}
          </h3>
        </div>

        <p className="relative mt-4 max-w-[42ch] text-[0.93rem] leading-relaxed text-muted">
          {description}
        </p>

        <ul className="relative mt-6 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.07, duration: 0.45 }}
            >
              <span className="inline-flex items-center rounded-full border border-line bg-bg/60 px-3 py-1.5 text-[11.5px] tracking-wide text-text-soft">
                <span
                  aria-hidden="true"
                  className="mr-2 size-1 rounded-full"
                  style={{ background: accent }}
                />
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
