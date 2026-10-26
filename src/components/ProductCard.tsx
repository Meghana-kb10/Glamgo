import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { snappySpring, hoverElevate, tapScale, MOTION_PRIMITIVES } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedShade?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
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

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      whileHover={hoverElevate}
      transition={snappySpring}
      className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-luxury border border-rose-gold/15 border-t-white/80 flex flex-col justify-between transition-all duration-200"
    >
      {/* Product Image Container with Shared Element layoutId */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-cream/50 p-6 flex items-center justify-center">
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xs"
        />

        {product.isBestseller && (
          <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-obsidian text-white text-[13px] font-semibold uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-champagne-light" />
            <span>Bestseller</span>
          </div>
        )}

        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-rose-gold/20 text-[13px] font-medium text-obsidian shadow-xs">
          <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
          <span className="font-mono font-bold">{product.rating}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <span className="text-[13px] font-semibold uppercase tracking-wider text-rose-dark block">
            {product.brand}
          </span>
          <motion.h3
            layoutId={`product-name-${product.id}`}
            className="font-serif text-lg font-bold text-obsidian line-clamp-1 mt-0.5"
          >
            {product.name}
          </motion.h3>
          <p className="text-sm text-obsidian-muted line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Shade selector if available */}
        {product.shades && (
          <div className="pt-2 border-t border-rose-gold/10">
            <span className="text-[13px] uppercase font-semibold text-obsidian-muted block mb-1.5">
              Shade: <span className="text-obsidian font-bold">{selectedShade}</span>
            </span>
            <div className="flex items-center gap-2">
              {product.shades.map((shade) => (
                <button
                  key={shade.name}
                  type="button"
                  onClick={() => setSelectedShade(shade.name)}
                  title={shade.name}
                  aria-label={`Select shade ${shade.name}`}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                    selectedShade === shade.name
                      ? 'border-obsidian scale-110 shadow-xs'
                      : 'border-white/80 hover:scale-105'
                  }`}
                  style={{ backgroundColor: shade.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Cart button with Tactile State Morph */}
        <div className="pt-3 border-t border-rose-gold/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-obsidian tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-sm text-obsidian-muted line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <motion.button
            type="button"
            whileHover={hoverElevate}
            whileTap={tapScale}
            transition={snappySpring}
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-obsidian hover:bg-obsidian-deep text-white'
            }`}
          >
            {isAdded ? (
              <>
                <motion.div
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={MOTION_PRIMITIVES.tactile}
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                </motion.div>
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-champagne-light" />
                <span>Add to Bag</span>
              </>
            )}
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};
