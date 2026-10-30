import React from 'react';
import { motion } from 'framer-motion';
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush/70 border border-rose-plum/20 text-xs font-semibold text-rose-plum">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Serving {currentLocation.name}, {currentLocation.city}</span>
              <button
                type="button"
                onClick={onOpenLocationSheet}
                className="underline hover:text-deep-plum ml-1 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Headline & Subtext */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.15]">
                Beauty services at your doorstep
              </h1>
              <p className="text-sm sm:text-base text-mauve-grey max-w-xl font-normal leading-relaxed">
                Certified salon, hair, skin &amp; bridal professionals delivering genuine mono-dose care in the comfort of your home.
              </p>
            </div>

            {/* Search Bar Input (Triggers Search Modal) */}
            <div className="max-w-xl">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search for services or professionals"
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-2xl bg-white border border-mist shadow-xs hover:border-rose-plum/40 hover:shadow-card transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-rose-plum shrink-0 group-hover:scale-105 transition-transform">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs sm:text-sm font-normal text-mauve-grey">
                      Search for &apos;Facial&apos;, &apos;Blowdry&apos;, &apos;Waxing&apos;...
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-rose-plum bg-blush px-3 py-1 rounded-full shrink-0">
                  <span>Search</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Quick Chips: Facial, Haircut, Waxing */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-mauve-grey font-medium">Popular right now:</span>
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => onSelectCategory(chip.slug)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-blush/60 border border-mist text-xs font-semibold text-ink shadow-2xs hover:border-rose-plum/30 transition-all cursor-pointer"
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
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-3/4 h-full rounded-3xl overflow-hidden shadow-card border-2 border-white bg-blush/30 z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                  alt="Professional hair and styling at home"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>

              {/* Image 2: Top Right Small Overlap */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="absolute top-0 right-0 w-1/2 h-3/5 rounded-2xl overflow-hidden shadow-card border-2 border-white bg-blush/20 z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80"
                  alt="Hydra facial and skin therapy"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>

              {/* Image 3: Bottom Right Badge / Overlap */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="absolute bottom-2 right-2 w-5/12 h-1/2 rounded-2xl overflow-hidden shadow-card border-2 border-white bg-blush/20 z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80"
                  alt="Spa and relaxation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>

              {/* Trust Tag Float */}
              <div className="absolute -bottom-2 -left-2 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-mist shadow-card flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-ink">500+ Verified Stylists Available</span>
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
