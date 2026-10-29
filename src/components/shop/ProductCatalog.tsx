import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Sparkles, SlidersHorizontal, Package, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductDetailModal } from './ProductDetailModal';

export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'Setting & Prep', label: 'Setting & Prep' },
  { id: 'Complexion & Base', label: 'Complexion & Base' },
  { id: 'Highlighter & Blush', label: 'Highlighter & Blush' },
  { id: 'Eye Accents', label: 'Eye Accents & Lashes' },
  { id: 'Lips & Tint', label: 'Lips & Tint' },
  { id: 'Skincare Prep', label: 'Skincare & Serums' },
  { id: 'Bridal Vanity Kits', label: 'Bridal Vanity Kits' },
];

interface ProductCatalogProps {
  products: Product[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  onAddToCart: (product: Product, selectedShade?: string) => void;
  onBackToServices: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory: initialCategory = 'all',
  onSelectCategory,
  onAddToCart,
  onBackToServices,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Sync with prop
  React.useEffect(() => {
    setActiveCategory(initialCategory || 'all');
  }, [initialCategory]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    onSelectCategory?.(catId === 'all' ? null : catId);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mist">
        <button
          type="button"
          onClick={onBackToServices}
          className="inline-flex items-center gap-2 text-xs font-semibold text-mauve-grey hover:text-rose-plum transition-colors cursor-pointer group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Salon &amp; Bridal Services</span>
        </button>

        <span className="text-xs text-mauve-grey font-sans">
          Showing <span className="font-bold text-ink">{filteredProducts.length}</span> curated beauty formulations
        </span>
      </div>

      {/* 2. Editorial Title Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blush/40 via-soft-ivory to-blush/20 border border-mist flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-mist shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-plum" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum">
              The Backstage Beauty Boutique
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
            Curated Professional Cosmetics
          </h1>
          <p className="text-xs sm:text-sm text-mauve-grey font-sans leading-relaxed">
            The exact setting shields, 24k radiance primers, and couture bridal palettes approved and used by celebrity makeup artists. Delivered straight to your doorstep.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-white border border-mist text-center shadow-xs">
            <span className="block font-mono text-xl font-bold text-rose-plum">100%</span>
            <span className="text-[10px] text-mauve-grey uppercase font-bold tracking-wider">Authentic Lab Verified</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-mist text-center shadow-xs">
            <span className="block font-mono text-xl font-bold text-ink">24h</span>
            <span className="text-[10px] text-mauve-grey uppercase font-bold tracking-wider">Climate-Safe Dispatch</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mauve-grey" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or brands..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-mist text-xs text-ink placeholder:text-mauve-grey focus:outline-none focus:border-rose-plum focus:ring-1 focus:ring-rose-plum transition-all shadow-2xs font-sans"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-mauve-grey shrink-0 font-sans hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 px-3.5 rounded-xl bg-white border border-mist text-xs font-semibold text-ink focus:outline-none focus:border-rose-plum transition-all cursor-pointer shadow-2xs font-sans"
          >
            <option value="featured">Featured Formulations</option>
            <option value="rating">Top Rated by Brides</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 4. Product Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-sans shrink-0 ${
                isSelected
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'bg-white hover:bg-blush/50 border border-mist text-ink hover:text-rose-plum shadow-2xs'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 5. Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-mist p-8 shadow-xs">
          <Package className="w-12 h-12 mx-auto text-mist" />
          <h3 className="font-heading text-lg font-bold text-ink">No formulations found</h3>
          <p className="text-xs text-mauve-grey max-w-sm mx-auto font-sans">
            We couldn't find any products matching your search criteria. Try selecting another category or resetting the search.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-rose-plum text-white text-xs font-semibold hover:bg-deep-plum transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={(prod) => setActiveDetailProduct(prod)}
            />
          ))}
        </div>
      )}

      {/* 6. Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        product={activeDetailProduct}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
