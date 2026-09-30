'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import useActiveSection from '@/hooks/useActiveSection';
import useAsset from '@/hooks/useAsset';
import useLockScroll from '@/hooks/useLockScroll';
import useReducedMotion from '@/hooks/useReducedMotion';
import { PROFILE_IMAGE_CANDIDATES } from '@/lib/assets';
import { navigation } from '@/data/navigation';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

const SECTION_IDS = navigation.map((item) => item.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const reduced = useReducedMotion();
  const { src: avatar, hasAsset: hasAvatar } = useAsset(PROFILE_IMAGE_CANDIDATES);
  useLockScroll(open);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setCompact(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={reduced ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            'pointer-events-auto relative flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500',
            scrolled
              ? 'glass px-3 py-2 shadow-[var(--shadow-card)] sm:px-4'
              : 'border-transparent bg-transparent px-1 py-2',
          )}
        >
          {/* Brand */}
          <a
            href="#home"
            className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2 pl-1"
            aria-label={`${profile.fullName} — back to top`}
          >
            <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface text-[10px] font-bold tracking-tight text-accent">
              {hasAvatar && avatar ? (
                <Image
                  src={avatar}
                  alt={`${profile.fullName} — ${profile.primaryRole}`}
                  fill
                  sizes="32px"
                  className="relative z-10 scale-[1.02] object-cover object-center"
                />
              ) : (
                <span className="relative z-10">{profile.initials}</span>
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent,color-mix(in_oklab,var(--accent)_55%,transparent),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ animation: 'sp-spin-slow 3.2s linear infinite' }}
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[11px] font-bold tracking-[0.2em] text-text sm:text-[12px]">
                {profile.navName}
              </span>
              <span
                className={cn(
                  'mt-1 hidden text-[9px] tracking-[0.22em] text-muted uppercase transition-opacity duration-300 sm:block',
                  compact ? 'opacity-100' : 'opacity-70',
                )}
              >
                HR &amp; Recruitment Specialist
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navigation.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'group relative block rounded-full px-3.5 py-2 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors duration-300',
                      isActive ? 'text-text' : 'text-muted hover:text-text',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden h-9 items-center rounded-full bg-accent px-5 text-[11px] font-semibold tracking-[0.16em] text-on-accent uppercase transition-[transform,box-shadow] duration-300 hover:shadow-[0_10px_30px_-10px_rgba(var(--accent-rgb),0.9)] active:scale-95 sm:inline-flex"
            >
              Hire&nbsp;Me
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              className="grid size-9 place-items-center rounded-full border border-line bg-surface/60 text-text transition-colors duration-300 hover:border-accent/50 lg:hidden"
            >
              {open ? <X className="size-4" strokeWidth={1.7} /> : <Menu className="size-4" strokeWidth={1.7} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} activeId={activeId} reduced={reduced} />
    </>
  );
}

function MobileMenu({ open, onClose, activeId, reduced }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
          className="fixed inset-0 z-[95] lg:hidden"
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-bg/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ y: reduced ? 0 : '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: reduced ? 0 : '-100%' }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-[4.5rem] mx-3 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-bg-elevated/95 p-5 shadow-[var(--shadow-lift)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid-surface opacity-40"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_65%)] blur-2xl"
            />

            <ul className="relative flex flex-col">
              {navigation.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: reduced ? 0 : -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : 0.14 + index * 0.055, duration: 0.5 }}
                    className="border-b border-line last:border-b-0"
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'flex items-center justify-between gap-4 py-4 font-display text-lg font-semibold tracking-tight transition-colors',
                        isActive ? 'text-accent' : 'text-text',
                      )}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] text-muted-2">
                          0{index + 1}
                        </span>
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-px w-8 transition-all duration-300',
                          isActive ? 'w-14 bg-accent' : 'bg-line-strong',
                        )}
                      />
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <div className="relative mt-5 flex items-center justify-between gap-3">
              <p className="text-[11px] leading-relaxed text-muted">
                {profile.tagline}
              </p>
              <ThemeToggle variant="bare" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
