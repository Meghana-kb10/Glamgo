import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AudienceType, AUDIENCE_DATA } from '../../config/marketing';

interface CategoryTilesProps {
  audience: AudienceType;
  onSelectCategory: (categorySlug: string) => void;
  onViewAll?: () => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ audience, onSelectCategory, onViewAll }) => {
  const currentAudienceData = AUDIENCE_DATA[audience] || AUDIENCE_DATA.women;
  const tiles = currentAudienceData.categories.slice(0, 8);
  return (
    <section aria-labelledby="category-tiles-title">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 id="category-tiles-title" className="font-heading text-xl sm:text-2xl font-semibold text-text">Find your next treatment</h2>
          <p className="text-sm text-text-muted mt-1">Explore services for {currentAudienceData.label.toLowerCase()}</p>
        </div>
        <button type="button" onClick={() => onViewAll ? onViewAll() : onSelectCategory('all')} className="min-h-11 shrink-0 text-sm font-semibold text-text flex items-center gap-1">
          See all <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
        {tiles.map((cat) => (
          <button type="button" key={cat.id} onClick={() => onSelectCategory(cat.slug)} className="group block min-w-0 text-left rounded-xl" aria-label={`Explore ${cat.name}`}>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-fill">
              <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base text-text group-hover:underline underline-offset-4">{cat.name}</h3>
              <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mt-1">{cat.tagline}</p>
          </button>
        ))}
      </div>
    </section>
  );
};
