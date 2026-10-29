import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, User, ShoppingBag, Clock, ArrowRight, Star } from 'lucide-react';
import {
  marketplaceService,
  DetailedService,
  TRENDING_SEARCHES,
} from '../../services/marketplaceService';
import { Artist, Product } from '../../types';
import { popoverVariant, MOTION_GESTURES } from '../../motion/tokens';

export interface GlobalSearchProps {
  onSelectService?: (service: DetailedService) => void;
  onSelectArtist?: (artist: Artist) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenSearchModal?: () => void;
  className?: string;
}

const ROTATING_PLACEHOLDERS = [
  "Search 'bridal makeup'",
  "Search 'hydra facial'",
  "Search 'haircut & blowdry'",
  "Search 'gel manicure'",
  "Search 'rica waxing'",
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSelectService,
  onSelectArtist,
  onSelectProduct,
  onOpenSearchModal,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('glamgo_recent_searches');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return ['Bridal HD Makeup', 'Hydra Facial', 'Dyson Blowout'];
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotating placeholder interval
  useEffect(() => {
    if (isFocused || query.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = query.trim() ? marketplaceService.search(query) : null;

  const handleSaveRecentSearch = (text: string) => {
    const updated = [text, ...recentSearches.filter((s) => s.toLowerCase() !== text.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('glamgo_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    handleSaveRecentSearch(term);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('glamgo_recent_searches');
    } catch {}
  };

  return (
    <div ref={containerRef} className={`relative flex-1 max-w-xl ${className}`}>
      {/* Search Input Bar */}
      <div
        className={`relative h-11 flex items-center w-full rounded-full bg-soft-ivory border transition-all duration-200 ${
          isFocused
            ? 'border-rose-plum ring-2 ring-rose-plum/20 bg-white shadow-xs'
            : 'border-mist hover:border-rose-plum/30'
        }`}
      >
        <Search
          className={`w-4 h-4 ml-4 shrink-0 transition-colors ${
            isFocused ? 'text-rose-plum' : 'text-mauve-grey'
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
          aria-label="Search services, stylists, treatments and products"
          aria-expanded={isFocused}
          aria-autocomplete="list"
          className="w-full h-full bg-transparent pl-3 pr-9 text-xs sm:text-sm font-medium text-ink placeholder:text-mauve-grey focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="absolute right-3.5 p-1 rounded-full text-mauve-grey hover:text-ink cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions & Results */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            variants={popoverVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-mist shadow-card p-3 z-50 max-h-[440px] overflow-y-auto"
          >
            {/* If query is empty, show Recent + Trending */}
            {!query.trim() && (
              <div className="space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 pb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-mauve-grey flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={handleClearRecent}
                        className="text-[11px] text-rose-plum hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectRecent(term)}
                          className="h-8 px-3 rounded-full bg-soft-ivory hover:bg-blush/60 text-xs font-medium text-ink border border-mist transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-mauve-grey flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-rose-plum" /> Trending Searches
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                    {TRENDING_SEARCHES.slice(0, 6).map((trend) => (
                      <button
                        key={trend}
                        type="button"
                        onClick={() => {
                          setQuery(trend);
                          handleSaveRecentSearch(trend);
                        }}
                        className="h-9 px-2.5 rounded-xl hover:bg-soft-ivory text-xs font-medium text-ink flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <span className="truncate">{trend}</span>
                        <ArrowRight className="w-3 h-3 text-mauve-grey shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If query exists, show matching results */}
            {query.trim() && searchResults && (
              <div className="space-y-3">
                {/* Services */}
                {searchResults.services.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-mauve-grey px-2 py-1">
                      Services ({searchResults.services.length})
                    </p>
                    <div className="space-y-1">
                      {searchResults.services.slice(0, 3).map((srv) => (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => {
                            handleSaveRecentSearch(srv.title);
                            setIsFocused(false);
                            onSelectService?.(srv);
                          }}
                          className="w-full h-12 flex items-center justify-between px-2.5 rounded-xl hover:bg-blush/40 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={srv.imageUrl}
                              alt={srv.title}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-ink truncate">{srv.title}</p>
                              <p className="text-[11px] text-mauve-grey">{srv.durationMinutes} mins</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-rose-plum shrink-0">
                            ₹{srv.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professionals */}
                {searchResults.professionals.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-mauve-grey px-2 py-1">
                      Stylists &amp; Artists ({searchResults.professionals.length})
                    </p>
                    <div className="space-y-1">
                      {searchResults.professionals.slice(0, 2).map((art) => (
                        <button
                          key={art.id}
                          type="button"
                          onClick={() => {
                            handleSaveRecentSearch(art.name);
                            setIsFocused(false);
                            onSelectArtist?.(art);
                          }}
                          className="w-full h-12 flex items-center justify-between px-2.5 rounded-xl hover:bg-blush/40 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={art.avatar || art.coverImage}
                              alt={art.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-ink truncate">{art.name}</p>
                              <p className="text-[11px] text-mauve-grey truncate">
                                {art.specialties.slice(0, 2).join(' • ')}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-ink shrink-0 flex items-center gap-1">
                            <Star className="w-3 h-3 text-champagne-gold fill-champagne-gold" />
                            <span>{art.rating}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {searchResults.products.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-mauve-grey px-2 py-1">
                      Products ({searchResults.products.length})
                    </p>
                    <div className="space-y-1">
                      {searchResults.products.slice(0, 2).map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            handleSaveRecentSearch(prod.name);
                            setIsFocused(false);
                            onSelectProduct?.(prod);
                          }}
                          className="w-full h-12 flex items-center justify-between px-2.5 rounded-xl hover:bg-blush/40 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-ink truncate">{prod.name}</p>
                              <p className="text-[11px] text-mauve-grey">{prod.brand}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-rose-plum shrink-0">
                            ₹{prod.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Full Search Results link */}
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    onOpenSearchModal?.();
                  }}
                  className="w-full h-10 rounded-xl bg-blush/60 hover:bg-blush text-rose-plum font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View all results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
