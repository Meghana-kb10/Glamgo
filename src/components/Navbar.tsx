import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Heart, MapPin, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MarketplaceMode } from '../types';
import { snappySpring, bouncySpring } from '../constants/motion';

interface NavbarProps {
  mode: MarketplaceMode;
  onModeChange: (mode: MarketplaceMode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onModeChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-gold/15 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Editorial Wordmark */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={snappySpring}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-velvet via-rose-gold to-champagne flex items-center justify-center text-white shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-obsidian">
              Glamgo
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-sans tracking-widest uppercase font-semibold text-rose-gold border border-rose-gold/30 px-1.5 py-0.5 rounded-full">
              Atelier
            </span>
          </div>
        </div>

        {/* Center: Morphing Sliding Pill Toggle between "Book Artists" and "Shop Glam" */}
        <div className="relative p-1 bg-surface-cream/80 backdrop-blur-md rounded-full border border-rose-gold/20 flex items-center shadow-inner">
          <button
            onClick={() => onModeChange('services')}
            className={`relative z-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 ${
              mode === 'services' ? 'text-obsidian font-semibold' : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${mode === 'services' ? 'text-rose-gold' : 'text-obsidian-muted'}`} />
            <span>Book Artists</span>
          </button>

          <button
            onClick={() => onModeChange('shop')}
            className={`relative z-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 ${
              mode === 'shop' ? 'text-obsidian font-semibold' : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 ${mode === 'shop' ? 'text-champagne-dark' : 'text-obsidian-muted'}`} />
            <span>Shop Glam</span>
          </button>

          {/* Morphing Sliding Background Pill */}
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-y-1 rounded-full bg-white shadow-md border border-rose-gold/20"
            style={{
              left: mode === 'services' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)',
            }}
            transition={snappySpring}
          />
        </div>

        {/* Right Action Icons: City Location, Wishlist, and Live Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector Pill */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-rose-gold/15 text-xs text-obsidian font-medium cursor-pointer shadow-sm hover:border-rose-gold/40 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-gold" />
            <span>Bandra West, Mumbai</span>
            <ChevronDown className="w-3 h-3 text-obsidian-subtle" />
          </motion.div>

          {/* Wishlist Button with Counter */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={snappySpring}
            className="relative p-2.5 rounded-full bg-white/80 border border-rose-gold/15 text-obsidian hover:text-rose-velvet cursor-pointer shadow-sm"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-velvet text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-sm"
              >
                {wishlistCount}
              </motion.span>
            )}
          </motion.div>

          {/* Interactive Hybrid Cart Button with Popping Badge */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={snappySpring}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-obsidian text-white shadow-md hover:bg-obsidian-deep transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-champagne-light" />
            <span className="hidden sm:inline text-xs font-medium tracking-wide">
              {mode === 'services' ? 'My Look & Cart' : 'Bag'}
            </span>
            
            {/* Live Popping Cart Badge Counter */}
            <AnimatePresence mode="popLayout">
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0, y: -4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={bouncySpring}
                  className="w-5 h-5 rounded-full bg-rose-gold text-white text-[11px] font-mono font-bold flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </div>
    </header>
  );
};
