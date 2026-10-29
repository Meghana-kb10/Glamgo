import React, { useRef, useState, useEffect } from 'react';
import { Crown, Sparkles, CheckCircle2, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { DetailedService } from '../../services/marketplaceService';
import { Button } from '../ui/Button';

interface BridalPackagesRailProps {
  packages: DetailedService[];
  onSelectPackage: (pkg: DetailedService) => void;
  onBookNow: (pkg: DetailedService) => void;
}

export const BridalPackagesRail: React.FC<BridalPackagesRailProps> = ({
  packages,
  onSelectPackage,
  onBookNow,
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
  }, [packages]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 460;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E7] to-[#F7EAD0] border border-[#C9A25B]/40 shadow-sm relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#C9A25B]/25 text-amber-900 flex items-center justify-center">
            <Crown className="w-4 h-4 text-amber-800" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900 font-sans">
            Couture Bridal Studio
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink font-sans tracking-tight">
            Signature Royal Wedding Packages
          </h2>
          <p className="text-xs text-mauve-grey mt-1 sm:mt-0 font-sans">
            Gold-Standard Artistry • Pre-Wedding Consultations Included
          </p>
        </div>

        <div className="relative group/rail">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous bridal packages"
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-[#C9A25B]/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
          )}

          {/* Horizontal Rail */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="w-[320px] sm:w-[420px] md:w-[460px] shrink-0 snap-start bg-white rounded-3xl border border-[#C9A25B]/40 p-6 shadow-xs flex flex-col justify-between hover:border-[#C9A25B] hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-mist/80">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-[#C9A25B]/20 px-2.5 py-0.5 rounded-md border border-[#C9A25B]/30 font-sans">
                        Tier 1 Master Artist
                      </span>
                      <h3
                        onClick={() => onSelectPackage(pkg)}
                        className="font-sans text-lg sm:text-xl font-bold text-ink mt-2 cursor-pointer hover:text-rose-plum transition-colors line-clamp-1"
                      >
                        {pkg.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-mauve-grey mt-1 font-sans">
                        <Clock className="w-3.5 h-3.5 text-champagne-gold" />
                        <span>{pkg.durationMinutes} mins dedicated transformation</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-sans text-xl sm:text-2xl font-bold text-ink block">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-emerald-700 font-bold block">
                        Save ₹{pkg.savingsAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* What's included checklist */}
                  <div className="py-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mauve-grey block mb-1 font-sans">
                      What's Included
                    </span>
                    {pkg.whatIsIncluded.slice(0, 4).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink">
                        <CheckCircle2 className="w-4 h-4 text-champagne-gold shrink-0" />
                        <span className="line-clamp-1 font-sans">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-mist/80 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => onSelectPackage(pkg)}
                  >
                    View Details
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onBookNow(pkg)}
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Reserve Date
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next bridal packages"
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-[#C9A25B]/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 text-ink" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
