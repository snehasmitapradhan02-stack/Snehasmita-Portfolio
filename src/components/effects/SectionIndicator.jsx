'use client';

import { motion } from 'motion/react';
import useActiveSection from '@/hooks/useActiveSection';
import { navigation } from '@/data/navigation';

const SECTION_IDS = navigation.map((item) => item.id);

/**
 * Right-hand section rail. Desktop only — it is a navigational shortcut,
 * not a replacement for the navbar, so it stays out of the mobile layout.
 */
export default function SectionIndicator() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <motion.nav
      aria-label="Section progress"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-6 top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {navigation.slice(1).map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-400 ${
                isActive
                  ? 'text-accent opacity-100'
                  : 'text-muted-2 opacity-0 group-hover:opacity-100'
              }`}
            >
              {item.label}
            </span>
            <span className="relative flex h-4 items-center">
              <span
                className={`block rounded-full bg-accent transition-all duration-500 ${
                  isActive ? 'h-6 w-[3px]' : 'h-1.5 w-[3px] bg-line-strong group-hover:bg-muted'
                }`}
              />
            </span>
          </a>
        );
      })}
    </motion.nav>
  );
}
