import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  Menu,
  Sparkles,
  Tag,
  Bell,
  Search as SearchIcon,
  ChevronDown,
  Grid,
} from 'lucide-react';
import { LocationPicker } from './LocationPicker';
import { GlobalSearch } from './GlobalSearch';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { AnnouncementBar } from './AnnouncementBar';
import { AudienceSwitcher } from './AudienceSwitcher';
import { MegaMenu } from './MegaMenu';
import { LocationItem, DetailedService } from '../../services/marketplaceService';
import { Artist, Product } from '../../types';
import { AudienceType } from '../../config/marketing';

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
  audience?: AudienceType;
  onChangeAudience?: (audience: AudienceType) => void;
  onSelectCategory?: (categorySlug: string) => void;
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
  audience = 'women',
  onChangeAudience,
  onSelectCategory,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Keep content clear of the header, including wrapped or dismissed promotions.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty('--customer-header-height', `${header.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--customer-header-height');
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 bg-bg border-b border-border"
    >
      {/* 1. Slim Announcement Bar Above Topbar */}
      <AnnouncementBar />

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-[68px] flex items-center justify-between gap-2 sm:gap-4 relative">
        
        {/* Left Section: Menu icon (mobile/tablet only) + Logo + Audience Switcher + MegaMenu trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation drawer"
            className="w-10 h-10 flex lg:hidden items-center justify-center rounded-full text-text hover:text-accent hover:bg-fill/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Brand */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Glamgo Home"
            className="flex items-center gap-2 cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl p-0.5"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent hidden min-[360px]:flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <span className="font-heading font-bold text-lg sm:text-xl text-text tracking-tight group-hover:text-accent transition-colors">
              Glamgo
            </span>
          </button>

          {/* Audience Switcher (Women | Men | Kids) next to Logo */}
          {onChangeAudience && (
            <div className="hidden lg:flex items-center">
              <AudienceSwitcher
                currentAudience={audience}
                onChangeAudience={onChangeAudience}
              />
            </div>
          )}

          {/* Desktop "Services" MegaMenu Trigger */}
          <div className="hidden lg:block relative">
            <button
              type="button"
              onClick={() => setIsMegaMenuOpen((prev) => !prev)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                isMegaMenuOpen
                  ? 'bg-accent text-white border-accent shadow-warm-sm'
                  : 'bg-card text-text hover:text-accent border-border hover:border-border-strong hover:bg-fill/40'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isMegaMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Location Pill (Hidden on narrow mobile, shown on md+) */}
          <div className="hidden lg:block">
            <LocationPicker
              currentLocation={currentLocation}
              onSelectLocation={onSelectLocation}
              onOpenSheet={onOpenLocationSheet}
            />
          </div>
        </div>

        {/* Center: Global Search Bar (desktop) */}
        <div className="hidden lg:flex flex-1 justify-center px-2 max-w-md">
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
            className="w-10 h-10 lg:hidden flex items-center justify-center rounded-full text-text hover:text-accent hover:bg-fill/50 transition-colors cursor-pointer"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Offers button */}
          <button
            type="button"
            onClick={onOpenOffers}
            aria-label="Exclusive Offers & Discounts"
            title="Special Offers"
            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full text-text hover:text-accent hover:bg-fill/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Tag className="w-4.5 h-4.5" />
          </button>

          {/* Notification bell with unread dot */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notifications, 1 unread message"
            className="w-10 h-10 hidden xl:flex items-center justify-center rounded-full text-text hover:text-accent hover:bg-fill/50 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Bell className="w-4.5 h-4.5" />
            <span
              className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent ring-2 ring-card"
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

        {/* Desktop MegaMenu Panel */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          audience={audience}
          onSelectCategory={(slug) => {
            if (onSelectCategory) onSelectCategory(slug);
            setIsMegaMenuOpen(false);
          }}
          onSelectSubService={(slug) => {
            if (onSelectCategory) onSelectCategory(slug);
            setIsMegaMenuOpen(false);
          }}
        />

      </div>
      <div className="lg:hidden flex items-center justify-between gap-3 px-4 pb-3">
        {onChangeAudience && <AudienceSwitcher currentAudience={audience} onChangeAudience={onChangeAudience} />}
        <button type="button" onClick={onOpenLocationSheet} aria-label={`Change location, currently ${currentLocation.name}, ${currentLocation.city}`} className="min-w-0 min-h-11 flex items-center gap-1 text-sm text-text-muted">
          <span className="truncate">{currentLocation.city}</span>
          <ChevronDown className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </header>
  );
};
