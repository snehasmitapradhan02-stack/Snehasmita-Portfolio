'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Tag from '@/components/ui/Tag';
import useAsset from '@/hooks/useAsset';
import useReducedMotion from '@/hooks/useReducedMotion';
import { initGsap } from '@/lib/gsap';
import { PROFILE_IMAGE_CANDIDATES } from '@/lib/assets';
import { profile } from '@/data/profile';

/**
 * About / profile chapter.
 *
 * LEFT   profile card (parallax tilt + orbit)
 * CENTER professional introduction — deliberately HR-led
 * RIGHT  professional metadata panel
 */
export default function About() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-about-line]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: element, start: 'top 72%', once: true },
        },
      );

      gsap.to('[data-about-visual]', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, element);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <Section
      id="about"
      labelledBy="about-title"
      tone="identity"
      withGrid
      withGlow
      className="border-t border-line"
    >
      <div ref={ref} className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_minmax(0,0.8fr)] lg:gap-10 xl:gap-12">
        {/* ---------------- left: profile card ---------------- */}
        <div data-about-visual className="flex justify-center lg:justify-start">
          <ProfileCard />
        </div>

        {/* ---------------- center: introduction ---------------- */}
        <div className="flex flex-col gap-6">
          <SectionHeading
            index="01"
            eyebrow="Profile"
            title="I work with people."
            accent="Every day."
            lead={profile.summary[0]}
            className="items-start"
          />

          <Reveal y={20} className="flex flex-col gap-5">
            <p className="text-[0.98rem] leading-relaxed text-muted md:text-[1.05rem]">
              {profile.summary[1]}
            </p>

            <blockquote className="relative rounded-[var(--radius-md)] border border-[color-mix(in_oklab,var(--accent)_28%,var(--line))] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] p-5 md:p-6">
              <Sparkles
                className="absolute -top-2.5 left-5 size-5 rounded-full bg-bg p-1 text-accent"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <p className="text-[0.95rem] leading-relaxed font-medium text-text md:text-[1.02rem]">
                {profile.differentiator}
              </p>
            </blockquote>
          </Reveal>

          <Reveal y={18} className="flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <Tag key={area.label} tone="accent" className="group cursor-default">
                {area.label}
              </Tag>
            ))}
          </Reveal>
        </div>

        {/* ---------------- right: metadata ---------------- */}
        <div className="flex flex-col justify-center">
          <Reveal y={26} className="flex flex-col">
            <dl className="flex flex-col">
              {profile.metadata.map((entry, index) => (
                <div
                  key={entry.label}
                  className="group border-b border-line py-4 first:border-t"
                >
                  <dt className="font-mono text-[9.5px] tracking-[0.26em] text-muted-2 uppercase">
                    {entry.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.98rem] font-medium text-text transition-colors duration-300 group-hover:text-accent">
                    {entry.value}
                  </dd>
                  <span
                    data-about-line
                    aria-hidden="true"
                    className="mt-3 block h-px w-full origin-left scale-x-100 bg-gradient-to-r from-[color-mix(in_oklab,var(--accent)_45%,transparent)] to-transparent"
                  />
                  {index === profile.metadata.length - 1 && <span className="sr-only">End of profile</span>}
                </div>
              ))}
            </dl>

            <p className="mt-6 flex items-center gap-2 text-[12.5px] text-muted">
              <MapPin className="size-3.5 text-accent-2" strokeWidth={1.7} />
              {profile.location.label}, {profile.location.country}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function ProfileCard() {
  const { src, hasAsset } = useAsset(PROFILE_IMAGE_CANDIDATES);
  const cardRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reduced) return undefined;

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', (ny * -5).toFixed(2));
      card.style.setProperty('--tilt-y', (nx * 6).toFixed(2));
      card.style.setProperty('--glow-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--glow-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      card.style.setProperty('--tilt-x', '0');
      card.style.setProperty('--tilt-y', '0');
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={cardRef}
      className="group relative aspect-[4/5] w-full max-w-[19rem] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface/60 p-2.5 shadow-[var(--shadow-card)] transition-transform duration-300 ease-out [transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] hover:shadow-[var(--shadow-lift)] lg:max-w-none"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--glow-x,50%) var(--glow-y,50%), color-mix(in oklab, var(--accent) 14%, transparent), transparent 68%)',
        }}
      />

      <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-lg)-10px)] border border-line bg-[color-mix(in_oklab,var(--navy)_60%,var(--surface))]">
        {hasAsset && src ? (
          <Image
            src={src}
            alt={`${profile.fullName} — ${profile.primaryRole}`}
            fill
            sizes="(min-width: 1024px) 20rem, 60vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_62%)]"
            />
            <svg viewBox="0 0 200 200" className="relative size-3/4 opacity-90" aria-hidden="true">
              <g fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5">
                <circle cx="100" cy="100" r="72" strokeDasharray="3 7" />
                <circle cx="100" cy="100" r="52" strokeDasharray="1 6" opacity="0.6" />
              </g>
            </svg>
            <span className="absolute font-display text-5xl font-extrabold tracking-tight text-gradient">
              {profile.initials}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--navy)_88%,transparent)] via-transparent to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-display text-lg font-bold tracking-tight text-white">
            {profile.fullName}
          </p>
          <p className="mt-0.5 text-[10.5px] tracking-[0.2em] text-white/70 uppercase">
            {profile.primaryRole}
          </p>
        </div>
      </div>

      {/* corner accents */}
      <span aria-hidden="true" className="absolute top-4 left-4 h-6 w-6 border-t border-l border-accent/60" />
      <span aria-hidden="true" className="absolute right-4 bottom-4 h-6 w-6 border-r border-b border-accent-2/60" />
    </div>
  );
}
