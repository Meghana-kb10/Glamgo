import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Home, Building2, Award, Zap, Star, ShieldCheck } from 'lucide-react';
import { snappySpring } from '../constants/motion';

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
    <div className="py-4 border-b border-rose-gold/10 bg-canvas-light/95 sticky top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Animated Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-obsidian-muted font-medium mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-gold" />
            <span>Filters:</span>
          </div>

          {filterPills.map(({ key, label, icon: Icon, active }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.96 }}
              transition={snappySpring}
              onClick={() => onToggleFilter(key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border ${
                active
                  ? 'bg-obsidian text-white border-obsidian shadow-sm'
                  : 'bg-white/80 hover:bg-white text-obsidian border-rose-gold/20 hover:border-rose-gold/40 shadow-sm'
              }`}
            >
              <Icon className={`w-3 h-3 ${active ? 'text-champagne-light' : 'text-rose-gold'}`} />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 text-xs">
          <span className="text-obsidian-subtle font-medium">
            Showing <strong className="text-obsidian font-mono">{totalResults}</strong> master artists
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-obsidian-subtle">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => onSortChange(e.target.value as FilterState['sort'])}
              className="bg-white border border-rose-gold/20 text-obsidian text-xs rounded-lg px-2.5 py-1 outline-none font-medium cursor-pointer shadow-sm focus:border-rose-gold"
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
