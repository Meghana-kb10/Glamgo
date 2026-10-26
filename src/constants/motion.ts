import { Transition } from 'framer-motion';

/**
 * Mandatory Glamgo Framer Motion Physics Presets (The 5 Pillars)
 */
export const SPRINGS = {
  snappy: { type: 'spring', stiffness: 400, damping: 28, mass: 0.8 } as Transition,   // Buttons, heart pops, filter pills, toggles
  spatial: { type: 'spring', stiffness: 260, damping: 30, mass: 1.0 } as Transition,  // Shared element layoutId transitions, drawers, expanding cards
  gentle: { type: 'spring', stiffness: 140, damping: 22, mass: 1.1 } as Transition,   // Hero staggered entrance, scroll reveals, parallax
};

// Aliases for component convenience
export const snappySpring = SPRINGS.snappy;
export const spatialSpring = SPRINGS.spatial;
export const gentleFloat = SPRINGS.gentle;

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 18,
  mass: 0.9,
};

export const tapScale = {
  scale: 0.96,
  transition: SPRINGS.snappy,
};

export const hoverElevate = {
  y: -5,
  transition: SPRINGS.snappy,
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRINGS.spatial,
  },
};

export const scaleFade = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: SPRINGS.spatial,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2 },
  },
};
