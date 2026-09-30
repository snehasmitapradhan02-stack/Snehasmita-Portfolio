'use client';

import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import useTheme from '@/hooks/useTheme';
import useMounted from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

/**
 * Theme toggle. Implemented as a `role="switch"` button so it is keyboard
 * accessible and announces its state. The knob is a spring-animated Motion
 * element, so UI-level motion belongs to Motion rather than GSAP.
 *
 * The server cannot know the stored theme, so the first render is deliberately
 * pinned to the dark presentation (matching the SSR markup) and the real
 * preference is adopted after mount. This avoids a hydration mismatch, and the
 * inline pre-paint script has already applied the correct palette to `<html>`
 * by then, so there is no visual flash.
 */
export default function ThemeToggle({ className, variant = 'glass' }) {
  const { isDark, toggleTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted ? isDark : true;

  const shell =
    variant === 'bare'
      ? 'border-line bg-transparent'
      : 'border-line bg-surface/60 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--line))]';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-[3.75rem] items-center rounded-full border p-1 transition-colors duration-500',
        shell,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(60%_140%_at_50%_0%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_70%)]"
      />
      <span aria-hidden="true" className="relative z-10 flex w-full items-center justify-between px-1.5">
        <Sun
          className={cn('size-3.5 transition-colors duration-500', dark ? 'text-muted-2' : 'text-accent-4')}
          strokeWidth={1.6}
        />
        <span className="w-3.5" />
        <Moon
          className={cn('size-3.5 transition-colors duration-500', dark ? 'text-accent-2' : 'text-muted-2')}
          strokeWidth={1.6}
        />
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute top-1 left-1 flex size-7 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_6px_18px_-6px_rgba(var(--accent-rgb),0.95)]"
        animate={{ x: dark ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        {dark ? <Moon className="size-3.5" strokeWidth={1.8} /> : <Sun className="size-3.5" strokeWidth={1.8} />}
      </motion.span>
    </button>
  );
}
