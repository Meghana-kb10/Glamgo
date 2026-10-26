import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Package, ShieldAlert } from 'lucide-react';
import { PortalType } from '../types';
import { snappySpring } from '../constants/motion';

interface PortalSwitcherProps {
  activePortal: PortalType;
  onSelectPortal: (portal: PortalType) => void;
}

export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({
  activePortal,
  onSelectPortal,
}) => {
  const portals: { id: PortalType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'customer', label: '1. Customer Marketplace', icon: Sparkles },
    { id: 'pro', label: '2. Pro Studio Dashboard', icon: Calendar },
    { id: 'vendor', label: '3. Product Vendor', icon: Package },
    { id: 'admin', label: '4. Admin Command', icon: ShieldAlert },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={snappySpring}
        className="pointer-events-auto p-1.5 rounded-full bg-obsidian-deep/90 backdrop-blur-xl border border-rose-gold/30 shadow-2xl flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none"
      >
        <span className="hidden sm:inline-block px-3 text-[10px] uppercase font-bold tracking-widest text-champagne-light select-none">
          Ecosystem:
        </span>

        {portals.map(({ id, label, icon: Icon }) => {
          const isActive = activePortal === id;
          return (
            <button
              key={id}
              onClick={() => onSelectPortal(id)}
              className={`relative px-3.5 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 transition-colors select-none shrink-0 ${
                isActive
                  ? 'text-obsidian font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {/* Active Morphing Sliding Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-portal-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-champagne-light via-champagne to-rose-blush shadow-md"
                  transition={snappySpring}
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-obsidian' : 'text-champagne-light'}`} />
                <span className="whitespace-nowrap">{label}</span>
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};
