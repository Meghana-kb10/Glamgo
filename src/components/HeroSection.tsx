import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Sparkles, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { MarketplaceMode } from '../types';
import { snappySpring, gentleFloat, spatialSpring, tapScale, hoverElevate } from '../constants/motion';

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
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-canvas-light via-surface-cream/40 to-canvas-light border-b border-rose-gold/10">
      
      {/* Subtle Architectural Dot Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#C87D65_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />

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
          className="absolute -left-6 top-12 lg:left-8 w-44 sm:w-52 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-xs border border-rose-gold/20 border-t-white hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
            alt="Bridal Preview"
            className="w-full h-44 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span className="font-serif font-bold text-obsidian">Tanya Grewal</span>
            <span className="font-mono text-champagne-dark font-semibold">★ 4.98</span>
          </div>
          <span className="text-[13px] text-obsidian-muted">Signature Bridal HD</span>
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
          className="absolute -right-6 top-6 lg:right-10 w-44 sm:w-56 p-2.5 rounded-2xl bg-white shadow-xs border border-rose-gold/20 hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80"
            alt="Editorial Glow"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span className="font-serif font-bold text-obsidian">Zoya Akhtar</span>
            <span className="font-mono text-emerald-800 font-semibold text-[13px] bg-emerald-50 px-2 py-0.5 rounded">
              Verified Pro
            </span>
          </div>
          <span className="text-[13px] text-obsidian-muted">Clean Glass Skin</span>
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
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-obsidian leading-[1.08] max-w-4xl [text-wrap:balance]"
          >
            {mode === 'services' ? (
              <>
                Unveil Your Most <br />
                <span className="italic font-normal text-rose-gold">
                  Breathtaking Expression
                </span>
              </>
            ) : (
              <>
                Curated Luxury <br />
                <span className="italic font-normal text-rose-dark">
                  Beauty &amp; Skincare Formulations
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle description */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-sm sm:text-base text-obsidian-muted max-w-2xl font-normal leading-relaxed"
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
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xs hover:shadow-luxury border border-rose-gold/25 border-t-white transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Keyword / Artist Search */}
              <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-rose-gold/15">
                <Search className="w-4 h-4 text-rose-gold shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={
                    mode === 'services'
                      ? 'Search celebrity MUAs, bridal hair, occasion...'
                      : 'Search setting sprays, glow palettes, mink lashes...'
                  }
                  className="w-full text-xs sm:text-sm bg-transparent placeholder-obsidian-subtle/80 text-obsidian outline-none font-medium"
                />
              </div>

              {/* Date Quick Picker */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 border-r border-rose-gold/15 text-xs text-obsidian font-medium cursor-pointer hover:text-rose-gold transition-colors">
                <Calendar className="w-4 h-4 text-rose-gold" />
                <span>Wedding Date</span>
              </div>

              {/* City Location */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 border-r border-rose-gold/15 text-xs text-obsidian font-medium cursor-pointer hover:text-rose-gold transition-colors">
                <MapPin className="w-4 h-4 text-rose-gold" />
                <span>Mumbai / At-Venue</span>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={hoverElevate}
                whileTap={tapScale}
                transition={snappySpring}
                onClick={onQuickExplore}
                className="px-5 py-3 rounded-xl bg-obsidian hover:bg-obsidian-deep text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
              >
                <span>{mode === 'services' ? 'Discover Artists' : 'Shop Catalog'}</span>
                <ArrowRight className="w-4 h-4 text-champagne-light" />
              </motion.button>
            </div>
          </motion.div>

          {/* 4. Quick Category Pills */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
          >
            <span className="text-[13px] font-semibold uppercase tracking-wider text-obsidian-muted mr-1">
              Trending:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  whileHover={hoverElevate}
                  whileTap={tapScale}
                  onClick={() => onSelectCategory(isActive ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 border cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                    isActive
                      ? 'bg-rose-velvet text-white border-rose-velvet shadow-xs'
                      : 'bg-white hover:bg-surface-cream text-obsidian border-rose-gold/20 hover:border-rose-gold/50 shadow-xs'
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
