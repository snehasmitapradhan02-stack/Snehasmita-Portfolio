'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Tag from '@/components/ui/Tag';
import { hrCapabilities, hrSoftSkills } from '@/data/hrSkills';
import { roundTo } from '@/lib/utils';

/**
 * HR & Recruitment skills.
 *
 * Visual rule: HR dominates. The ring is sized and weighted so that no
 * technical section can read as more important than this one.
 */
export default function HRSkills() {
  const [activeSkill, setActiveSkill] = useState(hrCapabilities[0]?.title ?? '');

  const coreSkills = useMemo(() => hrCapabilities.map((capability) => capability.title), []);

  /**
   * The orbit list is fixed. Hovering a node only changes which skill is
   * highlighted — it never re-sorts or re-sizes the ring, which would make
   * the nodes jump around under the pointer and desync the active index.
   */
  const orbitSkills = useMemo(() => {
    const seen = new Set();
    return [...coreSkills, ...hrSoftSkills.map((skill) => skill.label)].filter((skill) => {
      if (seen.has(skill)) return false;
      seen.add(skill);
      return true;
    });
  }, [coreSkills]);

  const activeIndex = Math.max(0, orbitSkills.indexOf(activeSkill));

  return (
    <Section
      id="hr-skills"
      labelledBy="hr-skills-title"
      tone="skills"
      withGrid
      className="border-t border-line"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30}>
          <SectionHeading
            index="04"
            eyebrow="HR Skill Set"
            title="Recruitment,"
            accent="covered end to end"
            size="large"
            lead="From the first requirement call to the follow-up after an offer — sourcing, screening, coordination and the communication that keeps it all moving."
            className="max-w-3xl"
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12">
          {/* orbiting skill constellation */}
          <div className="relative order-2 lg:order-1">
            <SkillOrbit
              skills={orbitSkills}
              activeIndex={activeIndex}
              onHover={(index) => {
                if (index !== null) setActiveSkill(orbitSkills[index]);
              }}
            />
          </div>

          {/* list */}
          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <Reveal y={22} className="flex flex-col gap-1">
              {coreSkills.map((title, index) => {
                const capability = hrCapabilities[index];
                const isActive = activeSkill === title;
                return (
                  <button
                    key={capability.id}
                    type="button"
                    onMouseEnter={() => setActiveSkill(title)}
                    onFocus={() => setActiveSkill(title)}
                    className="group flex items-center gap-4 border-b border-line py-3.5 text-left transition-colors duration-300 last:border-b-0"
                    aria-pressed={isActive}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
                        isActive ? 'text-accent' : 'text-muted-2'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-display text-[1.05rem] font-semibold tracking-tight transition-all duration-400 ${
                        isActive ? 'translate-x-1.5 text-text' : 'text-muted group-hover:text-text-soft'
                      }`}
                    >
                      {title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px transition-all duration-500 ${
                        isActive ? 'w-12 bg-accent' : 'w-4 bg-line-strong group-hover:w-8'
                      }`}
                    />
                  </button>
                );
              })}
            </Reveal>

            <Reveal y={18} className="flex flex-wrap gap-2">
              {hrSoftSkills.map((skill) => (
                <Tag key={skill.id} tone="cyan">
                  {skill.label}
                </Tag>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

const RING = [
  { radiusPct: 44, duration: 46 },
  { radiusPct: 33, duration: 34 },
  { radiusPct: 22, duration: 26 },
];

const RADII = [44, 33, 22, 38, 26, 40, 30, 20, 36, 42, 24, 34, 18, 39, 28];

function SkillOrbit({ skills, activeIndex, onHover }) {
  const ref = useRef(null);
  const [size, setSize] = useState(360);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.min(entry.contentRect.width, 460));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[30rem]">
      {/* rings */}
      {RING.map((ring, ringIndex) => (
        <div
          key={ring.radiusPct}
          aria-hidden="true"
          className="absolute rounded-full border border-dashed border-line"
          style={{
            inset: `${(100 - ring.radiusPct * 2) / 2}%`,
            animation: `sp-ring-spin ${ring.duration}s linear infinite ${
              ringIndex % 2 ? 'reverse' : 'normal'
            }`,
            transformOrigin: 'center',
          }}
        />
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_66%)] blur-xl"
      />

      {/* core */}
      <div className="absolute inset-[34%] grid place-items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] text-center backdrop-blur-md">
        <span className="font-display text-[0.72rem] leading-tight font-bold tracking-[0.12em] text-accent uppercase">
          HR &amp;
          <br />
          Recruitment
        </span>
      </div>

      {/* skill nodes, spread evenly around the circumference */}
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
        const radius = ((RADII[index % RADII.length] ?? 40) / 100) * (size / 2);
        // Rounded: these are server-rendered, and Math.sin/cos may differ by
        // one ULP between the server and browser V8 builds. See roundTo().
        const x = roundTo(size / 2 + Math.cos(angle) * radius);
        const y = roundTo(size / 2 + Math.sin(angle) * radius);
        const isActive = index === activeIndex;

        return (
          <motion.button
            key={`${skill}-${index}`}
            type="button"
            onMouseEnter={() => onHover(index)}
            onFocus={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
            onBlur={() => onHover(null)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-bg/85 px-2.5 py-1 text-[10.5px] font-medium tracking-wide whitespace-nowrap text-muted backdrop-blur-md transition-colors duration-300 hover:border-accent/60 hover:text-text data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:text-on-accent"
            data-active={isActive}
            style={{ left: x, top: y }}
            whileHover={isActive ? undefined : { scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            aria-label={`${skill}${isActive ? ' — selected' : ''}`}
          >
            {skill}
          </motion.button>
        );
      })}
    </div>
  );
}
