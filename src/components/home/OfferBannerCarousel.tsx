import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';
import { OfferBanner } from '../../services/marketplaceService';
import { useToast } from '../../context/ToastContext';

interface OfferBannerCarouselProps {
  offers: OfferBanner[];
  onSelectOffer: (offer: OfferBanner) => void;
}

export const OfferBannerCarousel: React.FC<OfferBannerCarouselProps> = ({
  offers,
  onSelectOffer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const toast = useToast();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPaused || offers.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, offers.length]);

  if (!offers.length) return null;
  const current = offers[currentIndex];

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`, 'Promo Ready');
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        onClick={() => onSelectOffer(current)}
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[360px] rounded-3xl overflow-hidden border border-mist shadow-md cursor-pointer group"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {/* Background Image with Gradient Overlay */}
            <img
              src={current.imageUrl}
              alt={current.title}
              fetchPriority="high"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent sm:w-2/3" />

            {/* Banner Content */}
            <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-between text-white max-w-xl">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-champagne-gold/30 text-amber-200 border border-champagne-gold/40 mb-2">
                  {current.badge}
                </span>
                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-sm text-balance">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-2 font-sans font-medium">
                  {current.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, current.code)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-white/30 transition-colors"
                  title="Copy code"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span>{current.code}</span>
                  <span className="text-[10px] text-amber-300 font-sans font-semibold">({current.discount})</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>{current.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-3 right-4 sm:bottom-5 sm:right-8 z-10 flex items-center gap-1.5">
          {offers.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className="p-1.5 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer"
            >
              <span
                className={`h-1.5 rounded-full transition-all block ${
                  currentIndex === idx ? 'w-6 bg-champagne-gold' : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
