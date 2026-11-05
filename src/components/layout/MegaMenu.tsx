import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AudienceType, AUDIENCE_DATA } from '../../config/marketing';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  audience: AudienceType;
  onSelectCategory: (categorySlug: string) => void;
  onSelectSubService?: (categorySlug: string, subService: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  audience,
  onSelectCategory,
  onSelectSubService,
}) => {
  const audienceInfo = AUDIENCE_DATA[audience] || AUDIENCE_DATA.women;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0 z-35 bg-text/15 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* MegaMenu Dropdown Panel (150ms fade) */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onMouseLeave={onClose}
            role="region"
            aria-label="Services mega menu"
            className="absolute top-full left-0 right-0 z-40 bg-card border-b border-border shadow-warm-modal select-none"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Header inside mega menu */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-accent font-sans">
                    All Services for {audienceInfo.label}
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    • 100% Verified professionals &amp; sealed mono-dose kits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    onClose();
                  }}
                  className="text-xs font-semibold text-accent hover:text-accent-pressed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Full Marketplace Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4-Column Grid for Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {audienceInfo.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-[16px] bg-card border border-border hover:border-border-strong hover:bg-fill/30 shadow-warm-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Thumbnail + Category Title */}
                      <div
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          onClose();
                        }}
                        className="flex items-center gap-3 cursor-pointer mb-3"
                      >
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-12 h-12 rounded-[12px] object-cover border border-border shadow-warm-sm group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <h4 className="font-heading text-sm font-bold text-text group-hover:text-accent transition-colors truncate">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-text-muted truncate">
                            {cat.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Sub-services list */}
                      <ul className="space-y-1.5 pl-1 mb-3">
                        {cat.subServices.map((sub) => (
                          <li key={sub}>
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectSubService) {
                                  onSelectSubService(cat.slug, sub);
                                } else {
                                  onSelectCategory(cat.slug);
                                }
                                onClose();
                              }}
                              className="text-xs text-text-muted hover:text-accent transition-colors text-left flex items-center gap-1.5 w-full cursor-pointer py-0.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                              <span className="truncate">{sub}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Explore category link */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent-pressed pt-2 border-t border-border cursor-pointer transition-colors"
                    >
                      <span>Explore {cat.name}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
