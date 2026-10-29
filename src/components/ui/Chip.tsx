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
        transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum
        min-h-[40px] cursor-pointer border
        ${
          selected
            ? 'bg-rose-plum text-white border-rose-plum shadow-sm'
            : 'bg-white text-ink border-mist hover:border-rose-plum/40 hover:bg-blush/20'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
            selected ? 'bg-white/20 text-white' : 'bg-blush text-rose-plum'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
};
