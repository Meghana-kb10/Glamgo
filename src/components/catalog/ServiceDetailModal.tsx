import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Heart,
  Droplets,
} from 'lucide-react';
import { DetailedService } from '../../services/marketplaceService';
import { Button } from '../ui/Button';
import { POPULAR_ADDONS, ServiceAddon } from '../../services/pricingService';
import { BeforeAfterSlider } from '../BeforeAfterSlider';
import { useToast } from '../../context/ToastContext';
import { favoritesService } from '../../services/favoritesService';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: DetailedService | null;
  onBookService: (service: DetailedService, addonIds: string[]) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  onBookService,
}) => {
  const toast = useToast();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(() =>
    service ? favoritesService.isServiceFavorite(service.id) : false
  );

  if (!isOpen || !service) return null;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleFav = () => {
    const nextState = favoritesService.toggleServiceFavorite(service.id);
    setIsFavorite(nextState);
    toast.success(
      nextState ? 'Saved to your favorites' : 'Removed from favorites',
      'Favorites Updated'
    );
  };

  const addonsTotal = POPULAR_ADDONS.filter((a) => selectedAddonIds.includes(a.id)).reduce(
    (acc, a) => acc + a.price,
    0
  );

  const finalPrice = service.price + addonsTotal;
  const images = service.galleryImages?.length ? service.galleryImages : [service.imageUrl];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(31, 26, 29, 0.75)' }}
      />

      {/* Modal / Bottom Sheet Container */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-3xl bg-soft-ivory rounded-t-3xl sm:rounded-3xl border border-mist shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        style={{ backgroundColor: '#FFFBF8' }}
      >
        {/* Sticky Header Bar */}
        <div className="px-5 py-3.5 border-b border-mist bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-plum bg-blush px-2.5 py-0.5 rounded-full">
              {service.category}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold" />
              <span className="font-bold text-ink">{service.rating}</span>
              <span className="text-mauve-grey">({service.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFav}
              aria-label="Save to favorites"
              className="p-1.5 rounded-full text-mauve-grey hover:text-coral-red cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-coral-red fill-coral-red' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="w-8 h-8 rounded-full flex items-center justify-center text-mauve-grey hover:text-ink hover:bg-mist/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          {/* 1. Image Carousel & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-mist bg-ink/10 shadow-xs">
              <img
                src={images[activeImageIndex] || service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-ink/75 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-champagne-gold" />
                <span>{service.durationMinutes} mins dedicated</span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-rose-plum ring-2 ring-rose-plum/20' : 'border-mist opacity-70'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Title & Core Value Proposition */}
          <div>
            <h2 id="service-detail-title" className="font-serif text-xl sm:text-2xl font-bold text-ink">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-mauve-grey leading-relaxed mt-2 font-sans">
              {service.description}
            </p>
          </div>

          {/* 3. Before / After Slider (if available) */}
          {service.beforeImage && service.afterImage && (
            <div className="p-4 rounded-2xl bg-white border border-mist space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-plum flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Lookbook Transformation (Before &amp; After)</span>
              </span>
              <p className="text-[11px] text-mauve-grey mb-3">
                Drag the slider to inspect high-definition skin blending &amp; contouring precision.
              </p>
              <div className="aspect-[16/10] max-h-[300px] overflow-hidden rounded-xl border border-mist">
                <BeforeAfterSlider
                  data={{
                    beforeUrl: service.beforeImage,
                    afterUrl: service.afterImage,
                    title: 'Transformation Preview',
                    skinType: 'All Skin Types',
                    transformationType: 'HD Bridal Glow',
                  }}
                />
              </div>
            </div>
          )}

          {/* 4. What's Included Checklist */}
          <div className="p-5 rounded-2xl bg-white border border-mist space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink block">
              What's Included in This Experience
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.whatIsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-ink">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Products & Formulations Used */}
          {service.productsUsed?.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-mist space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-mauve-grey flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-champagne-gold" />
                <span>Luxury Formulas &amp; Tools Used</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {service.productsUsed.map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-soft-ivory border border-mist text-xs font-medium text-ink"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Popular Add-ons Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink block">
              Recommended Add-ons for This Look
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {POPULAR_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);

                return (
                  <label
                    key={addon.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blush/30 border-rose-plum ring-1 ring-rose-plum/30 shadow-xs'
                        : 'bg-white border-mist hover:border-mist/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddon(addon.id)}
                      className="w-4 h-4 mt-0.5 rounded text-rose-plum accent-rose-plum"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-xs font-bold text-ink">{addon.name}</p>
                        <span className="font-serif text-xs font-bold text-rose-plum">
                          +₹{addon.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[10px] text-mauve-grey mt-0.5">{addon.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 7. FAQs Accordion */}
          {service.faqs?.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-mist space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink block mb-1">
                Frequently Asked Questions
              </span>
              <div className="divide-y divide-mist">
                {service.faqs.map((faq, idx) => {
                  const isOpen = expandedFaqIndex === idx;

                  return (
                    <div key={idx} className="py-2.5 first:pt-1 last:pb-1">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-xs font-bold text-ink cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-mauve-grey" /> : <ChevronDown className="w-3.5 h-3.5 text-mauve-grey" />}
                      </button>
                      {isOpen && (
                        <p className="text-[11px] text-mauve-grey mt-2 leading-relaxed font-sans">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 8. Cancellation Policy Strip */}
          <div className="p-3.5 rounded-xl bg-champagne-gold/15 border border-champagne-gold/30 flex items-center gap-2 text-xs text-ink">
            <ShieldCheck className="w-4 h-4 text-champagne-gold shrink-0" />
            <span className="leading-snug">
              Free rescheduling or cancellation up to 4 hours prior to appointment slot. Sealed sterile kit included.
            </span>
          </div>
        </div>

        {/* Sticky Bottom Booking Action Bar */}
        <div
          className="p-4 sm:p-5 border-t border-mist bg-white flex items-center justify-between gap-4 shrink-0 shadow-lg"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-rose-plum">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-xs text-mauve-grey line-through">
                  ₹{service.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-mauve-grey block">
              {selectedAddonIds.length > 0 ? `Includes ${selectedAddonIds.length} add-ons • All taxes included` : 'All taxes and hygiene kit included'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                onBookService(service, selectedAddonIds);
                onClose();
              }}
              leftIcon={<Sparkles className="w-4 h-4" />}
              style={{ backgroundColor: '#B8336A', color: '#FFFFFF', minWidth: '180px' }}
            >
              Reserve Appointment
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
