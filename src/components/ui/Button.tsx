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
  const baseStyles = 'inline-flex items-center justify-center font-heading font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs rounded-[14px] gap-1.5 min-h-[36px]',
    md: 'h-11 px-5 text-sm rounded-[14px] gap-2 min-h-[44px]',
    lg: 'h-[52px] px-6 text-base rounded-[14px] gap-2.5 min-h-[52px]',
  };

  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-accent-pressed active:bg-accent-pressed shadow-warm-sm',
    secondary: 'bg-transparent border-[1.5px] border-accent text-accent hover:bg-accent-soft active:bg-accent-soft/80',
    ghost: 'bg-transparent text-accent hover:bg-accent-soft active:bg-accent-soft/80',
    gold: 'bg-star text-white hover:brightness-95 active:brightness-90 shadow-warm-sm',
    danger: 'bg-error text-white hover:opacity-90 active:opacity-100 shadow-warm-sm',
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
