import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Sparkles, X, Search, MapPin, ChevronDown, ChevronRight, Crown, Droplets, Scissors, Gem, Flower2, UserCheck } from 'lucide-react';
import { AppShell, Topbar } from './components/layout';
import { HeroSection } from './components/HeroSection';
import { FilterBar, FilterState } from './components/FilterBar';
import { ArtistCard } from './components/ArtistCard';
import { ProductCard } from './components/ProductCard';
import { ArtistCardSkeleton, ProductCardSkeleton } from './components/SkeletonLoader';
import { PortalSwitcher } from './components/PortalSwitcher';
import { PullToRefresh } from './components/PullToRefresh';
import { useSseEvents } from './hooks/useSseEvents';
import { spatialSpring } from './constants/motion';

export type MobileTabType = 'home' | 'categories' | 'bookings' | 'shop' | 'profile';
import { LocationPickerSheet } from './components/home/LocationPickerSheet';
import { OfferBannerCarousel } from './components/home/OfferBannerCarousel';
import { SpotlightRail } from './components/home/SpotlightRail';
import { CategoryGrid } from './components/home/CategoryGrid';
import { BookAgainRail } from './components/home/BookAgainRail';
import { SalonPackagesRail } from './components/home/SalonPackagesRail';
import { MostBookedRail } from './components/home/MostBookedRail';
import { TopProsRail } from './components/home/TopProsRail';
import { BridalPackagesRail } from './components/home/BridalPackagesRail';
import { ArtistServicesExplorer } from './components/home/ArtistServicesExplorer';
import { ProductRail } from './components/home/ProductRail';
import { TrustStrip } from './components/home/TrustStrip';
import { SearchModal } from './components/search/SearchModal';
import { ServiceDetailModal } from './components/catalog/ServiceDetailModal';
import { CategoryListingPage } from './components/catalog/CategoryListingPage';
import { ProductCatalog } from './components/shop/ProductCatalog';
import { HeroHome } from './components/home/HeroHome';
import { CategoryTiles } from './components/home/CategoryTiles';
import { FirstTimeOfferStrip } from './components/home/FirstTimeOfferStrip';
import { PackageBuilderCard } from './components/home/PackageBuilderCard';
import { WhyGlamgoStrip } from './components/home/WhyGlamgoStrip';
import { ReviewCarousel } from './components/home/ReviewCarousel';
import { BridalBannerCard } from './components/home/BridalBannerCard';
import { HowItWorksStrip } from './components/home/HowItWorksStrip';
import { Footer } from './components/layout/Footer';
import { SafetyPromiseModal } from './components/home/SafetyPromiseModal';
import { OffersPage } from './components/offers/OffersPage';
import { AudienceType } from './config/marketing';
import {
  marketplaceService,
  DetailedService,
  ValuePackageCombo,
  LocationItem,
  MARKETPLACE_CATEGORIES,
  TRENDING_SEARCHES,
} from './services/marketplaceService';
import { favoritesService } from './services/favoritesService';
import { trackEvent } from './services/analyticsService';

