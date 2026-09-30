'use client';

import { useEffect, useRef } from 'react';

/**
 * Pointer position normalised to -1 → 1 relative to the viewport centre.
 *
 * A single passive listener writes to a ref-backed object, so consumers can
 * read it inside a rAF loop without triggering React re-renders. Pass
 * `disabled: true` to opt out entirely (the portfolio uses this to disable
 * pointer tracking on touch devices and under `prefers-reduced-motion`).
 */
export default function useMousePosition({ disabled = false } = {}) {
  const positionRef = useRef({ x: 0, y: 0, px: 0, py: 0, inside: false });

  useEffect(() => {
    if (disabled) return undefined;

    const onMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const x = innerWidth === 0 ? 0 : event.clientX / innerWidth - 0.5;
      const y = innerHeight === 0 ? 0 : event.clientY / innerHeight - 0.5;
      positionRef.current = {
        x: x * 2,
        y: y * 2,
        px: event.clientX,
        py: event.clientY,
        inside: true,
      };
    };
    const onLeave = () => {
      positionRef.current = { ...positionRef.current, inside: false };
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [disabled]);

  return positionRef;
}
