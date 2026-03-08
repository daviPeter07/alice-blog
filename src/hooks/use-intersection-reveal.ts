'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface UseIntersectionRevealOptions {
  /** Margin around root for triggering; default "0px 0px -8% 0px" */
  rootMargin?: string;
  /** Visibility threshold 0–1; default 0.12 (12% visível, dispara mais cedo) */
  threshold?: number;
  /** If true, disable animation (e.g. prefers-reduced-motion) */
  disabled?: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useIntersectionReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseIntersectionRevealOptions
): React.RefObject<T | null> {
  const { rootMargin = '0px 0px -8% 0px', threshold = 0.12, disabled = false } = options ?? {};

  const ref = useRef<T | null>(null);
  const hasRevealed = useRef(false);

  const shouldDisable = useCallback(() => {
    return disabled || prefersReducedMotion();
  }, [disabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (shouldDisable()) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (hasRevealed.current) continue;
          hasRevealed.current = true;
          entry.target.classList.add('is-visible');
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, shouldDisable]);

  return ref;
}
