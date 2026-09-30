'use client';

import { useEffect, useRef, useState } from 'react';

import useReducedMotion from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/** Ordered hover rules. The first match wins. */
const CURSOR_TARGETS = [
  { selector: '[data-cursor="view"]', label: 'View', ring: true },
  { selector: '[data-cursor="explore"]', label: 'Explore' },
  { selector: '[data-cursor="read"]', label: 'Read' },
  {
    selector: 'a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    label: '',
  },
];

/**
 * Premium desktop cursor: a glowing point with a lagging trailing ring.
 *
 * The trail is a hand-rolled rAF lerp (no React state per frame); only the
 * label text re-renders, and only when it actually changes. Automatically
 * disabled on touch devices and under reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef('');
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);

  const enabled = isDesktop && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { x: pointer.x, y: pointer.y };
    let frame = 0;

    const render = () => {
      trail.x += (pointer.x - trail.x) * 0.16;
      trail.y += (pointer.y - trail.y) * 0.16;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      dot.dataset.visible = 'true';
      ring.dataset.visible = 'true';

      const target = event.target;
      const match = CURSOR_TARGETS.find(
        (entry) => target instanceof Element && target.closest(entry.selector),
      );

      dot.dataset.active = match ? 'true' : 'false';
      ring.dataset.active = match ? 'true' : 'false';
      ring.dataset.ring = match?.ring ? 'true' : 'false';
      const nextLabel = match?.label ?? '';
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
    };

    const onLeave = () => {
      dot.dataset.visible = 'false';
      ring.dataset.visible = 'false';
      if (labelRef.current !== '') {
        labelRef.current = '';
        setLabel('');
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
    // The last label is tracked in a ref, so the listener never goes stale
    // and never needs to be torn down and rebuilt while the pointer moves.
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[130] hidden lg:block"
      data-pressed={pressed ? 'true' : 'false'}
    >
      <div
        ref={ringRef}
        data-active="false"
        data-ring="false"
        data-visible="false"
        className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-accent/40 text-[8px] font-semibold tracking-[0.16em] text-accent uppercase opacity-0 backdrop-blur-[2px] transition-[width,height,opacity,background-color,border-color] duration-300 data-[active=true]:opacity-100 data-[ring=true]:size-16 data-[ring=true]:border-accent/60 data-[ring=true]:bg-bg/70 data-[visible=true]:opacity-100"
      >
        <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
      </div>
      <div
        ref={dotRef}
        data-active="false"
        data-visible="false"
        className="absolute left-0 top-0 size-1.5 rounded-full bg-accent opacity-0 shadow-[0_0_14px_2px_rgba(var(--accent-rgb),0.9)] transition-[width,height,opacity] duration-200 data-[active=true]:size-0.5 data-[active=true]:opacity-70 data-[visible=true]:opacity-100"
      />
    </div>
  );
}
