import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AudienceType, AUDIENCE_DATA } from '../../config/marketing';

interface CategoryTilesProps {
  audience: AudienceType;
  onSelectCategory: (categorySlug: string) => void;
  onViewAll?: () => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  audience,
  onSelectCategory,
  onViewAll,
}) => {
  const currentAudienceData = AUDIENCE_DATA[audience] || AUDIENCE_DATA.women;
  // Get 8 categories for 2x4 photo tile grid
  const tiles = currentAudienceData.categories.slice(0, 8);

  return (
    <section aria-labelledby="category-tiles-title" className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            Tailored for {currentAudienceData.label}
          </span>
          <h2
            id="category-tiles-title"
            className="font-serif text-xl sm:text-2xl font-bold text-ink"
          >
            Explore Categories
          </h2>
        </div>

        <button
          type="button"
          onClick={() => (onViewAll ? onViewAll() : onSelectCategory('all'))}
          className="text-xs font-semibold text-rose-plum hover:text-deep-plum flex items-center gap-1 cursor-pointer"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2x4 Photo Tiles Grid (2 cols mobile, 4 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {tiles.map((cat, idx) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => onSelectCategory(cat.slug)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-mist hover:border-rose-plum/30 bg-blush/20"
          >
            {/* Background Photo */}
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading={idx < 4 ? 'eager' : 'lazy'}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

            {/* Label Overlay */}
            <div className="absolute inset-x-3 bottom-3 text-white">
              <h3 className="font-heading font-bold text-sm sm:text-base leading-tight drop-shadow-xs">
                {cat.name}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-normal">
                {cat.tagline}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
