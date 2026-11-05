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
      className={`w-full py-3.5 px-4 sm:px-6 rounded-[18px] bg-card border border-border shadow-warm-card backdrop-blur-xs flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-text ${className}`}
    >
      {/* Stat 1: Rating */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-star/15 flex items-center justify-center text-star shrink-0">
          <Star className="w-4 h-4 fill-star text-star" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-text leading-tight">
            {MARKETING_STATS.averageRating}
          </span>
          <span className="text-[11px] text-text-muted leading-tight">Average rating</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-border" aria-hidden="true" />

      {/* Stat 2: Happy Customers */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent shrink-0">
          <Users className="w-4 h-4 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-text leading-tight">
            {MARKETING_STATS.happyCustomers}
          </span>
          <span className="text-[11px] text-text-muted leading-tight">Happy customers</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-border" aria-hidden="true" />

      {/* Stat 3: Verified Pros */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-success shrink-0">
          <ShieldCheck className="w-4 h-4 text-success" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-text leading-tight">
            {MARKETING_STATS.verifiedPros}
          </span>
          <span className="text-[11px] text-text-muted leading-tight">Verified professionals</span>
        </div>
      </div>
    </div>
  );
};
