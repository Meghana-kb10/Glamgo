import React from 'react';
import { motion } from 'framer-motion';
import { AudienceType } from '../../config/marketing';

interface AudienceSwitcherProps {
  currentAudience: AudienceType;
  onChangeAudience: (audience: AudienceType) => void;
  className?: string;
}

const AUDIENCE_OPTIONS: { id: AudienceType; label: string }[] = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'kids', label: 'Kids' },
];

export const AudienceSwitcher: React.FC<AudienceSwitcherProps> = ({
  currentAudience,
  onChangeAudience,
  className = '',
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Select target audience"
      className={`inline-flex items-center p-0.5 rounded-full bg-card border border-border shadow-warm-sm ${className}`}
    >
      {AUDIENCE_OPTIONS.map((opt) => {
        const isSelected = currentAudience === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            type="button"
            onClick={() => onChangeAudience(opt.id)}
            className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              isSelected ? 'text-white' : 'text-text-muted hover:text-text'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="audience-pill-indicator"
                className="absolute inset-0 rounded-full bg-accent shadow-warm-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
