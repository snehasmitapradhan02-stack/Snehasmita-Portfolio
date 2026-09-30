'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import useMediaQuery from '@/hooks/useMediaQuery';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { recruitmentPipeline } from '@/data/hrSkills';

/**
 * The recruitment workflow.
 *
 * A pinned rail on desktop: as the visitor scrolls, each stage activates and
 * a glowing "candidate packet" travels down the pipeline. On mobile the same
 * content degrades to a simple vertical timeline with no pin and no scrub.
 */
export default function RecruitmentWorkflow() {
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const active = recruitmentPipeline[activeIndex];

  useEffect(() => {
    if (!isDesktop) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      const stages = gsap.utils.toArray('[data-stage]');

      stages.forEach((stage, index) => {
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index);
          },
        });
      });

      if (!reduced && railRef.current) {
        gsap.fromTo(
          '[data-rail-fill]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: '[data-stage-list]',
              start: 'top 62%',
              end: 'bottom 62%',
              scrub: 0.4,
            },
          },
        );
      }
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [isDesktop, reduced]);

  return (
    <Section
      id="workflow"
      labelledBy="workflow-title"
      tone="pipeline"
      className="border-t border-line bg-[color-mix(in_oklab,var(--surface)_45%,transparent)]"
    >
      <div ref={rootRef} className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30}>
          <SectionHeading
            index="03"
            eyebrow="Recruitment Workflow"
            title="From requirement"
            accent="to onboarding"
            size="large"
            lead="A predictable process — the same eight stages on every search, so nothing falls through and nobody is left wondering what happens next."
            className="max-w-3xl"
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* ---------------- pipeline rail ---------------- */}
          <div className="relative">
            <div
              ref={railRef}
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[11px] w-px bg-line md:left-[15px]"
            >
              <span
                data-rail-fill
                className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-accent via-accent-2 to-accent-3"
              />
              <motion.span
                aria-hidden="true"
                className="absolute -left-[3px] size-[7px] -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-2)_18%,transparent),0_0_22px_4px_rgba(var(--accent-2-rgb),0.8)]"
                initial={false}
                animate={{ top: `${(activeIndex / (recruitmentPipeline.length - 1)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 22 }}
              />
            </div>

            <ol data-stage-list className="flex flex-col gap-1">
              {recruitmentPipeline.map((stage, index) => {
                const isActive = index === activeIndex;
                const isDone = index < activeIndex;
                return (
                  <li key={stage.id} data-stage className="relative pl-10 md:pl-14">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-current={isActive ? 'step' : undefined}
                      className="group flex w-full flex-col gap-1 rounded-[var(--radius-sm)] py-3 text-left transition-colors duration-300 hover:bg-surface/40"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[9px] transition-all duration-500 md:size-8 md:text-[10px] ${
                            isActive
                              ? 'border-accent bg-accent text-on-accent shadow-[0_0_0_5px_color-mix(in_oklab,var(--accent)_14%,transparent)]'
                              : isDone
                                ? 'border-[color-mix(in_oklab,var(--accent-2)_50%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_12%,transparent)] text-accent-2'
                                : 'border-line bg-bg text-muted-2'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span
                          className={`font-display text-[1.05rem] font-semibold tracking-tight transition-colors duration-400 md:text-[1.2rem] ${
                            isActive ? 'text-text' : isDone ? 'text-text-soft' : 'text-muted'
                          }`}
                        >
                          {stage.title}
                        </span>
                      </span>
                      <span
                        className={`max-w-[46ch] text-[13px] leading-relaxed transition-colors duration-400 ${
                          isActive ? 'text-muted' : 'text-muted-2 lg:opacity-0 lg:group-hover:opacity-100'
                        }`}
                      >
                        {stage.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ---------------- active stage detail ---------------- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] p-6 shadow-[var(--shadow-card)] md:p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_62%)] blur-2xl"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
                />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] tracking-[0.3em] text-accent">
                    STAGE {active.step}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-muted-2">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(recruitmentPipeline.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="relative mt-5 font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold tracking-tight">
                  {active.title}
                </h3>
                <p className="relative mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">
                  {active.description}
                </p>

                <ul className="relative mt-7 flex flex-col gap-3 border-t border-line pt-6">
                  {active.detail.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                      className="flex items-start gap-3 text-[13.5px] text-text-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-2"
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div className="relative mt-7 flex items-center gap-1.5" aria-hidden="true">
                  {recruitmentPipeline.map((stage, index) => (
                    <span
                      key={stage.id}
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                        index === activeIndex ? 'bg-accent' : 'bg-line'
                      }`}
                    />
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
