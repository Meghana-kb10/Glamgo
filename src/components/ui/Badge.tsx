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
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 ${className}`}>
        <ShieldCheck className="w-3 h-3 text-emerald-accent" />
        <span>{text || 'Verified Pro'}</span>
      </span>
    );
  }

  if (type === 'bestseller') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-champagne-gold/15 text-champagne-gold border border-champagne-gold/30 ${className}`}>
        <Sparkles className="w-3 h-3 text-champagne-gold" />
        <span>{text || 'Bestseller'}</span>
      </span>
    );
  }

  if (type === 'offer') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blush text-rose-plum border border-rose-plum/20 ${className}`}>
        <Tag className="w-3 h-3 text-rose-plum" />
        <span>{text || 'Offer'}</span>
      </span>
    );
  }

  if (type === 'rating') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white border border-mist shadow-xs text-ink ${className}`}>
        <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-mist text-mauve-grey ${className}`}>
      {text}
    </span>
  );
};
