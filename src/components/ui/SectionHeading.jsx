'use client';

import { cn } from '@/lib/utils';

/**
 * Section heading block used across the portfolio.
 * `eyebrow` → index + label, `title` → cinematic heading, `lead` → short intro.
 */
export default function SectionHeading({
  eyebrow,
  index,
  title,
  accent,
  lead,
  align = 'left',
  className,
  children,
  as: Tag = 'h2',
  size = 'default',
}) {
  /* Sized so a two-line chapter title still reads as a heading rather than a
     billboard — the vertical rhythm matters more than raw scale here. */
  const sizes = {
      default: 'text-[clamp(2.25rem,4.8vw,3.4rem)]',
    large: 'text-[clamp(2.25rem,5.4vw,4.25rem)]',
    small: 'text-[clamp(1.6rem,3.6vw,2.4rem)]',
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {(eyebrow || index) && (
        <div
          className={cn(
            'flex items-center gap-3 text-[11px] font-medium tracking-[0.34em] text-muted uppercase',
            align === 'center' && 'justify-center',
          )}
        >
          {index && <span className="font-mono text-accent">{index}</span>}
          {index && <span aria-hidden="true" className="h-px w-8 bg-[color-mix(in_oklab,var(--accent)_50%,transparent)]" />}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <Tag className={cn('max-w-[22ch] font-bold tracking-[-0.035em]', sizes[size])}>
        {title}
        {accent && (
          <>
            {' '}
            <span className="text-gradient-accent">{accent}</span>
          </>
        )}
      </Tag>

      {lead && (
        <p
          className={cn(
            'max-w-[62ch] text-[0.98rem] leading-relaxed text-muted md:text-[1.05rem]',
            align === 'center' && 'mx-auto',
          )}
        >
          {lead}
        </p>
      )}

      {children}
    </div>
  );
}
