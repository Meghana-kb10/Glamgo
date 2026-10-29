import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Star, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface BookAgainItem {
  id: string;
  booking_number: string;
  professional_id: string;
  serviceTitle: string;
  artistName: string;
  artistAvatar: string;
  serviceImage?: string;
  rating: number;
  pastDate: string;
  price: number;
  venue_address?: string;
}

interface BookAgainRailProps {
  bookings: BookAgainItem[];
  onBookAgain: (booking: any) => void;
}

export const BookAgainRail: React.FC<BookAgainRailProps> = ({
  bookings,
  onBookAgain,
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
  }, [bookings]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!bookings || bookings.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-6 h-6 rounded-full bg-blush text-rose-plum flex items-center justify-center">
          <RotateCcw className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-ink font-sans tracking-tight">
          Book Again
        </h2>
        <span className="text-xs text-mauve-grey font-medium hidden sm:inline font-sans">
          • Repeat your favorite looks in 1 tap
        </span>
      </div>

      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous bookings"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Horizontal Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {bookings.map((bk) => (
            <div
              key={bk.id}
              className="w-[310px] sm:w-[350px] p-4 rounded-2xl bg-white border border-mist shadow-xs flex flex-col justify-between hover:border-rose-plum/40 hover:shadow-md transition-all shrink-0 snap-start group"
            >
              {/* Card Body */}
              <div className="flex items-start gap-3.5">
                {/* Lookbook Thumbnail + Floating Artist Avatar */}
                <div 
                  className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-mist bg-soft-ivory shadow-2xs"
                  style={{ width: '76px', height: '76px', minWidth: '76px', minHeight: '76px' }}
                >
                  <img
                    src={bk.serviceImage || bk.artistAvatar}
                    alt={bk.serviceTitle}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <img
                    src={bk.artistAvatar}
                    alt={bk.artistName}
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white object-cover shadow-xs"
                    title={`Artist: ${bk.artistName}`}
                  />
                </div>

                {/* Service & Booking Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-blush/60 text-rose-plum text-[10px] font-semibold font-sans">
                      {bk.pastDate}
                    </span>
                    <span className="font-sans text-sm font-bold text-rose-plum tabular-nums shrink-0">
                      ₹{bk.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="font-sans text-sm font-bold text-ink line-clamp-1 mt-1 group-hover:text-rose-plum transition-colors">
                    {bk.serviceTitle}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-mauve-grey mt-0.5 font-sans">
                    <span className="truncate">by {bk.artistName}</span>
                    <span className="text-mist">•</span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 text-champagne-gold fill-champagne-gold" />
                      <span className="font-semibold text-ink text-[11px]">{bk.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solid Action Button */}
              <Button
                type="button"
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onBookAgain(bk)}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="mt-3.5 text-xs font-semibold h-9 rounded-xl shadow-xs"
                style={{ backgroundColor: '#B8336A', color: '#FFFFFF' }}
              >
                Book Again
              </Button>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next bookings"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}
      </div>
    </section>
  );
};
