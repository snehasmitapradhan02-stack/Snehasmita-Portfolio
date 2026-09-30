'use client';

import { cn } from '@/lib/utils';

/**
 * Infinite horizontal ticker. Content is duplicated once and translated by
 * -50% so the loop is seamless. Pauses on hover and under reduced motion.
 */
export default function Marquee({ children, speed = 38, className, separator = '·', reverse = false }) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div
      className={cn('group/marquee relative w-full overflow-hidden', className)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div
        className="flex w-max items-center gap-8 will-change-transform motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
        style={{
          animation: `sp-marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {items.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex items-center gap-8">
                {item}
                {separator && (
                  <span aria-hidden="true" className="text-[10px] text-muted-2">
                    {separator}
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
