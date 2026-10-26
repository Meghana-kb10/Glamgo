import { Transition } from 'framer-motion';

export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};

export const spatialSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 1.0,
};

export const gentleFloat: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 22,
  mass: 1.2,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 18,
  mass: 0.9,
};

export const tapScale = {
  scale: 0.96,
  transition: snappySpring,
};

export const hoverElevate = {
  y: -5,
  transition: snappySpring,
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
    transition: spatialSpring,
  },
};

export const scaleFade = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: spatialSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2 },
  },
};
