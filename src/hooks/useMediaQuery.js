'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query via `useSyncExternalStore`, which is the
 * correct React 19 primitive for reading an external store. It is SSR-safe
 * (returns `false` on the server, so markup always matches) and never
 * triggers a cascading render.
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server snapshot must be stable to avoid hydration mismatches.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Desktop = wide viewport with a fine pointer. Gates the 3D layer + cursor. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px) and (pointer: fine)');
