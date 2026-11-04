import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 bg-card text-text text-sm rounded-xl border transition-colors
              placeholder:text-text-muted/70 focus:outline-none
              ${leftIcon ? 'pl-11' : 'pl-4'}
              ${rightIcon || error ? 'pr-11' : 'pr-4'}
              ${
                error
                  ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                  : 'border-border-strong hover:border-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card'
              }
              ${className}
            `}
            {...props}
          />
          {error ? (
            <div className="absolute right-3.5 flex items-center text-error pointer-events-none">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : rightIcon ? (
            <div className="absolute right-3.5 flex items-center text-text-muted">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <span className="text-xs font-medium text-error flex items-center gap-1 mt-0.5">
            <span>{error}</span>
          </span>
        ) : helperText ? (
          <span className="text-xs text-text-muted mt-0.5">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
