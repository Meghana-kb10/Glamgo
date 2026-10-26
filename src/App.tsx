import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar, FilterState } from './components/FilterBar';
import { ArtistCard } from './components/ArtistCard';
import { ProductCard } from './components/ProductCard';
import { ArtistProfileModal } from './components/ArtistProfileModal';
import { BookingDrawer } from './components/BookingDrawer';
import { ArtistCardSkeleton, ProductCardSkeleton } from './components/SkeletonLoader';
import { DevSkeletonToggle } from './components/DevSkeletonToggle';
import { PortalSwitcher } from './components/PortalSwitcher';
import { ProStudioDashboard } from './components/ProStudioDashboard';
import { ProductVendorDashboard } from './components/ProductVendorDashboard';
import { AdminCommandCenter } from './components/AdminCommandCenter';

import { MOCK_ARTISTS, MOCK_PRODUCTS } from './data/mockData';
import {
  MarketplaceMode,
  PortalType,
  Artist,
  ServicePackage,
  Product,
  CartItemService,
  CartItemProduct,
} from './types';
import { useProfessionalsSearch } from './hooks/useGlamgoApi';

export const App: React.FC = () => {
  // Navigation & Ecosystem States
  const [mode, setMode] = useState<MarketplaceMode>('services');
  const [activePortal, setActivePortal] = useState<PortalType>('customer');

  // Dev state for Champagne Shimmer Skeletons
  const [isLoadingSkeletons, setIsLoadingSkeletons] = useState(false);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    atHome: false,
    studioVisit: false,
    bridalCertified: false,
    instantBook: false,
    rating48: false,
    sort: 'featured',
  });

  // Wire API hook for Searching Professionals
  const apiSearchParams = useMemo(() => {
    return {
      query: searchQuery,
      sort_by: filters.sort,
      service_mode: filters.atHome ? ('AT_VENUE' as const) : filters.studioVisit ? ('IN_STUDIO' as const) : undefined,
    };
  }, [searchQuery, filters.sort, filters.atHome, filters.studioVisit]);

  const { data: apiPros, isLoading: isSearchingPros } = useProfessionalsSearch(apiSearchParams);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(['artist-1']));

  // Modal & Drawer States
  const [selectedArtistForModal, setSelectedArtistForModal] = useState<Artist | null>(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  // Hybrid Cart States
  const [activeServiceCart, setActiveServiceCart] = useState<CartItemService | null>({
    type: 'service',
    artist: MOCK_ARTISTS[0],
    package: MOCK_ARTISTS[0].packages[0],
    date: '2026-11-15',
    timeSlot: '02:30 PM',
    venueAddress: 'Sea View Penthouse, Bandra West, Mumbai',
    venueType: 'Home / Venue',
  });

  const [productCartItems, setProductCartItems] = useState<CartItemProduct[]>([
    {
      type: 'product',
      product: MOCK_PRODUCTS[0],
      quantity: 1,
    },
  ]);

  // Wishlist toggle handler
  const handleToggleWishlist = (artistId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(artistId)) {
        next.delete(artistId);
      } else {
        next.add(artistId);
      }
      return next;
    });
  };

  // Filter toggle handler
  const handleToggleFilter = (key: keyof Omit<FilterState, 'sort'>) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtered & Sorted Artists (synthesizing mock data with live API search)
  const filteredArtists = useMemo(() => {
    let result = [...MOCK_ARTISTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(
        (a) =>
          a.specialties.some((s) => s.toLowerCase().includes(cat)) ||
          a.title.toLowerCase().includes(cat)
      );
    }

    if (filters.atHome) {
      result = result.filter((a) => a.serviceTypes.includes('At-Home Service'));
    }
    if (filters.studioVisit) {
      result = result.filter((a) => a.serviceTypes.includes('Studio Visit'));
    }
    if (filters.bridalCertified) {
      result = result.filter((a) => a.isBridalCertified);
    }
    if (filters.instantBook) {
      result = result.filter((a) => a.isInstantBook);
    }
    if (filters.rating48) {
      result = result.filter((a) => a.rating >= 4.8);
    }

    if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    }

    return result;
  }, [searchQuery, selectedCategory, filters]);

  // Filtered Products for "Shop Glam" mode
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery]);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedShade?: string) => {
    setProductCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedShade === selectedShade
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedShade === selectedShade
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { type: 'product', product, selectedShade, quantity: 1 }];
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setProductCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBookPackage = (artist: Artist, pkg: ServicePackage) => {
    setActiveServiceCart({
      type: 'service',
      artist,
      package: pkg,
      date: '2026-11-15',
      timeSlot: '02:30 PM',
      venueAddress: 'Sea View Penthouse, Bandra West, Mumbai',
      venueType: 'Home / Venue',
    });
    setSelectedArtistForModal(null);
    setIsBookingDrawerOpen(true);
  };

  const handleUpdateServiceSlot = (
    date: string,
    timeSlot: string,
    venueAddress: string,
    venueType: 'Home / Venue' | 'Studio Visit'
  ) => {
    if (!activeServiceCart) return;
    setActiveServiceCart({
      ...activeServiceCart,
      date,
      timeSlot,
      venueAddress,
      venueType,
    });
  };

  const handleClearService = () => {
    setActiveServiceCart(null);
  };

  const totalCartCount = (activeServiceCart ? 1 : 0) + productCartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-canvas-light text-obsidian flex flex-col selection:bg-rose-gold/20 selection:text-obsidian pb-24">
      
      {/* 1. Glassmorphic Sticky Header */}
      <Navbar
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          if (activePortal !== 'customer') setActivePortal('customer');
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setIsBookingDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Ecosystem Switcher View */}
      <main className="flex-1">
        {/* PORTAL 1: Customer Marketplace */}
        {activePortal === 'customer' && (
          <div>
            {/* Hero Section with Explanatory Choreography */}
            <HeroSection
              mode={mode}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onQuickExplore={() => {
                const el = document.getElementById('discovery-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Filter Bar (for Services Mode) */}
            {mode === 'services' && (
              <FilterBar
                filters={filters}
                onToggleFilter={handleToggleFilter}
                onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
                totalResults={filteredArtists.length}
              />
            )}

            {/* Discovery Grid Container */}
            <div id="discovery-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              
              {/* Services Mode: Artist Discovery Grid */}
              {mode === 'services' && (
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold block">
                        Editorial Portfolio • Live PostGIS Database
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
                        Master Makeup Artists & Royal Stylists
                      </h2>
                    </div>
                    <span className="text-xs text-obsidian-subtle">
                      Tap card for high-definition portfolio & before/after comparisons
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoadingSkeletons || isSearchingPros
                      ? Array.from({ length: 4 }).map((_, i) => <ArtistCardSkeleton key={i} />)
                      : filteredArtists.map((artist) => (
                          <ArtistCard
                            key={artist.id}
                            artist={artist}
                            isWishlisted={wishlist.has(artist.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onSelectArtist={setSelectedArtistForModal}
                          />
                        ))}
                  </div>
                </div>
              )}

              {/* Shop Mode: Luxury Product Discovery Grid */}
              {mode === 'shop' && (
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-champagne-dark block">
                        Direct From Backstage
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
                        Curated Bridal & Red Carpet Formulations
                      </h2>
                    </div>
                    <span className="text-xs text-obsidian-subtle">
                      100% Authentic • Multi-warehouse inventory sync
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoadingSkeletons
                      ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                      : filteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* PORTAL 2: Beauty Professional Studio Dashboard */}
        {activePortal === 'pro' && <ProStudioDashboard />}

        {/* PORTAL 3: Product Vendor Dashboard */}
        {activePortal === 'vendor' && <ProductVendorDashboard />}

        {/* PORTAL 4: Admin Command Center */}
        {activePortal === 'admin' && <AdminCommandCenter />}
      </main>

      {/* Shared Element Artist Profile Modal */}
      <AnimatePresence>
        {selectedArtistForModal && (
          <ArtistProfileModal
            artist={selectedArtistForModal}
            onClose={() => setSelectedArtistForModal(null)}
            onBookPackage={handleBookPackage}
            selectedPackageId={activeServiceCart?.package.id}
            isWishlisted={wishlist.has(selectedArtistForModal.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

      {/* Slide-Over Booking & Hybrid Checkout Drawer */}
      <AnimatePresence>
        {isBookingDrawerOpen && (
          <BookingDrawer
            isOpen={isBookingDrawerOpen}
            onClose={() => setIsBookingDrawerOpen(false)}
            activeService={activeServiceCart}
            productCartItems={productCartItems}
            upsellProducts={MOCK_PRODUCTS}
            onAddUpsellProduct={(p) => handleAddToCart(p)}
            onRemoveProduct={handleRemoveProduct}
            onUpdateServiceSlot={handleUpdateServiceSlot}
            onClearService={handleClearService}
          />
        )}
      </AnimatePresence>

      {/* Dev Skeleton Toggle (bottom-left) */}
      <DevSkeletonToggle
        isLoading={isLoadingSkeletons}
        onToggle={() => setIsLoadingSkeletons(!isLoadingSkeletons)}
      />

      {/* Floating Ecosystem Portal Switcher (bottom-center) */}
      <PortalSwitcher
        activePortal={activePortal}
        onSelectPortal={setActivePortal}
      />

    </div>
  );
};
export default App;
