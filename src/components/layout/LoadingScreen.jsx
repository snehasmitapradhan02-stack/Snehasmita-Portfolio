'use client';

import { useEffect, useRef, useState } from 'react';
import { usePageReady } from '@/context/PageReadyContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { profile } from '@/data/profile';

/** Deliberately short — the site should never feel gated behind a loader. */
const SEQUENCE_DURATION = 2.1;

export default function LoadingScreen() {
  const root = useRef(null);
  const stageRefs = useRef([]);
  const progressRef = useRef(null);
  const reduced = useReducedMotion();
  const { setReady } = usePageReady();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;

    if (reduced) {
      // Deferred so the effect body itself never triggers a re-render.
      const done = window.setTimeout(() => setGone(true), 0);
      return () => window.clearTimeout(done);
    }

    const { gsap } = initGsap();
    const progress = { value: 0 };
    let context;

    // Let the first frame paint before the timeline starts.
    const startTimer = window.setTimeout(() => {
      context = gsap.context(() => {
        const stages = stageRefs.current.filter(Boolean);
        const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

        timeline
          .to(
            progress,
            {
              value: 100,
              duration: SEQUENCE_DURATION,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${progress.value / 100})`;
                }
              },
            },
            0,
          )
          .fromTo(
            '[data-loader-name] > span > span',
            { yPercent: 115 },
            { yPercent: 0, duration: 1.1, stagger: 0.07 },
            0.1,
          )
          .fromTo(
            '[data-loader-rule]',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, transformOrigin: 'left center' },
            0.3,
          )
          .fromTo(
            stages,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.26 },
            0.4,
          )
          .fromTo(
            '[data-loader-count]',
            { yPercent: 60 },
            { yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' },
            0.4,
          )
          .to('[data-loader-orbit]', { rotate: 200, duration: 2.2, ease: 'power1.inOut' }, 0.2)
          .to('[data-loader-panel]', { autoAlpha: 0, y: -40, duration: 0.7 }, '>-0.1')
          .to('[data-loader-orbit]', { autoAlpha: 0, scale: 1.12, duration: 0.8 }, '<')
          .to(element, { autoAlpha: 0, duration: 0.65, ease: 'power2.inOut' }, '<+=0.05')
          .add(() => setGone(true));
      }, element);
    }, 60);

    return () => {
      window.clearTimeout(startTimer);
      context?.revert();
    };
  }, [reduced, setReady]);

  useEffect(() => {
    if (!gone) return undefined;
    document.documentElement.dataset.ready = 'true';
    window.dispatchEvent(new Event('sp:ready'));
    setReady(true);
    return undefined;
  }, [gone, setReady]);

  if (gone) return null;

  return (
    <div
      ref={root}
      data-loader
      role="status"
      aria-live="polite"
      aria-label={`Loading the ${profile.fullName} portfolio`}
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-surface opacity-70" />
        <div className="absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_24%,transparent),transparent_62%)] blur-2xl" />
        <div className="absolute right-0 bottom-0 size-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_16%,transparent),transparent_65%)] blur-3xl" />
      </div>

      <div
        data-loader-orbit
        aria-hidden="true"
        className="pointer-events-none absolute size-[min(76vw,30rem)] rounded-full border border-[color-mix(in_oklab,var(--accent)_26%,transparent)]"
      >
        <span className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_20px_var(--accent)]" />
        <span
          className="absolute inset-[16%] rounded-full border border-dashed border-[color-mix(in_oklab,var(--accent-2)_22%,transparent)]"
          style={{ animation: 'sp-spin-slow 20s linear infinite reverse' }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div data-loader-panel>
          <p
            data-loader-name
            className="flex flex-col overflow-hidden font-display text-[clamp(1.75rem,8.5vw,3.4rem)] font-extrabold leading-[0.94] tracking-[-0.045em]"
          >
            <span className="overflow-hidden">
              <span className="block">{profile.firstName.toUpperCase()}</span>
            </span>
            <span className="overflow-hidden">
              <span className="block text-gradient-accent">{profile.lastName.toUpperCase()}</span>
            </span>
          </p>

          <div
            data-loader-rule
            aria-hidden="true"
            className="mt-7 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          />
        </div>

        <ol className="mt-9 flex w-full flex-col gap-2.5">
          {profile.loaderSequence.map((stage, index) => (
            <li
              key={stage.index}
              ref={(node) => {
                stageRefs.current[index] = node;
              }}
              className="flex items-center justify-between gap-4 text-[11px] tracking-[0.3em] text-muted uppercase"
            >
              <span
                data-loader-count
                className="block font-mono text-accent/70"
              >
                {stage.index}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" aria-hidden="true" />
              <span data-loader-count className="block">
                {stage.label}
              </span>
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className="mt-11 h-px w-full overflow-hidden bg-line">
          <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2" />
        </div>

        <p className="mt-4 text-[11px] tracking-[0.24em] text-muted-2 uppercase">
          {profile.primaryRole} &nbsp;·&nbsp; {profile.secondaryRole}
        </p>
      </div>
    </div>
  );
}
