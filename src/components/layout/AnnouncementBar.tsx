import React, { useState } from 'react';
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
      className="bg-charcoal border-b border-[#48443C] text-dark-text-alt px-3 sm:px-6 py-2 relative z-50 text-xs select-none"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-medium">
          <span className="hidden sm:inline-flex items-center gap-1 font-bold bg-champagne text-charcoal text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-warm-sm">
            <Tag className="w-2.5 h-2.5" />
            <span>{ANNOUNCEMENT_BAR_CONFIG.badge}</span>
          </span>
          <span className="text-dark-text-alt">
            {ANNOUNCEMENT_BAR_CONFIG.text}{' '}
            <button
              type="button"
              onClick={handleCopyCode}
              title="Click to copy coupon code"
              className="inline-flex items-center font-bold text-champagne underline decoration-champagne/50 hover:decoration-champagne hover:text-white cursor-pointer"
            >
              {ANNOUNCEMENT_BAR_CONFIG.code}
            </button>
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-charcoal-hover text-dark-text hover:text-white transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