// Code-split heavy modals, dashboards, and showcase views
const ShowcaseLandingPage = React.lazy(() =>
  import('./components/ShowcaseLandingPage').then((m) => ({ default: m.ShowcaseLandingPage }))
);
const ArtistProfileModal = React.lazy(() =>
  import('./components/ArtistProfileModal').then((m) => ({ default: m.ArtistProfileModal }))
);
const BookingDrawer = React.lazy(() =>
  import('./components/BookingDrawer').then((m) => ({ default: m.BookingDrawer }))
);
const CustomerBookingsModal = React.lazy(() =>
  import('./components/CustomerBookingsModal').then((m) => ({ default: m.CustomerBookingsModal }))
);
const AuthModal = React.lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const SplashOnboarding = React.lazy(() =>
  import('./components/SplashOnboarding').then((m) => ({ default: m.SplashOnboarding }))
);
const ProStudioDashboard = React.lazy(() =>
  import('./components/ProStudioDashboard').then((m) => ({ default: m.ProStudioDashboard }))
);
const ProductVendorDashboard = React.lazy(() =>
  import('./components/ProductVendorDashboard').then((m) => ({ default: m.ProductVendorDashboard }))
);
const AdminCommandCenter = React.lazy(() =>
  import('./components/AdminCommandCenter').then((m) => ({ default: m.AdminCommandCenter }))
);

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
import {
  loadServiceCart,
  saveServiceCart,
  loadProductCart,
  saveProductCart,
  generateDynamicDates,
} from './utils/storage';
import { bookingDraftStorage, BookingDraft } from './utils/bookingDraft';
import { bookingSlotService } from './services/bookingSlotService';
import { useToast } from './context/ToastContext';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  // Real-time Haute Beauté Telemetry & Webhook Streaming
  useSseEvents();

  // Dynamic starter dates
  const defaultDates = useMemo(() => generateDynamicDates(14), []);

  // Navigation & Ecosystem States (Customer Home is the default route; Showcase accessible at /showcase)
  const [mode, setMode] = useState<MarketplaceMode>('services');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string | null>(null);
  const [activeNavRoute, setActiveNavRoute] = useState<string>('home');
  const [activePortal, setActivePortal] = useState<PortalType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/showcase' || search.includes('portal=showcase')) return 'landing';
      if (path === '/pro' || search.includes('portal=pro')) return 'pro';
      if (path === '/vendor' || search.includes('portal=vendor')) return 'vendor';
      if (path === '/admin' || search.includes('portal=admin')) return 'admin';
    }
    return 'customer';
  });

  const handleNavigatePortal = (portal: PortalType) => {
    setActivePortal(portal);
    if (typeof window !== 'undefined') {
      const url = portal === 'landing' ? '/showcase' : portal === 'customer' ? '/' : `/?portal=${portal}`;
      window.history.pushState(null, '', url);
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/showcase' || search.includes('portal=showcase')) setActivePortal('landing');
      else if (path === '/pro' || search.includes('portal=pro')) setActivePortal('pro');
      else if (path === '/vendor' || search.includes('portal=vendor')) setActivePortal('vendor');
      else if (path === '/admin' || search.includes('portal=admin')) setActivePortal('admin');
      else setActivePortal('customer');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Customer Reservations & Orders Hub Modal (PRD CUST-06)
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Auth Modal State & Deferred Checkout Callback
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

  const handleOpenAuth = (authMode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(authMode);
    setIsAuthModalOpen(true);
  };

  const handleRequireAuth = (continuation: () => void) => {
    setAuthSuccessCallback(() => continuation);
    setIsAuthModalOpen(true);
  };

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

  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('glamgo_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['artist-1']);
    } catch {
      return new Set(['artist-1']);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('glamgo_wishlist', JSON.stringify(Array.from(wishlist)));
    } catch {}
  }, [wishlist]);

  // Phase 4 State: Location, Search, Category Listing & Detail Modals
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(() =>
    marketplaceService.getCurrentLocation()
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<DetailedService | null>(null);
  const [selectedCategoryListing, setSelectedCategoryListing] = useState<string | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTabType>('home');
  const [favorites, setFavorites] = useState<string[]>(() => favoritesService.getFavorites().artists);
  const [rotatingSearchIndex, setRotatingSearchIndex] = useState(0);

  // Audience State: Women | Men | Kids (persists in localStorage)
  const [audience, setAudience] = useState<AudienceType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('glamgo_audience');
        if (saved === 'women' || saved === 'men' || saved === 'kids') return saved;
      } catch {}
    }
    return 'women';
  });

  const handleAudienceChange = (nextAudience: AudienceType) => {
    setAudience(nextAudience);
    try {
      localStorage.setItem('glamgo_audience', nextAudience);
    } catch {}
  };

  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Rotating search placeholder timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingSearchIndex((prev) => (prev + 1) % TRENDING_SEARCHES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFavoritePro = (artistId: string) => {
    const next = favoritesService.toggleArtistFavorite(artistId);
    setFavorites(favoritesService.getFavorites().artists);
    toast.success(next ? 'Added to your favorites' : 'Removed from favorites', 'Favorites');
  };

  const defaultPastBookings = [
    {
      id: 'past-01',
      booking_number: 'GLAM-2026-78412',
      professional_id: 'artist-1',
      serviceTitle: 'Signature Sabyasachi Bridal HD Package',
      artistName: 'Tanya Grewal',
      artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      serviceImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      rating: 4.98,
      pastDate: 'Oct 14, 2026',
      price: 32000,
      venue_address: 'Indiranagar 100ft Road, Bengaluru',
    },
    {
      id: 'past-02',
      booking_number: 'GLAM-2026-61904',
      professional_id: 'artist-2',
      serviceTitle: 'Red Carpet HD Airbrush Glam',
      artistName: 'Zainab Merchant',
      artistAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
      serviceImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      rating: 4.95,
      pastDate: 'Sep 28, 2026',
      price: 6500,
      venue_address: 'Koramangala 4th Block, Bengaluru',
    },
    {
      id: 'past-03',
      booking_number: 'GLAM-2026-51209',
      professional_id: 'artist-3',
      serviceTitle: 'Hollywood Bouncy Blowout & Scalp Therapy',
      artistName: 'Kabir & Aarav Studio',
      artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      serviceImage: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
      rating: 4.96,
      pastDate: 'Sep 10, 2026',
      price: 2400,
      venue_address: 'Indiranagar, Bengaluru',
    },
  ];

  // Modal & Drawer States
  const [selectedArtistForModal, setSelectedArtistForModal] = useState<Artist | null>(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [bookingDrawerInitialStep, setBookingDrawerInitialStep] = useState<1 | 2 | 3 | 4>(1);
  const [resumePromptDraft, setResumePromptDraft] = useState<BookingDraft | null>(() => {
    const draft = bookingDraftStorage.load();
    return draft && draft.activeService ? draft : null;
  });

  const handleBookAgain = (bk: any) => {
    let artist: Artist = MOCK_ARTISTS.find((a) => a.id === bk.professional_id) as Artist;
    let usedFallback = false;

    if (!artist) {
      artist = bookingSlotService.getBestAvailableProfessional(MOCK_ARTISTS);
      usedFallback = true;
    }

    const srvPackage = artist.packages?.[0] || MOCK_ARTISTS[0].packages[0];
    const rebookedService: CartItemService = {
      type: 'service',
      artist,
      package: srvPackage,
      date: defaultDates[1].fullDate,
      timeSlot: '02:30 PM',
      venueAddress: typeof bk.venue_address === 'string' ? bk.venue_address : bk.venue_address?.street || 'Indiranagar, Bengaluru',
      venueType: 'Home / Venue',
    };
    setActiveServiceCart(rebookedService);
    setBookingDrawerInitialStep(2);
    bookingDraftStorage.save({
      step: 2,
      activeService: rebookedService,
      date: defaultDates[1].fullDate,
      timeSlot: '02:30 PM',
    });
    setIsBookingDrawerOpen(true);

    if (usedFallback) {
      toast.info(
        'Previous professional is unavailable. We have matched you with our best available master artist.',
        'Artist Reassigned'
      );
    }
  };

  // Hybrid Cart States with LocalStorage Persistence
  const [activeServiceCart, setActiveServiceCart] = useState<CartItemService | null>(() =>
    loadServiceCart({
      type: 'service',
      artist: MOCK_ARTISTS[0],
      package: MOCK_ARTISTS[0].packages[0],
      date: defaultDates[1].fullDate,
      timeSlot: '02:30 PM',
      venueAddress: 'Sea View Penthouse, Bandra West, Mumbai',
      venueType: 'Home / Venue',
    })
  );

  const [productCartItems, setProductCartItems] = useState<CartItemProduct[]>(() =>
    loadProductCart([
      {
        type: 'product',
        product: MOCK_PRODUCTS[0],
        quantity: 1,
      },
    ])
  );

  useEffect(() => {
    saveServiceCart(activeServiceCart);
  }, [activeServiceCart]);

  useEffect(() => {
    saveProductCart(productCartItems);
  }, [productCartItems]);

  const nextAppointmentInfo = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    if (activeServiceCart) {
      return {
        id: activeServiceCart.package.id,
        serviceTitle: activeServiceCart.package.name,
        artistName: activeServiceCart.artist.name,
        dateTime: `${activeServiceCart.date} • ${activeServiceCart.timeSlot}`,
      };
    }
    return {
      id: 'past-01',
      serviceTitle: 'Signature Sabyasachi Bridal HD Package',
      artistName: 'Tanya Grewal',
      dateTime: 'Tomorrow • 10:00 AM',
    };
  }, [isAuthenticated, user, activeServiceCart]);

  const handleBuildCustomPackage = (selectedServices: DetailedService[]) => {
    if (selectedServices.length === 0) return;
    const primary = selectedServices[0];
    handleBookDetailedService(primary);
    toast.success(
      `Custom package of ${selectedServices.length} services configured! 15% discount applied.`,
      'Package Built'
    );
  };

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
      date: defaultDates[1]?.fullDate || '2026-11-15',
      timeSlot: '02:30 PM',
      venueAddress: `${currentLocation.name}, ${currentLocation.area}, ${currentLocation.city}`,
      venueType: pkg.serviceMode === 'IN_STUDIO' ? 'Studio Visit' : 'Home / Venue',
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

  const handleBookDetailedService = (srv: DetailedService) => {
    const artist = MOCK_ARTISTS[0];
    const srvPackage: ServicePackage = {
      id: srv.id,
      name: srv.title,
      price: srv.price,
      durationMinutes: srv.durationMinutes,
      description: srv.description,
      tier: srv.category === 'bridal' ? 'Bridal Couture' : 'Signature',
      productsUsed: srv.productsUsed,
      inclusions: srv.whatIsIncluded,
      isPopular: srv.isMostBooked,
    };
    const newService: CartItemService = {
      type: 'service',
      artist,
      package: srvPackage,
      date: defaultDates[1].fullDate,
      timeSlot: '02:30 PM',
      venueAddress: `${currentLocation.name}, ${currentLocation.area}, ${currentLocation.city}`,
      venueType: 'Home / Venue',
    };
    setActiveServiceCart(newService);
    setSelectedServiceForDetail(null);
    setIsBookingDrawerOpen(true);
    trackEvent('add_to_cart', { serviceId: srv.id, price: srv.price });
  };

  const handleSelectValuePackage = (pkg: ValuePackageCombo) => {
    const srv: DetailedService = {
      id: pkg.id,
      title: pkg.name,
      category: 'packages',
      durationMinutes: pkg.durationMinutes,
      price: pkg.packagePrice,
      originalPrice: pkg.originalPrice,
      savingsAmount: pkg.savingsAmount,
      rating: pkg.rating,
      reviewCount: pkg.reviewCount,
      imageUrl: pkg.imageUrl,
      galleryImages: [pkg.imageUrl],
      description: pkg.tagline,
      whatIsIncluded: pkg.includedServices,
      productsUsed: pkg.sealedKitsIncluded,
      procedureSteps: pkg.includedServices.map((inc, i) => ({
        stepNumber: i + 1,
        title: inc.split('(')[0].trim(),
        duration: `${Math.round(pkg.durationMinutes / pkg.includedServices.length)} mins`,
        description: `Bespoke salon treatment using genuine single-use mono-dose sealed packs with hospital-sterilized tools.`,
      })),
      disposablesIncluded: pkg.sealedKitsIncluded,
      customerRequirements: ['1 Comfortable chair or bed in well-lit room', 'Power outlet within 2 meters for thermal tools'],
      serviceMode: 'AT_VENUE',
      faqs: [
        {
          question: 'Are all products genuine and sealed?',
          answer: 'Yes! In line with Urban Company & Yes Madam standards, 100% of products are individual factory-sealed mono-packs opened directly in front of you.',
        },
        {
          question: 'Can I customize any service in the package?',
          answer: 'Yes, your certified master pro will consult with you on undertones, nail shades, and skin types prior to breaking the seals.',
        },
      ],
      byopOptionAvailable: true,
      byopDiscount: 600,
    };
    setSelectedServiceForDetail(srv);
  };

  const handleBookValuePackage = (pkg: ValuePackageCombo) => {
    const srv: DetailedService = {
      id: pkg.id,
      title: pkg.name,
      category: 'packages',
      durationMinutes: pkg.durationMinutes,
      price: pkg.packagePrice,
      originalPrice: pkg.originalPrice,
      savingsAmount: pkg.savingsAmount,
      rating: pkg.rating,
      reviewCount: pkg.reviewCount,
      imageUrl: pkg.imageUrl,
      galleryImages: [pkg.imageUrl],
      description: pkg.tagline,
      whatIsIncluded: pkg.includedServices,
      productsUsed: pkg.sealedKitsIncluded,
      procedureSteps: pkg.includedServices.map((inc, i) => ({
        stepNumber: i + 1,
        title: inc.split('(')[0].trim(),
        duration: `${Math.round(pkg.durationMinutes / pkg.includedServices.length)} mins`,
        description: `Bespoke salon treatment using genuine single-use mono-dose sealed packs with hospital-sterilized tools.`,
      })),
      disposablesIncluded: pkg.sealedKitsIncluded,
      customerRequirements: ['1 Comfortable chair or bed in well-lit room', 'Power outlet within 2 meters for thermal tools'],
      serviceMode: 'AT_VENUE',
      faqs: [
        {
          question: 'Are all products genuine and sealed?',
          answer: 'Yes! In line with Urban Company & Yes Madam standards, 100% of products are individual factory-sealed mono-packs opened directly in front of you.',
        },
      ],
      byopOptionAvailable: true,
      byopDiscount: 600,
    };
    handleBookDetailedService(srv);
  };

  const handleNavRoute = (route: string) => {
    setActiveNavRoute(route);
    if (route === 'home') {
      setSelectedCategoryListing(null);
      setMode('services');
      setMobileActiveTab('home');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route.startsWith('category-')) {
      const slug = route.replace('category-', '');
      setSelectedCategoryListing(slug);
      setMobileActiveTab('home');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'categories') {
      setSelectedCategoryListing('all');
      setMobileActiveTab('home');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'bookings') {
      setIsBookingsModalOpen(true);
      setMobileActiveTab('bookings');
    } else if (route.startsWith('shop-')) {
      const catSlug = route.replace('shop-', '');
      setSelectedProductCategory(catSlug);
      setSelectedCategoryListing(null);
      setMode('shop');
      setMobileActiveTab('shop');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'shop') {
      setSelectedProductCategory('all');
      setSelectedCategoryListing(null);
      setMode('shop');
      setMobileActiveTab('shop');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'artists') {
      setSelectedCategoryListing(null);
      setMode('services');
      setActiveNavRoute('artists');
      setMobileActiveTab('home');
      if (activePortal !== 'customer') handleNavigatePortal('customer');
      const el = document.getElementById('artist-services-suites');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'favorites') {
      const el = document.getElementById('top-pros-rail');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      toast.info('Tap the Heart icon on any master artist or service to save them to your personal lookbook.', 'Favorites');
    } else if (route === 'offers') {
      setSelectedCategoryListing(null);
      setActiveNavRoute('offers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'safety') {
      setIsSafetyModalOpen(true);
    } else if (route === 'refer') {
      setActiveNavRoute('offers');
      toast.success(
        'Refer a friend: They get 20% off, you earn ₹500 wallet credits upon completion!',
        'Refer & Earn'
      );
    } else if (route === 'profile') {
      if (!isAuthenticated) {
        handleOpenAuth('login');
      } else {
        setIsBookingsModalOpen(true);
      }
      setMobileActiveTab('profile');
    } else if (route === 'help') {
      window.open('mailto:support@glamgo.in', '_blank');
    } else if (route === 'about') {
      const el = document.getElementById('trust-strip-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileTabSelect = (tab: MobileTabType) => {
    handleNavRoute(tab);
  };

  const cartServiceTotal = activeServiceCart ? activeServiceCart.package.price : 0;
  const cartProductsTotal = productCartItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const cartTotalAmount = cartServiceTotal + cartProductsTotal;
  const totalCartCount = (activeServiceCart ? 1 : 0) + productCartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <LayoutGroup id="glamgo-app">
      <div className="min-h-screen bg-canvas-light text-obsidian flex flex-col selection:bg-rose-gold/20 selection:text-obsidian pb-24">
        
        {/* Topbar for non-customer portals (Pro Studio, Vendor, Admin) */}
        {activePortal !== 'landing' && activePortal !== 'customer' && (
          <Topbar
            onToggleMobileMenu={() => {}}
            currentLocation={currentLocation}
            onSelectLocation={(loc) => setCurrentLocation(loc)}
            onOpenLocationSheet={() => setIsLocationPickerOpen(true)}
            cartCount={totalCartCount}
            onOpenCart={() => setIsBookingDrawerOpen(true)}
            onLogoClick={() => {
              setMode('services');
              handleNavigatePortal('customer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
            onOpenBookings={() => {
              setIsBookingsModalOpen(true);
            }}
            onOpenFavorites={() => {
              handleNavigatePortal('customer');
              const el = document.getElementById('top-pros-rail');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              toast.info('Tap the Heart icon on any master artist or service to save them to your personal lookbook.', 'Favorites');
            }}
            onOpenOffers={() => {
              handleNavigatePortal('customer');
              const el = document.getElementById('offers-carousel-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
              toast.success('Exclusive Offer: Code WEDDING2026 active for 15% off royal bridal couture!', 'Special Offer');
            }}
            onOpenNotifications={() => {
              toast.info(
                'You have 1 active update: Your verified booking and check-in OTP telemetry are active. Show your OTP to your artist at service time.',
                'Glamgo Atelier Notification'
              );
            }}
            onOpenSearchModal={() => setIsSearchOpen(true)}
          />
        )}

        {/* Main Ecosystem Switcher View with Spatial Page Transitions */}
        <main className="flex-1">
          <Suspense fallback={<div className="p-8 flex items-center justify-center min-h-[40vh]"><div className="w-8 h-8 rounded-full border-2 border-rose-plum border-t-transparent animate-spin" /></div>}>
            <AnimatePresence mode="wait">
            {/* PORTAL 0: Modern Project Showcase & Motion Laboratory */}
            {activePortal === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spatialSpring}
              >
                <ShowcaseLandingPage
                  onNavigatePortal={handleNavigatePortal}
                  onExploreMarketplace={(targetMode) => {
                    setMode(targetMode);
                    handleNavigatePortal('customer');
                  }}
                  onOpenAuth={handleOpenAuth}
                />
              </motion.div>
            )}

            {/* PORTAL 1: Customer Marketplace wrapped in AppShell */}
            {activePortal === 'customer' && (
              <AppShell
                activeRoute={activeNavRoute}
                onNavigate={handleNavRoute}
                currentLocation={currentLocation}
                onSelectLocation={(loc) => setCurrentLocation(loc)}
                onOpenLocationSheet={() => setIsLocationPickerOpen(true)}
                cartCount={totalCartCount}
                cartTotal={cartTotalAmount}
                onOpenCart={() => setIsBookingDrawerOpen(true)}
                onOpenAuth={handleOpenAuth}
                onOpenBookings={() => {
                  setIsBookingsModalOpen(true);
                }}
                onOpenFavorites={() => {
                  const el = document.getElementById('top-pros-rail');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  toast.info('Tap the Heart icon on any master artist or service to save them to your personal lookbook.', 'Favorites');
                }}
                onOpenOffers={() => {
                  setSelectedCategoryListing(null);
                  setActiveNavRoute('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenNotifications={() => {
                  toast.info(
                    'You have 1 active update: Your verified booking and check-in OTP telemetry are active. Show your OTP to your artist at service time.',
                    'Glamgo Atelier Notification'
                  );
                }}
                onOpenSearchModal={() => setIsSearchOpen(true)}
                onSelectService={(srv) => setSelectedServiceForDetail(srv)}
                onSelectArtist={(art) => setSelectedArtistForModal(art)}
                onSelectProduct={(prod) => handleAddToCart(prod)}
                upcomingBookingsCount={defaultPastBookings.length}
                bottomNavActiveTab={
                  activeNavRoute === 'bookings' ? 'bookings' :
                  activeNavRoute === 'shop' || mode === 'shop' ? 'shop' :
                  activeNavRoute === 'profile' ? 'profile' : 'home'
                }
                onSelectBottomNavTab={(tab) => handleNavRoute(tab)}
                audience={audience}
                onChangeAudience={handleAudienceChange}
                onSelectCategory={(slug) => setSelectedCategoryListing(slug)}
                nextAppointment={nextAppointmentInfo}
              >
                {/* Greeting Header (Logged-in only) */}
                {isAuthenticated && user && (
                  <div className="mb-4 bg-blush/40 border border-mist rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h1 className="font-heading text-lg sm:text-xl font-bold text-ink">
                        Good day, {user.fullName.split(' ')[0]}
                      </h1>
                      <p className="text-xs text-mauve-grey mt-0.5">
                        What luxury beauty treatment would you like to experience today?
                      </p>
                    </div>
                  </div>
                )}

                {activeNavRoute === 'offers' ? (
                  /* Dedicated Offers & Coupon Privileges Page */
                  <OffersPage
                    onBackToHome={() => {
                      setActiveNavRoute('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onApplyCoupon={(code) => {
                      toast.success(`Coupon code ${code} applied successfully!`, 'Voucher Activated');
                      setActiveNavRoute('home');
                    }}
                  />
                ) : selectedCategoryListing ? (
                  /* Urban Company 3-Column Category & Service Listing Screen */
                  <CategoryListingPage
                    categorySlug={selectedCategoryListing}
                    onBackToHome={() => setSelectedCategoryListing(null)}
                    onOpenServiceDetail={(srv) => setSelectedServiceForDetail(srv)}
                    onBookService={(srv) => handleBookDetailedService(srv)}
                    cartServiceId={activeServiceCart?.package.id}
                    activeCart={activeServiceCart}
                    onOpenCart={() => setIsBookingDrawerOpen(true)}
                    onAddToCart={(srv) => handleBookDetailedService(srv)}
                    onRemoveFromCart={handleClearService}
                  />
                ) : mode === 'shop' ? (
                  /* Dedicated Backstage Products Catalog */
                  <ProductCatalog
                    products={MOCK_PRODUCTS}
                    selectedCategory={selectedProductCategory}
                    onSelectCategory={(cat) => setSelectedProductCategory(cat)}
                    onAddToCart={handleAddToCart}
                    onBackToServices={() => {
                      setMode('services');
                      setActiveNavRoute('home');
                      setMobileActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  /* Main Customer Marketplace Home (Exact 10 Section Hierarchy) */
                  <div className="space-y-6 pb-6">
                    {/* a) Hero Section: Headlines, Search Bar, Quick Chips, Photo Collage & Stat Strip */}
                    <div id="hero-section">
                      <HeroHome
                        currentLocation={currentLocation}
                        onOpenSearch={() => setIsSearchOpen(true)}
                        onOpenLocationSheet={() => setIsLocationPickerOpen(true)}
                        onSelectCategory={(slug) => setSelectedCategoryListing(slug)}
                        audience={audience}
                      />
                    </div>

                    {/* b) Category Tiles: 2x4 Photo Tiles for Selected Audience */}
                    <div id="category-tiles-section">
                      <CategoryTiles
                        audience={audience}
                        onSelectCategory={(slug) => setSelectedCategoryListing(slug)}
                        onViewAll={() => setSelectedCategoryListing('all')}
                      />
                    </div>

                    {/* c) First-Time Offer Strip: 3 Small Cards */}
                    <div id="first-time-offers-section">
                      <FirstTimeOfferStrip
                        onOpenOffers={() => {
                          setSelectedCategoryListing(null);
                          setActiveNavRoute('offers');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onApplyCode={(code) =>
                          toast.success(`Code ${code} copied! Use during checkout.`, 'Offer Applied')
                        }
                      />
                    </div>

                    {/* d) "Create your own package": Mini Builder Card with Savings Meter */}
                    <div id="package-builder-section">
                      <PackageBuilderCard
                        onBuildPackage={handleBuildCustomPackage}
                      />
                    </div>

                    {/* e) Most Booked Services Row & Top-Rated Professionals Row */}
                    <div id="most-booked-section" className="space-y-6">
                      <MostBookedRail
                        services={marketplaceService.getMostBookedServices()}
                        cartQuantities={
                          activeServiceCart?.package.id ? { [activeServiceCart.package.id]: 1 } : {}
                        }
                        onAddService={handleBookDetailedService}
                        onUpdateQuantity={(id, q) => {
                          if (q === 0) handleClearService();
                        }}
                        onSelectService={(srv) => setSelectedServiceForDetail(srv)}
                      />

                      <div id="top-pros-rail">
                        <TopProsRail
                          artists={marketplaceService.getTopProfessionals()}
                          favorites={favorites}
                          onToggleFavorite={handleToggleFavoritePro}
                          onSelectArtist={setSelectedArtistForModal}
                        />
                      </div>
                    </div>

                    {/* f) "Why Glamgo": 4 Icon Cards + "Products we use" Brand Placeholder Strip */}
                    <div id="why-glamgo-section">
                      <WhyGlamgoStrip
                        onOpenSafetyPromise={() => setIsSafetyModalOpen(true)}
                      />
                    </div>

                    {/* g) Real Reviews Carousel (Swipe, No Autoplay) */}
                    <div id="reviews-carousel-section">
                      <ReviewCarousel
                        onViewAllReviews={() =>
                          toast.info('Displaying 45,000+ verified customer reviews across metros.')
                        }
                      />
                    </div>

                    {/* h) Bridal & Occasion Banner: One Large Rounded Card */}
                    <div id="bridal-banner-section">
                      <BridalBannerCard
                        onSelectCategory={(slug) => setSelectedCategoryListing(slug)}
                      />
                    </div>

                    {/* i) "How It Works": 3 Steps with Icons */}
                    <div id="how-it-works-section">
                      <HowItWorksStrip />
                    </div>

                    {/* j) Marketplace Comprehensive Footer */}
                    <div id="footer-section">
                      <Footer
                        onNavigatePortal={handleNavigatePortal}
                        onOpenSafetyPromise={() => setIsSafetyModalOpen(true)}
                        onOpenHelp={() => window.open('mailto:support@glamgo.in', '_blank')}
                      />
                    </div>
                  </div>
                )}
              </AppShell>
            )}

            {/* Safety Promise Modal Dialog */}
            <SafetyPromiseModal
              isOpen={isSafetyModalOpen}
              onClose={() => setIsSafetyModalOpen(false)}
            />

            {/* PORTAL 2: Beauty Professional Studio Dashboard */}
            {activePortal === 'pro' && (
              <motion.div
                key="pro"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spatialSpring}
              >
                <ProStudioDashboard />
              </motion.div>
            )}

            {/* PORTAL 3: Product Vendor Dashboard */}
            {activePortal === 'vendor' && (
              <motion.div
                key="vendor"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spatialSpring}
              >
                <ProductVendorDashboard />
              </motion.div>
            )}

            {/* PORTAL 4: Admin Command Center */}
            {activePortal === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spatialSpring}
              >
                <AdminCommandCenter />
              </motion.div>
            )}
          </AnimatePresence>
          </Suspense>
        </main>

      {/* Shared Element Artist Profile Modal */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Slide-Over Booking & Hybrid Checkout Drawer */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {isBookingDrawerOpen && (
            <BookingDrawer
              isOpen={isBookingDrawerOpen}
              onClose={() => {
                setIsBookingDrawerOpen(false);
                setBookingDrawerInitialStep(1);
              }}
              onOpenBookingsModal={() => setIsBookingsModalOpen(true)}
              onBookingSuccess={(bk) => {
                setActiveServiceCart(null);
                setProductCartItems([]);
                setIsBookingsModalOpen(true);
              }}
              activeService={activeServiceCart}
              productCartItems={productCartItems}
              upsellProducts={MOCK_PRODUCTS}
              onAddUpsellProduct={(p) => handleAddToCart(p)}
              onRemoveProduct={handleRemoveProduct}
              onUpdateServiceSlot={handleUpdateServiceSlot}
              onClearService={handleClearService}
              onRequireAuth={handleRequireAuth}
              initialStep={bookingDrawerInitialStep}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {/* Floating Resume Booking Draft Banner (PRD BOOK-4) */}
      {resumePromptDraft && !isBookingDrawerOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md bg-white border border-rose-plum/30 rounded-2xl shadow-xl p-3.5 z-40 flex items-center justify-between gap-3"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blush text-rose-plum flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-ink truncate">
                Resume your booking: {resumePromptDraft.activeService?.package?.name || 'Selected Service'}
              </p>
              <p className="text-[11px] text-mauve-grey truncate">
                Pick up right where you left off
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsBookingDrawerOpen(true);
                setResumePromptDraft(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-plum text-white text-xs font-bold hover:bg-deep-plum transition-colors cursor-pointer"
            >
              Resume →
            </button>
            <button
              type="button"
              onClick={() => {
                bookingDraftStorage.clear();
                setResumePromptDraft(null);
              }}
              aria-label="Dismiss resume prompt"
              className="p-1 rounded-lg text-mauve-grey hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Editorial Luxury Authentication Modal */}
      <Suspense fallback={null}>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {
              setIsAuthModalOpen(false);
              setAuthSuccessCallback(null);
            }}
            initialMode={authModalMode}
            onSuccess={() => {
              if (authSuccessCallback) {
                authSuccessCallback();
                setAuthSuccessCallback(null);
              }
            }}
          />
        )}
      </Suspense>

      {/* First-time Splash Screen & Onboarding Carousel */}
      <Suspense fallback={null}>
        <SplashOnboarding />
      </Suspense>

      {/* Customer Post-Booking Management Hub (PRD CUST-06) */}
      <Suspense fallback={null}>
        {isBookingsModalOpen && (
          <CustomerBookingsModal
            isOpen={isBookingsModalOpen}
            onClose={() => setIsBookingsModalOpen(false)}
            onBookAgain={handleBookAgain}
          />
        )}
      </Suspense>

      {/* Phase 4: Location Picker Bottom Sheet (PRD HOME-1) */}
      <LocationPickerSheet
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />

      {/* Phase 4: Live Global Typo-Tolerant Search Modal (PRD HOME-2) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectService={(srv) => {
          setSelectedServiceForDetail(srv);
          setIsSearchOpen(false);
        }}
        onSelectArtist={(art) => {
          setSelectedArtistForModal(art);
          setIsSearchOpen(false);
        }}
        onSelectProduct={(prod) => {
          handleAddToCart(prod);
          setIsSearchOpen(false);
        }}
      />

      {/* Phase 4: Full Service Detail Modal/Sheet (PRD SVC-1..7) */}
      <ServiceDetailModal
        isOpen={!!selectedServiceForDetail}
        onClose={() => setSelectedServiceForDetail(null)}
        service={selectedServiceForDetail}
        onBookService={(srv) => handleBookDetailedService(srv)}
      />

      {/* Floating Ecosystem Portal Switcher (bottom-center, visible on active portals) */}
      {activePortal !== 'landing' && (
        <PortalSwitcher
          activePortal={activePortal}
          onSelectPortal={handleNavigatePortal}
        />
      )}

      </div>
    </LayoutGroup>
  );
};
export default App;
