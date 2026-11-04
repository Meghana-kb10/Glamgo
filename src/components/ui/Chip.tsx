import React from 'react';
import { motion } from 'framer-motion';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  count?: number | string;
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  count,
  className = '',
  disabled = false,
}) => {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium
        transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        min-h-[40px] cursor-pointer border
        ${
          selected
            ? 'bg-fill text-accent border-accent shadow-warm-sm font-semibold'
            : 'bg-card text-text border-border hover:border-border-strong hover:bg-fill/40'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className={`shrink-0 ${selected ? 'text-accent' : 'text-text-muted'}`}>{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
            selected ? 'bg-accent-soft text-accent' : 'bg-fill text-text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
};
