import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, ShoppingBag, User, ArrowRight } from 'lucide-react';
import { MOTION_SPRINGS, MOTION_GESTURES } from '../../motion/tokens';

export type BottomNavTab = 'home' | 'bookings' | 'shop' | 'profile';

export interface BottomNavProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
  className = '',
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
    { id: 'shop' as const, label: 'Shop', icon: ShoppingBag },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden pointer-events-none ${className}`}
    >
      <div className="pointer-events-auto">
        {/* Docked Sticky Cart Bar (Above Bottom Nav) */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={MOTION_SPRINGS.soft}
              className="px-4 pb-2"
            >
              <button
                type="button"
                onClick={onOpenCart}
                className="w-full bg-rose-plum text-white h-12 px-4 rounded-2xl shadow-lg shadow-rose-plum/30 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`View Cart: ${cartCount} ${cartCount === 1 ? 'item' : 'items'}, ₹${cartTotal.toLocaleString('en-IN')}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center shrink-0">
                    {cartCount}
                  </span>
                  <span className="text-xs font-bold truncate">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="font-heading text-sm font-bold truncate">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold shrink-0">
                  <span>View Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4-Tab Bottom Navigation Bar */}
        <nav
          aria-label="Mobile Navigation"
          className="bg-white/95 backdrop-blur-md border-t border-mist/80 px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-sheet"
        >
          <div className="grid grid-cols-4 items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={tab.label}
                  className="relative h-12 flex flex-col items-center justify-center gap-1 transition-colors group cursor-pointer focus-visible:outline-none select-none"
                >
                  {/* Subtle active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-tab"
                      transition={MOTION_SPRINGS.slider}
                      className="absolute inset-x-2 inset-y-1 rounded-xl bg-blush/60 -z-10"
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? 'text-rose-plum scale-110'
                        : 'text-mauve-grey group-hover:text-ink'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold transition-colors ${
                      isActive ? 'text-rose-plum' : 'text-mauve-grey group-hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
