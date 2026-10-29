import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav, BottomNavTab } from './BottomNav';
import { LocationItem, DetailedService } from '../../services/marketplaceService';
import { Artist, Product } from '../../types';
import { MOTION_SPRINGS } from '../../motion/tokens';

export interface AppShellProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onOpenLocationSheet: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenBookings: () => void;
  onOpenFavorites: () => void;
  onOpenOffers: () => void;
  onOpenNotifications?: () => void;
  onOpenSearchModal: () => void;
  onSelectService?: (service: DetailedService) => void;
  onSelectArtist?: (artist: Artist) => void;
  onSelectProduct?: (product: Product) => void;
  upcomingBookingsCount?: number;
  bottomNavActiveTab: BottomNavTab;
  onSelectBottomNavTab: (tab: BottomNavTab) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeRoute,
  onNavigate,
  currentLocation,
  onSelectLocation,
  onOpenLocationSheet,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAuth,
  onOpenBookings,
  onOpenFavorites,
  onOpenOffers,
  onOpenNotifications,
  onOpenSearchModal,
  onSelectService,
  onSelectArtist,
  onSelectProduct,
  upcomingBookingsCount = 0,
  bottomNavActiveTab,
  onSelectBottomNavTab,
}) => {
  // Sidebar collapsed state with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('glamgo_sidebar_collapsed');
        if (saved !== null) return JSON.parse(saved);
      } catch {}
    }
    // Default collapsed on tablet (600-1023px)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Auto-collapse sidebar on window resize to tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    try {
      localStorage.setItem('glamgo_sidebar_collapsed', JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-soft-ivory text-ink flex flex-col selection:bg-rose-plum/20 selection:text-ink">
      {/* Skip-to-content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 px-4 py-2 bg-rose-plum text-white font-bold text-xs rounded-xl shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* 1. Global Topbar */}
      <Topbar
        onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        currentLocation={currentLocation}
        onSelectLocation={onSelectLocation}
        onOpenLocationSheet={onOpenLocationSheet}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onLogoClick={() => onNavigate('home')}
        onOpenAuth={onOpenAuth}
        onOpenBookings={onOpenBookings}
        onOpenFavorites={onOpenFavorites}
        onOpenOffers={onOpenOffers}
        onOpenNotifications={onOpenNotifications}
        onOpenSearchModal={onOpenSearchModal}
        onSelectService={onSelectService}
        onSelectArtist={onSelectArtist}
        onSelectProduct={onSelectProduct}
      />

      {/* 2. Persistent Sidebar (Desktop >=1024px: 240px/72px, Tablet 600-1023px: 72px) */}
      <div className="hidden sm:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          onOpenAuth={onOpenAuth}
          upcomingBookingsCount={upcomingBookingsCount}
        />
      </div>

      {/* 3. Mobile Slide-in Drawer (<600px) */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        upcomingBookingsCount={upcomingBookingsCount}
      />

      {/* 4. Main Content Area */}
      <motion.div
        layout
        transition={MOTION_SPRINGS.slider}
        className={`flex-1 transition-all duration-200 pt-14 sm:pt-[72px] ${
          // Padding left matches sidebar width on tablet & desktop
          isSidebarCollapsed ? 'sm:pl-[72px]' : 'sm:pl-[72px] lg:pl-[240px]'
        }`}
      >
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-12 focus:outline-none"
        >
          {children}
        </main>
      </motion.div>

      {/* 5. Mobile 4-Tab Bottom Navigation + Docked Cart Bar */}
      <BottomNav
        activeTab={bottomNavActiveTab}
        onSelectTab={onSelectBottomNavTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={onOpenCart}
      />
    </div>
  );
};
