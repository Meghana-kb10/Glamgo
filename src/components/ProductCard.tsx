import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { hoverElevate, tapScale, MOTION_PRIMITIVES, snappySpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedShade?: string) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [selectedShade, setSelectedShade] = useState(
    product.shades ? product.shades[0].name : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

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

  const optimizedImage = product.image.includes('images.unsplash.com')
    ? `${product.image.split('?')[0]}?auto=format&fit=crop&w=400&q=80&fm=webp`
    : product.image;

  return (
    <motion.article
      layoutId={`product-card-${product.id}`}
      whileHover={hoverElevate}
      transition={snappySpring}
      onClick={() => onViewDetails?.(product)}
      className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-luxury border border-mist flex flex-col justify-between transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Container with Shared Element layoutId */}
      <div className="relative aspect-square w-full overflow-hidden bg-soft-ivory p-6 flex items-center justify-center">
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={optimizedImage}
          alt={product.name}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xs"
        />

        {product.isBestseller && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge type="bestseller" text="Bestseller" className="shadow-xs" />
          </div>
        )}

        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-mist text-xs font-medium text-ink shadow-xs">
          <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
          <span className="font-mono font-bold">{product.rating}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-plum block">
            {product.brand}
          </span>
          <motion.h3
            layoutId={`product-name-${product.id}`}
            className="font-serif text-base sm:text-lg font-bold text-ink line-clamp-1 mt-0.5"
          >
            {product.name}
          </motion.h3>
          <p className="text-xs text-mauve-grey line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Shade selector if available */}
        {product.shades && (
          <div className="pt-2 border-t border-mist">
            <span className="text-[11px] uppercase font-semibold text-mauve-grey block mb-1.5">
              Shade: <span className="text-ink font-bold">{selectedShade}</span>
            </span>
            <div className="flex items-center gap-2">
              {product.shades.map((shade) => (
                <button
                  key={shade.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShade(shade.name);
                  }}
                  title={shade.name}
                  aria-label={`Select shade ${shade.name}`}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-plum focus-visible:outline-none ${
                    selectedShade === shade.name
                      ? 'border-ink scale-110 shadow-xs'
                      : 'border-white/80 hover:scale-105'
                  }`}
                  style={{ backgroundColor: shade.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-mist space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base sm:text-lg font-bold text-ink tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-xs text-mauve-grey line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] font-bold text-emerald-accent bg-emerald-50 px-2 py-0.5 rounded-md">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <Button
            size="sm"
            fullWidth
            variant={isAdded ? 'primary' : 'primary'}
            onClick={handleAdd}
            aria-label={isAdded ? `Added ${product.name}` : `Add to Bag: ${product.name}`}
            className={`rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isAdded ? 'bg-emerald-accent hover:bg-emerald-accent' : ''
            }`}
            style={isAdded ? { backgroundColor: '#14744E', color: '#FFFFFF' } : {}}
            leftIcon={
              isAdded ? (
                <motion.div
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={MOTION_PRIMITIVES.tactile}
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              )
            }
          >
            {isAdded ? 'Added to Bag' : 'Add to Bag'}
          </Button>
        </div>

      </div>
    </motion.article>
  );
};
