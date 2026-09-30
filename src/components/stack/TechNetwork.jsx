'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import Icon from '@/components/ui/Icon';
import useReducedMotion from '@/hooks/useReducedMotion';
import { techOrbit, techStack } from '@/data/techStack';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

const byId = Object.fromEntries(techStack.map((tech) => [tech.id, tech]));

/**
 * Futuristic technology network.
 *
 * Desktop: an SVG constellation — SNEHASMITA at the centre, technologies
 *          arranged around it, connected by animated lines. Hovering a node
 *          opens an information card; nothing needs to be clicked.
 * Mobile:  the same data as a clean, readable grid. The network is never
 *          force-fitted onto a small screen.
 */
export default function TechNetwork() {
  const [activeId, setActiveId] = useState(null);
  const [box, setBox] = useState(460);
  const wrapperRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setBox(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const centre = box / 2;
  const orbitRadius = box * 0.38;

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-[42rem]">
      {/* ---------------- desktop network ---------------- */}
      <div className="relative hidden aspect-square w-full md:block">
        <svg viewBox={`0 0 ${box} ${box}`} className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <radialGradient id="net-core" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="net-spoke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          <circle cx={centre} cy={centre} r={orbitRadius * 1.18} fill="none" stroke="var(--line)" strokeWidth="1" />
          <circle
            cx={centre}
            cy={centre}
            r={orbitRadius * 1.18}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="2 10"
            opacity="0.45"
            style={reduced ? undefined : { animation: 'sp-ring-spin 60s linear infinite', transformOrigin: `${centre}px ${centre}px` }}
          />
          <circle cx={centre} cy={centre} r={orbitRadius * 0.78} fill="url(#net-core)" />
          <circle
            cx={centre}
            cy={centre}
            r={orbitRadius * 0.78}
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="0.75"
            strokeDasharray="1 8"
            opacity="0.5"
            style={reduced ? undefined : { animation: 'sp-ring-spin-reverse 42s linear infinite', transformOrigin: `${centre}px ${centre}px` }}
          />

          {techOrbit.map((node) => {
            const isActive = activeId === node.id;
            return (
              <line
                key={`line-${node.id}`}
                x1={centre}
                y1={centre}
                x2={(node.x / 100) * box}
                y2={(node.y / 100) * box}
                stroke="url(#net-spoke)"
                strokeWidth={isActive ? 1.4 : 0.75}
                opacity={isActive ? 0.9 : 0.35}
                style={{ transition: 'opacity 300ms ease, stroke-width 300ms ease' }}
              />
            );
          })}
        </svg>

        {/* core */}
        <div
          className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] text-center backdrop-blur-md"
          style={{ boxShadow: '0 0 60px -18px rgba(var(--accent-rgb),0.7)' }}
        >
          <span className="font-display text-[1.6rem] leading-none font-extrabold tracking-tight text-gradient-accent">
            {profile.initials}
          </span>
          <span className="mt-1 text-[8.5px] tracking-[0.24em] text-muted uppercase">
            {profile.shortName}
          </span>
        </div>

        {/* nodes */}
        {techOrbit.map((node) => {
          const isActive = activeId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              data-cursor="explore"
              onMouseEnter={() => setActiveId(node.id)}
              onFocus={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onBlur={() => setActiveId(null)}
              className={cn(
                'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-[11.5px] font-medium tracking-wide whitespace-nowrap backdrop-blur-md transition-all duration-400',
                isActive
                  ? 'scale-110 border-accent bg-accent text-on-accent shadow-[0_8px_30px_-8px_rgba(var(--accent-rgb),0.9)]'
                  : 'border-line bg-bg/80 text-muted hover:border-accent/60 hover:text-text',
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-describedby={isActive ? `tech-info-${node.id}` : undefined}
            >
              {node.name}
            </button>
          );
        })}

        {/* information card */}
        <AnimatePresence>
          {activeId && byId[activeId] && (
            <motion.aside
              key={activeId}
              id={`tech-info-${activeId}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute bottom-2 left-1/2 z-20 w-[min(20rem,80%)] -translate-x-1/2 rounded-[var(--radius-sm)] border border-line bg-bg/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-[0.95rem] font-semibold text-text">
                  {byId[activeId].name}
                </span>
                <span className="font-mono text-[9px] tracking-[0.18em] text-accent uppercase">
                  {byId[activeId].group}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{byId[activeId].blurb}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[9.5px] tracking-[0.2em] text-accent-2 uppercase">
                  {byId[activeId].level}
                </span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- mobile grid ---------------- */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:hidden">
        {techOrbit.map((node) => {
          const tech = byId[node.id];
          return (
            <div
              key={node.id}
              className="flex flex-col gap-1.5 rounded-[var(--radius-sm)] border border-line bg-surface/60 px-3.5 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-text">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  {node.name}
                </span>
                <Icon name="network" className="size-3 text-muted-2" />
              </div>
              <span className="text-[9.5px] tracking-[0.18em] text-accent-2 uppercase">
                {tech?.group}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
