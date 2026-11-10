import React from 'react';
import { MARKETING_STATS } from '../../config/marketing';

interface StatStripProps { className?: string; }

export const StatStrip: React.FC<StatStripProps> = ({ className = '' }) => (
  <div aria-label="Service metrics" className={`grid grid-cols-3 gap-3 py-4 text-center ${className}`}>
    {[
      [MARKETING_STATS.averageRating, 'Average rating'],
      [MARKETING_STATS.happyCustomers, 'Happy customers'],
      [MARKETING_STATS.verifiedPros, 'Verified professionals'],
    ].map(([value, label]) => (
      <div key={label}>
        <p className="text-lg sm:text-xl font-semibold text-text tabular-nums">{value}</p>
        <p className="text-xs sm:text-sm text-text-muted mt-1">{label}</p>
      </div>
    ))}
  </div>
);
