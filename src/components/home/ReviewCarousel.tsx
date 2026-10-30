import React, { useRef } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { REAL_REVIEWS, ReviewCarouselItem } from '../../config/marketing';

interface ReviewCarouselProps {
  className?: string;
  onViewAllReviews?: () => void;
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  className = '',
  onViewAllReviews,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section aria-labelledby="real-reviews-title" className={`py-8 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            Real Customer Voices
          </span>
          <h2
            id="real-reviews-title"
            className="font-serif text-xl sm:text-2xl font-bold text-ink"
          >
            Real Reviews
          </h2>
        </div>

        {/* Navigation Buttons (No autoplay) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous review"
            className="w-8 h-8 rounded-full border border-mist bg-white hover:bg-blush/60 text-ink flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next review"
            className="w-8 h-8 rounded-full border border-mist bg-white hover:bg-blush/60 text-ink flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipeable Carousel Track */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Customer review cards"
        className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x snap-mandatory"
      >
        {REAL_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="w-[290px] sm:w-[340px] shrink-0 snap-start p-5 rounded-2xl bg-white border border-mist shadow-2xs hover:border-rose-plum/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Avatar, Name, Location & Verified Tag */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={rev.avatarUrl}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-mist shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-ink truncate">
                      {rev.name}
                    </h4>
                    {rev.verifiedBooking && (
                      <span
                        title="Verified Customer Booking"
                        className="inline-flex items-center text-emerald-600 shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-100" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-mauve-grey truncate">{rev.city}</p>
                </div>
              </div>

              {/* Rating Stars & Service Tag */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-champagne-gold text-champagne-gold'
                          : 'text-mist'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-rose-plum bg-blush px-2 py-0.5 rounded-full truncate max-w-[140px]">
                  {rev.serviceTitle}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs text-ink/90 leading-relaxed italic">
                &ldquo;{rev.reviewText}&rdquo;
              </p>
            </div>

            {/* Footer with date and verified booking pill */}
            <div className="mt-4 pt-3 border-t border-mist/60 flex items-center justify-between text-[10px] text-mauve-grey">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle className="w-2.5 h-2.5" />
                <span>Verified Booking</span>
              </span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
