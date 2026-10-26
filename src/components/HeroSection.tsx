import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Sparkles, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { MarketplaceMode } from '../types';
import { snappySpring, gentleFloat, spatialSpring } from '../constants/motion';

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
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: spatialSpring,
    },
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-canvas-light via-surface-cream/40 to-canvas-light border-b border-rose-gold/10">
      
      {/* Background Floating Parallax Artist Portfolio Cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40 sm:opacity-75">
        
        {/* Floating Card 1 - Left */}
        <motion.div
          animate={{
            y: [-12, 14, -12],
            rotate: [-2, 1, -2],
          }}
          transition={{
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut",
          }}
          className="absolute -left-6 top-12 lg:left-8 w-44 sm:w-52 p-2.5 rounded-2xl bg-white/80 backdrop-blur-md shadow-luxury border border-rose-gold/20 hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
            alt="Bridal Preview"
            className="w-full h-44 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-obsidian">Tanya Grewal</span>
            <span className="font-mono text-champagne-dark font-semibold">★ 4.98</span>
          </div>
          <span className="text-[10px] text-obsidian-subtle">Signature Bridal HD</span>
        </motion.div>

        {/* Floating Card 2 - Right */}
        <motion.div
          animate={{
            y: [14, -10, 14],
            rotate: [2, -1.5, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 11,
            ease: "easeInOut",
          }}
          className="absolute -right-6 top-6 lg:right-10 w-44 sm:w-56 p-2.5 rounded-2xl bg-white/80 backdrop-blur-md shadow-luxury border border-rose-gold/20 hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80"
            alt="Editorial Glow"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-obsidian">Zoya Akhtar</span>
            <span className="font-mono text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
              Verified Pro
            </span>
          </div>
          <span className="text-[10px] text-obsidian-subtle">Clean Glass Skin</span>
        </motion.div>

        {/* Ambient Warm Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-champagne/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* 1. Eyebrow Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-rose-gold/25 shadow-sm text-xs font-medium text-rose-gold tracking-wide uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne-dark" />
            <span>The Couture Beauty Concierge</span>
          </motion.div>

          {/* 2. Serif Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-obsidian leading-[1.12] max-w-4xl"
          >
            {mode === 'services' ? (
              <>
                Unveil Your Most <br />
                <span className="italic font-normal bg-gradient-to-r from-rose-velvet via-rose-gold to-champagne-dark bg-clip-text text-transparent">
                  Breathtaking Expression
                </span>
              </>
            ) : (
              <>
                Curated Luxury <br />
                <span className="italic font-normal bg-gradient-to-r from-champagne-dark via-rose-gold to-rose-velvet bg-clip-text text-transparent">
                  Beauty & Skincare Formulations
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
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-luxury hover:shadow-luxury-hover border border-rose-gold/25 transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={snappySpring}
                onClick={onQuickExplore}
                className="px-5 py-3 rounded-xl bg-obsidian hover:bg-obsidian-deep text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-colors"
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-obsidian-subtle mr-1">
              Trending:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectCategory(isActive ? '' : cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-rose-velvet text-white border-rose-velvet shadow-sm'
                      : 'bg-white/80 hover:bg-white text-obsidian border-rose-gold/20 hover:border-rose-gold/50 shadow-sm'
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
