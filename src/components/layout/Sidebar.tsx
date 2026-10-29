import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Grid,
  Calendar,
  ShoppingBag,
  Heart,
  Tag,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scissors,
  Gem,
  Smile,
  ShieldAlert,
  Flame,
  UserCheck,
  Droplets,
  Eye,
  Package,
  Building2,
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup } from './SidebarGroup';
import { useAuth } from '../../context/AuthContext';
import { MOTION_SPRINGS, MOTION_GESTURES } from '../../motion/tokens';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  upcomingBookingsCount?: number;
  className?: string;
}

export const CATEGORIES_LIST = [
  { slug: 'makeup', label: 'Makeup', icon: Sparkles },
  { slug: 'hair', label: 'Hair', icon: Scissors },
  { slug: 'nails', label: 'Nails', icon: Gem },
  { slug: 'skin', label: 'Skin & Facial', icon: Smile },
  { slug: 'waxing', label: 'Waxing', icon: ShieldAlert },
  { slug: 'bridal', label: 'Bridal', icon: Sparkles },
  { slug: 'spa', label: 'Spa', icon: Flame },
  { slug: 'mens', label: "Men's Grooming", icon: UserCheck },
];

export const PRODUCT_SUB_CATEGORIES = [
  { slug: 'all', label: 'All Products', icon: ShoppingBag },
  { slug: 'Setting & Prep', label: 'Setting & Prep', icon: Sparkles },
  { slug: 'Complexion & Base', label: 'Complexion & Base', icon: Droplets },
  { slug: 'Highlighter & Blush', label: 'Highlighter & Blush', icon: Gem },
  { slug: 'Eye Accents', label: 'Eyes & Lashes', icon: Eye },
  { slug: 'Lips & Tint', label: 'Lips & Tint', icon: Heart },
  { slug: 'Skincare Prep', label: 'Skincare & Serums', icon: Sparkles },
  { slug: 'Bridal Vanity Kits', label: 'Bridal Vanity Kits', icon: Package },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeRoute,
  onNavigate,
  onOpenAuth,
  upcomingBookingsCount = 0,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(
    activeRoute.startsWith('category-')
  );
  const [isShopExpanded, setIsShopExpanded] = useState(
    activeRoute === 'shop' || activeRoute.startsWith('shop-')
  );

  React.useEffect(() => {
    if (activeRoute === 'shop' || activeRoute.startsWith('shop-')) {
      setIsShopExpanded(true);
    }
    if (activeRoute.startsWith('category-') || activeRoute === 'categories') {
      setIsCategoriesExpanded(true);
    }
  }, [activeRoute]);

  return (
    <motion.aside
      layout
      transition={MOTION_SPRINGS.slider}
      style={{ width: isCollapsed ? 72 : 240 }}
      className={`fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-mist flex flex-col justify-between pt-16 sm:pt-[72px] pb-4 select-none ${className}`}
      aria-label="Marketplace Navigation Sidebar"
    >
      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4 space-y-6 no-scrollbar">
        
        {/* Collapse / Expand Toggle Button on Desktop */}
        <div className={`hidden lg:flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} px-1`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar to icons'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-mauve-grey hover:text-ink hover:bg-blush/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 1. Main Navigation Group */}
        <SidebarGroup title="Explore" isCollapsed={isCollapsed}>
          {/* Home */}
          <SidebarItem
            icon={Home}
            label="Home"
            isActive={activeRoute === 'home'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('home')}
          />

          {/* Categories with Expandable Sub-items */}
          <SidebarItem
            icon={Grid}
            label="Categories"
            isActive={activeRoute === 'categories' || activeRoute.startsWith('category-')}
            isCollapsed={isCollapsed}
            hasSubItems={true}
            isExpanded={isCategoriesExpanded}
            onClick={() => {
              if (isCollapsed) {
                onNavigate('categories');
              } else {
                setIsCategoriesExpanded(!isCategoriesExpanded);
              }
            }}
            onToggleExpand={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          />

          {/* Expanded Nested Categories */}
          <AnimatePresence initial={false}>
            {!isCollapsed && isCategoriesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={MOTION_SPRINGS.slider}
                className="pl-4 pr-1 space-y-0.5 overflow-hidden border-l-2 border-blush ml-5 my-1"
              >
                {CATEGORIES_LIST.map((cat) => {
                  const isCatActive = activeRoute === `category-${cat.slug}`;
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => onNavigate(`category-${cat.slug}`)}
                      aria-current={isCatActive ? 'page' : undefined}
                      className={`w-full h-9 flex items-center gap-2.5 px-3 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isCatActive
                          ? 'bg-blush text-rose-plum font-bold'
                          : 'text-ink/80 hover:text-ink hover:bg-blush/30'
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* My Bookings */}
          <SidebarItem
            icon={Calendar}
            label="My Bookings"
            isActive={activeRoute === 'bookings'}
            isCollapsed={isCollapsed}
            badge={upcomingBookingsCount > 0 ? upcomingBookingsCount : undefined}
            onClick={() => onNavigate('bookings')}
          />

          {/* Artists & Salons */}
          <SidebarItem
            icon={Building2}
            label="Artists & Salons"
            isActive={activeRoute === 'artists'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('artists')}
          />

          {/* Shop with Expandable Sub-items */}
          <SidebarItem
            icon={ShoppingBag}
            label="Shop"
            isActive={activeRoute === 'shop' || activeRoute.startsWith('shop-')}
            isCollapsed={isCollapsed}
            hasSubItems={true}
            isExpanded={isShopExpanded}
            onClick={() => {
              setIsShopExpanded(true);
              onNavigate('shop');
            }}
            onToggleExpand={() => setIsShopExpanded(!isShopExpanded)}
          />

          {/* Expanded Nested Product Categories */}
          <AnimatePresence initial={false}>
            {!isCollapsed && isShopExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={MOTION_SPRINGS.slider}
                className="pl-4 pr-1 space-y-0.5 overflow-hidden border-l-2 border-blush ml-5 my-1"
              >
                {PRODUCT_SUB_CATEGORIES.map((cat) => {
                  const isCatActive =
                    activeRoute === `shop-${cat.slug}` ||
                    (cat.slug === 'all' && activeRoute === 'shop');
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => onNavigate(cat.slug === 'all' ? 'shop' : `shop-${cat.slug}`)}
                      aria-current={isCatActive ? 'page' : undefined}
                      className={`w-full h-9 flex items-center gap-2.5 px-3 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isCatActive
                          ? 'bg-blush text-rose-plum font-bold'
                          : 'text-ink/80 hover:text-ink hover:bg-blush/30'
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Favorites */}
          <SidebarItem
            icon={Heart}
            label="Favorites"
            isActive={activeRoute === 'favorites'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('favorites')}
          />

          {/* Offers */}
          <SidebarItem
            icon={Tag}
            label="Offers"
            isActive={activeRoute === 'offers'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('offers')}
          />
        </SidebarGroup>

        {/* 2. Secondary Support Group */}
        <SidebarGroup title="Help &amp; Info" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={HelpCircle}
            label="Help &amp; Support"
            isActive={activeRoute === 'help'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('help')}
          />
          <SidebarItem
            icon={Info}
            label="How Glamgo Works"
            isActive={activeRoute === 'about'}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate('about')}
          />
        </SidebarGroup>

      </div>

      {/* Footer User / Guest Card */}
      <div className="px-2 pt-2 border-t border-mist/80">
        {!isAuthenticated || !user ? (
          // Guest Footer Card
          isCollapsed ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                title="Log in to book faster"
                aria-label="Log in"
                className="w-10 h-10 rounded-full bg-blush text-rose-plum flex items-center justify-center font-bold text-xs hover:bg-rose-plum hover:text-white transition-colors cursor-pointer"
              >
                Log
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-blush/60 border border-rose-plum/15 space-y-2">
              <div>
                <p className="text-xs font-bold text-ink">Log in to book faster</p>
                <p className="text-[11px] text-mauve-grey leading-tight mt-0.5">
                  Track orders &amp; unlock member discounts
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="w-full h-8 rounded-xl bg-rose-plum text-white text-xs font-bold hover:bg-deep-plum transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              >
                Log In
              </button>
            </div>
          )
        ) : (
          // Authenticated User Footer Card
          isCollapsed ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                title={user.fullName}
                aria-label={`View profile of ${user.fullName}`}
                className="w-10 h-10 rounded-full bg-blush text-rose-plum flex items-center justify-center font-bold text-xs border border-rose-plum/20 hover:scale-105 transition-transform cursor-pointer"
              >
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              aria-label={`Profile of ${user.fullName}`}
              className="w-full p-2.5 rounded-xl hover:bg-blush/50 transition-colors flex items-center gap-2.5 text-left cursor-pointer group"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-mist shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blush text-rose-plum font-bold text-xs flex items-center justify-center shrink-0 border border-rose-plum/20">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ink truncate group-hover:text-rose-plum transition-colors">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-mauve-grey truncate">View profile →</p>
              </div>
            </button>
          )
        )}
      </div>

    </motion.aside>
  );
};
