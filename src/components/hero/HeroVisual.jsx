'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import useAsset from '@/hooks/useAsset';
import useReducedMotion from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { PROFILE_IMAGE_CANDIDATES } from '@/lib/assets';
import { floatingLabels } from '@/data/navigation';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

const TONES = {
  accent: 'border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-accent',
  'accent-2': 'border-[color-mix(in_oklab,var(--accent-2)_40%,transparent)] text-accent-2',
  text: 'border-line text-text-soft',
};

/**
 * The hero portrait system.
 *
 * Layer order (back → front):
 *   1. WebGL orbital geometry (lazy, desktop only, injected by Hero)
 *   2. SVG orbital rings + travelling nodes
 *   3. Glass frame + circular profile image
 *   4. Floating capability labels
 *
 * Nothing heavy ever sits over the face, and the whole assembly drifts
 * subtly toward the pointer.
 */
export default function HeroVisual() {
  const stageRef = useRef(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { src, hasAsset } = useAsset(PROFILE_IMAGE_CANDIDATES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced || !isDesktop) return undefined;

    const state = { rx: 0, ry: 0, tx: 0, ty: 0, x: 0, y: 0, t: 0 };
    let frame = 0;

    const render = () => {
      state.t += 0.012;
      // gentle idle drift layered on top of the pointer offset
      const driftX = Math.sin(state.t) * 0.6;
      const driftY = Math.cos(state.t * 0.8) * 0.5;

      state.x += (state.tx - state.x) * 0.06;
      state.y += (state.ty - state.y) * 0.06;

      const px = state.x + driftX;
      const py = state.y + driftY;

      stage.style.setProperty('--px', px.toFixed(3));
      stage.style.setProperty('--py', py.toFixed(3));
      state.rx += (state.tx * 7 - state.rx) * 0.06;
      state.ry += (state.ty * -7 - state.ry) * 0.06;
      stage.style.transform = `perspective(1100px) rotateY(${state.rx.toFixed(2)}deg) rotateX(${state.ry.toFixed(2)}deg)`;

      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };
    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMove = (event) => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      state.tx = Math.max(-1, Math.min(1, nx * 2));
      state.ty = Math.max(-1, Math.min(1, ny * 2));
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);

    // Only burn frames while the hero is actually on screen. Without this the
    // loop would run for the entire session, even once the hero is gone.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    visibility.observe(stage);
    start();

    return () => {
      stop();
      visibility.disconnect();
      window.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, isDesktop]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square w-full max-w-[min(94vw,25rem)] will-change-transform"
      data-ready={ready}
    >
      {/* ---- 2. orbital rings (SVG, cheap) ------------------------------- */}
      <div aria-hidden="true" className="absolute inset-0">
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
              <stop offset="55%" stopColor="var(--accent-2)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent-3)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <g data-parallax data-depth="0.5">
            <g className="ring-spin" style={{ '--ring-duration': '42s' }}>
              <circle
                cx="200"
                cy="200"
                r="188"
                fill="none"
                stroke="url(#ring-gradient)"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.65"
              />
              <circle cx="200" cy="12" r="3.5" fill="var(--accent)" />
              <circle cx="200" cy="12" r="8" fill="var(--accent)" opacity="0.18" />
              <circle cx="200" cy="388" r="2" fill="var(--accent-2)" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>

      {/* rotating tick ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3%] rounded-full opacity-70"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 55%, transparent) 40deg, transparent 90deg, transparent 360deg)',
          maskImage: 'radial-gradient(circle, transparent 62%, #000 63%, #000 100%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 62%, #000 63%, #000 100%)',
          animation: 'sp-spin-slow 34s linear infinite',
        }}
        data-parallax
        data-depth="0.35"
      />

      {/* ---- 3. glass frame + portrait ----------------------------------- */}
      <div
        className="absolute inset-[14%] overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,var(--line))] bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] shadow-[0_40px_120px_-50px_rgba(var(--accent-rgb),0.75)] backdrop-blur-xl"
        data-parallax
        data-depth="1.25"
      >
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" aria-hidden="true" />
        <div
          className="absolute inset-0 rounded-full opacity-80"
          style={{
            background:
              'radial-gradient(circle at 32% 24%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 58%)',
          }}
          aria-hidden="true"
        />

        {hasAsset && src ? (
          <Image
            src={src}
            alt={`${profile.fullName}, ${profile.primaryRole}`}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 28rem, 70vw"
            /* object-cover keeps the circle filled at any aspect ratio
               without distorting, object-center keeps the face centred. */
            className="scale-[1.02] object-cover object-center"
          />
        ) : (
          <ProfilePlaceholder />
        )}

        {/* soft inner vignette keeps focus on the face */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_58%,color-mix(in_oklab,var(--navy)_42%,transparent)_100%)]"
        />
      </div>

      {/* status chip */}
      <div
        data-parallax
        data-depth="1.6"
        className="absolute bottom-[16%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-bg/80 px-3.5 py-1.5 text-[10px] tracking-[0.18em] whitespace-nowrap text-muted uppercase backdrop-blur-md"
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-2 opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent-2" />
        </span>
        {profile.location.label}
      </div>

      {/* ---- 4. floating capability labels ------------------------------- */}
      {floatingLabels.map((item, index) => (
        <span
          key={item.label}
          data-parallax
          data-depth={(index % 3) + 1}
          className={cn(
            'pointer-events-none absolute rounded-full border bg-bg/70 px-2.5 py-1 text-[9.5px] font-medium tracking-[0.16em] whitespace-nowrap uppercase backdrop-blur-sm',
            TONES[item.tone],
          )}
          style={labelPosition(index)}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Designed monogram placeholder — used until a real photo is added. */
function ProfilePlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="ph-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="ph-core" cx="50%" cy="35%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--navy)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#ph-core)" />
        <g fill="none" stroke="url(#ph-arc)" strokeWidth="1">
          <circle cx="100" cy="100" r="70" strokeDasharray="2 6" opacity="0.7" />
          <circle cx="100" cy="100" r="84" strokeDasharray="40 200" strokeLinecap="round" />
        </g>
        <path
          d="M100 52c16 0 28 12 28 27 0 12-8 22-19 26v10h18v8H73v-8h18v-10c-11-4-19-14-19-26 0-15 12-27 28-27Z"
          fill="var(--text)"
          opacity="0.14"
        />
      </svg>
      <span className="relative font-display text-[clamp(2.5rem,9vw,3.75rem)] font-extrabold tracking-tight text-gradient">
        {profile.initials}
      </span>
    </div>
  );
}

/** Deterministic placement so labels never collide across breakpoints. */
function labelPosition(index) {
  const positions = [
    { top: '4%', left: '52%' },
    { top: '17%', right: '-2%' },
    { top: '33%', left: '-3%' },
    { top: '44%', right: '-4%' },
    { bottom: '30%', right: '0%' },
    { bottom: '12%', right: '14%' },
    { bottom: '4%', left: '22%' },
    { top: '62%', left: '-6%' },
    { top: '8%', left: '6%' },
  ];
  return positions[index % positions.length];
}
