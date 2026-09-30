'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import TechNetwork from './TechNetwork';
import { techCapabilities, techStack } from '@/data/techStack';

const GROUPS = ['All', 'Frontend', 'Backend', 'Database', 'Framework', 'Mobile', 'Tooling', 'Language'];

/**
 * TECHNICAL FOUNDATION.
 *
 * Intentionally quieter than the HR chapters — technology is the supporting
 * strength, so this section is compact, precise and never outshines the
 * recruitment work.
 */
export default function TechStackSection() {
  const [group, setGroup] = useState('All');
  const visible = group === 'All' ? techStack : techStack.filter((tech) => tech.group === group);

  return (
    <Section
      id="tech-stack"
      labelledBy="tech-stack-title"
      tone="technology"
      withGrid
      withGlow
      className="border-t border-line"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <Reveal y={30}>
            <SectionHeading
              index="06"
              eyebrow="Technical Foundation"
              title="Technology that"
              accent="supports the work"
              size="large"
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal y={24}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted lg:pb-2">
              This is not a secondary career — it is the layer that lets me read a requirement
              properly, understand what an engineering team needs, and screen for the right skills
              without guessing.
            </p>
          </Reveal>
        </div>

        {/* technology network */}
        <Reveal y={30} className="mt-4">
          <TechNetwork />
        </Reveal>

        {/* capability chips */}
        <Reveal y={20} className="flex flex-wrap gap-2.5">
          {techCapabilities.map((capability) => (
            <span
              key={capability.id}
              className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-[12.5px] text-text-soft transition-colors duration-300 hover:border-accent/50 hover:text-text"
            >
              <Icon name={capability.icon} className="size-3.5 text-accent" />
              {capability.label}
            </span>
          ))}
        </Reveal>

        {/* filter row */}
        <Reveal y={18}>
          <div
            role="tablist"
            aria-label="Filter technologies by group"
            className="flex flex-wrap gap-1.5 rounded-full border border-line bg-surface/50 p-1.5"
          >
            {GROUPS.map((item) => {
              const isActive = group === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setGroup(item)}
                  className="relative rounded-full px-3.5 py-1.5 text-[11.5px] font-medium tracking-wide text-muted transition-colors duration-300 hover:text-text"
                >
                  {isActive && (
                    <motion.span
                      layoutId="tech-filter"
                      className="absolute inset-0 rounded-full bg-accent/12 ring-1 ring-accent/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-accent' : ''}`}>{item}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* grid */}
        <motion.ul layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((tech) => (
              <motion.li
                key={tech.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="explore"
                className="group relative overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface/50 p-4 transition-[transform,border-color] duration-400 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent-2)_45%,var(--line))]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle, color-mix(in oklab, var(--accent-2) 24%, transparent), transparent 70%)',
                  }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-display text-[0.95rem] font-semibold tracking-tight text-text">
                    {tech.name}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted-2 uppercase">
                    {tech.level}
                  </span>
                </div>
                <p className="relative mt-2 text-[12.5px] leading-relaxed text-muted">{tech.blurb}</p>
                <div className="relative mt-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[9.5px] tracking-[0.2em] text-accent-2 uppercase">
                    {tech.group}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </Section>
  );
}
