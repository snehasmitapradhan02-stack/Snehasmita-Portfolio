'use client';

import { useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';

/**
 * Thin top progress bar driven by ScrollTrigger — no scroll listener, no
 * React state. Rendered once, scaled on the compositor.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    if (reduced) {
      bar.style.transform = 'scaleX(0)';
      return undefined;
    }

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.25,
          },
        },
      );
    });

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-px bg-line/60"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent via-accent-2 to-accent-3"
      />
    </div>
  );
}
