'use client';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import { hrCapabilities } from '@/data/hrSkills';

/**
 * "How I work with people" — the primary capability grid.
 *
 * Motion handles every interaction here (lift, glow, icon travel, border
 * response) because this is UI-level feedback rather than scroll cinema.
 */
export default function HRCapabilities() {
  return (
    <Section
      id="hr-capabilities"
      labelledBy="hr-capabilities-title"
      tone="people"
      withGlow
      className="border-t border-line"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="02"
            eyebrow="HR & Recruitment"
            title="How I work with"
            accent="people"
            size="large"
            className="max-w-2xl"
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Recruitment runs on process, but it is delivered through relationships. These are the
            capabilities I bring to every requirement I pick up.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hrCapabilities.map((capability, index) => (
            <GlowCard
              key={capability.id}
              data-cursor="explore"
              className="group flex flex-col gap-4 p-5"
              glowColor="var(--accent)"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="relative grid size-11 shrink-0 place-items-center rounded-[14px] border border-line bg-[color-mix(in_oklab,var(--surface-2)_80%,transparent)] text-accent transition-transform duration-500 ease-out group-hover/card:-translate-y-1 group-hover/card:scale-105">
                  <Icon name={capability.icon} className="size-5" />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]"
                  />
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-2/70 transition-colors duration-300 group-hover/card:text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[1.02rem] font-semibold tracking-tight text-text transition-transform duration-500 ease-out group-hover/card:translate-x-0.5">
                  {capability.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{capability.description}</p>
              </div>

              <span
                aria-hidden="true"
                className="mt-auto h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent/60 to-transparent transition-transform duration-500 ease-out group-hover/card:scale-x-100"
              />
            </GlowCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
