'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

import Icon from '@/components/ui/Icon';
import Tag from '@/components/ui/Tag';
import ProjectVisual from './ProjectVisual';
import useAsset from '@/hooks/useAsset';
import useReducedMotion from '@/hooks/useReducedMotion';
import { projectImageCandidates } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * Premium project card: visual first, then the facts.
 *
 * Screenshot resolution is automatic — drop `slug.webp` into /public/projects
 * and the card picks it up. Until one exists, `ProjectVisual` draws a
 * project-specific interface concept, clearly labelled "UI concept" in the
 * overlay: never a broken image, and never a fabricated screenshot.
 */
export default function ProjectCard({ project, className }) {
  const cardRef = useRef(null);
  const reduced = useReducedMotion();
  const { src, hasAsset } = useAsset(projectImageCandidates(project.slug));

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 24, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-4, 4]);
  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const sheen = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(280px circle at ${x * 100}% ${y * 100}%, color-mix(in oklab, var(--accent) 15%, transparent), transparent 68%)`,
  );

  const handleMove = (event) => {
    if (reduced) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const hasLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      data-cursor="view"
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--bg-elevated)_80%,transparent)] transition-[border-color,box-shadow] duration-500 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--line))] hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: sheen }}
      />

      {/* ---------------- media ---------------- */}
      {/* The visual is the point of the card: it takes the top ~half of the
          surface, comes first on every breakpoint, and lifts on hover. */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line bg-[color-mix(in_oklab,var(--navy)_45%,var(--surface))]">
        {hasAsset && src ? (
          <Image
            src={src}
            alt={`${project.name} — project screenshot`}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <ProjectVisual
            project={project}
            className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--navy)_75%,transparent)] via-transparent to-transparent"
        />

        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3.5">
          <span className="font-mono text-[10px] tracking-[0.26em] text-white/70">
            {project.number}
          </span>
          {/* A real screenshot speaks for itself; a concept illustration says
              so explicitly, so the two are never confused. */}
          {!hasAsset && (
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] tracking-[0.18em] text-white/80 uppercase backdrop-blur-sm">
              UI concept
            </span>
          )}
        </div>

        {hasLinks && (
          <span
            aria-hidden="true"
            className="absolute right-3.5 bottom-3.5 z-20 grid size-9 translate-y-3 place-items-center rounded-full bg-accent text-on-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Icon name="external" className="size-4" />
          </span>
        )}
      </div>

      {/* ---------------- body ---------------- */}
      <div className="relative flex flex-1 flex-col gap-2.5 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={project.kind === 'client' ? 'accent' : 'cyan'}>{project.category}</Tag>
          {project.highlight && (
            <span className="rounded-full border border-[color-mix(in_oklab,var(--accent-2)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_8%,transparent)] px-3 py-1 text-[11px] font-medium tracking-wide text-accent-2">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-display text-[1.15rem] font-bold tracking-tight text-text transition-transform duration-500 ease-out group-hover:translate-x-1">
          {project.name}
        </h3>

        <p className="text-[13.5px] leading-relaxed text-muted">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <Tag key={tech} tone="muted" mono>
                {tech}
              </Tag>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 border-t border-line pt-3.5">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] text-accent uppercase transition-colors duration-300 after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] hover:text-accent-2"
            >
              View Project
              <span className="sr-only">— {project.name}</span>
              <Icon name="moveRight" className="size-3.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] text-muted-2 uppercase">
              Details on request
            </span>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative ml-auto inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-muted uppercase transition-colors duration-300 after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] hover:text-text"
            >
              <Icon name="github" className="size-3.5" />
              Source
              <span className="sr-only">— {project.name}</span>
            </a>
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent-2 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.article>
  );
}
