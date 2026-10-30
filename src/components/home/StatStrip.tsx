import React from 'react';
import { Star, Users, ShieldCheck } from 'lucide-react';
import { MARKETING_STATS } from '../../config/marketing';

interface StatStripProps {
  className?: string;
}

export const StatStrip: React.FC<StatStripProps> = ({ className = '' }) => {
  return (
    <div
      aria-label="Verified service metrics"
      className={`w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-white/90 border border-mist shadow-xs backdrop-blur-xs flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-ink ${className}`}
    >
      {/* Stat 1: Rating */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-champagne-gold/20 flex items-center justify-center text-champagne-gold shrink-0">
          <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-ink leading-tight">
            {MARKETING_STATS.averageRating}
          </span>
          <span className="text-[11px] text-mauve-grey leading-tight">Average rating</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-mist" aria-hidden="true" />

      {/* Stat 2: Happy Customers */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blush flex items-center justify-center text-rose-plum shrink-0">
          <Users className="w-3.5 h-3.5 text-rose-plum" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-ink leading-tight">
            {MARKETING_STATS.happyCustomers}
          </span>
          <span className="text-[11px] text-mauve-grey leading-tight">Happy customers</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-mist" aria-hidden="true" />

      {/* Stat 3: Verified Pros */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-ink leading-tight">
            {MARKETING_STATS.verifiedPros}
          </span>
          <span className="text-[11px] text-mauve-grey leading-tight">Verified professionals</span>
        </div>
      </div>
    </div>
  );
};
