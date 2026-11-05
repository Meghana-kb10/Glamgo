import React from 'react';
import { Search, Sparkles, MapPin, ChevronRight } from 'lucide-react';
import { StatStrip } from './StatStrip';
import { LocationItem } from '../../services/marketplaceService';
import { AudienceType } from '../../config/marketing';

interface HeroHomeProps {
  currentLocation: LocationItem;
  onOpenSearch: () => void;
  onOpenLocationSheet: () => void;
  onSelectCategory: (categorySlug: string) => void;
  audience: AudienceType;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  currentLocation,
  onOpenSearch,
  onOpenLocationSheet,
  onSelectCategory,
  audience,
}) => {
  const quickChips = [
    { label: 'Facial', slug: 'skin' },
    { label: 'Haircut', slug: 'hair' },
    { label: 'Waxing', slug: 'waxing' },
  ];

  return (
    <section
      aria-label="Welcome hero banner"
      className="relative overflow-hidden pt-2 pb-6 sm:py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Search Bar & Quick Chips */}
          <div className="lg:col-span-7 space-y-5">
            {/* Location Pill Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-xs font-semibold text-accent">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Serving {currentLocation.name}, {currentLocation.city}</span>
              <button
                type="button"
                onClick={onOpenLocationSheet}
                className="underline hover:text-accent-pressed ml-1 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Headline & Subtext */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text tracking-tight leading-[1.15]">
                Beauty services at your doorstep
              </h1>
              <p className="text-sm sm:text-base text-text-muted max-w-xl font-normal leading-relaxed">
                Certified salon, hair, skin &amp; bridal professionals delivering genuine mono-dose care in the comfort of your home.
              </p>
            </div>

            {/* Search Bar Input (Triggers Search Modal) */}
            <div className="max-w-xl">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search for 'Facial', 'Blowdry', 'Waxing'..."
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-[18px] bg-card border border-border shadow-warm-card hover:border-accent/50 hover:shadow-warm-md transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-fill flex items-center justify-center text-accent-pressed shrink-0 group-hover:scale-105 transition-transform">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs sm:text-sm font-normal text-text-muted">
                      Search for &apos;Facial&apos;, &apos;Blowdry&apos;, &apos;Waxing&apos;...
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-accent-pressed bg-fill border border-border px-3 py-1 rounded-full shrink-0">
                  <span>Search</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Quick Chips: Facial, Haircut, Waxing */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-text-muted font-medium">Popular right now:</span>
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => onSelectCategory(chip.slug)}
                  className="px-3 py-1 rounded-full bg-card hover:bg-fill border border-border text-xs font-semibold text-text shadow-warm-sm hover:border-accent/40 transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3-Image Photo Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full max-w-lg mx-auto">
              
              {/* Image 1: Main Large Canvas */}
              <div
                className="absolute inset-0 w-3/4 h-full rounded-[22px] overflow-hidden shadow-warm-lg border border-border bg-fill/30 z-10"
              >
                <img
                  src="/images/hero-1.webp"
                  alt="Professional hair and styling at home"
                  width={360}
                  height={270}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text/35 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Image 2: Top Right Small Overlap */}
              <div
                className="absolute top-0 right-0 w-1/2 h-3/5 rounded-[18px] overflow-hidden shadow-warm-card border border-border bg-fill/20 z-20"
              >
                <img
                  src="/images/hero-2.webp"
                  alt="Hydra facial and skin therapy"
                  width={180}
                  height={135}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Image 3: Bottom Right Badge / Overlap */}
              <div
                className="absolute bottom-2 right-2 w-5/12 h-1/2 rounded-[18px] overflow-hidden shadow-warm-card border border-border bg-fill/20 z-20"
              >
                <img
                  src="/images/hero-3.webp"
                  alt="Spa and relaxation"
                  width={150}
                  height={112}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Trust Tag Float */}
              <div className="absolute -bottom-2 -left-2 z-30 bg-card/95 backdrop-blur-md px-3.5 py-1.5 rounded-[14px] border border-border shadow-warm-card flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] font-bold text-text">500+ Verified Stylists Available</span>
              </div>
            </div>
          </div>

        </div>

        {/* Rating & Trust Stat Strip directly under Hero */}
        <div className="mt-8">
          <StatStrip />
        </div>

      </div>
    </section>
  );
};
