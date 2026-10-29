import { Transition, Variants } from 'framer-motion';

/**
 * Standardized Glamgo Motion Tokens
 * Modern, smooth, 60fps GPU-accelerated motion primitives.
 * Constrained to transform and opacity for maximum mobile performance.
 */

// 1. Durations (in seconds for Framer Motion)
export const MOTION_DURATIONS = {
  fast: 0.15, // 150ms — micro-interactions, tooltips, fast chips
  base: 0.25, // 250ms — entrances, modal fades, tab indicator slides
  slow: 0.40, // 400ms — route changes, large drawers, complex transitions
} as const;

// 2. Easings & Physical Springs
export const MOTION_EASINGS = {
  // Apple/Linear-grade smooth deceleration curve for entrances
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Standard ease-in-out for symmetric transitions
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  // Fast pop-in curve
  easeFast: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
} as const;

export const MOTION_SPRINGS = {
  // Soft, organic spring for bottom sheets, drawers, and expanding cards
  soft: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1.0,
  } as Transition,

  // Snappy, tactile spring for button presses, icon bounces, and badges
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 32,
    mass: 0.8,
  } as Transition,

  // LayoutId sliding indicator spring (tabs, filter chips, pill switches)
  slider: {
    type: 'spring',
    stiffness: 380,
    damping: 32,
  } as Transition,
} as const;

// 3. Tactile Gestures
export const MOTION_GESTURES = {
  tap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: [0.16, 1, 0.3, 1] },
  },
  tapCard: {
    scale: 0.98,
    transition: { duration: 0.1, ease: [0.16, 1, 0.3, 1] },
  },
  hoverLift: {
    y: -4,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  hoverZoom: {
    scale: 1.04,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

// 4. Reusable Animation Variants
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.easeOut,
    },
  },
};

export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATIONS.fast, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATIONS.fast, ease: 'easeIn' },
  },
};

export const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: MOTION_SPRINGS.soft,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: MOTION_DURATIONS.fast },
  },
};

export const slideUpVariant: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION_SPRINGS.soft,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.easeOut,
    },
  },
};

export const slideInLeftVariant: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: MOTION_SPRINGS.soft,
  },
  exit: {
    x: '-100%',
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.easeOut,
    },
  },
};

export const popoverVariant: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.12 },
  },
};

export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0.04): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Reduced motion fallbacks (replaces coordinate movement with pure opacity fades)
export const reducedFadeVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION_DURATIONS.fast } },
  exit: { opacity: 0, transition: { duration: MOTION_DURATIONS.fast } },
};
