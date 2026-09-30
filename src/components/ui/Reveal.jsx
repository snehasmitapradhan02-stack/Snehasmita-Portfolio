'use client';

import { useEffect, useRef } from 'react';
import { usePageReady } from '@/context/PageReadyContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * Cinematic scroll reveal powered by GSAP ScrollTrigger.
 * Children are revealed as a staggered group; the container controls
 * `data-revealed` so CSS can react to it too.
 */
export default function Reveal({
  children,
  className,
  as: Tag = 'div',
  y = 28,
  stagger = 0.08,
  duration = 0.9,
  delay = 0,
  start = 'top 85%',
  once = true,
  disabled = false,
  childSelector = ':scope > *',
}) {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const { ready } = usePageReady();

  useEffect(() => {
    if (disabled) return undefined;
    if (reduced) {
      if (scope.current) scope.current.setAttribute('data-revealed', 'true');
      return undefined;
    }

    const { gsap, ScrollTrigger } = initGsap();
    const element = scope.current;
    if (!element) return undefined;

    // Owned outside the GSAP context so teardown always removes the listener.
    let detach = null;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(childSelector);
      if (targets.length === 0) return;

      gsap.set(targets, { autoAlpha: 0, y, willChange: 'transform, opacity' });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: element, start, once },
        paused: true,
        delay,
      });
      timeline
        .to(targets, { autoAlpha: 1, y: 0, duration, stagger, ease: 'power3.out' })
        .add(() => element.setAttribute('data-revealed', 'true'), 0);

      if (ready) timeline.play();
      else {
        const onReady = () => timeline.play();
        window.addEventListener('sp:ready', onReady, { once: true });
        ScrollTrigger.refresh();
        detach = () => window.removeEventListener('sp:ready', onReady);
      }
    }, element);

    return () => {
      detach?.();
      ctx.revert();
    };
  }, [ready, reduced, y, stagger, duration, delay, start, once, disabled, childSelector]);

  return (
    <Tag ref={scope} className={cn(className)} data-revealed="false">
      {children}
    </Tag>
  );
}
