'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Tracks which section is currently under the reading line.
 * Used by the navbar, the section indicator and the scroll progress rail.
 */
export default function useActiveSection(sectionIds, { rootMargin = '-45% 0px -50% 0px' } = {}) {
  // Serialised so the effect re-runs when the *contents* change, not the array
  // identity, and so nothing is read or written during render.
  const key = Array.isArray(sectionIds) ? sectionIds.join('|') : '';
  const initial = key ? key.split('|')[0] : null;
  const [activeId, setActiveId] = useState(initial);

  useEffect(() => {
    const ids = key ? key.split('|') : [];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.15, 0.35, 0.6, 0.9] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return useMemo(() => activeId, [activeId]);
}
