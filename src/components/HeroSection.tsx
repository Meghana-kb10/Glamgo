import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';
import { MarketplaceMode } from '../types';
import { spatialSpring } from '../constants/motion';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';

interface HeroSectionProps {
  mode: MarketplaceMode;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickExplore: () => void;
}

const CATEGORIES = [
  'Bridal Makeup',
  'HD Party Glam',
  'Editorial Hair',
  'Royal Draping',
  'Luxury Skincare',
  'Nail Couture'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  mode,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickExplore,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: spatialSpring,
    },
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-soft-ivory via-blush/20 to-soft-ivory border-b border-mist">
      
      {/* Subtle Architectural Dot Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#B8336A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />

      {/* Background Floating Parallax Artist Portfolio Cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40 sm:opacity-75">
        
        {/* Floating Card 1 - Left */}
        <motion.div
          animate={{
            y: [-8, 10, -8],
            rotate: [-1.5, 1, -1.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          className="absolute -left-6 top-12 lg:left-8 w-44 sm:w-52 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-mist hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80&fm=webp"
            alt="Bridal Preview Tanya Grewal"
            width={208}
            height={176}
            {...{ fetchpriority: 'high' }}
            decoding="async"
            className="w-full h-44 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-ink">Tanya Grewal</span>
            <span className="font-mono text-champagne-gold font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
              <span>4.98</span>
            </span>
          </div>
          <span className="text-[11px] text-mauve-grey">Signature Bridal HD</span>
        </motion.div>

        {/* Floating Card 2 - Right */}
        <motion.div
          animate={{
            y: [10, -8, 10],
            rotate: [1.5, -1, 1.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut",
          }}
          className="absolute -right-6 top-6 lg:right-10 w-44 sm:w-56 p-2.5 rounded-2xl bg-white shadow-card border border-mist hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80&fm=webp"
            alt="Editorial Glow Zoya Akhtar"
            width={224}
            height={192}
            decoding="async"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-ink">Zoya Akhtar</span>
            <span className="font-mono text-emerald-accent font-semibold text-[11px] bg-emerald-accent/10 px-2 py-0.5 rounded-full">
              Verified Pro
            </span>
          </div>
          <span className="text-[11px] text-mauve-grey">Clean Glass Skin</span>
        </motion.div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* 1. Serif Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.08] max-w-4xl [text-wrap:balance]"
          >
            {mode === 'services' ? (
              <>
                Unveil Your Most <br />
                <span className="italic font-normal text-rose-plum">
                  Breathtaking Expression
                </span>
              </>
            ) : (
              <>
                Curated Luxury <br />
                <span className="italic font-normal text-rose-plum">
                  Beauty &amp; Skincare Formulations
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle description */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-sm sm:text-base text-mauve-grey max-w-2xl font-normal leading-relaxed"
          >
            {mode === 'services'
              ? 'Hand-selected celebrity makeup artists, royal bridal hair couturiers, and holistic estheticians. Brought seamlessly to your suite or private venue.'
              : 'Direct from backstage fashion runways: verified cruelty-free setting shields, multidimensional glow palettes, and bridal-grade luxury cosmetics.'}
          </motion.p>

          {/* 3. Interactive Luxury Search Bar with Date/Location */}
          <motion.div
            variants={itemVariants}
            className="mt-8 w-full max-w-3xl"
          >
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-card hover:shadow-luxury border border-mist transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Keyword / Artist Search */}
              <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-mist">
                <Search className="w-4 h-4 text-rose-plum shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={
                    mode === 'services'
                      ? 'Search celebrity MUAs, bridal hair, occasion...'
                      : 'Search setting sprays, glow palettes, mink lashes...'
                  }
                  className="w-full text-xs sm:text-sm bg-transparent placeholder-mauve-grey/60 text-ink outline-none font-medium"
                />
              </div>

              {/* Date Quick Picker */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 border-r border-mist text-xs text-ink font-medium cursor-pointer hover:text-rose-plum transition-colors">
                <Calendar className="w-4 h-4 text-rose-plum" />
                <span>Wedding Date</span>
              </div>

              {/* City Location */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 border-r border-mist text-xs text-ink font-medium cursor-pointer hover:text-rose-plum transition-colors">
                <MapPin className="w-4 h-4 text-rose-plum" />
                <span>Mumbai / At-Venue</span>
              </div>

              {/* Action Button */}
              <Button
                size="md"
                variant="primary"
                onClick={onQuickExplore}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="rounded-xl px-5 py-2.5 text-xs sm:text-sm"
              >
                {mode === 'services' ? 'Discover Artists' : 'Shop Catalog'}
              </Button>
            </div>
          </motion.div>

          {/* 4. Quick Category Chips */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-mauve-grey mr-1">
              Trending:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  selected={isActive}
                  onClick={() => onSelectCategory(isActive ? '' : cat)}
                  className="text-xs sm:text-sm py-1.5"
                />
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
