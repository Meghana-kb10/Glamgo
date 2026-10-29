import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5 min-h-[36px]',
    md: 'h-11 px-5 text-sm rounded-xl gap-2 min-h-[44px]',
    lg: 'h-[52px] px-6 text-base rounded-xl gap-2.5 min-h-[52px]',
  };

  const variantStyles = {
    primary: 'bg-rose-plum text-white hover:bg-deep-plum active:bg-deep-plum shadow-sm',
    secondary: 'bg-transparent border border-rose-plum text-rose-plum hover:bg-blush/40 active:bg-blush/60',
    ghost: 'bg-transparent text-rose-plum hover:bg-blush/30 active:bg-blush/50',
    gold: 'bg-champagne-gold text-white hover:bg-amber-accent active:bg-amber-accent shadow-sm',
    danger: 'bg-coral-red text-white hover:opacity-90 active:opacity-100 shadow-sm',
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        ...(variant === 'primary' ? { backgroundColor: '#B8336A', color: '#FFFFFF' } : {}),
        ...(variant === 'gold' ? { backgroundColor: '#C9A25B', color: '#FFFFFF' } : {}),
        ...(variant === 'danger' ? { backgroundColor: '#D6455D', color: '#FFFFFF' } : {}),
        ...props.style,
      }}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
