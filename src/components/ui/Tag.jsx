'use client';

import { cn } from '@/lib/utils';

/**
 * Small pill used for skills, categories and metadata.
 */
export default function Tag({ children, className, tone = 'default', mono = false }) {
  const tones = {
    default: 'border-line text-muted',
    accent: 'border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-accent bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]',
    cyan: 'border-[color-mix(in_oklab,var(--accent-2)_35%,transparent)] text-accent-2 bg-[color-mix(in_oklab,var(--accent-2)_8%,transparent)]',
    muted: 'border-line text-muted-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap',
        mono && 'font-mono tracking-[0.08em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
