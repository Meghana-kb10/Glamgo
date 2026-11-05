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
    <section aria-labelledby="real-reviews-title" className={`py-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent block">
            Real Customer Voices
          </span>
          <h2
            id="real-reviews-title"
            className="font-serif text-xl sm:text-2xl font-bold text-text"
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
            className="w-9 h-9 rounded-full border border-border bg-card hover:bg-fill text-text shadow-warm-sm flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next review"
            className="w-9 h-9 rounded-full border border-border bg-card hover:bg-fill text-text shadow-warm-sm flex items-center justify-center transition-colors cursor-pointer"
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
            className="w-[290px] sm:w-[340px] shrink-0 snap-start p-5 rounded-[18px] bg-card border border-border shadow-warm-card hover:border-accent/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Avatar, Name, Location & Verified Tag */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={rev.avatarUrl}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-border shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-text truncate">
                      {rev.name}
                    </h3>
                    {rev.verifiedBooking && (
                      <span
                        title="Verified Customer Booking"
                        className="inline-flex items-center text-success shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5 fill-success/15" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{rev.city}</p>
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
                          ? 'fill-star text-star'
                          : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-accent-pressed bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20 truncate max-w-[140px]">
                  {rev.serviceTitle}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs text-text leading-relaxed italic">
                &ldquo;{rev.reviewText}&rdquo;
              </p>
            </div>

            {/* Footer with date and verified booking pill */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-text-muted">
              <span className="inline-flex items-center gap-1 font-semibold text-success-text bg-success/15 px-2 py-0.5 rounded-md">
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
