import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Package, ShieldAlert, Compass } from 'lucide-react';
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
  const portals: { id: PortalType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: '0. Project Showcase', icon: Compass },
    { id: 'customer', label: '1. Customer Marketplace', icon: Sparkles },
    { id: 'pro', label: '2. Pro Studio OS', icon: Calendar },
    { id: 'vendor', label: '3. Vendor Hub', icon: Package },
    { id: 'admin', label: '4. Admin Command', icon: ShieldAlert },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 hidden lg:flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={snappySpring}
        role="tablist"
        aria-label="Platform Ecosystem Navigation"
        className="pointer-events-auto p-1.5 rounded-full bg-obsidian-deep/95 backdrop-blur-xl border border-rose-gold/25 border-t-white/20 shadow-2xl flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none"
      >
        <span className="hidden sm:inline-block px-3 text-[13px] font-bold tracking-wider text-champagne-light select-none">
          Ecosystem:
        </span>

        {portals.map(({ id, label, icon: Icon }) => {
          const isActive = activePortal === id;
          return (
            <motion.button
              key={id}
              role="tab"
              aria-selected={isActive}
              whileHover={hoverElevate}
              whileTap={tapScale}
              onClick={() => onSelectPortal(id)}
              className={`relative min-h-[38px] px-3.5 py-2 rounded-full text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-colors select-none shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-champagne focus-visible:outline-none ${
                isActive
                  ? 'bg-white text-obsidian font-bold shadow-xs'
                  : 'text-white hover:text-champagne-light'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-obsidian' : 'text-champagne-light'}`} />
                <span className="whitespace-nowrap">{label}</span>
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};
