'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useMotionTemplate, useTransform } from 'motion/react';

import { usePageReady } from '@/context/PageReadyContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * One full cycle, expressed as fractions of a single `progress` value.
 *
 * A single value drives the reveal mask and the cursor, so the whole effect is
 * one animation with no per-letter timers and no React state updates — Motion
 * writes straight to the DOM style.
 */
const CYCLE_SECONDS = 5;
const TYPE = 0.32; // 0 → 1: typing (linear = constant letter cadence)
const HOLD = 0.8; // fully revealed
const RESET = 0.88; // faded out, ready to loop
const TIMES = [0, TYPE, HOLD, RESET, 1];
const KEYFRAMES = [0, 1, 1, 0, 0];
const EDGE = 3.2; // % of the word width used to feather the reveal edge

/**
 * Types a word one letter at a time, holds it, then loops forever.
 *
 * Reveal is done with a mask rather than by conditionally rendering letters,
 * so every character is in the DOM from the first frame and the block reserves
 * the full width of the finished word. Nothing reflows and there is no
 * horizontal jump or caret-induced shift.
 *
 * The mask MUST sit on the same element as `text-gradient-accent`.
 * `background-clip: text` paints the gradient as the element's *own*
 * background, so a mask on a child would clip nothing and the gradient would
 * stay fully visible. Letters are therefore plain inline spans: they carry
 * `color: transparent` from the gradient, so per-letter opacity/filter would
 * be invisible anyway — the gradient showing through the glyphs is what you
 * actually see.
 */
export default function TypingText({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
  ready: readyProp,
}) {
  const scopeRef = useRef(null);
  const reduced = useReducedMotion();
  const { ready: pageReady } = usePageReady();
  const ready = readyProp ?? pageReady;

  const letters = useMemo(() => String(text).split(''), [text]);

  const progress = useMotionValue(0);

  // 0% → 100% of the word revealed. The mask edge travels left→right exactly
  // as a caret would. Both stops are scaled by `progress`, so the feather band
  // collapses to zero width when the word is hidden — no ghost sliver of the
  // first letter is left behind at the reset.
  const edge = useTransform(progress, (value) => `${(value * 100).toFixed(3)}%`);
  const feather = useTransform(progress, (value) => `${(value * EDGE).toFixed(3)}%`);
  const mask = useMotionTemplate`linear-gradient(to right,#000 0%,#000 ${edge},transparent calc(${edge} + ${feather}))`;

  // The caret only exists while letters are actually being typed.
  const caretOpacity = useTransform(
    progress,
    [0, 0.02, TYPE - 0.01, TYPE],
    [0, 1, 1, 0],
    { clamp: true },
  );

  useEffect(() => {
    // Reduced motion, or still behind the loader: no animation is created, so
    // `progress` stays 0 and the mask keeps the word masked out until the
    // loader — which shows the full name itself — has cleared.
    if (reduced || !ready) return undefined;

    // `animate` (not `progress.animate`) — Motion 13 removed the per-value
    // method, so a MotionValue is animated through the exported driver.
    const controls = animate(progress, KEYFRAMES, {
      duration: CYCLE_SECONDS,
      times: TIMES,
      ease: 'linear',
      repeat: Infinity,
      delay,
    });
    controls.pause();

    const node = scopeRef.current;

    // A looping animation should never burn frames when nobody can see it, so
    // it pauses when the hero scrolls out of view or the tab is hidden.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? controls.play() : controls.pause()),
      { threshold: 0 },
    );
    if (node) visibility.observe(node);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') controls.play();
      else controls.pause();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Usually already intersecting by the time the loader clears.
    if (node && node.getBoundingClientRect().top < window.innerHeight) controls.play();

    return () => {
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      controls.stop();
    };
  }, [progress, reduced, ready, delay]);

  if (reduced) {
    return (
      <Tag ref={scopeRef} className={cn('inline-block', className)}>
        {text}
      </Tag>
    );
  }

  return (
    // `relative` anchors the caret; `aria-label` carries the real string for
    // assistive tech while the decorative letters below stay hidden from it.
    <Tag ref={scopeRef} className={cn('relative inline-block', className)} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline-block text-gradient-accent will-change-[mask-image]"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {letters.map((letter, index) => (
          <span key={`${letter}-${index}`} className="inline-block">
            {letter}
          </span>
        ))}
      </motion.span>
      <Caret progress={progress} opacity={caretOpacity} />
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Accent bar sitting on the reveal edge. It is a sibling of the masked word
 * rather than a child, so the mask can never clip it.
 */
function Caret({ progress, opacity }) {
  // `progress` is 0→1 across the TYPE phase, which maps 1:1 to word width.
  const left = useTransform(progress, (value) => `${(value / TYPE) * 100}%`);

  return (
    <motion.span
      aria-hidden="true"
      className="absolute top-[8%] bottom-[8%] w-[2px] rounded-full bg-accent-2"
      style={{ left, opacity }}
    >
      <span className="absolute inset-0 animate-[sp-cursor-blink_1.05s_steps(1,end)_infinite] rounded-full bg-accent-2" />
    </motion.span>
  );
}
