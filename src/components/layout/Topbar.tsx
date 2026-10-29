import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Sparkles,
  Tag,
  Bell,
  Search as SearchIcon,
} from 'lucide-react';
import { LocationPicker } from './LocationPicker';
import { GlobalSearch } from './GlobalSearch';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { LocationItem, DetailedService } from '../../services/marketplaceService';
import { Artist, Product } from '../../types';
import { MOTION_GESTURES } from '../../motion/tokens';

export interface TopbarProps {
  onToggleMobileMenu: () => void;
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onOpenLocationSheet: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onLogoClick: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenBookings: () => void;
  onOpenFavorites: () => void;
  onOpenOffers: () => void;
  onOpenNotifications?: () => void;
  onOpenSearchModal: () => void;
  onSelectService?: (service: DetailedService) => void;
  onSelectArtist?: (artist: Artist) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  currentLocation,
  onSelectLocation,
  onOpenLocationSheet,
  cartCount,
  onOpenCart,
  onLogoClick,
  onOpenAuth,
  onOpenBookings,
  onOpenFavorites,
  onOpenOffers,
  onOpenNotifications,
  onOpenSearchModal,
  onSelectService,
  onSelectArtist,
  onSelectProduct,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Monitor scroll for glass effect & elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-mist shadow-xs'
          : 'bg-white border-b border-mist/80'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Menu icon (mobile/tablet only) + Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation drawer"
            className="w-11 h-11 flex lg:hidden items-center justify-center rounded-full text-ink hover:text-rose-plum hover:bg-blush/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Brand */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Glamgo Home"
            className="flex items-center gap-2.5 cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum rounded-xl p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-plum flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl sm:text-2xl text-ink tracking-tight group-hover:text-rose-plum transition-colors">
                Glamgo
              </span>
            </div>
          </button>

          {/* Location Pill (Hidden on narrow mobile, shown on sm+) */}
          <div className="hidden sm:block">
            <LocationPicker
              currentLocation={currentLocation}
              onSelectLocation={onSelectLocation}
              onOpenSheet={onOpenLocationSheet}
            />
          </div>
        </div>

        {/* Center: Global Search Bar (desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-4 max-w-xl">
          <GlobalSearch
            onSelectService={onSelectService}
            onSelectArtist={onSelectArtist}
            onSelectProduct={onSelectProduct}
            onOpenSearchModal={onOpenSearchModal}
          />
        </div>

        {/* Right Cluster: Offers, Notifications, Cart, User / Login */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile search trigger button */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Search services and products"
            className="w-11 h-11 md:hidden flex items-center justify-center rounded-full text-ink hover:text-rose-plum hover:bg-blush/60 transition-colors cursor-pointer"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Offers button */}
          <button
            type="button"
            onClick={onOpenOffers}
            aria-label="Exclusive Offers & Discounts"
            title="Special Offers"
            className="w-11 h-11 hidden sm:flex items-center justify-center rounded-full text-ink hover:text-rose-plum hover:bg-blush/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
          >
            <Tag className="w-5 h-5" />
          </button>

          {/* Notification bell with unread dot */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notifications, 1 unread message"
            className="w-11 h-11 hidden lg:flex items-center justify-center rounded-full text-ink hover:text-rose-plum hover:bg-blush/60 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-plum ring-2 ring-white"
              aria-hidden="true"
            />
          </button>

          {/* Cart Button */}
          <CartButton count={cartCount} onClick={onOpenCart} />

          {/* User Menu / Guest Login Button */}
          <UserMenu
            onOpenAuth={onOpenAuth}
            onOpenBookings={onOpenBookings}
            onOpenFavorites={onOpenFavorites}
            onOpenAddresses={onOpenLocationSheet}
            onOpenHelp={() => {
              window.open('mailto:support@glamgo.in', '_blank');
            }}
          />
        </div>

      </div>
    </header>
  );
};
