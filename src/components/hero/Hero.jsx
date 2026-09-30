'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { ArrowRight, MousePointer2, Sparkles } from 'lucide-react';

import HeroBackground from './HeroBackground';
import HeroVisual from './HeroVisual';
import MagneticButton from '@/components/ui/MagneticButton';
import SocialButtons from '@/components/ui/SocialButtons';
import SplitText from '@/components/ui/SplitText';
import TypingText from '@/components/ui/TypingText';
import ResumeButton from '@/components/ui/ResumeButton';
import useMediaQuery from '@/hooks/useMediaQuery';
import useReducedMotion from '@/hooks/useReducedMotion';
import { usePageReady } from '@/context/PageReadyContext';
import { initGsap } from '@/lib/gsap';
import { profile } from '@/data/profile';
import { contact } from '@/data/contact';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * The 3D layer is code-split: it is never part of the initial bundle and is
 * only mounted on wide, motion-friendly devices.
 */
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function Hero() {
  const rootRef = useRef(null);
  const portalRef = useRef(null);
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const slotRef = useRef(null);
  const reduced = useReducedMotion();
  const { ready } = usePageReady();
  const isDesktop = useMediaQuery('(min-width: 1024px) and (pointer: fine)');
  const showScene = isDesktop && !reduced;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;

    const { gsap, ScrollTrigger } = initGsap();
    // Declared outside the GSAP context so the listener is always removed on
    // teardown — `context.revert()` only touches GSAP-owned animations.
    let onPageReady = null;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });
      timeline
        .fromTo(
          '[data-hero-eyebrow]',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          0,
        )
        .fromTo(
          '[data-hero-role]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 },
          0.1,
        )
        .fromTo(
          '[data-hero-statement]',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.35,
        )
        .fromTo(
          '[data-hero-actions] > *',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
          0.45,
        )
        .fromTo(
          '[data-hero-social]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0.6,
        )
        .fromTo(
          '[data-hero-scroll]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          0.9,
        );

      if (ready) timeline.play();
      else {
        onPageReady = () => timeline.play();
        window.addEventListener('sp:ready', onPageReady, { once: true });
      }

      // Parallax on the copy column as the hero scrolls away.
      gsap.to('[data-hero-copy]', {
        yPercent: 14,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-visual]', {
        yPercent: -8,
        scale: 0.96,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-bg]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, root);

    return () => {
      if (onPageReady) window.removeEventListener('sp:ready', onPageReady);
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [ready, reduced]);

  /**
   * The cinematic hand-off.
   *
   * The portrait begins inside the hero composition, on the right, exactly as
   * before. As the hero scrolls away it travels to the centre of the viewport
   * and grows slightly, holding as the focal point for a beat before fading
   * into the next chapter.
   *
   * How it stays anchored to the viewport:
   * - the portrait is hosted in a viewport-fixed layer that is a DIRECT child
   *   of the hero <section>. The section has no transform, so nothing between
   *   it and the viewport hijacks the fixed containing block (an ancestor with
   *   a transform/perspective/filter would silently re-anchor it to that
   *   ancestor instead).
   * - the hero's own `overflow-hidden` does not clip it: a fixed descendant
   *   whose containing block is the viewport is outside that clip, which is
   *   why the layer can never be cropped by the section edge.
   * - an invisible, identically sized slot keeps the original grid column, so
   *   the hero's layout and height are byte-for-byte unchanged at rest.
   *
   * Only `x`, `y`, `scale` and `autoAlpha` are animated — transforms and
   * opacity — so nothing reflows per frame, no React state is touched while
   * scrolling, and the globe, rings and pointer tilt keep running untouched
   * behind and inside the moving portrait.
   */
  useEffect(() => {
    const stage = stageRef.current;
    const slot = slotRef.current;
    const frame = frameRef.current;
    const portal = portalRef.current;
    if (!stage || !slot || !frame || !portal) return undefined;

    const { gsap, ScrollTrigger } = initGsap();

    const DESKTOP_QUERY = '(min-width: 1024px)';

    /* -----------------------------------------------------------------------
       Two boxes describe the whole movement:

       · SEAT  — the invisible grid slot that still owns the hero's layout.
       · STAGE — the portrait, already placed by flexbox inside the fixed layer.

       The travel the portrait needs is the DIFFERENCE between them, never the
       seat's raw offset: the stage is not at x = 0, it is already sitting at
       the container's gutter. Treating the seat's left as the translate value
       would count that gutter twice and leave the portrait visibly off-centre
       on narrow viewports. Every number below is re-read on each refresh and
       is never cached, so a resize or a font swap can never leave the
       portrait out of register with the grid it came from.
    ----------------------------------------------------------------------- */

    /* The stage's own, untransformed box. `offsetWidth/Height` are layout
       values, so the current translate cannot contaminate them; the frame is
       transformed by nothing, so its rect is trustworthy as the reference. */
    const stageBox = () => {
      const rect = frame.getBoundingClientRect();
      const styles = getComputedStyle(frame);
      const padLeft = parseFloat(styles.paddingLeft) || 0;
      const padRight = parseFloat(styles.paddingRight) || 0;
      const width = stage.offsetWidth;
      const height = stage.offsetHeight;
      const contentLeft = rect.left + padLeft;
      const contentWidth = rect.width - padLeft - padRight;
      // `justify-end` on desktop (the seat is flush right), centred elsewhere.
      const packedRight = window.matchMedia(DESKTOP_QUERY).matches;
      return {
        width,
        height,
        left: packedRight
          ? contentLeft + contentWidth - width
          : contentLeft + (contentWidth - width) / 2,
        top: rect.top + (rect.height - height) / 2,
      };
    };

    /* The seat's layout box. `[data-hero-visual]` also carries the hero's
       scroll parallax (a scale + yPercent tween), and `getBoundingClientRect`
       would fold that live transform into the answer — so it is neutralised
       for the single read and restored immediately. This runs on init and on
       refresh only, never per frame. */
    const seatBox = () => {
      const host = slot.parentElement;
      const previous = host.style.transform;
      host.style.transform = 'none';
      const rect = slot.getBoundingClientRect();
      host.style.transform = previous;
      return rect;
    };

    /* At rest the stage is translated exactly onto the seat, so the hero is
       pixel-identical to the un-animated version: the grid centres the slot in
       the padded hero, the fixed layer centres the stage in the bare viewport,
       and those two centres are NOT the same point.
       The seat is measured in DOCUMENT space — its viewport rect plus the
       scroll offset — because the seat travels with the page while the stage,
       living in a fixed layer, does not. Reading the raw viewport rect would
       hand back a smaller and smaller offset the further you scrolled, and
       every scroll-triggered refresh would bake that wrong number in. */
    const restX = () => seatBox().left + window.scrollX - stageBox().left;
    const restY = () => seatBox().top + window.scrollY - stageBox().top;

    /* The box the portrait is positioned against is the LAYOUT viewport, which
       is `documentElement.clientWidth/Height` — deliberately NOT
       `window.innerWidth/innerHeight`. Those report the *visual* viewport, so
       they shift whenever the page is pinch-zoomed or a mobile browser
       shrink-to-fits an overflowing page, and a portrait centred against them
       lands visibly off-centre. A `position: fixed` layer is laid out against
       the layout viewport, so that is the box the centre belongs to. */
    const viewportWidth = () => document.documentElement.clientWidth;
    const viewportHeight = () => document.documentElement.clientHeight;

    /* The focal point: dead centre of the viewport, at the portrait's own
       size, so it stays perfectly centred at any scale. */
    const centreX = () => {
      const box = stageBox();
      return viewportWidth() / 2 - box.width / 2 - box.left;
    };
    const centreY = () => {
      const box = stageBox();
      return viewportHeight() / 2 - box.height / 2 - box.top;
    };

    // Reduced motion keeps the portrait parked in its seat: no travel, no
    // zoom, no fixed layer doing anything clever.
    if (reduced) {
      gsap.set(stage, { x: restX, y: restY, scale: 1, autoAlpha: 1 });
      return undefined;
    }

    /* Park the portrait in its seat before the timeline exists, so the first
       painted frame already matches the grid rather than the fixed layer's
       own centring. */
    gsap.set(stage, { x: restX, y: restY, scale: 1, autoAlpha: 1 });

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: '(min-width: 1024px)',
        tablet: '(min-width: 768px) and (max-width: 1023.98px)',
        mobile: '(max-width: 767.98px)',
      },
      (context) => {
        const { desktop, tablet } = context.conditions;

        // Desktop earns the widest travel and the strongest scale-up. Below
        // `lg` the hero is a single column, so the portrait is already
        // horizontally centred and only needs to rise — the effect tightens
        // rather than forcing a large horizontal move.
        const maxScale = desktop ? 1.3 : tablet ? 1.2 : 1.1;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top top',
              end: 'bottom top',
              // Direct scrub: Lenis already eases the scroll itself, so a
              // lag value here would only make the two systems disagree.
              scrub: true,
              // Re-resolve the seat and the centre on resize, font swap and
              // orientation change, so the portrait can never drift out of
              // register with the grid it came from.
              invalidateOnRefresh: true,
              // Once the hand-off is done the layer is display:none. That also
              // takes the portrait's idle rAF (pointer drift + parallax vars)
              // off the budget for the rest of the session.
              onLeave: () => {
                portal.style.display = 'none';
              },
              onEnterBack: () => {
                portal.style.display = '';
              },
            },
          })
          /* 0% → ~80%: the right-hand seat, scale 1, travelling to dead centre.
             power1.inOut keeps the opening and the arrival unhurried, so it
             reads as a considered move rather than a snap. */
          .fromTo(
            stage,
            { x: restX, y: restY, scale: 1, autoAlpha: 1 },
            {
              x: centreX,
              y: centreY,
              scale: maxScale,
              duration: 0.82,
              ease: 'power1.inOut',
            },
            0,
          )
          /* ~82% → 100%: held at centre and full scale, then handed off to
             the next section. Fading is what makes the transition seamless —
             the fixed layer cannot scroll away on its own. */
          .to(stage, { autoAlpha: 0, duration: 0.18, ease: 'power1.in' }, 0.82);
      },
    );

    /* The hero's height is only final once the copy column has laid out, and
       the seat is derived from it. Re-measure immediately so the recorded rest
       position is never the pre-layout one — a stale seat is what makes a
       portrait sit a few pixels off its column after a slow first load. */
    ScrollTrigger.refresh();

    /* Still not final, though: web fonts, the split-text name and the hero's
       own entrance sequence all resize the copy column AFTER the first paint,
       and because the seat is vertically centred in that column, every one of
       those shifts it. A ResizeObserver on the seat catches all of them — plus
       real window resizes and orientation changes — so the recorded rest
       position can never be a pre-settle value.
       Observed on the content box, which transforms do not affect, so the
       hero's scale/yPercent parallax cannot feed this loop. */
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(slot);

    /* The loading screen releases the page after its own sequence; one last
       re-measure there catches anything that only settled by then. */
    const onReady = () => ScrollTrigger.refresh();
    window.addEventListener('sp:ready', onReady);

    // Web fonts land after mount and can shift the copy column, which moves
    // the seat. Re-measure once they settle.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('sp:ready', onReady);
      media.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  const whatsappHref = buildWhatsAppUrl(contact.whatsapp.number, contact.whatsapp.heroMessage);

  return (
    <section
      id="home"
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-8 md:pt-28 lg:pb-12"
    >
      <div data-hero-bg className="absolute inset-0 -z-20">
        <HeroBackground />
      </div>

      {showScene && <HeroScene />}

      <div className="container-x relative z-10 grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-8 xl:gap-10">
        {/* ---------------- copy column ---------------- */}
        <div data-hero-copy className="flex flex-col items-start">
          <div
            data-hero-eyebrow
            className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/50 px-3.5 py-1.5 text-[10.5px] tracking-[0.22em] text-muted uppercase backdrop-blur-md"
          >
            <Sparkles className="size-3 text-accent" strokeWidth={1.8} />
            <span>{profile.location.label}</span>
            <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
            <span className="text-accent">{profile.primaryRole}</span>
          </div>

          <h1 id="hero-title" className="flex flex-col">
            <span className="block overflow-hidden">
              <SplitText
                text={profile.firstName.toUpperCase()}
                playOnMount={ready}
                delay={0.05}
                className="text-[clamp(2.1rem,7vw,4.3rem)] leading-[0.92]"
              />
            </span>
            <span className="block overflow-hidden">
              <TypingText
                text={profile.lastName.toUpperCase()}
                delay={0.12}
                /* No gradient here: TypingText owns it, because the reveal mask
                   and `background-clip: text` have to live on one element. */
                className="text-[clamp(2.1rem,7vw,4.3rem)] leading-[0.92]"
              />
            </span>
          </h1>

          <div className="mt-4 flex flex-col gap-1 sm:mt-5">
            <p
              data-hero-role
              className="font-display text-[clamp(0.95rem,2vw,1.28rem)] font-semibold tracking-tight text-text"
            >
              {profile.primaryRole}
            </p>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-accent to-accent-2" />
              <p
                data-hero-role
                className="font-mono text-[10px] tracking-[0.24em] text-accent-2 uppercase"
              >
                {profile.secondaryRole}
              </p>
            </div>
          </div>

          <p
            data-hero-statement
            className="mt-4 max-w-[54ch] text-[0.9rem] leading-relaxed text-muted md:text-[0.95rem]"
          >
            {profile.heroStatement}
          </p>

          <div data-hero-actions className="mt-6 flex flex-wrap items-center gap-2.5">
            <MagneticButton href="#experience" variant="primary" size="md">
              View Experience
              <ArrowRight className="size-4" strokeWidth={1.8} />
            </MagneticButton>

            <MagneticButton href="#contact" variant="secondary" size="md">
              Contact Me
            </MagneticButton>

            <ResumeButton variant="ghost" size="md" className="px-3">
              <span className="hidden sm:inline">Download Resume</span>
              <span className="sm:hidden">Resume</span>
            </ResumeButton>
          </div>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-3 inline-flex items-center gap-2 text-[12px] text-muted transition-colors duration-300 hover:text-accent-2"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-2 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-2" />
              </span>
              Let&apos;s Talk on WhatsApp
            </a>
          )}

          <div data-hero-social className="mt-6 flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.28em] text-muted-2 uppercase">Connect</span>
            <SocialButtons />
          </div>
        </div>

        {/* ---------------- visual column ---------------- */}
        {/* The portrait itself is hosted in the viewport-fixed layer below so
            it can travel to the centre while it is still on screen. This slot
            is an invisible, identically sized stand-in: it keeps this grid
            column — and therefore the hero's height and the copy's
            centring — exactly as it was. */}
        <div data-hero-visual className="relative flex justify-center lg:justify-end">
          <div
            ref={slotRef}
            aria-hidden="true"
            className="aspect-square w-full max-w-[min(94vw,25rem)]"
          />
        </div>
      </div>

      {/* ---------------- cinematic portrait layer ---------------- */}
      {/* Fixed to the viewport so the portrait can sit dead centre while the
          hero scrolls out from under it. `pointer-events-none` so the layer
          can never intercept a click on the copy beneath it, and it is a
          direct child of the section on purpose — a transformed ancestor
          would become the containing block for a fixed child and break the
          viewport anchoring. */}
      <div
        ref={portalRef}
        data-hero-portal
        className="pointer-events-none fixed inset-0 z-20"
      >
        <div
          ref={frameRef}
          data-hero-portal-frame
          className="container-x flex h-full w-full items-center justify-center lg:justify-end"
        >
          <div
            ref={stageRef}
            data-hero-portal-stage
            className="w-full max-w-[min(94vw,25rem)] will-change-transform"
          >
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-hero-scroll
        className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center md:bottom-7"
        aria-hidden="true"
      >
        <span className="flex flex-col items-center gap-2 text-muted-2">
          <MousePointer2 className="size-3.5" strokeWidth={1.6} />
          <span className="h-10 w-px overflow-hidden bg-line-strong">
            <span className="block h-1/2 w-full bg-accent" style={{ animation: 'sp-float 2.4s ease-in-out infinite' }} />
          </span>
        </span>
      </div>
    </section>
  );
}
