'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * Cursor-reactive card:
 *  · a soft radial gradient that follows the pointer
 *  · a subtle 3D tilt driven by spring values
 *  · a border that lights up on hover
 *
 * Everything runs on transforms/opacity only, so it stays on the compositor.
 */
export default function GlowCard({
  children,
  className,
  tilt = 6,
  glowColor = 'var(--accent)',
  as: Tag = 'div',
  interactive = true,
  ...props
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const disabled = reduced || !interactive;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 22, mass: 0.4 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const glowBackground = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x * 100}% ${y * 100}%, color-mix(in oklab, ${glowColor} 16%, transparent), transparent 70%)`,
  );

  const handleMove = (event) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        'group/card relative isolate overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface/70',
        !disabled &&
          'transition-[border-color,box-shadow] duration-500 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--line))] hover:shadow-[var(--shadow-lift)]',
        className,
      )}
      style={disabled ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: glowBackground }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
      />
      {children}
    </Tag>
  );
}
