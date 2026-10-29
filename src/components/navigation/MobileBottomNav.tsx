import React from 'react';
import { Home, Grid, Calendar, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type MobileTabType = 'home' | 'categories' | 'bookings' | 'shop' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTabType;
  onSelectTab: (tab: MobileTabType) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden pointer-events-none">
      <div className="pointer-events-auto">
        {/* Docked Sticky Cart Bar (Above Bottom Nav) */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="px-4 pb-2"
            >
              <button
                type="button"
                onClick={onOpenCart}
                className="w-full bg-rose-plum text-white p-3 rounded-2xl shadow-lg shadow-rose-plum/25 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
                aria-label={`View Cart: ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in Bag, ₹${cartTotal.toLocaleString('en-IN')}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="text-xs font-bold tracking-wide">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} in Bag
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="font-serif text-sm font-bold">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-200">
                  <span>View Cart</span>
                  <span>→</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5-Tab Mobile Bottom Navigation Bar with Safe Area Inset */}
        <nav
          className="bg-white/95 backdrop-blur-md border-t border-mist/80 px-2 py-2 flex items-center justify-around shadow-lg"
          style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
          role="navigation"
          aria-label="Mobile Navigation"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative min-h-[44px] min-w-[44px] ${
                  isActive ? 'text-rose-plum' : 'text-mauve-grey hover:text-ink'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
                  {tab.id === 'shop' && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-plum ring-2 ring-white" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-rose-plum' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-rose-plum"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
