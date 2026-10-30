import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { DetailedService } from '../../services/marketplaceService';

export interface ServiceVariantOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number; // additional price (or 0 for base)
  durationDeltaMinutes: number;
}

export interface VariantGroup {
  id: string;
  name: string;
  required: boolean;
  options: ServiceVariantOption[];
}

interface VariantPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  service: DetailedService | null;
  onConfirmSelection: (service: DetailedService, selectedVariant: ServiceVariantOption, finalPrice: number) => void;
}

const DEFAULT_VARIANTS: Record<string, VariantGroup> = {
  hair: {
    id: 'hair-length',
    name: 'Select Hair Length',
    required: true,
    options: [
      { id: 'opt-short', name: 'Above Shoulder (Short)', description: 'Quick precision dry and wave', priceDelta: 0, durationDeltaMinutes: 0 },
      { id: 'opt-medium', name: 'Shoulder to Mid-Back (Medium)', description: 'Layered thermal tension blowout', priceDelta: 400, durationDeltaMinutes: 15 },
      { id: 'opt-long', name: 'Below Waist / Thick (Long)', description: 'Deep sectional pin-setting & high volume', priceDelta: 800, durationDeltaMinutes: 30 },
    ],
  },
  waxing: {
    id: 'wax-type',
    name: 'Select Wax Formula',
    required: true,
    options: [
      { id: 'wax-honey', name: 'Classic Sugar Honey Wax', description: 'Standard gentle epilation for normal skin', priceDelta: 0, durationDeltaMinutes: 0 },
      { id: 'wax-rica', name: 'Italian Rica White Chocolate', description: 'Colophony-free liposoluble wax for sensitive skin', priceDelta: 450, durationDeltaMinutes: 10 },
      { id: 'wax-peel', name: 'Brazilian Peel-Off Stripless', description: 'Zero-strip hot peel for ultra-delicate zones', priceDelta: 750, durationDeltaMinutes: 15 },
    ],
  },
  skin: {
    id: 'skin-intensity',
    name: 'Select Facial Booster',
    required: true,
    options: [
      { id: 'skin-classic', name: 'Standard Hydra Oxygen', description: 'Deep pore cleanse and hydration seal', priceDelta: 0, durationDeltaMinutes: 0 },
      { id: 'skin-cryo', name: 'Sub-Zero Cryo Ice Globe Sculpt', description: 'Lymphatic drainage and jawline lifting wand', priceDelta: 500, durationDeltaMinutes: 15 },
      { id: 'skin-gold', name: '24K Gold Foil Derma Infusion', description: 'Cellular revitalization for bridal glow', priceDelta: 1100, durationDeltaMinutes: 20 },
    ],
  },
};

export const VariantPickerSheet: React.FC<VariantPickerSheetProps> = ({
  isOpen,
  onClose,
  service,
  onConfirmSelection,
}) => {
  if (!isOpen || !service) return null;

  const variantGroup =
    DEFAULT_VARIANTS[service.category] || DEFAULT_VARIANTS.hair;

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    variantGroup.options[0]?.id || ''
  );

  const selectedOption =
    variantGroup.options.find((opt) => opt.id === selectedOptionId) ||
    variantGroup.options[0];

  const finalPrice = service.price + (selectedOption?.priceDelta || 0);
  const finalDuration =
    service.durationMinutes + (selectedOption?.durationDeltaMinutes || 0);

  const handleConfirm = () => {
    onConfirmSelection(service, selectedOption, finalPrice);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/50 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal / Bottom Sheet Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-mist flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-plum block">
                Customize Service
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
                {service.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-mauve-grey mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-plum" />
                  <span>{finalDuration} mins</span>
                </span>
                <span>•</span>
                <span>Products: sealed, single-use</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close variant picker"
              className="w-8 h-8 rounded-full bg-soft-ivory hover:bg-blush flex items-center justify-center text-ink transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options List */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1 no-scrollbar">
            <p className="text-xs font-bold text-ink mb-1">
              {variantGroup.name}
            </p>

            {variantGroup.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const optionPrice = service.price + opt.priceDelta;

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blush/40 border-rose-plum shadow-xs ring-1 ring-rose-plum/30'
                      : 'bg-white hover:bg-soft-ivory border-mist'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-ink">
                        {opt.name}
                      </h4>
                      {opt.priceDelta === 0 && (
                        <span className="text-[10px] font-bold text-mauve-grey bg-mist/60 px-1.5 py-0.5 rounded">
                          Standard
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-mauve-grey mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-heading font-bold text-sm text-ink block">
                        ₹{optionPrice}
                      </span>
                      {opt.durationDeltaMinutes > 0 && (
                        <span className="text-[10px] text-mauve-grey font-mono block">
                          +{opt.durationDeltaMinutes}m
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-rose-plum text-white'
                          : 'border border-mist text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hygiene Assurance Note */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Every option includes genuine mono-dose sachets and disposable linens.
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-mist bg-white flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-mauve-grey tracking-wider block">
                Total Live Price
              </span>
              <span className="font-heading font-bold text-xl text-ink">
                ₹{finalPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-rose-plum text-white font-bold text-xs sm:text-sm hover:bg-deep-plum transition-all shadow-xs cursor-pointer"
            >
              Confirm &amp; Add
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
