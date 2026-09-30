'use client';

import { useEffect, useRef } from 'react';

import ProjectCard from './ProjectCard';
import useMediaQuery from '@/hooks/useMediaQuery';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * Horizontal project gallery.
 *
 * Desktop: the section is pinned and the track is scrubbed sideways, so the
 *          visitor travels through the work rather than scrolling past it.
 *          The pin is released cleanly and normal scrolling resumes.
 * Mobile:  a controlled horizontal swipe track with momentum — no pin, no
 *          vertical dead space.
 */
export default function ProjectScroller({ projects, className }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  /* The pin only engages when the whole section can fit the viewport: the card
     carries a 16:10 visual on top of its body, so a short window would clip the
     card. Below the height floor the swipe track is used instead, which scrolls
     with the page and can never be cut off. */
  const isDesktop = useMediaQuery('(min-width: 1024px) and (min-height: 720px)');
  const reduced = useReducedMotion();
  const enabled = isDesktop && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card depth: the card nearest the reading line sits slightly forward.
      gsap.utils.toArray('[data-project-card]').forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 88%',
          end: 'right 12%',
          toggleClass: { targets: card, className: 'is-focused' },
        });
      });
    }, section);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [enabled]);

  return (
    <div ref={sectionRef} className={cn('relative', className)}>
      <div
        ref={trackRef}
        className={cn(
          'flex gap-5 will-change-transform',
          enabled
            ? 'h-full items-center px-[max(1.25rem,calc((100vw-88rem)/2+3.5rem))] py-6'
            : 'snap-x snap-mandatory overflow-x-auto px-5 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            data-project-card
            className={cn(
              'shrink-0 snap-start transition-transform duration-500 [&.is-focused]:scale-[1.015]',
              /* `42vh` keeps the card inside a short viewport so the pinned
                 section is never taller than the screen. */
              enabled
                ? 'w-[min(27rem,78vw,42vh)]'
                : 'w-[min(23rem,86vw)] sm:w-[25rem]',
            )}
          >
            <ProjectCard project={project} className="h-full" />
          </div>
        ))}

        <div className={cn('shrink-0', enabled ? 'w-2' : 'w-1')} aria-hidden="true" />
      </div>
    </div>
  );
}
