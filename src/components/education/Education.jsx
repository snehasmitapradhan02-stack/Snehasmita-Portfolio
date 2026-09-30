'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Tag from '@/components/ui/Tag';
import Icon from '@/components/ui/Icon';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { education } from '@/data/education';

/**
 * Education — a clean animated timeline.
 * Institution, dates and status come straight from `src/data/education.js`.
 */
export default function Education() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-edu-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: '[data-edu-list]', start: 'top 72%', end: 'bottom 72%', scrub: 0.4 },
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
      id="education"
      labelledBy="education-title"
      tone="education"
      withGrid
      className="border-t border-line"
    >
      <div ref={rootRef} className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30}>
          <SectionHeading
            index="08"
            eyebrow="Education"
            title="Academic"
            accent="foundation"
            lead="Computer science and computer application studies — the base the technical work is built on."
            className="max-w-2xl"
          />
        </Reveal>

        <ol data-edu-list className="relative flex flex-col gap-6 pl-8 md:pl-12">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[7px] w-px bg-line md:left-[11px]"
          >
            <span
              data-edu-fill
              className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-accent-2 via-accent to-transparent"
            />
          </span>

          {education.map((item, index) => (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-6 grid size-4 place-items-center rounded-full border-2 border-accent-2 bg-bg md:-left-12 md:size-6"
              >
                <span className="size-1.5 rounded-full bg-accent-2 md:size-2" />
              </span>

              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-[color-mix(in_oklab,var(--bg-elevated)_70%,transparent)] p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent-2)_45%,var(--line))] md:p-7"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <Icon name="graduation" className="size-4 text-accent-2" />
                      <span className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">
                        {item.shortDegree}
                      </span>
                    </div>
                    <h3 className="font-display text-[clamp(1.15rem,2.4vw,1.5rem)] font-bold tracking-tight text-text">
                      {item.degree}
                    </h3>
                    <p className="text-[14px] text-text-soft">{item.institution}</p>
                    <p className="text-[12px] text-muted">{item.location}</p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                    <Tag tone="cyan" mono>
                      {item.dates}
                    </Tag>
                    <Tag tone={item.status === 'Completed' ? 'accent' : 'muted'}>
                      {item.status}
                    </Tag>
                  </div>
                </div>

                <p className="mt-5 max-w-[62ch] border-t border-line pt-5 text-[13.5px] leading-relaxed text-muted">
                  {item.detail}
                </p>

                {item.statusNeedsReview && (
                  <p className="mt-4 inline-flex items-center gap-2 text-[11px] text-accent-4">
                    <Icon name="scan" className="size-3.5" />
                    Final status to be confirmed.
                  </p>
                )}
              </motion.article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
