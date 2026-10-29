import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Check, X, Compass } from 'lucide-react';
import { LocationItem, POPULAR_LOCATIONS, marketplaceService } from '../../services/marketplaceService';
import { trackEvent } from '../../services/analyticsService';

interface LocationPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
}

export const LocationPickerSheet: React.FC<LocationPickerSheetProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customPincode, setCustomPincode] = useState('');

  if (!isOpen) return null;

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.pincode.includes(searchQuery)
  );

  const handleSelect = (loc: LocationItem) => {
    onSelectLocation(loc);
    marketplaceService.setCurrentLocation(loc);
    trackEvent('location_changed', { locationId: loc.id, area: loc.area, city: loc.city });
    onClose();
  };

  const handleApplyCustomPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPincode.trim().length === 6) {
      const customLoc: LocationItem = {
        id: `loc-custom-${customPincode}`,
        name: `Pincode ${customPincode}`,
        area: 'Bengaluru Zone',
        city: 'Bengaluru',
        pincode: customPincode,
      };
      handleSelect(customLoc);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
      />

      {/* Bottom Sheet on Mobile, Modal on Desktop */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-lg bg-soft-ivory rounded-t-3xl sm:rounded-3xl border border-mist shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-mist bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blush text-rose-plum flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 id="location-picker-title" className="font-serif text-base sm:text-lg font-bold text-ink">
                Select Your Service Area
              </h3>
              <p className="text-xs text-mauve-grey">
                Showing artists &amp; immediate doorstep availability
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location picker"
            className="w-8 h-8 rounded-full flex items-center justify-center text-mauve-grey hover:text-ink hover:bg-mist/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Custom Pincode Input */}
        <div className="p-4 border-b border-mist/80 bg-white/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mauve-grey" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, neighborhood, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-mist bg-white text-xs text-ink placeholder:text-mauve-grey focus:outline-none focus:ring-2 focus:ring-rose-plum/30 focus:border-rose-plum"
            />
          </div>

          {/* Quick Pincode Enter */}
          <form onSubmit={handleApplyCustomPincode} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={customPincode}
              onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit Pincode (e.g. 560038)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-mist bg-white text-xs text-ink placeholder:text-mauve-grey focus:outline-none focus:ring-2 focus:ring-rose-plum/30"
            />
            <button
              type="submit"
              disabled={customPincode.length !== 6}
              className="px-4 py-2 rounded-xl bg-rose-plum text-white text-xs font-bold hover:bg-deep-plum disabled:opacity-50 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Location List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mauve-grey px-1 block mb-2">
            Popular Neighborhoods in Bengaluru
          </span>

          {filteredLocations.map((loc) => {
            const isSelected = loc.id === currentLocation.id || loc.pincode === currentLocation.pincode;

            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-plum bg-blush/30 shadow-xs'
                    : 'border-mist bg-white hover:border-rose-plum/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-rose-plum text-white' : 'bg-mist/40 text-mauve-grey'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">{loc.name}</p>
                    <p className="text-[11px] text-mauve-grey">{loc.city} • Pincode {loc.pincode}</p>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-rose-plum" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
