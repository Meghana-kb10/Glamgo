import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'surface' | 'blush' | 'flat';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  isInteractive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-white border border-mist shadow-card',
    blush: 'bg-blush/40 border border-mist shadow-card',
    flat: 'bg-white border border-mist',
  };

  return (
    <motion.div
      whileHover={isInteractive ? { y: -2, transition: { duration: 0.15 } } : undefined}
      whileTap={isInteractive ? { scale: 0.99 } : undefined}
      className={`
        rounded-2xl overflow-hidden transition-all
        ${variantStyles[variant]}
        ${isInteractive ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
