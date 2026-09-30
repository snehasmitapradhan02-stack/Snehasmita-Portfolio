'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const PageReadyContext = createContext({ ready: false, setReady: () => {} });

/**
 * Bridges the loading screen to the rest of the page: hero timelines and
 * scroll-linked animations wait for `ready` before they start, so nothing
 * animates behind the loading overlay.
 */
export function PageReadyProvider({ children }) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);

  return <PageReadyContext.Provider value={value}>{children}</PageReadyContext.Provider>;
}

export function usePageReady() {
  return useContext(PageReadyContext);
}

export default PageReadyContext;
