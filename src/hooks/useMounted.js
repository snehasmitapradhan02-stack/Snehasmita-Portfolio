'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` on the server, `true` after hydration.
 *
 * Built on `useSyncExternalStore` rather than `useEffect` + `useState` so it
 * causes no cascading render, and it is the correct primitive for "I need to
 * know I am on the client" without running an effect.
 */
export default function useMounted() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
