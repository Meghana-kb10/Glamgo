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
          className="h-11 px-4 rounded-[14px] border-[1.5px] border-accent text-accent hover:bg-accent-soft font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
        className="h-11 flex items-center gap-2.5 px-2 sm:px-3 rounded-full hover:bg-fill/40 border border-border transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-8 h-8 rounded-full object-cover border border-border shadow-warm-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent-soft text-accent font-bold text-xs flex items-center justify-center border border-accent/20">
            {initialLetter}
          </div>
        )}
        <span className="hidden sm:inline-block text-xs font-semibold text-text max-w-[120px] truncate">
          {user.fullName.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-accent' : ''
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
            className="absolute right-0 mt-2 w-64 rounded-[18px] bg-card border border-border shadow-warm-modal p-2 z-50 overflow-hidden"
          >
            {/* User Header Profile Card */}
            <div className="p-3 bg-bg rounded-[14px] border border-border mb-2 shadow-warm-sm">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent-soft text-accent font-bold text-sm flex items-center justify-center shrink-0 border border-accent/20">
                    {initialLetter}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text truncate">{user.fullName}</p>
                  <p className="text-xs text-text-muted truncate">
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
                className="w-full h-11 flex items-center gap-3 px-3 rounded-[12px] text-xs font-semibold text-text hover:bg-fill/40 hover:text-accent transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Calendar className="w-4 h-4 text-text-muted" />
                <span>My Bookings</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFavorites?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-[12px] text-xs font-semibold text-text hover:bg-fill/40 hover:text-accent transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Heart className="w-4 h-4 text-text-muted" />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAddresses?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-[12px] text-xs font-semibold text-text hover:bg-fill/40 hover:text-accent transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <MapPin className="w-4 h-4 text-text-muted" />
                <span>Saved Addresses</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenHelp?.();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-[12px] text-xs font-semibold text-text hover:bg-fill/40 hover:text-accent transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <HelpCircle className="w-4 h-4 text-text-muted" />
                <span>Help &amp; Support</span>
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full h-11 flex items-center gap-3 px-3 rounded-[12px] text-xs font-semibold text-accent hover:bg-accent-soft transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LogOut className="w-4 h-4 text-accent" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
