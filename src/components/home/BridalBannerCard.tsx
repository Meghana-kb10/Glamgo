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
    <section
      aria-label="Bridal & Occasion Banner"
      className={`p-5 sm:p-7 rounded-[22px] bg-bg-alt border border-border/80 shadow-warm-sm ${className}`}
    >
      <div
        onClick={() => onSelectCategory('bridal')}
        className="group relative rounded-[20px] overflow-hidden cursor-pointer shadow-warm-lg border border-border bg-text text-white"
      >
        {/* Background Image with Fixed Ratio */}
        <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=70&fm=webp"
            alt="Royal Bridal Atelier - Couture Transformations"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            loading="lazy"
            decoding="async"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-text via-text/80 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-star/20 border border-star/40 text-star text-xs font-bold uppercase tracking-wider mb-3 w-fit">
              <Crown className="w-3.5 h-3.5 text-star" />
              <span>Royal Bridal Atelier</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Curated bridal suites for your dream day
            </h2>

            <p className="text-xs sm:text-sm text-white/85 line-clamp-2 mb-5 font-normal leading-relaxed">
              Master MUAs with 4K HD formulas, pinless saree pleating, and certified sterile tools. Limited dates for 2026 wedding season.
            </p>

            <div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-[14px] bg-star text-text font-bold text-xs sm:text-sm hover:bg-star/90 transition-colors shadow-warm-sm flex items-center gap-2 cursor-pointer"
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
