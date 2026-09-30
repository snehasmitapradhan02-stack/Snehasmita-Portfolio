'use client';

import { useCallback, useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's reduced-motion preference.
 *
 * `useSyncExternalStore` keeps this teardown-clean and hydration-safe: the
 * server snapshot is always `false`, and the real value is picked up on the
 * first client render. Every animation layer in the portfolio checks this
 * before it runs.
 */
export default function useReducedMotion() {
  const subscribe = useCallback((onStoreChange) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener('change', onStoreChange);
    return () => media.removeEventListener('change', onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => window.matchMedia(QUERY).matches, []);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
