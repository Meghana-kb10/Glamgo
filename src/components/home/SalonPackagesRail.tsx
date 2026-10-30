import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Clock, Check, Star, ShieldCheck, ArrowRight, ArrowLeft, Plus, CheckCircle2, ChevronRight, PackageCheck } from 'lucide-react';
import { ValuePackageCombo } from '../../services/marketplaceService';
import { triggerChampagneSparkles } from '../../utils/confetti';

interface SalonPackagesRailProps {
  packages: ValuePackageCombo[];
  onSelectPackage: (pkg: ValuePackageCombo) => void;
  onBookPackage: (pkg: ValuePackageCombo) => void;
  isPackageAdded?: (pkgId: string) => boolean;
}

export const SalonPackagesRail: React.FC<SalonPackagesRailProps> = ({
  packages,
  onSelectPackage,
  onBookPackage,
  isPackageAdded,
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
    const scrollAmount = 420;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleAdd = (e: React.MouseEvent, pkg: ValuePackageCombo) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    onBookPackage(pkg);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with UC/YesMadam style savings accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Urban Company &amp; Yes Madam Benchmark
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
            Save with Curated Salon Packages &amp; Combos
          </h2>
          <p className="text-xs sm:text-sm text-mauve-grey font-sans leading-relaxed">
            Head-to-toe beauty rituals bundled for maximum savings. Every package includes sealed single-use mono-packs opened right in front of you.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-rose-plum bg-blush px-3 py-1 rounded-full border border-mist">
            Guaranteed Savings up to 35%
          </span>
        </div>
      </div>

      <div className="relative group/rail">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous packages"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next packages"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Scrollable Package Cards Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {packages.map((pkg) => {
            const isAdded = isPackageAdded ? isPackageAdded(pkg.id) : false;

            return (
              <div
                key={pkg.id}
                onClick={() => onSelectPackage(pkg)}
                className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 snap-start bg-white rounded-3xl border border-mist hover:border-champagne-gold/60 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* 1. Photography & Savings Pill Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-mist/20">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

                  {/* Savings Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                      Save ₹{pkg.savingsAmount.toLocaleString('en-IN')} ({pkg.discountPercent}% OFF)
                    </span>
                  </div>

                  {/* Rating & Duration Overlay */}
                  <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md border border-white/10 font-bold">
                      <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                      <span>{pkg.rating.toFixed(2)}</span>
                      <span className="text-white/70 font-normal">({pkg.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md border border-white/10 font-mono">
                      <Clock className="w-3.5 h-3.5 text-champagne-gold" />
                      <span>{pkg.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* 2. Body: Inclusions & Sealed Kit Guarantee */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-ink group-hover:text-rose-plum transition-colors line-clamp-1">
                      {pkg.name}
                    </h3>

                    <p className="text-xs text-mauve-grey leading-relaxed line-clamp-2">
                      {pkg.tagline}
                    </p>

                    {/* Included Treatments Checklist (UC Style) */}
                    <div className="pt-2 space-y-1.5 border-t border-mist/80">
                      <span className="text-[10px] uppercase font-bold text-ink tracking-wider block">
                        Included in This Package ({pkg.includedServices.length} Treatments):
                      </span>
                      {pkg.includedServices.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-ink/90">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 text-[11px] font-sans">{inc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Yes Madam Style Sealed Kit Guarantee Pill */}
                    <div className="p-2.5 rounded-xl bg-blush/35 border border-rose-plum/20 flex items-center gap-2 text-[11px] text-ink font-sans">
                      <ShieldCheck className="w-4 h-4 text-rose-plum shrink-0" />
                      <span className="line-clamp-1 font-medium">{pkg.hygieneProtocol}</span>
                    </div>
                  </div>

                  {/* 3. Pricing & Booking Action */}
                  <div className="pt-4 border-t border-mist flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-ink tabular-nums">
                          ₹{pkg.packagePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-mauve-grey line-through tabular-nums">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Includes all single-use disposables
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAdd(e, pkg)}
                      className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-plum hover:bg-deep-plum text-white hover:shadow-luxury'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-white" />
                          <span>Add Package</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};