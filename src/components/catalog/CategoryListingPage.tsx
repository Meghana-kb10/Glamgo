import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  Check,
  Plus,
  Minus,
  Sparkles,
  SlidersHorizontal,
  Home,
  Building2,
  CalendarCheck,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  DetailedService,
  MARKETPLACE_CATEGORIES,
  marketplaceService,
} from '../../services/marketplaceService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { trackEvent } from '../../services/analyticsService';

interface CategoryListingPageProps {
  categorySlug: string;
  onBackToHome: () => void;
  onOpenServiceDetail: (service: DetailedService) => void;
  onBookService: (service: DetailedService) => void;
  cartServiceId?: string;
  onAddToCart?: (service: DetailedService) => void;
  onRemoveFromCart?: (serviceId: string) => void;
}

type SortOption = 'recommended' | 'rating' | 'price-asc' | 'price-desc';
type ModeFilter = 'all' | 'AT_VENUE' | 'IN_STUDIO';
type PriceFilter = 'all' | 'under3k' | '3kto10k' | 'above10k';

export const CategoryListingPage: React.FC<CategoryListingPageProps> = ({
  categorySlug,
  onBackToHome,
  onOpenServiceDetail,
  onBookService,
  cartServiceId,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const currentCategory = useMemo(() => {
    return (
      MARKETPLACE_CATEGORIES.find(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
      ) || {
        id: 'cat-all',
        slug: 'all',
        name: 'All Categories',
        tagline: 'Luxury salon, hair & aesthetic experiences',
        iconName: 'Sparkles',
        imageUrl: '',
        subcategories: ['All', 'Bridal', 'Makeup', 'Hair', 'Skin', 'Nails', 'Spa'],
      }
    );
  }, [categorySlug]);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    currentCategory.subcategories[0] || 'All'
  );
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyHighRating, setOnlyHighRating] = useState(false);

  // Quantities for stepper
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => {
    return cartServiceId ? { [cartServiceId]: 1 } : {};
  });

  const allServices = useMemo(() => {
    return marketplaceService.getServicesByCategory(
      categorySlug === 'all' ? '' : categorySlug
    );
  }, [categorySlug]);

  // Filtered & Sorted Services
  const filteredServices = useMemo(() => {
    let result = [...allServices];

    // Subcategory Filter
    if (
      selectedSubcategory &&
      !selectedSubcategory.toLowerCase().startsWith('all')
    ) {
      const sub = selectedSubcategory.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(sub) ||
          s.category.toLowerCase().includes(sub) ||
          s.description.toLowerCase().includes(sub)
      );
    }

    // Service Mode Filter
    if (modeFilter !== 'all') {
      result = result.filter(
        (s) => s.serviceMode === modeFilter || s.serviceMode === 'HYBRID'
      );
    }

    // Available Today
    if (onlyAvailableToday) {
      result = result.filter((s) => s.isAvailableToday);
    }

    // 4.8+ Rating
    if (onlyHighRating) {
      result = result.filter((s) => s.rating >= 4.8);
    }

    // Price Filter
    if (priceFilter === 'under3k') {
      result = result.filter((s) => s.price < 3000);
    } else if (priceFilter === '3kto10k') {
      result = result.filter((s) => s.price >= 3000 && s.price <= 10000);
    } else if (priceFilter === 'above10k') {
      result = result.filter((s) => s.price > 10000);
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    allServices,
    selectedSubcategory,
    modeFilter,
    onlyAvailableToday,
    onlyHighRating,
    priceFilter,
    sortBy,
  ]);

  const handleSubcategoryClick = (sub: string) => {
    setSelectedSubcategory(sub);
    trackEvent('category_viewed', { category: categorySlug, subcategory: sub });
  };

  const handleAdd = (e: React.MouseEvent, srv: DetailedService) => {
    e.stopPropagation();
    setCartQuantities((prev) => ({ ...prev, [srv.id]: 1 }));
    if (onAddToCart) onAddToCart(srv);
    else onBookService(srv);
  };

  const handleIncrement = (e: React.MouseEvent, srvId: string) => {
    e.stopPropagation();
    setCartQuantities((prev) => ({ ...prev, [srvId]: (prev[srvId] || 1) + 1 }));
  };

  const handleDecrement = (e: React.MouseEvent, srvId: string) => {
    e.stopPropagation();
    setCartQuantities((prev) => {
      const current = prev[srvId] || 1;
      if (current <= 1) {
        const next = { ...prev };
        delete next[srvId];
        if (onRemoveFromCart) onRemoveFromCart(srvId);
        return next;
      }
      return { ...prev, [srvId]: current - 1 };
    });
  };

  return (
    <div className="min-h-screen bg-soft-ivory pb-28">
      {/* Top Category Hero Banner */}
      <div className="bg-gradient-to-b from-blush/60 to-soft-ivory border-b border-mist px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-mauve-grey hover:text-ink transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
                Glamgo Marketplace Catalog
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-mauve-grey mt-1">
                {currentCategory.tagline}
              </p>
            </div>

            <div className="text-xs font-mono text-mauve-grey">
              {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} available
            </div>
          </div>

          {/* Subcategory Scroll Strip */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {currentCategory.subcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-plum text-white shadow-xs'
                      : 'bg-white hover:bg-blush/50 text-mauve-grey border border-mist'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-mist shadow-xs px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-soft-ivory border border-mist rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-rose-plum cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-mauve-grey absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Service Mode Chips */}
          <button
            type="button"
            onClick={() =>
              setModeFilter((prev) => (prev === 'AT_VENUE' ? 'all' : 'AT_VENUE'))
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              modeFilter === 'AT_VENUE'
                ? 'bg-rose-plum text-white border-rose-plum'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>At Home</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setModeFilter((prev) => (prev === 'IN_STUDIO' ? 'all' : 'IN_STUDIO'))
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              modeFilter === 'IN_STUDIO'
                ? 'bg-rose-plum text-white border-rose-plum'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>At Studio</span>
          </button>

          {/* Rating 4.8+ */}
          <button
            type="button"
            onClick={() => setOnlyHighRating((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              onlyHighRating
                ? 'bg-champagne-gold/20 text-ink border-champagne-gold'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
            <span>4.8+ Rating</span>
          </button>

          {/* Available Today */}
          <button
            type="button"
            onClick={() => setOnlyAvailableToday((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              onlyAvailableToday
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Available Today</span>
          </button>

          {/* Price Range Filter */}
          <div className="relative shrink-0">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
              className="appearance-none bg-soft-ivory border border-mist rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-rose-plum cursor-pointer"
            >
              <option value="all">Price: All</option>
              <option value="under3k">Under ₹3,000</option>
              <option value="3kto10k">₹3,000 – ₹10,000</option>
              <option value="above10k">Above ₹10,000</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-mauve-grey absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredServices.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto mb-4 text-rose-plum">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">
              No services match your filters
            </h3>
            <p className="text-xs text-mauve-grey mt-1 mb-5">
              Try adjusting your subcategory, rating, or price preferences to see more master services.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedSubcategory('All');
                setModeFilter('all');
                setPriceFilter('all');
                setOnlyAvailableToday(false);
                setOnlyHighRating(false);
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const qty = cartQuantities[service.id] || 0;
              const hasDiscount = service.originalPrice > service.price;

              return (
                <div
                  key={service.id}
                  onClick={() => onOpenServiceDetail(service)}
                  className="group bg-white rounded-2xl border border-mist shadow-xs hover:shadow-card hover:border-rose-plum/40 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-blush/20">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-ink shadow-xs">
                        {service.serviceMode === 'AT_VENUE'
                          ? 'At-Home Service'
                          : service.serviceMode === 'IN_STUDIO'
                          ? 'In Studio'
                          : 'Home & Studio'}
                      </span>

                      {service.isMostBooked && (
                        <Badge type="bestseller" text="Most Booked" />
                      )}
                    </div>

                    {/* Savings Tag */}
                    {hasDiscount && (
                      <div className="absolute bottom-3 left-3 bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                        Save ₹{service.savingsAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta stats */}
                      <div className="flex items-center gap-3 text-xs text-mauve-grey mb-1.5 font-medium">
                        <div className="flex items-center gap-1 text-ink font-semibold">
                          <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                          <span>{service.rating.toFixed(2)}</span>
                          <span className="text-mauve-grey font-normal">
                            ({service.reviewCount})
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-plum" />
                          <span>{service.durationMinutes} mins</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-base sm:text-lg font-bold text-ink line-clamp-1 group-hover:text-rose-plum transition-colors">
                        {service.title}
                      </h3>

                      {/* Inclusions summary */}
                      <ul className="mt-2.5 space-y-1 text-xs text-mauve-grey">
                        {service.whatIsIncluded.slice(0, 2).map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-4 pt-3.5 border-t border-mist flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-lg sm:text-xl font-bold text-ink">
                            ₹{service.price.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-mauve-grey line-through font-mono">
                              ₹{service.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-mauve-grey block">
                          Taxes & hygiene kit estimated
                        </span>
                      </div>

                      {/* Stepper or Add Button */}
                      {qty > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center border border-rose-plum rounded-xl overflow-hidden bg-blush/40 shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={(e) => handleDecrement(e, service.id)}
                            className="w-8 h-8 flex items-center justify-center text-rose-plum hover:bg-rose-plum/10 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-mono font-bold text-xs text-ink">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleIncrement(e, service.id)}
                            className="w-8 h-8 flex items-center justify-center text-rose-plum hover:bg-rose-plum/10 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleAdd(e, service)}
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                          className="rounded-xl px-4 py-1.5 text-xs font-semibold"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
