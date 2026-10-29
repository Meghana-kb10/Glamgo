import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star, Sparkles, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { marketplaceService, TRENDING_SEARCHES, DetailedService } from '../../services/marketplaceService';
import { Artist, Product } from '../../types';
import { trackEvent } from '../../services/analyticsService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: DetailedService) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onSelectArtist,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'pros' | 'products'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glamgo_recent_searches');
      return saved ? JSON.parse(saved) : ['Bridal HD Makeup', 'Indiranagar Blowdry'];
    } catch {
      return ['Bridal HD Makeup', 'Indiranagar Blowdry'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = marketplaceService.search(query);
  const totalMatches = results.services.length + results.professionals.length + results.products.length;

  const handleExecuteSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    trackEvent('search_performed', { query: searchTerm });
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('glamgo_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('glamgo_recent_searches');
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center p-0 sm:p-4 pt-0 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/75 backdrop-blur-md"
      />

      {/* Search Container */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white sm:rounded-3xl border border-mist shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-mist flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-plum shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 2) {
                trackEvent('search_performed', { query: e.target.value });
              }
            }}
            placeholder="Search artists, bridal packages, hair styling, cosmetics..."
            className="flex-1 bg-transparent text-sm sm:text-base text-ink placeholder:text-mauve-grey focus:outline-none"
            aria-label="Search beauty services, professionals and products"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="p-1 rounded-full text-mauve-grey hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full hover:bg-mist text-mauve-grey hover:text-ink cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Live Filter Tabs (when searching) */}
        {query.trim().length > 0 && (
          <div className="px-5 py-2.5 bg-soft-ivory border-b border-mist flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: `All (${totalMatches})` },
              { id: 'services', label: `Services (${results.services.length})` },
              { id: 'pros', label: `Artists (${results.professionals.length})` },
              { id: 'products', label: `Products (${results.products.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-rose-plum text-white shadow-xs'
                    : 'bg-white text-mauve-grey border border-mist hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Default Screen: Recent & Trending Searches */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-mauve-grey flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleClearRecent}
                      className="text-[11px] text-mauve-grey hover:text-coral-red cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleExecuteSearch(term)}
                        className="px-3 py-1.5 rounded-xl bg-soft-ivory border border-mist text-xs text-ink hover:border-rose-plum/40 hover:text-rose-plum transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-mauve-grey flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-plum" />
                  <span>Trending in Bengaluru</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleExecuteSearch(term)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-mist text-xs text-ink hover:border-rose-plum hover:bg-blush/20 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-champagne-gold" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results */}
          {query.trim() && (
            <div className="space-y-6" aria-live="polite">
              {totalMatches === 0 && (
                <div className="py-12 text-center text-mauve-grey space-y-2">
                  <p className="font-serif text-lg font-bold text-ink">No results for "{query}"</p>
                  <p className="text-xs text-mauve-grey max-w-sm mx-auto">
                    Try searching for "Bridal HD", "Blowout", "Facial", or explore our top categories.
                  </p>
                </div>
              )}

              {/* Services Section */}
              {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-plum block">
                    Services ({results.services.length})
                  </span>
                  <div className="space-y-2">
                    {results.services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => {
                          onSelectService(srv);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white border border-mist hover:border-rose-plum/40 flex items-center justify-between gap-3 transition-colors cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={srv.imageUrl}
                            alt={srv.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-ink group-hover:text-rose-plum transition-colors line-clamp-1">
                              {srv.title}
                            </h4>
                            <p className="text-[11px] text-mauve-grey">
                              {srv.durationMinutes} mins • {srv.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif text-sm font-bold text-ink block">
                            ₹{srv.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            Save ₹{srv.savingsAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists Section */}
              {(activeTab === 'all' || activeTab === 'pros') && results.professionals.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-plum block">
                    Artists ({results.professionals.length})
                  </span>
                  <div className="space-y-2">
                    {results.professionals.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onSelectArtist(art);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white border border-mist hover:border-rose-plum/40 flex items-center justify-between gap-3 transition-colors cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={art.avatar || art.coverImage}
                            alt={art.name}
                            className="w-12 h-12 rounded-full object-cover shrink-0 border border-mist"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-ink group-hover:text-rose-plum transition-colors">
                              {art.name}
                            </h4>
                            <p className="text-[11px] text-mauve-grey">
                              {art.title} • {art.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold" />
                          <span className="font-bold text-ink">{art.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-plum block">
                    Cosmetics &amp; Products ({results.products.length})
                  </span>
                  <div className="space-y-2">
                    {results.products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white border border-mist hover:border-rose-plum/40 flex items-center justify-between gap-3 transition-colors cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-mist"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-ink group-hover:text-rose-plum transition-colors line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-mauve-grey">
                              {prod.brand} • {prod.category}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif text-sm font-bold text-ink">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
