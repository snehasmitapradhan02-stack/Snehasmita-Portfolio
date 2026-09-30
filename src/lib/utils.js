/**
 * Small shared utilities.
 */

export function cn(...values) {
  return values.filter(Boolean).join(' ');
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

/** Ease used for scroll-driven progress — smooth start, confident finish. */
export function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? '').trim());
}

export function formatPhoneHref(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits ? `tel:+${digits}` : '';
}

/**
 * Quantises a number to a fixed number of decimals.
 *
 * `Math.sin` / `Math.cos` are implementation-defined: the V8 build on the
 * server and the V8 build in the browser are allowed to disagree in the last
 * bit (e.g. 78.75644347017862 vs 78.75644347017861). A raw float written
 * into server-rendered markup therefore does not match the client render, and
 * React reports a hydration error it cannot patch.
 *
 * Rounding erases any such difference before it reaches the DOM, so both
 * sides produce byte-identical output. Rounding to 2 decimals is well below
 * the ~1px precision a decorative coordinate needs.
 */
export function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
