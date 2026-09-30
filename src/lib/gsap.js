'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Single registration point for GSAP plugins.
 * Importing this module is enough — it is idempotent and SSR safe
 * (GSAP is only touched inside the browser).
 */
export function initGsap() {
  if (registered || typeof window === 'undefined') return { gsap, ScrollTrigger };
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
  return { gsap, ScrollTrigger };
}

/** Recalculates every trigger — call after fonts load or on resize. */
export function refreshTriggers() {
  if (typeof window === 'undefined' || !registered) return;
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
