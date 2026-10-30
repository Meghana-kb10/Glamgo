import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
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
            className="fixed inset-0 z-35 bg-ink/10 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* MegaMenu Dropdown Panel */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onMouseLeave={onClose}
            role="region"
            aria-label="Services mega menu"
            className="absolute top-full left-0 right-0 z-40 bg-white border-b border-mist shadow-xl select-none"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Header inside mega menu */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-mist">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-plum" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-plum font-sans">
                    All Services for {audienceInfo.label}
                  </span>
                  <span className="text-xs text-mauve-grey font-medium">
                    • 100% Verified professionals &amp; sealed mono-dose kits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    onClose();
                  }}
                  className="text-xs font-semibold text-rose-plum hover:text-deep-plum flex items-center gap-1 cursor-pointer"
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
                    className="p-3.5 rounded-2xl border border-mist/80 hover:border-rose-plum/30 hover:bg-blush/20 transition-all group flex flex-col justify-between"
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
                          className="w-12 h-12 rounded-xl object-cover border border-mist shadow-2xs group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <h4 className="font-heading text-sm font-bold text-ink group-hover:text-rose-plum transition-colors truncate">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-mauve-grey truncate">
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
                              className="text-xs text-mauve-grey hover:text-rose-plum transition-colors text-left flex items-center gap-1.5 w-full cursor-pointer py-0.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-rose-plum/40 shrink-0" />
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
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-plum hover:text-deep-plum pt-2 border-t border-mist/60 cursor-pointer"
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
