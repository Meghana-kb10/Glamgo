import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductDetailModal } from '../shop/ProductDetailModal';

interface ProductRailProps {
  products: Product[];
  onAddToCart: (product: Product, selectedShade?: string) => void;
  onViewAll: () => void;
}

export const ProductRail: React.FC<ProductRailProps> = ({
  products,
  onAddToCart,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            Backstage Beauty Formulations
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans tracking-tight">
            Curated Professional Products
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-rose-plum hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>View All Products</span>
          <span>→</span>
        </button>
      </div>

      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous products"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Horizontal Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={(prod) => setSelectedProductForDetail(prod)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next products"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}
      </div>

      {/* Luxury Product Detail View Card Modal */}
      <ProductDetailModal
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        product={selectedProductForDetail}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
