import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { snappySpring } from '../constants/motion';

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
    onAddToCart(product, selectedShade);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={snappySpring}
      className="group bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-rose-gold/15 flex flex-col justify-between transition-all duration-300"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-cream/50 p-6 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-md"
        />

        {product.isBestseller && (
          <div className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full bg-obsidian text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-champagne" />
            <span>Bestseller</span>
          </div>
        )}

        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-gold/20 text-[11px] font-medium text-obsidian shadow-sm">
          <Star className="w-3 h-3 fill-champagne-dark text-champagne-dark" />
          <span className="font-mono">{product.rating}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-gold block">
            {product.brand}
          </span>
          <h3 className="font-serif text-lg font-bold text-obsidian line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-obsidian-subtle line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Shade selector if available */}
        {product.shades && (
          <div className="mt-3 pt-2 border-t border-rose-gold/10">
            <span className="text-[10px] uppercase font-semibold text-obsidian-subtle block mb-1.5">
              Shade: <span className="text-obsidian font-normal">{selectedShade}</span>
            </span>
            <div className="flex items-center gap-2">
              {product.shades.map((shade) => (
                <button
                  key={shade.name}
                  onClick={() => setSelectedShade(shade.name)}
                  title={shade.name}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    selectedShade === shade.name
                      ? 'border-obsidian scale-110 shadow-sm'
                      : 'border-white/80 hover:scale-105'
                  }`}
                  style={{ backgroundColor: shade.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-rose-gold/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base sm:text-lg font-bold text-obsidian tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-obsidian-subtle line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            transition={snappySpring}
            onClick={handleAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-obsidian hover:bg-obsidian-deep text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-champagne-light" />
                <span>Add to Bag</span>
              </>
            )}
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};
