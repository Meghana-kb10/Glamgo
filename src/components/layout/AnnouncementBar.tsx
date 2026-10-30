import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X } from 'lucide-react';
import { ANNOUNCEMENT_BAR_CONFIG } from '../../config/marketing';

interface AnnouncementBarProps {
  onApplyPromo?: (code: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onApplyPromo }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(ANNOUNCEMENT_BAR_CONFIG.storageKey) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(ANNOUNCEMENT_BAR_CONFIG.storageKey, 'true');
    } catch {}
  };

  const handleCopyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(ANNOUNCEMENT_BAR_CONFIG.code);
    }
    if (onApplyPromo) {
      onApplyPromo(ANNOUNCEMENT_BAR_CONFIG.code);
    }
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Promotional announcement"
      className="bg-[#FCE7F0] border-b border-[#B8336A]/20 text-[#B8336A] px-3 sm:px-6 py-1.5 relative z-50 text-xs select-none"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-medium">
          <span className="hidden sm:inline-flex items-center gap-1 font-bold bg-[#B8336A] text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
            <Tag className="w-2.5 h-2.5" />
            <span>{ANNOUNCEMENT_BAR_CONFIG.badge}</span>
          </span>
          <span className="text-[#1F1A1D]">
            {ANNOUNCEMENT_BAR_CONFIG.text}{' '}
            <button
              type="button"
              onClick={handleCopyCode}
              title="Click to copy coupon code"
              className="inline-flex items-center font-bold text-[#B8336A] underline decoration-[#B8336A]/50 hover:decoration-[#B8336A] cursor-pointer"
            >
              {ANNOUNCEMENT_BAR_CONFIG.code}
            </button>
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#B8336A]/10 text-[#B8336A] transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8336A]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
