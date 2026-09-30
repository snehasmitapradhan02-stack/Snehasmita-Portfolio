'use client';

import { cn } from '@/lib/utils';

/**
 * Standard section frame: semantic <section>, anchor id, consistent spacing
 * and an optional ambient background variant so each chapter keeps its own
 * visual identity without re-implementing layout.
 */
export default function Section({
  id,
  children,
  className,
  innerClassName,
  labelledBy,
  tone = 'default',
  withGrid = false,
  withGlow = false,
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative isolate scroll-mt-24', className)}
      data-section={id}
      data-tone={tone}
    >
      {withGrid && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid-surface opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,#000_10%,transparent_75%)]"
        />
      )}
      {withGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 aspect-square w-full max-w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_60%)] blur-3xl"
        />
      )}
      <div className={cn('container-x section-pad', innerClassName)}>{children}</div>
    </section>
  );
}
