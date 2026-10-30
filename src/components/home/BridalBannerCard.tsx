import React from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

interface BridalBannerCardProps {
  onSelectCategory: (categorySlug: string) => void;
  className?: string;
}

export const BridalBannerCard: React.FC<BridalBannerCardProps> = ({
  onSelectCategory,
  className = '',
}) => {
  return (
    <section aria-label="Bridal & Occasion Banner" className={`py-6 ${className}`}>
      <div
        onClick={() => onSelectCategory('bridal')}
        className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-card border border-mist bg-ink text-white"
      >
        {/* Background Image with Fixed Ratio */}
        <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80"
            alt="Royal Bridal Atelier - Sabyasachi & Couture Transformations"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            loading="lazy"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-gold/25 border border-champagne-gold/40 text-champagne-gold text-xs font-bold uppercase tracking-wider mb-3 w-fit">
              <Crown className="w-3.5 h-3.5 text-champagne-gold" />
              <span>Royal Bridal Atelier</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Curated bridal suites for your dream day
            </h2>

            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-5 font-normal leading-relaxed">
              Master MUAs with 4K HD formulas, pinless saree pleating, and certified sterile tools. Limited dates for 2026 wedding season.
            </p>

            <div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-champagne-gold text-ink font-bold text-xs sm:text-sm group-hover:bg-champagne-gold/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Bridal Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
