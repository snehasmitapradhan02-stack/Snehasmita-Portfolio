'use client';

import { useEffect, useState } from 'react';

const PROBE_TIMEOUT = 8000;

/**
 * Probes a list of candidate asset paths and resolves the first one that
 * actually loads. This is how the portfolio picks up a profile photo or
 * project screenshots the moment they are dropped into /public — no code
 * change required — while still rendering an elegant placeholder when the
 * file is missing.
 *
 * `kind` selects the probe strategy:
 *   - `'image'` (default) loads each candidate with `new Image()`.
 *   - `'document'` issues a `HEAD` request, which is the only reliable way
 *     to confirm a PDF such as the resume actually exists.
 *
 * All `setState` calls happen in async callbacks, so the effect body never
 * triggers a cascading render.
 */
export default function useAsset(candidates, { enabled = true, kind = 'image' } = {}) {
  const list = Array.isArray(candidates) ? candidates : [];
  const key = list.join('|');

  const [result, setResult] = useState(() => ({
    key,
    src: null,
    status: enabled && list.length > 0 ? 'loading' : 'missing',
  }));

  useEffect(() => {
    // Candidates can overlap (e.g. an env override that equals a default), and
    // a duplicate path would only cost another pointless network round-trip.
    const paths = key ? [...new Set(key.split('|'))] : [];
    if (!enabled || paths.length === 0) {
      const timer = setTimeout(() => setResult({ key, src: null, status: 'missing' }), 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    const settle = (src, status) => {
      if (cancelled) return;
      setResult({ key, src, status });
    };

    if (kind === 'document') {
      let index = 0;

      const tryNext = async () => {
        if (cancelled) return;
        if (index >= paths.length) {
          settle(null, 'missing');
          return;
        }
        const candidate = paths[index];
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
        try {
          const response = await fetch(candidate, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store',
          });
          clearTimeout(timer);
          if (cancelled) return;
          const type = response.headers.get('content-type') ?? '';
          if (response.ok && (type === 'application/pdf' || type === '')) {
            settle(candidate, 'ready');
          } else {
            index += 1;
            tryNext();
          }
        } catch {
          clearTimeout(timer);
          if (cancelled) return;
          index += 1;
          tryNext();
        }
      };

      tryNext();
      return () => {
        cancelled = true;
      };
    }

    let index = 0;
    const tryNext = () => {
      if (cancelled) return;
      if (index >= paths.length) {
        settle(null, 'missing');
        return;
      }
      const candidate = paths[index];
      const image = new Image();
      const timer = setTimeout(() => {
        image.onload = null;
        image.onerror = null;
        index += 1;
        tryNext();
      }, PROBE_TIMEOUT);
      image.onload = () => {
        clearTimeout(timer);
        if (cancelled) return;
        settle(candidate, 'ready');
      };
      image.onerror = () => {
        clearTimeout(timer);
        if (cancelled) return;
        index += 1;
        tryNext();
      };
      image.src = candidate;
    };

    tryNext();
    return () => {
      cancelled = true;
    };
  }, [key, enabled, kind]);

  // A changed candidate list means the previous result is stale.
  const current = result.key === key ? result : { key, src: null, status: 'loading' };
  return { src: current.src, status: current.status, hasAsset: current.status === 'ready' };
}
