import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { MOTION_GESTURES, MOTION_SPRINGS } from '../../motion/tokens';

export interface CartButtonProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({
  count,
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={MOTION_GESTURES.tap}
      aria-label={`Shopping Cart, ${count} item${count === 1 ? '' : 's'}`}
      className={`w-11 h-11 rounded-full flex items-center justify-center text-ink hover:text-rose-plum hover:bg-blush/60 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum ${className}`}
    >
      <ShoppingBag className="w-5 h-5 text-ink hover:text-rose-plum transition-colors" />

      {/* Cart Badge with Count Pop Animation */}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={MOTION_SPRINGS.snappy}
            aria-live="polite"
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-rose-plum text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs pointer-events-none"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
