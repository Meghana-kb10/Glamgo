import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Hook to detect and adhere to user's motion preferences.
 * When enabled, animations should degrade from translation/scale to clean opacity fades.
 */
export function useMotionPreference(): { prefersReducedMotion: boolean } {
  // Framer Motion's built-in hook
  const motionReduced = useReducedMotion();
  const [systemReduced, setSystemReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setSystemReduced(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return {
    prefersReducedMotion: Boolean(motionReduced ?? systemReduced),
  };
}
