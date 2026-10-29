import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { SpotlightItem } from '../../services/marketplaceService';

interface SpotlightRailProps {
  items: SpotlightItem[];
  onSelectCategory: (category: string) => void;
  onBookItem?: (item: SpotlightItem) => void;
}

export const SpotlightRail: React.FC<SpotlightRailProps> = ({
  items,
  onSelectCategory,
  onBookItem,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 420;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCardClick = (item: SpotlightItem) => {
    if (onBookItem) {
      onBookItem(item);
    } else {
      onSelectCategory(item.category);
    }
  };

  if (!items.length) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans tracking-tight">
          In the spotlight
        </h2>
      </div>

      {/* Rail Container */}
      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous spotlight items"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Horizontal Scrolling Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {items.map((item) => {
            const isLightCta = item.ctaVariant === 'light';

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="relative shrink-0 w-[300px] sm:w-[380px] md:w-[410px] h-[190px] sm:h-[210px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none snap-start group transition-transform duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                style={{ backgroundColor: item.bgColor }}
              >
                {/* Photo on Right */}
                <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle blend gradient from background color to photo */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${item.bgColor} 0%, ${item.bgColor}80 20%, transparent 80%)`,
                    }}
                  />
                </div>

                {/* Left Content Area */}
                <div className="relative z-10 w-[60%] sm:w-[65%] h-full p-5 sm:p-6 flex flex-col justify-between text-white">
                  <div>
                    {item.badge && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wide mb-2 shadow-xs"
                        style={{
                          backgroundColor: item.badgeBg || '#5A1C32',
                          color: item.badgeColor || '#FFFFFF',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold leading-tight text-white line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/85 mt-1 font-sans line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer ${
                        isLightCta
                          ? 'bg-white text-ink hover:bg-white/95'
                          : 'bg-ink text-white hover:bg-ink/90'
                      }`}
                    >
                      {item.ctaText || 'Book now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next spotlight items"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}
      </div>
    </section>
  );
};
