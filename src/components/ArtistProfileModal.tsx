import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Calendar,
  Layers,
  ArrowRight,
  Share2,
  ShieldCheck,
  Briefcase,
  MapPin,
  Maximize2,
  CheckCircle2,
  Search,
  Building2,
  Home,
  Filter,
} from 'lucide-react';
import { Artist, ServicePackage } from '../types';
import { spatialSpring } from '../constants/motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { triggerChampagneSparkles } from '../utils/confetti';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Chip } from './ui/Chip';
import { useToast } from '../context/ToastContext';
import { favoritesService } from '../services/favoritesService';
import { trackEvent } from '../services/analyticsService';

interface ArtistProfileModalProps {
  artist: Artist | null;
  onClose: () => void;
  onBookPackage: (artist: Artist, pkg: ServicePackage) => void;
  selectedPackageId?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (artistId: string) => void;
}

type TabType = 'portfolio' | 'services' | 'reviews' | 'about';
type StyleFilter = 'all' | 'bridal' | 'airbrush' | 'reception' | 'editorial';

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  onClose,
  onBookPackage,
  selectedPackageId,
  isWishlisted: propIsWishlisted,
  onToggleWishlist: propOnToggleWishlist,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('services');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    artist?.packages[0]?.id || null
  );
  const [portfolioStyle, setPortfolioStyle] = useState<StyleFilter>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Service Filtering within this Artist / Salon
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [serviceModeFilter, setServiceModeFilter] = useState<'all' | 'AT_VENUE' | 'IN_STUDIO'>('all');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');
  const [serviceSortBy, setServiceSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');

  const filteredPackages = useMemo(() => {
    if (!artist || !artist.packages) return [];
    let list = [...artist.packages];

    if (serviceCategoryFilter !== 'all') {
      list = list.filter((pkg) => {
        const cat = pkg.category?.toLowerCase() || '';
        const name = pkg.name.toLowerCase();
        if (serviceCategoryFilter === 'bridal') return cat === 'bridal' || name.includes('bridal') || pkg.tier === 'Bridal Couture';
        if (serviceCategoryFilter === 'makeup') return cat === 'makeup' || name.includes('glam') || name.includes('airbrush') || name.includes('makeup');
        if (serviceCategoryFilter === 'hair') return cat === 'hair' || name.includes('hair') || name.includes('blowout') || name.includes('updo');
        if (serviceCategoryFilter === 'skin') return cat === 'skin' || name.includes('facial') || name.includes('skin') || name.includes('hydra');
        if (serviceCategoryFilter === 'nails') return cat === 'nails' || name.includes('nail') || name.includes('gel') || name.includes('manicure');
        if (serviceCategoryFilter === 'draping') return cat === 'draping' || name.includes('drape') || name.includes('saree') || name.includes('pleat');
        return cat === serviceCategoryFilter;
      });
    }

    if (serviceModeFilter !== 'all') {
      list = list.filter((pkg) => {
        if (!pkg.serviceMode || pkg.serviceMode === 'HYBRID') return true;
        return pkg.serviceMode === serviceModeFilter;
      });
    }

    if (serviceSearchQuery.trim()) {
      const q = serviceSearchQuery.toLowerCase();
      list = list.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q) ||
          pkg.tier.toLowerCase().includes(q) ||
          pkg.productsUsed.some((p) => p.toLowerCase().includes(q)) ||
          pkg.inclusions.some((inc) => inc.toLowerCase().includes(q))
      );
    }

    if (serviceSortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (serviceSortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (serviceSortBy === 'duration') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return list;
  }, [artist, serviceCategoryFilter, serviceModeFilter, serviceSearchQuery, serviceSortBy]);

  const [internalWishlisted, setInternalWishlisted] = useState<boolean>(() =>
    artist ? favoritesService.isArtistFavorite(artist.id) : false
  );

  if (!artist) return null;

  const isFav = propIsWishlisted !== undefined ? propIsWishlisted : internalWishlisted;

  const handleToggleWishlist = () => {
    if (propOnToggleWishlist) {
      propOnToggleWishlist(artist.id);
    } else {
      const next = favoritesService.toggleArtistFavorite(artist.id);
      setInternalWishlisted(next);
      toast.success(
        next ? `Saved ${artist.name} to favorites` : `Removed from favorites`,
        'Favorites'
      );
    }
  };

  const handleNativeShare = async () => {
    trackEvent('professional_shared', { artistId: artist.id, artistName: artist.name });
    const shareUrl = window.location.href;
    const shareData = {
      title: `${artist.name} on Glamgo`,
      text: `Book verified celebrity beauty artist ${artist.name} on Glamgo. Verified reviews & at-home service!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Ignored if cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Profile link copied to clipboard!', 'Link Copied');
      } catch {
        toast.info('Share URL: ' + shareUrl, 'Share');
      }
    }
  };

  const togglePackageExpand = (pkgId: string) => {
    setExpandedPackageId(expandedPackageId === pkgId ? null : pkgId);
  };

  const handleSelectPackage = (e: React.MouseEvent, pkg: ServicePackage) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    trackEvent('package_selected', { artistId: artist.id, packageId: pkg.id, price: pkg.price });
    onBookPackage(artist, pkg);
  };

  // Curated portfolio collection with tags
  const portfolioItems = [
    { url: artist.coverImage, tag: 'bridal', title: 'Royal Heritage Bridal HD' },
    { url: artist.portfolioImages[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', tag: 'airbrush', title: 'Dewy Glass Skin Airbrush' },
    { url: artist.portfolioImages[1] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', tag: 'reception', title: 'Sunset Cocktail Smokey Eye' },
    { url: artist.portfolioImages[2] || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', tag: 'editorial', title: 'Couture Editorial Monochromatic' },
    { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80', tag: 'bridal', title: 'South Indian Muhurtham Bride' },
    { url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80', tag: 'reception', title: 'Gilded Hollywood Waves' },
  ];

  const filteredPortfolio = portfolioStyle === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.tag === portfolioStyle);

  const completedJobsCount = (artist.reviewCount * 3) + 48;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="artist-profile-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/75 backdrop-blur-md"
      />

      {/* Sheet on Mobile (<600px), Modal on Desktop */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={spatialSpring}
        className="relative w-full max-w-4xl bg-soft-ivory rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] z-10 border border-mist"
        style={{ backgroundColor: '#FFFBF8' }}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden bg-white/95">
          <div className="w-10 h-1 rounded-full bg-mist" />
        </div>

        {/* Top Control Bar */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-md border-b border-mist flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span id="artist-profile-title" className="font-serif font-bold text-base text-ink line-clamp-1">
              {artist.name}
            </span>
            {artist.isVerified && (
              <Badge type="verified" text="Verified Pro" className="shadow-xs text-[10px]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label={`Share ${artist.name}'s profile`}
              className="p-2 rounded-full bg-white hover:bg-blush/40 text-mauve-grey hover:text-ink border border-mist shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={`Save ${artist.name} to wishlist`}
              className="p-2 rounded-full bg-white hover:bg-blush/40 text-mauve-grey hover:text-rose-plum border border-mist shadow-xs transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-plum text-rose-plum' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile modal"
              className="p-2 rounded-full bg-white hover:bg-blush/40 text-ink border border-mist shadow-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Header */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-ink">
            <img
              src={artist.coverImage}
              alt={artist.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

            <div className="absolute bottom-5 inset-x-5 sm:inset-x-6 z-10 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-champagne-gold shadow-luxury shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-plum px-2.5 py-0.5 rounded-full text-white">
                      Celebrity Tier
                    </span>
                    <span className="text-xs text-blush font-mono">{artist.handle}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {artist.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90">{artist.title}</p>
                </div>
              </div>

              {/* Verified Metrics Strip */}
              <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-medium self-start sm:self-auto">
                <div className="flex items-center gap-1 text-champagne-gold font-bold">
                  <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                  <span>{artist.rating.toFixed(2)}</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-white/90">{artist.reviewCount} reviews</span>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{completedJobsCount}+ jobs completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Navigation Tabs: Portfolio | Services | Reviews | About */}
          <div className="sticky top-0 z-20 px-4 sm:px-6 py-2.5 bg-soft-ivory/95 backdrop-blur-md border-b border-mist flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'bg-white text-mauve-grey hover:text-ink border border-mist'
              }`}
            >
              Portfolio ({portfolioItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'bg-white text-mauve-grey hover:text-ink border border-mist'
              }`}
            >
              Services & Packages ({artist.packages.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'bg-white text-mauve-grey hover:text-ink border border-mist'
              }`}
            >
              Reviews ({artist.reviews.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'bg-white text-mauve-grey hover:text-ink border border-mist'
              }`}
            >
              About & Credentials
            </button>
          </div>

          {/* Tab Panes */}
          <div className="p-4 sm:p-6 pb-28">
            {/* TAB 1: PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                {/* Style Sub-Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {(['all', 'bridal', 'airbrush', 'reception', 'editorial'] as StyleFilter[]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setPortfolioStyle(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                        portfolioStyle === filter
                          ? 'bg-ink text-white'
                          : 'bg-white text-mauve-grey hover:bg-blush/40 border border-mist'
                      }`}
                    >
                      {filter === 'all' ? 'All Looks' : filter}
                    </button>
                  ))}
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {filteredPortfolio.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-blush/30 border border-mist cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        <span className="text-[10px] uppercase font-bold text-champagne-gold tracking-wider">
                          {item.tag}
                        </span>
                        <p className="text-xs font-semibold text-white line-clamp-1">{item.title}</p>
                      </div>
                      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & PACKAGES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ink">
                      Complete Atelier Service Menu
                    </h3>
                    <p className="text-xs text-mauve-grey mt-0.5">
                      Showing {filteredPackages.length} of {artist.packages.length} bespoke treatments by {artist.name}
                    </p>
                  </div>
                  <span className="text-xs text-mauve-grey hidden sm:inline">
                    Tap any package to reveal luxury formulations &amp; inclusions
                  </span>
                </div>

                {/* Search & Service Filter Toolbar */}
                <div className="space-y-3 p-4 rounded-2xl bg-white border border-mist shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mauve-grey" />
                      <input
                        type="text"
                        value={serviceSearchQuery}
                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                        placeholder={`Search ${artist.name}'s services...`}
                        className="w-full h-9 pl-9 pr-3 rounded-xl bg-soft-ivory/80 border border-mist text-xs text-ink placeholder:text-mauve-grey focus:outline-none focus:border-rose-plum font-sans"
                      />
                    </div>

                    {/* Mode Filter */}
                    <div className="flex items-center bg-soft-ivory p-1 rounded-xl border border-mist text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setServiceModeFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                          serviceModeFilter === 'all'
                            ? 'bg-rose-plum text-white shadow-2xs'
                            : 'text-mauve-grey hover:text-ink'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceModeFilter('AT_VENUE')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                          serviceModeFilter === 'AT_VENUE'
                            ? 'bg-rose-plum text-white shadow-2xs'
                            : 'text-mauve-grey hover:text-ink'
                        }`}
                      >
                        <Home className="w-3 h-3" />
                        <span>At-Home</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceModeFilter('IN_STUDIO')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                          serviceModeFilter === 'IN_STUDIO'
                            ? 'bg-rose-plum text-white shadow-2xs'
                            : 'text-mauve-grey hover:text-ink'
                        }`}
                      >
                        <Building2 className="w-3 h-3" />
                        <span>Studio</span>
                      </button>
                    </div>

                    {/* Sort Selector */}
                    <select
                      value={serviceSortBy}
                      onChange={(e) => setServiceSortBy(e.target.value as any)}
                      className="h-9 px-2.5 rounded-xl bg-soft-ivory border border-mist text-xs font-semibold text-ink focus:outline-none focus:border-rose-plum cursor-pointer"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-asc">Price: Low-High</option>
                      <option value="price-desc">Price: High-Low</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>

                  {/* Category Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                    {[
                      { id: 'all', label: 'All Services' },
                      { id: 'bridal', label: 'Bridal' },
                      { id: 'makeup', label: 'Makeup' },
                      { id: 'hair', label: 'Hair' },
                      { id: 'skin', label: 'Skin' },
                      { id: 'nails', label: 'Nails' },
                      { id: 'draping', label: 'Draping' },
                    ].map((cat) => {
                      const isSel = serviceCategoryFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setServiceCategoryFilter(cat.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            isSel
                              ? 'bg-rose-plum text-white shadow-2xs'
                              : 'bg-soft-ivory text-ink hover:bg-blush/60 border border-mist'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Packages List */}
                {filteredPackages.length === 0 ? (
                  <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-mist p-6">
                    <Filter className="w-8 h-8 mx-auto text-mist" />
                    <h4 className="font-heading text-sm font-bold text-ink">No services match your filters</h4>
                    <p className="text-xs text-mauve-grey">Try selecting another category or resetting the search.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setServiceCategoryFilter('all');
                        setServiceModeFilter('all');
                        setServiceSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-plum text-white text-xs font-semibold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPackages.map((pkg) => {
                      const isExpanded = expandedPackageId === pkg.id;
                      const isSelected = selectedPackageId === pkg.id;

                      return (
                        <div
                          key={pkg.id}
                          onClick={() => togglePackageExpand(pkg.id)}
                          className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-blush/40 border-rose-plum shadow-card'
                              : isExpanded
                              ? 'bg-white border-rose-plum/40 shadow-luxury'
                              : 'bg-white hover:bg-blush/20 border-mist shadow-xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Treatment Image Thumbnail */}
                            {pkg.imageUrl && (
                              <img
                                src={pkg.imageUrl}
                                alt={pkg.name}
                                className="w-full sm:w-24 sm:h-24 h-36 rounded-2xl object-cover shrink-0 border border-mist shadow-2xs"
                                loading="lazy"
                              />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-champagne-gold/20 text-ink">
                                  {pkg.tier}
                                </span>
                                {pkg.isPopular && <Badge type="bestseller" text="Most Booked" />}
                                <span className="text-[10px] font-semibold text-mauve-grey uppercase tracking-wider bg-soft-ivory px-2 py-0.5 rounded-md border border-mist">
                                  {pkg.serviceMode === 'IN_STUDIO' ? 'Studio Visit' : 'At-Home Service'}
                                </span>
                              </div>

                              <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                                {pkg.name}
                              </h4>

                              <p className="text-xs text-mauve-grey mt-1">{pkg.description}</p>

                              <div className="mt-2.5 flex items-center gap-3 text-xs text-mauve-grey font-medium">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-rose-plum" />
                                  <span className="font-mono">{pkg.durationMinutes} mins</span>
                                </div>
                                <span>•</span>
                                <span>Sterile Kit Included</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-mist/60">
                              <span className="font-serif text-lg sm:text-xl font-bold text-ink block tabular-nums">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                              <button
                                type="button"
                                className="mt-2 text-xs font-semibold text-rose-plum hover:text-deep-plum flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Less' : 'Details'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={spatialSpring}
                                className="mt-5 pt-4 border-t border-mist overflow-hidden"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-xs uppercase font-bold tracking-wider text-ink flex items-center gap-1.5 mb-2">
                                      <Sparkles className="w-3.5 h-3.5 text-rose-plum" />
                                      <span>Formulations &amp; Brands</span>
                                    </span>
                                    <ul className="space-y-1 text-xs text-mauve-grey">
                                      {pkg.productsUsed.map((brand, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold shrink-0" />
                                          <span>{brand}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <span className="text-xs uppercase font-bold tracking-wider text-ink flex items-center gap-1.5 mb-2">
                                      <Layers className="w-3.5 h-3.5 text-rose-plum" />
                                      <span>Inclusions</span>
                                    </span>
                                    <ul className="space-y-1 text-xs text-mauve-grey">
                                      {pkg.inclusions.map((inc, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                          <Check className="w-3.5 h-3.5 text-emerald-accent shrink-0" />
                                          <span>{inc}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-mist flex items-center justify-between">
                                  <span className="text-[11px] text-mauve-grey">
                                    Includes 10-min slot lock &amp; escrow refund protection
                                  </span>

                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={(e) => handleSelectPackage(e, pkg)}
                                    className={`rounded-xl text-xs font-semibold ${
                                      isSelected ? 'bg-emerald-accent hover:bg-emerald-accent' : ''
                                    }`}
                                    leftIcon={
                                      isSelected ? (
                                        <Check className="w-3.5 h-3.5 text-white" />
                                      ) : (
                                        <Calendar className="w-3.5 h-3.5 text-white" />
                                      )
                                    }
                                  >
                                    {isSelected ? 'Selected' : 'Add Service + Select Slot'}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Before / After Transformation Inspection */}
                {artist.beforeAfter && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-champagne-gold" />
                      <h4 className="font-serif text-base font-bold text-ink">
                        Real Transformation: {artist.beforeAfter.title}
                      </h4>
                    </div>
                    <BeforeAfterSlider data={artist.beforeAfter} />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REVIEWS WITH RATING BREAKDOWN */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Overview & Breakdown Bars */}
                <div className="p-5 rounded-2xl bg-white border border-mist shadow-xs flex flex-col md:flex-row items-center gap-6">
                  {/* Left: Overall Score */}
                  <div className="text-center md:text-left shrink-0">
                    <span className="font-mono text-4xl sm:text-5xl font-bold text-ink block">
                      {artist.rating.toFixed(2)}
                    </span>
                    <div className="flex items-center justify-center md:justify-start gap-1 my-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-champagne-gold text-champagne-gold" />
                      ))}
                    </div>
                    <span className="text-xs text-mauve-grey">
                      Based on {artist.reviewCount} verified appointments
                    </span>
                  </div>

                  {/* Right: Breakdown Bars */}
                  <div className="flex-1 w-full space-y-2">
                    {[
                      { star: 5, pct: 92, count: Math.round(artist.reviewCount * 0.92) },
                      { star: 4, pct: 6, count: Math.round(artist.reviewCount * 0.06) },
                      { star: 3, pct: 2, count: Math.round(artist.reviewCount * 0.02) },
                      { star: 2, pct: 0, count: 0 },
                      { star: 1, pct: 0, count: 0 },
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-3 text-xs">
                        <span className="w-8 flex items-center gap-0.5 font-mono font-medium text-ink">
                          {row.star}
                          <Star className="w-2.5 h-2.5 fill-champagne-gold text-champagne-gold" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-blush/60 overflow-hidden">
                          <div
                            className="h-full bg-champagne-gold rounded-full transition-all duration-500"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-mauve-grey">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-3">
                  {artist.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-mist shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="w-9 h-9 rounded-full object-cover border border-mist"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-ink">{rev.author}</span>
                              {rev.verifiedBridal && (
                                <Badge type="verified" text="Verified Client" className="text-[10px]" />
                              )}
                            </div>
                            <span className="text-[11px] text-mauve-grey">{rev.lookTitle}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-mauve-grey leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-mauve-grey mt-2 block font-mono">
                        Reviewed {rev.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ABOUT & CREDENTIALS */}
            {activeTab === 'about' && (
              <div className="space-y-5">
                {/* Bio Card */}
                <div className="p-5 rounded-2xl bg-white border border-mist shadow-xs space-y-3">
                  <h4 className="font-serif text-base font-bold text-ink">About {artist.name}</h4>
                  <p className="text-xs sm:text-sm text-mauve-grey leading-relaxed">
                    {artist.bio ||
                      `${artist.name} is a premier couture makeup specialist with over ${artist.experienceYears} years of experience crafting high-glam looks for brides, film galas, and runway shoots across Bengaluru.`}
                  </p>
                </div>

                {/* Hygiene & Tool Sterilization */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Certified Sterile Tool Protocol</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Every service includes a hermetically sealed, single-use sterilization kit (disposable applicators, sanitized Japanese steel tweezers, UV-sterilized synthetic brushes, and 99% alcohol sanitization wipes).
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Hygiene Score: {artist.hygieneScore || '99.4%'}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Health Checked
                    </span>
                  </div>
                </div>

                {/* Service Modes & Locations */}
                <div className="p-5 rounded-2xl bg-white border border-mist shadow-xs space-y-3">
                  <h4 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-plum" />
                    <span>Service Availability & Coverage</span>
                  </h4>
                  <p className="text-xs text-mauve-grey">
                    Available for at-home visits and studio consultations in:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Lavelle Road', 'Sadashivanagar'].map((area) => (
                      <span key={area} className="px-3 py-1 rounded-full bg-blush text-xs font-medium text-ink">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Booking Bar */}
        <div className="sticky bottom-0 z-30 px-5 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-t border-mist flex items-center justify-between shadow-luxury shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-mauve-grey block font-semibold">
              Starting from
            </span>
            <span className="font-mono text-lg sm:text-xl font-bold text-ink">
              ₹{artist.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={(e) => handleSelectPackage(e, artist.packages[0])}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold"
          >
            Book Appointment
          </Button>
        </div>

        {/* Lightbox / Full-screen Image Viewer */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
            >
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-w-2xl w-full max-h-[80vh] flex flex-col items-center">
                <img
                  src={filteredPortfolio[selectedPhotoIndex]?.url}
                  alt={filteredPortfolio[selectedPhotoIndex]?.title}
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <span className="text-xs uppercase font-bold text-champagne-gold tracking-wider">
                    {filteredPortfolio[selectedPhotoIndex]?.tag}
                  </span>
                  <h4 className="text-white font-serif text-lg font-bold">
                    {filteredPortfolio[selectedPhotoIndex]?.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
