'use client';

import { useEffect, useRef } from 'react';
import { usePageReady } from '@/context/PageReadyContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

const WORD_MASK = 'relative inline-block overflow-hidden align-bottom';

/**
 * Splits a string into words wrapped in overflow-hidden masks and reveals
 * them on a stagger. Used for the large hero typography.
 */
export default function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  duration = 1.1,
  as: Tag = 'span',
  start = 'top 92%',
  trigger,
  playOnMount = false,
  animate = true,
}) {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const { ready } = usePageReady();
  const words = String(text).split(' ');

  useEffect(() => {
    if (!animate) return undefined;

    const element = scope.current;
    if (!element) return undefined;

    if (reduced) {
      gsap_setVisible(element);
      return undefined;
    }

    const { gsap, ScrollTrigger } = initGsap();
    // Owned outside the GSAP context so teardown always removes the listener.
    let detach = null;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('[data-word]', element);
      if (targets.length === 0) return;

      gsap.set(targets, { yPercent: 118, rotate: 2, opacity: 0, willChange: 'transform' });

      const timeline = gsap.timeline({ paused: true, delay });
      timeline.to(targets, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration,
        stagger,
        ease: 'expo.out',
      });

      if (playOnMount || ready) {
        timeline.play();
      } else {
        const triggerEl = trigger?.current ?? element;
        const scrollTrigger = ScrollTrigger.create({
          trigger: triggerEl,
          start,
          once: true,
          onEnter: () => timeline.play(),
        });
        const onReady = () => timeline.play();
        window.addEventListener('sp:ready', onReady, { once: true });
        detach = () => {
          window.removeEventListener('sp:ready', onReady);
          scrollTrigger.kill();
        };
      }
    }, element);

    return () => {
      detach?.();
      ctx.revert();
    };
  }, [animate, delay, stagger, duration, playOnMount, ready, reduced, start, trigger]);

  return (
    <Tag ref={scope} className={cn('inline-block', className)} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className={WORD_MASK} aria-hidden="true">
          <span data-word className={cn('inline-block will-change-transform', wordClassName)}>
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

function gsap_setVisible(element) {
  element.querySelectorAll('[data-word]').forEach((word) => {
    word.style.opacity = '1';
    word.style.transform = 'none';
  });
}
