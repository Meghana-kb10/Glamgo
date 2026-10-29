import React, { useRef, useState, useEffect } from 'react';
import { Clock, Star, Plus, Minus, Flame, ArrowLeft, ArrowRight } from 'lucide-react';
import { DetailedService } from '../../services/marketplaceService';

interface MostBookedRailProps {
  services: DetailedService[];
  cartQuantities: Record<string, number>;
  onAddService: (service: DetailedService) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onSelectService: (service: DetailedService) => void;
}

export const MostBookedRail: React.FC<MostBookedRailProps> = ({
  services,
  cartQuantities,
  onAddService,
  onUpdateQuantity,
  onSelectService,
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
  }, [services]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-coral-red/10 text-coral-red flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 fill-coral-red text-coral-red" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans tracking-tight">
            Most Booked Services
          </h2>
        </div>
        <span className="text-xs text-mauve-grey hidden sm:inline">
          Trending in Bengaluru this week
        </span>
      </div>

      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous services"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Horizontal Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {services.map((srv) => {
            const qty = cartQuantities[srv.id] || 0;

            return (
              <div
                key={srv.id}
                className="w-[290px] sm:w-[350px] md:w-[370px] shrink-0 snap-start bg-white rounded-3xl border border-mist overflow-hidden shadow-xs hover:shadow-md hover:border-rose-plum/30 transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div
                  onClick={() => onSelectService(srv)}
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                >
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ink/75 backdrop-blur-md text-white">
                      {srv.category}
                    </span>
                    {srv.savingsAmount > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-xs">
                        Save ₹{srv.savingsAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-ink/70 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-champagne-gold" />
                    <span>{srv.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-mauve-grey mb-1">
                      <Star className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold" />
                      <span className="font-bold text-ink">{srv.rating}</span>
                      <span>({srv.reviewCount} reviews)</span>
                    </div>

                    <h3
                      onClick={() => onSelectService(srv)}
                      className="font-sans text-base font-bold text-ink line-clamp-1 group-hover:text-rose-plum transition-colors cursor-pointer"
                    >
                      {srv.title}
                    </h3>
                    <p className="text-xs text-mauve-grey line-clamp-2 mt-1 leading-relaxed font-sans">
                      {srv.description}
                    </p>
                  </div>

                  {/* Pricing & Add / Stepper */}
                  <div className="pt-4 mt-3 border-t border-mist/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-sans text-lg font-bold text-ink">
                          ₹{srv.price.toLocaleString('en-IN')}
                        </span>
                        {srv.originalPrice > srv.price && (
                          <span className="text-xs text-mauve-grey line-through">
                            ₹{srv.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-mauve-grey block">
                        Single-use kit included
                      </span>
                    </div>

                    {/* Add Button or Quantity Stepper */}
                    <div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => onAddService(srv)}
                          className="px-4 py-2 rounded-xl bg-white border border-rose-plum text-rose-plum text-xs font-bold hover:bg-rose-plum hover:text-white transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-blush/60 border border-rose-plum/30 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(srv.id, qty - 1)}
                            className="w-7 h-7 rounded-lg bg-white text-rose-plum flex items-center justify-center hover:bg-rose-plum hover:text-white transition-colors cursor-pointer shadow-2xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-ink font-sans">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(srv.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-white text-rose-plum flex items-center justify-center hover:bg-rose-plum hover:text-white transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
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
            aria-label="Next services"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}
      </div>
    </section>
  );
};
