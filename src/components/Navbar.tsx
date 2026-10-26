import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  MapPin,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Crown,
  Brush,
  Store,
} from 'lucide-react';
import { MarketplaceMode, PortalType } from '../types';
import { snappySpring, bouncySpring, tapScale, hoverElevate } from '../constants/motion';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  mode: MarketplaceMode;
  onModeChange: (mode: MarketplaceMode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogoClick?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onNavigatePortal?: (portal: PortalType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onModeChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onLogoClick,
  onOpenAuth,
  onNavigatePortal,
}) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-gold/15 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Editorial Wordmark */}
        <button 
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none group text-left focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-xl p-1"
          title="Return to Glamgo Project Showcase"
        >
          <motion.div 
            whileHover={{ rotate: 8, scale: 1.03 }}
            whileTap={tapScale}
            transition={snappySpring}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-velvet via-rose-gold to-champagne flex items-center justify-center text-white shadow-xs"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-obsidian group-hover:text-rose-gold transition-colors">
              Glamgo
            </span>
            <span className="hidden sm:inline-block ml-2 text-[13px] font-sans tracking-widest uppercase font-semibold text-rose-dark border border-rose-gold/30 px-2 py-0.5 rounded-full">
              Atelier
            </span>
          </div>
        </button>

        {/* Center: Morphing Sliding Pill Toggle between "Book Artists" and "Shop Glam" */}
        <div className="relative p-1 bg-surface-cream/80 backdrop-blur-md rounded-full border border-rose-gold/20 flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => onModeChange('services')}
            className={`relative z-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-full ${
              mode === 'services' ? 'text-obsidian font-semibold' : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${mode === 'services' ? 'text-rose-gold' : 'text-obsidian-muted'}`} />
            <span>Book Artists</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('shop')}
            className={`relative z-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-full ${
              mode === 'shop' ? 'text-obsidian font-semibold' : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 ${mode === 'shop' ? 'text-champagne-dark' : 'text-obsidian-muted'}`} />
            <span>Shop Glam</span>
          </button>

          {/* Morphing Sliding Background Pill */}
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-y-1 rounded-full bg-white shadow-xs border border-rose-gold/20"
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
          <motion.button 
            type="button"
            whileHover={hoverElevate}
            whileTap={tapScale}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-rose-gold/15 text-[13px] text-obsidian font-medium cursor-pointer shadow-xs hover:border-rose-gold/40 transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-gold" />
            <span>Bandra West, Mumbai</span>
            <ChevronDown className="w-3 h-3 text-obsidian-subtle" />
          </motion.button>

          {/* Wishlist Button with Counter */}
          <motion.button 
            type="button"
            aria-label="Wishlist items"
            whileHover={hoverElevate}
            whileTap={tapScale}
            transition={snappySpring}
            className="relative p-2.5 rounded-full bg-white/80 border border-rose-gold/15 text-obsidian hover:text-rose-velvet cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-velvet text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs"
              >
                {wishlistCount}
              </motion.span>
            )}
          </motion.button>

          {/* Interactive Hybrid Cart Button with Popping Badge */}
          <motion.button
            type="button"
            whileHover={hoverElevate}
            whileTap={tapScale}
            transition={snappySpring}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-obsidian text-white shadow-xs hover:bg-obsidian-deep transition-all focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
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
                  initial={{ scale: 0.5, opacity: 0, y: -2 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={bouncySpring}
                  className="w-5 h-5 rounded-full bg-rose-gold text-white text-[11px] font-mono font-bold flex items-center justify-center shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Authentication & Profile Menu */}
          {user ? (
            <div className="relative">
              <motion.button
                type="button"
                whileTap={tapScale}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-rose-gold/25 hover:border-rose-gold/50 shadow-xs transition-colors cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-xs font-semibold">
                  {user.fullName ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'U'}
                </div>
                <span className="text-[13px] font-medium text-obsidian hidden sm:inline max-w-[110px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {user.roles?.[0] === 'CUSTOMER' ? 'BRIDE' : user.roles?.[0] || 'GUEST'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={snappySpring}
                    className="absolute right-0 mt-2 w-64 bg-white border border-stone-200/90 rounded-2xl shadow-xl p-3 z-50 text-left"
                  >
                    <div className="pb-3 border-b border-stone-100 px-2 pt-1">
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.fullName}</p>
                      <p className="text-[13px] text-stone-500 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200/60">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Atelier Member ({user.roles?.join(', ')})</span>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      {onNavigatePortal && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onNavigatePortal('customer');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <Crown className="w-4 h-4 text-rose-gold" />
                            <span>Bridal Discovery</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onNavigatePortal('pro');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <Brush className="w-4 h-4 text-rose-gold" />
                            <span>Pro Artist Studio</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onNavigatePortal('vendor');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <Store className="w-4 h-4 text-rose-gold" />
                            <span>Vendor Fulfillment</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onNavigatePortal('admin');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-rose-gold" />
                            <span>Admin Telemetry</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              type="button"
              whileHover={hoverElevate}
              whileTap={tapScale}
              transition={snappySpring}
              onClick={() => onOpenAuth?.('login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-champagne-light" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

      </div>
    </header>
  );
};
