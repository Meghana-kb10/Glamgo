import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { slideInLeftVariant, fadeInVariant } from '../../motion/tokens';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  upcomingBookingsCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeRoute,
  onNavigate,
  onOpenAuth,
  upcomingBookingsCount = 0,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Dismiss if dragged left with velocity or more than 80px
    if (info.offset.x < -80 || info.velocity.x < -300) {
      onClose();
    }
  };

  const handleNavigateItem = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          {/* Backdrop with Fade */}
          <motion.div
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-text/40 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Container with Drag-to-Dismiss */}
          <motion.div
            ref={drawerRef}
            drag="x"
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            variants={slideInLeftVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-[280px] max-w-[85vw] h-full bg-bg border-r border-border shadow-warm-modal flex flex-col z-10 select-none"
          >
            {/* Drawer Header */}
            <div className="h-14 sm:h-[72px] px-4 border-b border-border bg-bg flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-warm-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-heading font-bold text-xl text-text">
                  Glamgo
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu drawer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-fill/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render full Sidebar navigation inside mobile drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                isCollapsed={false}
                onToggleCollapse={() => {}}
                activeRoute={activeRoute}
                onNavigate={handleNavigateItem}
                onOpenAuth={(mode) => {
                  onClose();
                  onOpenAuth(mode);
                }}
                upcomingBookingsCount={upcomingBookingsCount}
                className="relative top-0 pt-0 border-r-0 w-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
