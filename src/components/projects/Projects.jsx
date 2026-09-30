'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';

import ProjectScroller from './ProjectScroller';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { projectGroups, projects } from '@/data/projects';

/**
 * Projects — supporting both client/business platforms and full-stack builds.
 * Counts are real (derived from the data), never invented metrics.
 */
export default function Projects() {
  const [group, setGroup] = useState('all');

  const visible = useMemo(
    () => (group === 'all' ? projects : projects.filter((project) => project.kind === group)),
    [group],
  );

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      data-section="projects"
      data-tone="work"
      className="relative isolate scroll-mt-24 border-t border-line"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--surface)_45%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]"
      />

      <div className="container-x pt-[3.25rem] pb-7 sm:pt-8 md:pt-9 lg:pt-11">
        <Reveal y={30} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="10"
            eyebrow="Selected Work"
            title="Projects built"
            accent="with real people"
            size="large"
            className="max-w-2xl"
          />

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div
              role="tablist"
              aria-label="Filter projects"
              className="flex flex-wrap gap-1.5 rounded-full border border-line bg-surface/50 p-1.5"
            >
              {projectGroups.map((item) => {
                const count = projects.filter((project) =>
                  item.id === 'all' ? true : project.kind === item.id,
                ).length;
                const isActive = group === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setGroup(item.id)}
                    className="relative rounded-full px-3.5 py-1.5 text-[11.5px] font-medium tracking-wide whitespace-nowrap text-muted transition-colors duration-300 hover:text-text"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="project-filter"
                        className="absolute inset-0 rounded-full bg-accent/12 ring-1 ring-accent/40"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-accent' : ''}`}>
                      {item.label}
                      <span className="ml-1.5 font-mono text-[9.5px] text-muted-2">{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11.5px] tracking-[0.18em] text-muted-2 uppercase">
              Scroll to explore &nbsp;·&nbsp; {visible.length} projects
            </p>
          </div>
        </Reveal>
      </div>

      <ProjectScroller projects={visible} className="pb-[3.5rem] md:pb-[4.5rem]" />
    </section>
  );
}
