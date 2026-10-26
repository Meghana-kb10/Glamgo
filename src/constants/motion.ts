import { Transition } from 'framer-motion';

/**
 * Impeccable Motion Primitives & Calibrated Physics
 * Apple & Linear-grade damped physical micro-movements.
 * Eliminates generic rubber-band cartoon oscillations.
 */
export const MOTION_PRIMITIVES = {
  // Tactile click / micro-interactions (sub-180ms settling, feels like a physical taptic click)
  tactile: { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 } as Transition,
  
  // Spatial element layoutId transitions, drawers, modal presentations, and expanding cards
  spatial: { type: 'spring', stiffness: 280, damping: 28, mass: 1.0 } as Transition,
  
  // Soft editorial cascade / staggered entrance
  reveal: { type: 'spring', stiffness: 180, damping: 26, mass: 1.0 } as Transition,
  
  // Sub-200ms crisp mechanical UI transitions
  crisp: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } as Transition,
};

// Aliases for component convenience and backward-compatibility
export const SPRINGS = {
  snappy: MOTION_PRIMITIVES.tactile,
  spatial: MOTION_PRIMITIVES.spatial,
  gentle: MOTION_PRIMITIVES.reveal,
};

export const snappySpring = MOTION_PRIMITIVES.tactile;
export const spatialSpring = MOTION_PRIMITIVES.spatial;
export const gentleFloat = MOTION_PRIMITIVES.reveal;

// Damped subtle spring replacing uncontrolled bouncy bounce
export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 440,
  damping: 28,
  mass: 0.85,
};

// 1px tactile mechanical depression (replaces exaggerated shrinking)
export const tapScale = {
  scale: 0.98,
  y: 1,
  transition: MOTION_PRIMITIVES.tactile,
};

// Refined 2px elevation with specular lift (replaces unnatural 5px floating)
export const hoverElevate = {
  y: -2,
  transition: MOTION_PRIMITIVES.tactile,
};

export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0) => ({
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
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: MOTION_PRIMITIVES.spatial,
  },
};

export const scaleFade = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: MOTION_PRIMITIVES.spatial,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
  },
};
