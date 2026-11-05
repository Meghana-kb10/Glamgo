import React from 'react';
import { ShieldCheck, Star, Sparkles, Tag } from 'lucide-react';

export interface BadgeProps {
  type: 'verified' | 'bestseller' | 'offer' | 'rating' | 'neutral';
  text?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, className = '' }) => {
  if (type === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/15 text-success-text border border-success/30 ${className}`}>
        <ShieldCheck className="w-3 h-3 text-success-text" />
        <span>{text || 'Verified Pro'}</span>
      </span>
    );
  }

  if (type === 'bestseller') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fill text-accent-pressed border border-border-strong ${className}`}>
        <Sparkles className="w-3 h-3 text-accent-pressed" />
        <span>{text || 'Bestseller'}</span>
      </span>
    );
  }

  if (type === 'offer') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-soft text-accent-pressed border border-accent/25 ${className}`}>
        <Tag className="w-3 h-3 text-accent-pressed" />
        <span>{text || 'Offer'}</span>
      </span>
    );
  }

  if (type === 'rating') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-card border border-border shadow-warm-sm text-text ${className}`}>
        <Star className="w-3 h-3 fill-star text-star" />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-fill text-text-muted border border-border ${className}`}>
      {text}
    </span>
  );
};
