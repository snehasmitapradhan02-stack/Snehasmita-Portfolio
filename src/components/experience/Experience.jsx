'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Tag from '@/components/ui/Tag';
import Icon from '@/components/ui/Icon';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { experience } from '@/data/experience';

/**
 * Experience — an animated career timeline.
 *
 * A continuous rail is drawn with ScrollTrigger scrub while each role
 * activates in turn. Deliberately compact so it never competes with the
 * recruitment chapters.
 */
export default function Experience() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-exp-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: '[data-exp-list]', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
        },
      );

      gsap.utils.toArray('[data-exp-card]').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          },
        );
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <Section
      id="experience"
      labelledBy="experience-title"
      tone="career"
      className="border-t border-line bg-[color-mix(in_oklab,var(--surface)_40%,transparent)]"
    >
      <div ref={rootRef} className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="07"
            eyebrow="Experience"
            title="Where I've"
            accent="worked"
            size="large"
            className="max-w-2xl"
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
            A current HR consulting role, alongside an internship building full-stack
            applications and client front-end work in healthcare. Dates are reproduced
            exactly as listed in the resume, except the current role, which is taken
            from the public LinkedIn profile.
          </p>
        </Reveal>

        <ol data-exp-list className="relative flex flex-col gap-8 pl-8 md:pl-12">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[11px]"
          >
            <span
              data-exp-fill
              className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-accent via-accent-2 to-transparent"
            />
          </span>

          {experience.map((item, index) => (
            <li key={item.id} data-exp-card className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-1.5 grid size-4 place-items-center rounded-full border-2 border-accent bg-bg md:-left-12 md:size-6"
              >
                <span className="size-1.5 rounded-full bg-accent md:size-2" />
              </span>

              <ExperienceCard item={item} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function ExperienceCard({ item, index }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.article
      layout
      className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--bg-elevated)_80%,transparent)] p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--line))] md:p-7"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[10px] tracking-[0.24em] text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Tag tone="accent">{item.type}</Tag>
            {item.datesNeedReview && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--accent-4)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent-4)_10%,transparent)] px-2.5 py-1 text-[10px] tracking-[0.14em] text-accent-4 uppercase"
                title={item.datesNote}
              >
                <Icon name="scan" className="size-3" />
                Dates need review
              </span>
            )}
          </div>

          <h3 className="font-display text-[clamp(1.25rem,2.6vw,1.65rem)] font-bold tracking-tight text-text">
            {item.role}
          </h3>
          <p className="flex items-center gap-2 text-[14px] text-text-soft">
            <span className="size-1.5 rounded-full bg-accent-2" aria-hidden="true" />
            {item.company}
          </p>
          {item.companyNote && (
            <p className="max-w-[52ch] text-[11.5px] leading-relaxed text-muted-2 italic">
              {item.companyNote}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-1.5 md:items-end">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-muted">
            {item.dates}
          </span>
          {item.location && <span className="text-[11.5px] text-muted-2">{item.location}</span>}
        </div>
      </div>

      {item.stack.length > 0 && (
        <div className="relative mt-6 flex flex-wrap gap-2">
          {item.stack.map((tech) => (
            <Tag key={tech} tone="muted" mono>
              {tech}
            </Tag>
          ))}
        </div>
      )}

      <div className="relative mt-6 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-[11px] tracking-[0.24em] text-muted uppercase transition-colors duration-300 hover:text-accent"
        >
          Responsibilities
          <span
            aria-hidden="true"
            className={`grid size-6 place-items-center rounded-full border border-line transition-transform duration-400 ${open ? 'rotate-45' : ''}`}
          >
            <Icon name="plus" className="size-3" />
          </span>
        </button>

        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <ul className="grid gap-2.5 pt-5 sm:grid-cols-2">
            {item.responsibilities.map((responsibility) => (
              <li
                key={responsibility}
                className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted"
              >
                <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-accent/70" />
                {responsibility}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.article>
  );
}
