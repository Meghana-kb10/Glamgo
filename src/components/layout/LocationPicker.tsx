import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Compass, Search, Check } from 'lucide-react';
import { LocationItem, POPULAR_LOCATIONS, marketplaceService } from '../../services/marketplaceService';
import { popoverVariant, MOTION_GESTURES } from '../../motion/tokens';

export interface LocationPickerProps {
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onOpenSheet?: () => void;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  currentLocation,
  onSelectLocation,
  onOpenSheet,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    // On small screen (<640px), open bottom sheet if callback provided
    if (window.innerWidth < 640 && onOpenSheet) {
      onOpenSheet();
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (loc: LocationItem) => {
    onSelectLocation(loc);
    marketplaceService.setCurrentLocation(loc);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Fallback to top Bangalore location for now
          handleSelect(POPULAR_LOCATIONS[0]);
        },
        () => {
          handleSelect(POPULAR_LOCATIONS[0]);
        }
      );
    } else {
      handleSelect(POPULAR_LOCATIONS[0]);
    }
  };

  const filtered = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.pincode.includes(searchQuery)
  );

  return (
    <div ref={popoverRef} className={`relative ${className}`}>
      {/* 44px Location Pill Button */}
      <motion.button
        type="button"
        whileTap={MOTION_GESTURES.tap}
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Current location: ${currentLocation.area}, ${currentLocation.city}. Click to change location.`}
        className="h-11 flex items-center gap-2.5 px-3 sm:px-4 rounded-full bg-soft-ivory hover:bg-blush/40 border border-mist hover:border-rose-plum/30 transition-all cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
      >
        <div className="w-6 h-6 rounded-full bg-blush flex items-center justify-center text-rose-plum shrink-0">
          <MapPin className="w-3.5 h-3.5 text-rose-plum" />
        </div>
        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-semibold text-ink truncate max-w-[120px] sm:max-w-[160px]">
              {currentLocation.area || currentLocation.city}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-mauve-grey transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-rose-plum' : ''
              }`}
            />
          </div>
        </div>
      </motion.button>

      {/* Desktop Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={popoverVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-mist shadow-card p-4 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-mist/80 mb-3">
              <div>
                <h3 className="text-sm font-bold text-ink">Choose your location</h3>
                <p className="text-[11px] text-mauve-grey">Available service providers vary by location</p>
              </div>
            </div>

            {/* GPS Detect Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full h-11 flex items-center gap-2.5 px-3 rounded-xl bg-blush/60 hover:bg-blush text-rose-plum text-xs font-semibold transition-colors cursor-pointer mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Use current GPS location</span>
            </button>

            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-mauve-grey absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, landmark, or 6-digit pincode"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-soft-ivory border border-mist text-xs text-ink placeholder:text-mauve-grey focus:outline-none focus:border-rose-plum focus:ring-1 focus:ring-rose-plum"
              />
            </div>

            {/* Popular / Matching Locations */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-mauve-grey px-2 py-1">
                Popular Areas
              </p>
              {filtered.map((loc) => {
                const isSelected = loc.id === currentLocation.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={`w-full h-11 flex items-center justify-between px-3 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blush text-rose-plum font-semibold'
                        : 'hover:bg-soft-ivory text-ink'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate">{loc.name}</p>
                      <p className="text-[11px] text-mauve-grey truncate">
                        {loc.area}, {loc.city} • {loc.pincode}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-plum shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
