import React, { useRef, useState, useEffect } from 'react';
import { Clock, Star, Plus, Minus, Flame, ArrowLeft, ArrowRight } from 'lucide-react';
import { DetailedService } from '../../services/marketplaceService';

interface MostBookedRailProps {
  services: DetailedService[];
  cartQuantities: Record<string, number>;
  onAddService: (service: DetailedService) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onSelectService: (service: DetailedService) => void;
  onOpenCart: () => void;
}

export const MostBookedRail: React.FC<MostBookedRailProps> = ({
  services,
  cartQuantities,
  onAddService,
  onUpdateQuantity,
  onSelectService,
  onOpenCart,
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
    <section className="py-2">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent-soft text-accent flex items-center justify-center">
            <Flame className="w-4 h-4 fill-accent text-accent" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text font-serif tracking-tight">
            Most Booked Services
          </h2>
        </div>
        <span className="text-xs text-text-muted hidden sm:inline">
          Trending in your area this week
        </span>
      </div>

      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous services"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card text-text shadow-warm-md border border-border flex items-center justify-center hover:bg-fill active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-text" />
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
                className="w-[290px] sm:w-[350px] md:w-[370px] shrink-0 snap-start bg-card rounded-[18px] border border-border overflow-hidden shadow-warm-card hover:shadow-warm-lg hover:border-accent/40 transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <button
                  type="button"
                  aria-label={`View ${srv.title}`}
                  onClick={() => onSelectService(srv)}
                  className="relative block w-full aspect-[16/10] overflow-hidden cursor-pointer"
                >
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text/50 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-text/80 backdrop-blur-md text-white">
                      {srv.category}
                    </span>
                    {srv.savingsAmount > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success text-white shadow-warm-sm">
                        Save ₹{srv.savingsAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-text/75 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-star" />
                    <span>{srv.durationMinutes} mins</span>
                  </div>
                </button>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                      <Star className="w-3.5 h-3.5 text-star fill-star" />
                      <span className="font-bold text-text">{srv.rating}</span>
                      <span>({srv.reviewCount} reviews)</span>
                    </div>

                    <h3 className="font-sans text-base font-bold text-text">
                      <button type="button" onClick={() => onSelectService(srv)} className="text-left leading-snug hover:underline underline-offset-4">{srv.title}</button>
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed font-sans">
                      {srv.description}
                    </p>
                  </div>

                  {/* Pricing & Add / Stepper */}
                  <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-sans text-lg font-bold text-text">
                          ₹{srv.price.toLocaleString('en-IN')}
                        </span>
                        {srv.originalPrice > srv.price && (
                          <span className="text-xs text-text-muted line-through">
                            ₹{srv.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-muted block">
                        Single-use kit included
                      </span>
                    </div>

                    {/* Add Button or Quantity Stepper */}
                    <div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => onAddService(srv)}
                          aria-label={`Add ${srv.title}`}
                          className="min-h-11 px-4 py-2 rounded-[14px] bg-card border border-accent text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all shadow-warm-sm cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-accent-soft border border-accent/30 rounded-[14px] p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(srv.id, qty - 1)}
                            aria-label={`Remove one ${srv.title}`}
                            className="w-11 h-11 rounded-[10px] bg-card text-accent-pressed flex items-center justify-center hover:bg-accent hover:text-white transition-colors cursor-pointer shadow-warm-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-text font-sans">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={onOpenCart}
                            aria-label={`View cart with ${srv.title}`}
                            className="min-h-11 px-2 rounded-[10px] bg-card text-accent-pressed flex items-center justify-center hover:bg-accent hover:text-white text-xs font-semibold cursor-pointer"
                          >
                            View cart
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
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card text-text shadow-warm-md border border-border flex items-center justify-center hover:bg-fill active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-text" />
          </button>
        )}
      </div>
    </section>
  );
};
