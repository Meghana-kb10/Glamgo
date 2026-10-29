import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, ShieldCheck, Check, Sparkles, Truck, Droplets, Heart } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { triggerChampagneSparkles } from '../../utils/confetti';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, selectedShade?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [selectedShade, setSelectedShade] = useState<string | undefined>(() =>
    product?.shades ? product.shades[0].name : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    onAddToCart(product, selectedShade);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white border border-mist rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        style={{ backgroundColor: '#FFFBF8' }}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-mist bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-plum bg-blush px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-mauve-grey hidden sm:inline">• Backstage Formula</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-mist/40 hover:bg-mist text-ink flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Product Image Stage */}
            <div className="relative aspect-square rounded-2xl bg-white border border-mist p-6 flex items-center justify-center shadow-xs overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {product.isBestseller && (
                <div className="absolute top-3 left-3">
                  <Badge type="bestseller" text="Backstage Bestseller" />
                </div>
              )}
            </div>

            {/* Product Metadata */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-plum">
                  {product.brand}
                </span>
                <h2
                  id="product-detail-title"
                  className="font-serif text-xl sm:text-2xl font-bold text-ink tracking-tight mt-0.5"
                >
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-champagne-gold/15 px-2.5 py-0.5 rounded-full border border-champagne-gold/30 text-xs font-semibold text-ink">
                    <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-mauve-grey">
                    ({product.reviewCount} master artist reviews)
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-3.5 rounded-2xl bg-soft-ivory border border-mist/80 flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-rose-plum">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-mauve-grey line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    {discountPct && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {discountPct}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Shade Selector if available */}
              {product.shades && product.shades.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-ink block">
                    Select Shade: <span className="text-rose-plum">{selectedShade || product.shades[0].name}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.shades.map((shade) => {
                      const isSelected = (selectedShade || product.shades![0].name) === shade.name;
                      return (
                        <button
                          key={shade.name}
                          type="button"
                          onClick={() => setSelectedShade(shade.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-plum bg-blush/60 text-ink shadow-2xs'
                              : 'border-mist bg-white text-mauve-grey hover:border-mist hover:text-ink'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-mist shadow-2xs"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <span>{shade.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Logistics Seals */}
              <div className="space-y-1.5 text-xs text-mauve-grey pt-1 font-sans">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-rose-plum shrink-0" />
                  <span>Ships within 24h in climate-sealed protective packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Authentic batch verified by brand laboratory</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 pt-4 border-t border-mist/80">
            <h3 className="font-serif text-base font-bold text-ink">Formulation Profile</h3>
            <p className="text-xs sm:text-sm text-mauve-grey leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Highlights Checklist */}
          <div className="p-4 rounded-2xl bg-white border border-mist space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Master Artist Quality Assurances
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink font-sans">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>16-Hour Flash Photography Proof</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dermatologically Tested &amp; Non-Comedogenic</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Micro-Glitter Fallback</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tamper-Proof Holographic Seal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div
          className="p-4 sm:p-5 border-t border-mist bg-white flex items-center justify-between gap-4 shrink-0 shadow-lg"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div>
            <span className="text-[11px] text-mauve-grey block">Total Investment</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-rose-plum">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleAdd}
            leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            style={{ backgroundColor: '#B8336A', color: '#FFFFFF', minWidth: '190px' }}
          >
            {isAdded ? 'Added to Bag!' : 'Add to Bag'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
