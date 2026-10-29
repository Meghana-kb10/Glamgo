import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Package, ShieldAlert, Compass, ChevronUp, ChevronDown, X } from 'lucide-react';
import { PortalType } from '../types';
import { snappySpring, hoverElevate, tapScale } from '../constants/motion';

interface PortalSwitcherProps {
  activePortal: PortalType;
  onSelectPortal: (portal: PortalType) => void;
}

export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({
  activePortal,
  onSelectPortal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const portals: { id: PortalType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: '0. Project Showcase', icon: Compass },
    { id: 'customer', label: '1. Customer Marketplace', icon: Sparkles },
    { id: 'pro', label: '2. Pro Studio OS', icon: Calendar },
    { id: 'vendor', label: '3. Vendor Hub', icon: Package },
    { id: 'admin', label: '4. Admin Command', icon: ShieldAlert },
  ];

  const currentPortalLabel = portals.find((p) => p.id === activePortal)?.label || 'Ecosystem';

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden lg:flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={snappySpring}
            role="tablist"
            aria-label="Platform Ecosystem Navigation"
            className="mb-2 p-1.5 rounded-2xl bg-ink/95 backdrop-blur-xl border border-champagne-gold/30 shadow-2xl flex items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none"
          >
            <span className="px-3 text-xs font-bold uppercase tracking-wider text-champagne-gold select-none">
              Ecosystem:
            </span>

            {portals.map(({ id, label, icon: Icon }) => {
              const isActive = activePortal === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    onSelectPortal(id);
                    setIsOpen(false);
                  }}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all select-none shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-ink font-bold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ink' : 'text-champagne-gold'}`} />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              title="Close Portal Switcher"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      {/* Discrete Launcher Pill */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-full bg-ink/90 hover:bg-ink text-white text-xs font-medium border border-champagne-gold/40 shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all"
        title="Switch Ecosystem Portal"
      >
        <Compass className="w-3.5 h-3.5 text-champagne-gold animate-spin-slow" />
        <span className="font-semibold">{currentPortalLabel}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-champagne-gold" /> : <ChevronUp className="w-3.5 h-3.5 text-champagne-gold" />}
      </motion.button>
    </div>
  );
};
