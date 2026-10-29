import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  ChevronDown,
  Calendar,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { popoverVariant, MOTION_GESTURES } from '../../motion/tokens';

export interface UserMenuProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenBookings?: () => void;
  onOpenFavorites?: () => void;
  onOpenAddresses?: () => void;
  onOpenHelp?: () => void;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onOpenAuth,
  onOpenBookings,
  onOpenFavorites,
  onOpenAddresses,
  onOpenHelp,
  className = '',
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.button
          type="button"
          whileTap={MOTION_GESTURES.tap}
          onClick={() => onOpenAuth('login')}
          className="h-11 px-4 rounded-xl border border-rose-plum text-rose-plum hover:bg-blush/60 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
        >
          <UserIcon className="w-4 h-4" />
          <span>Log in</span>
        </motion.button>
      </div>
    );
  }

  const initialLetter = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <motion.button
        ref={buttonRef}
        type="button"
        whileTap={MOTION_GESTURES.tap}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`User menu for ${user.fullName}`}
        className="h-11 flex items-center gap-2.5 px-2 sm:px-3 rounded-full hover:bg-blush/50 border border-mist transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-8 h-8 rounded-full object-cover border border-mist"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blush text-rose-plum font-bold text-xs flex items-center justify-center border border-rose-plum/20">
            {initialLetter}
          </div>
        )}
        <span className="hidden sm:inline-block text-xs font-semibold text-ink max-w-[120px] truncate">
          {user.fullName.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-mauve-grey transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-rose-plum' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown Menu (150ms fade + 6px slide) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-orientation="vertical"
            variants={popoverVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-mist shadow-card p-2 z-50 overflow-hidden"
          >
            {/* User Header Profile Card */}
            <div className="p-3 bg-soft-ivory rounded-xl border border-mist/80 mb-2">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-mist"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blush text-rose-plum font-bold text-sm flex items-center justify-center shrink-0">
                    {initialLetter}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{user.fullName}</p>
                  <p className="text-xs text-mauve-grey truncate">
                    {user.phone || user.email || 'Verified Customer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5" role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBookings?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-xs font-semibold text-ink hover:bg-blush/50 hover:text-rose-plum transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
              >
                <Calendar className="w-4 h-4 text-mauve-grey" />
                <span>My Bookings</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFavorites?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-xs font-semibold text-ink hover:bg-blush/50 hover:text-rose-plum transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
              >
                <Heart className="w-4 h-4 text-mauve-grey" />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAddresses?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-xs font-semibold text-ink hover:bg-blush/50 hover:text-rose-plum transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
              >
                <MapPin className="w-4 h-4 text-mauve-grey" />
                <span>Saved Addresses</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenHelp?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-xs font-semibold text-ink hover:bg-blush/50 hover:text-rose-plum transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
              >
                <HelpCircle className="w-4 h-4 text-mauve-grey" />
                <span>Help &amp; Support</span>
              </button>

              <div className="my-1 border-t border-mist/80" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-xs font-semibold text-rose-plum hover:bg-blush/60 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
              >
                <LogOut className="w-4 h-4 text-rose-plum" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
