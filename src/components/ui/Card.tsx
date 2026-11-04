import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'surface' | 'cream' | 'flat' | 'blush';
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
    surface: 'bg-card border border-border shadow-warm-card',
    cream: 'bg-bg-alt border border-border shadow-warm-sm',
    flat: 'bg-card border border-border',
    blush: 'bg-accent-soft/50 border border-border shadow-warm-sm',
  };

  return (
    <motion.div
      whileHover={isInteractive ? { y: -2, transition: { duration: 0.15 } } : undefined}
      whileTap={isInteractive ? { scale: 0.99 } : undefined}
      className={`
        rounded-[18px] overflow-hidden transition-all
        ${variantStyles[variant]}
        ${isInteractive ? 'cursor-pointer hover:border-border-strong' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
