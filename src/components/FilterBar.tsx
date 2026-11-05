import React from 'react';
import { SlidersHorizontal, Home, Building2, Award, Zap, Star } from 'lucide-react';
import { Chip } from './ui/Chip';

export interface FilterState {
  atHome: boolean;
  studioVisit: boolean;
  bridalCertified: boolean;
  instantBook: boolean;
  rating48: boolean;
  sort: 'featured' | 'price-asc' | 'rating';
}

interface FilterBarProps {
  filters: FilterState;
  onToggleFilter: (key: keyof Omit<FilterState, 'sort'>) => void;
  onSortChange: (sort: FilterState['sort']) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onToggleFilter,
  onSortChange,
  totalResults,
}) => {
  const filterPills = [
    { key: 'atHome' as const, label: 'At-Home Service', icon: Home, active: filters.atHome },
    { key: 'studioVisit' as const, label: 'Studio Visit', icon: Building2, active: filters.studioVisit },
    { key: 'bridalCertified' as const, label: 'Bridal Certified', icon: Award, active: filters.bridalCertified },
    { key: 'instantBook' as const, label: 'Instant Book', icon: Zap, active: filters.instantBook },
    { key: 'rating48' as const, label: 'Rating 4.8+', icon: Star, active: filters.rating48 },
  ];

  return (
    <div className="py-3.5 border-b border-border bg-bg/95 sticky top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Standardized Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            <span>Filters:</span>
          </div>

          {filterPills.map(({ key, label, icon: Icon, active }) => (
            <Chip
              key={key}
              label={label}
              selected={active}
              onClick={() => onToggleFilter(key)}
              icon={<Icon className={`w-3.5 h-3.5 ${active ? 'text-accent-pressed' : 'text-accent'}`} />}
              className="shrink-0 text-xs py-1.5 min-h-[38px]"
            />
          ))}
        </div>

        {/* Right: Results Count & Accessible Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 text-xs">
          <span className="text-text-muted font-medium">
            Showing <strong className="text-text font-mono font-semibold">{totalResults}</strong> master artists
          </span>

          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-select" className="text-text-muted cursor-pointer font-medium">
              Sort:
            </label>
            <select
              id="sort-select"
              aria-label="Sort master artists"
              value={filters.sort}
              onChange={(e) => onSortChange(e.target.value as FilterState['sort'])}
              className="bg-card border border-border text-text text-xs rounded-xl px-3 py-1.5 outline-none font-medium cursor-pointer shadow-warm-xs focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            >
              <option value="featured">Featured & High Demand</option>
              <option value="rating">Top Rated (4.9+)</option>
              <option value="price-asc">Starting Price: Low to High</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
