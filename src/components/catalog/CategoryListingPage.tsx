import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  Check,
  Plus,
  Minus,
  Sparkles,
  Home,
  Building2,
  CalendarCheck,
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  DetailedService,
  MARKETPLACE_CATEGORIES,
  marketplaceService,
} from '../../services/marketplaceService';
import { VariantPickerSheet, ServiceVariantOption } from './VariantPickerSheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { trackEvent } from '../../services/analyticsService';
import { CartItemService } from '../../types';

interface CategoryListingPageProps {
  categorySlug: string;
  onBackToHome: () => void;
  onOpenServiceDetail: (service: DetailedService) => void;
  onBookService: (service: DetailedService) => void;
  cartServiceId?: string;
  activeCart?: CartItemService | null;
  onOpenCart?: () => void;
  onAddToCart?: (service: DetailedService, variant?: ServiceVariantOption) => void;
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
  activeCart,
  onOpenCart,
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
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        subcategories: ['All', 'Bridal', 'Makeup', 'Hair', 'Skin', 'Nails', 'Spa'],
      }
    );
  }, [categorySlug]);

  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    currentCategory.subcategories[0] || 'All'
  );
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyHighRating, setOnlyHighRating] = useState(false);

  // Variant picker state
  const [variantModalService, setVariantModalService] = useState<DetailedService | null>(null);

  // Quantities for stepper
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => {
    return cartServiceId ? { [cartServiceId]: 1 } : {};
  });

  const allServices = useMemo(() => {
    return marketplaceService.getServicesByCategory(
      categorySlug === 'all' ? '' : categorySlug
    );
  }, [categorySlug]);

  // Group services by subcategory for Urban Company scroll-spy view
  const groupedServices = useMemo(() => {
    let result = [...allServices];

    // Mode Filter
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

    // Organize into groups
    const groups: { title: string; services: DetailedService[] }[] = [];
    const subcats = currentCategory.subcategories.filter((s) => !s.toLowerCase().startsWith('all'));

    if (subcats.length === 0) {
      groups.push({ title: currentCategory.name, services: result });
    } else {
      subcats.forEach((sub) => {
        const subLower = sub.toLowerCase();
        const matched = result.filter(
          (s) =>
            s.title.toLowerCase().includes(subLower) ||
            s.description.toLowerCase().includes(subLower) ||
            s.category.toLowerCase().includes(subLower)
        );
        if (matched.length > 0) {
          groups.push({ title: sub, services: matched });
        }
      });
      // Fallback if some services were not captured by subcategory keywords
      const capturedIds = new Set(groups.flatMap((g) => g.services.map((s) => s.id)));
      const remaining = result.filter((s) => !capturedIds.has(s.id));
      if (remaining.length > 0) {
        groups.push({ title: 'Popular Services', services: remaining });
      }
    }

    return groups;
  }, [
    allServices,
    currentCategory,
    modeFilter,
    onlyAvailableToday,
    onlyHighRating,
    priceFilter,
    sortBy,
  ]);

  // Scroll to section when subcategory clicked
  const handleScrollToSubcategory = (title: string) => {
    setActiveSubcategory(title);
    const element = document.getElementById(`subcat-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddClick = (e: React.MouseEvent, srv: DetailedService) => {
    e.stopPropagation();
    // If service has options (e.g. hair, waxing, skin), open variant picker
    if (['hair', 'waxing', 'skin'].includes(srv.category)) {
      setVariantModalService(srv);
      return;
    }
    setCartQuantities((prev) => ({ ...prev, [srv.id]: 1 }));
    if (onAddToCart) onAddToCart(srv);
    else onBookService(srv);
  };

  const handleVariantConfirmed = (
    srv: DetailedService,
    selectedVariant: ServiceVariantOption,
    finalPrice: number
  ) => {
    setCartQuantities((prev) => ({ ...prev, [srv.id]: 1 }));
    const modifiedService: DetailedService = {
      ...srv,
      price: finalPrice,
      durationMinutes: srv.durationMinutes + selectedVariant.durationDeltaMinutes,
    };
    if (onAddToCart) onAddToCart(modifiedService, selectedVariant);
    else onBookService(modifiedService);
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

  const totalServicesCount = groupedServices.reduce((sum, g) => sum + g.services.length, 0);

  return (
    <div className="min-h-screen bg-soft-ivory pb-28">
      {/* Category Header Hero */}
      <div className="bg-white border-b border-mist px-4 sm:px-6 lg:px-8 pt-4 pb-5">
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

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-plum block">
                Glamgo Certified Salon Menus
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-mauve-grey mt-0.5">
                {currentCategory.tagline} • 100% genuine sealed mono-dose kits
              </p>
            </div>

            <div className="text-xs font-mono text-mauve-grey">
              {totalServicesCount} {totalServicesCount === 1 ? 'service' : 'services'} available
            </div>
          </div>

          {/* Mobile sub-category chips */}
          <div className="mt-4 flex lg:hidden items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {groupedServices.map((g) => {
              const isSelected = activeSubcategory === g.title;
              return (
                <button
                  key={g.title}
                  type="button"
                  onClick={() => handleScrollToSubcategory(g.title)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-plum text-white shadow-xs'
                      : 'bg-soft-ivory hover:bg-blush/50 text-mauve-grey border border-mist'
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter / Sort Sticky Bar */}
      <div className="sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-mist shadow-xs px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-soft-ivory border border-mist rounded-xl px-3 py-1.5 pr-7 font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-rose-plum cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-mauve-grey absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Service Mode Chips */}
          <button
            type="button"
            onClick={() =>
              setModeFilter((prev) => (prev === 'AT_VENUE' ? 'all' : 'AT_VENUE'))
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              modeFilter === 'IN_STUDIO'
                ? 'bg-rose-plum text-white border-rose-plum'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>In Studio</span>
          </button>

          {/* 4.8+ Rating */}
          <button
            type="button"
            onClick={() => setOnlyHighRating((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              onlyAvailableToday
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                : 'bg-soft-ivory hover:bg-blush/40 text-mauve-grey border-mist'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Available Today</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN URBAN COMPANY LAYOUT (Desktop >=1024px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1 (Desktop Left Rail): Sticky Sub-Category Rail with Scroll-Spy */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-1 bg-white p-3 rounded-2xl border border-mist shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-mauve-grey px-2 py-1 block">
              Sub-Categories
            </span>
            {groupedServices.map((group) => {
              const isSelected = activeSubcategory === group.title;
              return (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => handleScrollToSubcategory(group.title)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blush text-rose-plum font-bold shadow-2xs'
                      : 'text-ink/80 hover:text-ink hover:bg-soft-ivory'
                  }`}
                >
                  <span className="truncate">{group.title}</span>
                  <span className="text-[10px] font-mono text-mauve-grey shrink-0 ml-2">
                    {group.services.length}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* COLUMN 2 (Center): Service List Grouped Under Sub-Category Headings */}
          <main className="lg:col-span-6 space-y-8">
            {groupedServices.length === 0 ? (
              <div className="py-16 text-center max-w-md mx-auto bg-white rounded-2xl p-6 border border-mist">
                <Sparkles className="w-8 h-8 text-rose-plum mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-ink">
                  No services match these filters
                </h3>
                <p className="text-xs text-mauve-grey mt-1 mb-4">
                  Adjust your filter chips or reset to see all available services.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setModeFilter('all');
                    setPriceFilter('all');
                    setOnlyAvailableToday(false);
                    setOnlyHighRating(false);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              groupedServices.map((group) => (
                <section
                  key={group.title}
                  id={`subcat-${group.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="space-y-4"
                >
                  {/* Sub-category Heading */}
                  <div className="flex items-baseline justify-between border-b border-mist/80 pb-2">
                    <h2 className="font-heading font-bold text-lg text-ink">
                      {group.title}
                    </h2>
                    <span className="text-xs text-mauve-grey">
                      {group.services.length} items
                    </span>
                  </div>

                  {/* Service Cards */}
                  <div className="space-y-4">
                    {group.services.map((service) => {
                      const qty = cartQuantities[service.id] || 0;
                      const hasDiscount = service.originalPrice > service.price;
                      const hasVariants = ['hair', 'waxing', 'skin'].includes(service.category);

                      return (
                        <div
                          key={service.id}
                          onClick={() => onOpenServiceDetail(service)}
                          className="p-4 sm:p-5 rounded-2xl bg-white border border-mist shadow-2xs hover:border-rose-plum/30 hover:shadow-card transition-all flex flex-col sm:flex-row gap-4 justify-between cursor-pointer group"
                        >
                          {/* Left details info */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Service title & Rating */}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink bg-champagne-gold/15 px-2 py-0.5 rounded">
                                  <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
                                  <span>{service.rating.toFixed(2)}</span>
                                  <span className="text-mauve-grey font-normal font-mono">
                                    ({service.reviewCount})
                                  </span>
                                </span>

                                {service.isMostBooked && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-plum bg-blush px-2 py-0.5 rounded-full">
                                    Most Booked
                                  </span>
                                )}
                              </div>

                              <h3 className="font-heading font-bold text-sm sm:text-base text-ink group-hover:text-rose-plum transition-colors leading-tight">
                                {service.title}
                              </h3>
                            </div>

                            {/* Duration & Price */}
                            <div className="flex items-baseline gap-2 font-mono">
                              <span className="text-xs font-semibold text-rose-plum bg-blush/60 px-2 py-0.5 rounded">
                                {service.durationMinutes} mins
                              </span>
                              <span className="text-sm sm:text-base font-bold text-ink">
                                ₹{service.price}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-mauve-grey line-through">
                                  ₹{service.originalPrice}
                                </span>
                              )}
                              {hasDiscount && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  Save ₹{service.savingsAmount}
                                </span>
                              )}
                            </div>

                            {/* 2-3 Bullet Highlights */}
                            <ul className="space-y-1 pt-1 text-xs text-mauve-grey">
                              {service.whatIsIncluded.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Sealed single-use note */}
                            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium pt-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Products: sealed, single-use</span>
                            </div>

                            {/* View details link */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenServiceDetail(service);
                              }}
                              className="text-[11px] font-bold text-rose-plum hover:text-deep-plum inline-flex items-center gap-1 cursor-pointer pt-1"
                            >
                              <span>View details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Right: Service photo + Round Add Button */}
                          <div className="relative w-full sm:w-36 shrink-0 flex sm:flex-col items-center justify-between sm:justify-start gap-3">
                            <div className="relative aspect-[4/3] w-28 sm:w-full rounded-xl overflow-hidden bg-blush/20 border border-mist shadow-2xs">
                              <img
                                src={service.imageUrl}
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>

                            {/* Add / Stepper Button */}
                            <div className="w-auto sm:w-full flex justify-end sm:justify-center">
                              {qty > 0 ? (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center border border-rose-plum rounded-full overflow-hidden bg-blush/40 shadow-xs"
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => handleDecrement(e, service.id)}
                                    className="w-7 h-7 flex items-center justify-center text-rose-plum hover:bg-rose-plum/10 transition-colors cursor-pointer"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center font-mono font-bold text-xs text-ink">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleIncrement(e, service.id)}
                                    className="w-7 h-7 flex items-center justify-center text-rose-plum hover:bg-rose-plum/10 transition-colors cursor-pointer"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => handleAddClick(e, service)}
                                  className="px-4 py-1.5 rounded-full bg-white hover:bg-blush border border-rose-plum text-rose-plum font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{hasVariants ? 'Add +' : 'Add'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </main>

          {/* COLUMN 3 (Desktop Right): Sticky Cart & Safe Assurance Card */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-4">
            {/* Sticky Cart Summary */}
            <div className="p-4 rounded-2xl bg-white border border-mist shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-mist/80">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-rose-plum" />
                  <span>Your Cart</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-rose-plum">
                  {activeCart ? '1 item' : '0 items'}
                </span>
              </div>

              {activeCart ? (
                <div className="space-y-3">
                  <div className="text-xs">
                    <p className="font-bold text-ink truncate">
                      {activeCart.package.name}
                    </p>
                    <p className="text-[11px] text-mauve-grey font-mono mt-0.5">
                      {activeCart.date} • {activeCart.timeSlot}
                    </p>
                    <p className="font-bold text-rose-plum mt-1">
                      ₹{activeCart.package.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="w-full py-2.5 rounded-xl bg-rose-plum text-white font-bold text-xs hover:bg-deep-plum transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Cart &amp; Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-mauve-grey">
                    No services in cart yet.
                  </p>
                  <p className="text-[11px] text-mauve-grey/80 mt-0.5">
                    Click &apos;Add&apos; on any service to start booking.
                  </p>
                </div>
              )}
            </div>

            {/* Safe & Hygienic Assurance Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe &amp; Hygienic Delivery</span>
              </div>
              <ul className="space-y-1 text-[11px] text-emerald-800">
                <li>• Barcode-sealed mono-dose kits</li>
                <li>• Hospital-grade tool sterilization</li>
                <li>• Start OTP verification on arrival</li>
              </ul>
            </div>
          </aside>

        </div>
      </div>

      {/* Variant Picker Sheet */}
      <VariantPickerSheet
        isOpen={Boolean(variantModalService)}
        onClose={() => setVariantModalService(null)}
        service={variantModalService}
        onConfirmSelection={handleVariantConfirmed}
      />
    </div>
  );
};
