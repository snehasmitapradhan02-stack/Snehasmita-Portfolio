'use client';

import { useCallback, useSyncExternalStore } from 'react';

const THEME_STORAGE_KEY = 'sp-theme';
const DARK = 'dark';
const LIGHT = 'light';

/**
 * Theme provider used by the inline pre-paint script in layout.js.
 * Kept in sync with the store below — if you change one, change both.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='light'||s==='dark'?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

/* -------------------------------------------------------------------------- */
/*  Module-level store                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The theme lives in a single module-level store rather than in component
 * state. Several components (the toggle, the hero background, the WebGL
 * scene) read the theme at once — with per-hook `useState` they would each
 * hold an independent copy and only the toggle would update, leaving the
 * canvas stuck on the old palette. One store keeps them all in sync.
 */
const listeners = new Set();
let current = null;

function readInitialTheme() {
  if (typeof window === 'undefined') return DARK;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === LIGHT || stored === DARK) return stored;
  } catch {
    /* private mode — fall through to system preference */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

function getSnapshot() {
  if (current === null) current = readInitialTheme();
  return current;
}

function getServerSnapshot() {
  return DARK;
}

function subscribe(onStoreChange) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function commitTheme(next) {
  const value = typeof next === 'function' ? next(getSnapshot()) : next;
  if (value === current) return;
  current = value;

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value);
    document.documentElement.style.colorScheme = value;
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the in-memory theme still applies */
  }

  listeners.forEach((listener) => listener());
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Reads the shared theme. Returns a concrete `'light' | 'dark'` on the first
 * client render (never an "unknown" state), so there is no flash and no
 * cascading render in an effect.
 */
export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next) => commitTheme(next), []);

  const toggleTheme = useCallback(() => commitTheme((value) => (value === DARK ? LIGHT : DARK)), []);

  return { theme, setTheme, toggleTheme, isDark: theme === DARK, ready: true };
}

export { THEME_STORAGE_KEY };
