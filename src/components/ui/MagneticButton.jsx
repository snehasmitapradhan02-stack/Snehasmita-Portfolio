'use client';

import { motion } from 'motion/react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-[0.14em] uppercase transition-colors duration-300 will-change-transform';

const VARIANTS = {
  primary:
    'bg-accent text-on-accent shadow-[0_10px_40px_-16px_rgba(var(--accent-rgb),0.9)] hover:shadow-[0_18px_60px_-18px_rgba(var(--accent-rgb),1)]',
  secondary:
    'border border-line-strong text-text hover:border-accent/70 hover:text-accent bg-surface/40',
  ghost: 'text-muted hover:text-text',
  whatsapp:
    'border border-[color-mix(in_oklab,var(--accent-2)_55%,transparent)] text-text hover:border-accent-2 hover:text-accent-2 bg-surface/40',
};

const SIZES = {
  sm: 'h-10 px-5 text-[11px]',
  md: 'h-12 px-7 text-xs',
  lg: 'h-14 px-8 text-[13px]',
};

/** Maps a tag name to its Motion counterpart so gesture props are consumed. */
const MOTION_TAGS = {
  a: motion.a,
  button: motion.button,
  span: motion.span,
  div: motion.div,
};

/**
 * Magnetic button: a spring-driven pull toward the pointer, plus a sheen that
 * tracks the cursor. Motion (not GSAP) because this is UI-level feedback.
 * Disabled entirely under reduced motion.
 */
export default function MagneticButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  target,
  rel,
  type = 'button',
  disabled,
  as,
  ...props
}) {
  const reduced = useReducedMotion();
  const Component = MOTION_TAGS[as] ?? as ?? (href ? motion.a : motion.button);

  const motionProps = {
    ...(href
      ? { href, target, rel }
      : { type, onClick, disabled }),
    className: cn(BASE, VARIANTS[variant], SIZES[size], disabled && 'opacity-50', className),
    whileHover: reduced || disabled ? undefined : { scale: 1.03 },
    whileTap: reduced || disabled ? undefined : { scale: 0.97 },
    transition: { type: 'spring', stiffness: 320, damping: 24, mass: 0.6 },
    ...props,
  };

  return (
    <Component
      {...motionProps}
      onPointerMove={
        reduced || disabled
          ? undefined
          : (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = event.clientX - rect.left - rect.width / 2;
              const y = event.clientY - rect.top - rect.height / 2;
              event.currentTarget.style.transform = `translate3d(${x * 0.14}px, ${y * 0.18}px, 0)`;
              event.currentTarget.style.setProperty('--sheen-x', `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty('--sheen-y', `${event.clientY - rect.top}px`);
            }
      }
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = '';
      }}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
          style={{
            background:
              'radial-gradient(180px circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,255,255,0.35), transparent 60%)',
          }}
        />
      )}
      {variant === 'secondary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/12 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5 whitespace-nowrap">
        {children}
      </span>
    </Component>
  );
}
