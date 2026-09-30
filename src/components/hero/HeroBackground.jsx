'use client';

import { useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import useTheme from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

/**
 * Hero atmosphere: grid, radial glows, drifting particles and a vignette.
 *
 * Entirely CSS + a lightweight canvas particle field — no WebGL — so it
 * paints instantly and never competes with the R3F layer behind the portrait.
 */
export default function HeroBackground({ className }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let points = [];
    let frame = 0;
    let running = true;

    const palette = () => {
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue('--accent').trim() || '#4d8bff';
      const cyan = styles.getPropertyValue('--accent-2').trim() || '#22d3ee';
      return [accent, cyan];
    };
    let [accent, cyan] = palette();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deliberately sparse: the dots are atmosphere, not a feature, so they
      // stay well under the density that makes them read as "dramatic".
      const density = Math.min(Math.round((width * height) / 44000), 30);
      points = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.35,
        speed: Math.random() * 0.16 + 0.03,
        drift: (Math.random() - 0.5) * 0.16,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.72 ? cyan : accent,
        alpha: Math.random() * 0.26 + 0.07,
      }));
    };

    const draw = () => {
      if (!running) return;
      context.clearRect(0, 0, width, height);

      for (const point of points) {
        point.y -= point.speed;
        point.x += point.drift;
        if (point.y < -4) {
          point.y = height + 4;
          point.x = Math.random() * width;
        }
        if (point.x < -4) point.x = width + 4;
        if (point.x > width + 4) point.x = -4;

        const twinkle = 0.65 + Math.sin(point.phase + point.y * 0.012) * 0.35;
        context.globalAlpha = point.alpha * twinkle;
        context.fillStyle = point.color;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // Draw one static frame only.
      context.clearRect(0, 0, width, height);
      points.forEach((point) => {
        context.globalAlpha = point.alpha;
        context.fillStyle = point.color;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    }

    // `frame` doubles as the "is the loop already running" flag, so the loop
    // can never be started twice by overlapping visibility sources.
    const start = () => {
      running = true;
      if (reduced || frame) return;
      frame = window.requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Stop drawing once the hero has scrolled away, so the canvas does not
    // keep costing a full frame budget for the rest of the session.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    visibility.observe(canvas);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      visibility.disconnect();
    };
  }, [reduced, theme]);

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* base grid */}
      <div className="absolute inset-0 grid-surface [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_78%)]" />

      {/* soft radial glows */}
      <div className="absolute -left-[12%] top-[6%] size-[42rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_62%)] blur-[110px]" />
      <div className="absolute -right-[10%] top-[28%] size-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_16%,transparent),transparent_64%)] blur-[120px]" />
      <div className="absolute bottom-[-14%] left-1/3 size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-3)_12%,transparent),transparent_66%)] blur-[130px]" />

      {/* particle field */}
      <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-55" />

      {/* thin connecting lines */}
      <svg className="absolute inset-0 size-full opacity-[0.5]" aria-hidden="true">
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="hidden lg:block" stroke="url(#hero-line)" fill="none" strokeWidth="1">
          <path className="hero-line-path" d="M4 62 L 320 210 L 700 130 L 1080 300 L 1440 180" strokeDasharray="6 14" />
          <path className="hero-line-path" d="M120 720 L 460 540 L 820 660 L 1180 500 L 1520 640" strokeDasharray="6 14" />
        </g>
      </svg>

      {/* vignette + bottom fade into the next section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,color-mix(in_oklab,var(--bg)_70%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
