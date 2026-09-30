'use client';

import { useEffect } from 'react';
import { usePageReady } from '@/context/PageReadyContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';

/**
 * Lenis smooth scrolling, driven from the GSAP ticker so ScrollTrigger and
 * Lenis never disagree about the scroll position.
 *
 * - disabled entirely under reduced motion (native scrolling takes over)
 * - paused until the loading screen finishes
 * - in-page anchors are intercepted so navigation uses the same easing
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const { ready } = usePageReady();

  useEffect(() => {
    if (reduced) return undefined;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import('lenis'),
        Promise.resolve(initGsap()),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => 1 - (1 - t) ** 3,
        smoothWheel: true,
        touchMultiplier: 1.6,
        lerp: 0.1,
      });

      lenis.on('scroll', ScrollTrigger.update);
      lenis.stop();

      const ticker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const onClick = (event) => {
        const anchor = event.target?.closest?.('a[href^="#"]');
        if (!anchor || anchor.getAttribute('target') === '_blank') return;
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -76, duration: 1.25 });
        window.history.replaceState(null, '', id);
      };

      const onReady = () => lenis.start();
      document.addEventListener('click', onClick);
      window.addEventListener('sp:ready', onReady, { once: true });

      if (document.documentElement.dataset.ready === 'true') lenis.start();
      document.documentElement.dataset.lenis = 'active';

      cleanup = () => {
        document.removeEventListener('click', onClick);
        window.removeEventListener('sp:ready', onReady);
        gsap.ticker.remove(ticker);
        lenis.destroy();
        delete document.documentElement.dataset.lenis;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, ready]);

  return null;
}
