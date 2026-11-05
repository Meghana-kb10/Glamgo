import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Clock,
  Check,
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
  const [isByopSelected, setIsByopSelected] = useState(false);
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

  const byopDiscountAmount = isByopSelected ? (service.byopDiscount || 500) : 0;
  const finalPrice = Math.max(1, service.price - byopDiscountAmount + addonsTotal);
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
        className="fixed inset-0 bg-text/60 backdrop-blur-sm"
      />

      {/* Modal / Bottom Sheet Container */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-3xl bg-card rounded-t-[24px] sm:rounded-[24px] border border-border shadow-warm-modal overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh]"
      >
        {/* Sticky Header Bar */}
        <div className="px-5 py-3.5 border-b border-border bg-card/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-0.5 rounded-full">
              {service.category}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 text-star fill-star" />
              <span className="font-bold text-text">{service.rating}</span>
              <span className="text-text-muted">({service.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFav}
              aria-label="Save to favorites"
              className="p-1.5 rounded-full text-text-muted hover:text-accent cursor-pointer transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-accent fill-accent' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-fill/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          {/* 1. Image Carousel & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-[20px] overflow-hidden border border-border bg-fill/20 shadow-warm-xs">
              <img
                src={images[activeImageIndex] || service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-[10px] bg-text/80 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-star" />
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
                    className={`relative w-16 h-12 rounded-[12px] overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-accent ring-2 ring-accent/20' : 'border-border opacity-70'
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
            <h2 id="service-detail-title" className="font-heading text-xl sm:text-2xl font-bold text-text">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mt-2 font-sans">
              {service.description}
            </p>
          </div>

          {/* Glamgo Signature: Product Delivery Mode (All-Inclusive vs Bring Your Own Product) */}
          <div className="p-4 rounded-[20px] bg-bg-alt border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Product Transparency Mode</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                Glamgo Transparency Guarantee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsByopSelected(false)}
                className={`p-3 rounded-[16px] border text-left transition-all cursor-pointer ${
                  !isByopSelected
                    ? 'bg-card border-accent ring-1 ring-accent/25 shadow-warm-xs'
                    : 'bg-card/60 hover:bg-card border-border text-text-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-text">All-Inclusive Sealed Kit</span>
                  {!isByopSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                </div>
                <p className="text-[11px] text-text-muted leading-tight">
                  100% genuine single-use mono-pack opened in front of you.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsByopSelected(true)}
                className={`p-3 rounded-[16px] border text-left transition-all cursor-pointer ${
                  isByopSelected
                    ? 'bg-card border-accent ring-1 ring-accent/25 shadow-warm-xs'
                    : 'bg-card/60 hover:bg-card border-border text-text-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-text">Bring Your Own Product (BYOP)</span>
                  <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                    Save ₹{(service.byopDiscount || 500).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-tight">
                  Use your own preferred foundation/creams; pay only for master labor.
                </p>
              </button>
            </div>
          </div>

          {/* Glamgo Signature: Step-by-Step Procedure Timeline */}
          {service.procedureSteps && service.procedureSteps.length > 0 && (
            <div className="p-5 rounded-[20px] bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text block">
                  Step-by-Step Treatment Procedure ({service.procedureSteps.length} Steps)
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
                  Glamgo Atelier Protocol
                </span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {service.procedureSteps.map((step) => (
                  <div key={step.stepNumber} className="relative group">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center ring-4 ring-card">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-text">{step.title}</h4>
                        <span className="text-[10px] font-mono text-text-muted">{step.duration}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Glamgo Signature: Consumables vs Customer Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-[18px] bg-bg-alt border border-border space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>What Glamgo Delivers</span>
              </span>
              <ul className="space-y-1 text-xs text-text">
                {(service.disposablesIncluded || [
                  '100% Genuine Sealed Mono-Dose Pack',
                  'Sterile single-use bed roll & floor sheet',
                  'Autoclaved metal tools in sealed pouch',
                  'Post-service bio-waste disposal pouch',
                ]).map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-[18px] bg-bg-alt border border-border space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-pressed flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-pressed" />
                <span>What You Need to Provide</span>
              </span>
              <ul className="space-y-1 text-xs text-text">
                {(service.customerRequirements || [
                  '1 Chair or bed in a well-lit room',
                  'Electrical socket within 2 meters',
                  'Normal room temperature water',
                ]).map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-accent font-bold shrink-0">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Before / After Slider (if available) */}
          {service.beforeImage && service.afterImage && (
            <div className="p-4 rounded-[20px] bg-card border border-border space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Lookbook Transformation (Before &amp; After)</span>
              </span>
              <p className="text-[11px] text-text-muted mb-3">
                Drag the slider to inspect high-definition skin blending &amp; contouring precision.
              </p>
              <div className="aspect-[16/10] max-h-[300px] overflow-hidden rounded-[16px] border border-border">
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
          <div className="p-5 rounded-[20px] bg-card border border-border space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text block">
              What's Included in This Experience
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.whatIsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Products & Formulations Used */}
          {service.productsUsed?.length > 0 && (
            <div className="p-5 rounded-[20px] bg-card border border-border space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-star" />
                <span>Luxury Formulas &amp; Tools Used</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {service.productsUsed.map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-[12px] bg-fill border border-border text-xs font-medium text-text"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Recommended Add-ons Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text block">
              Recommended Add-ons for This Look
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {POPULAR_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);

                return (
                  <label
                    key={addon.id}
                    className={`p-3.5 rounded-[16px] border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-accent-soft/40 border-accent ring-1 ring-accent/30 shadow-warm-xs'
                        : 'bg-card border-border hover:border-accent/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddon(addon.id)}
                      className="w-4 h-4 mt-0.5 rounded text-accent accent-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-xs font-bold text-text">{addon.name}</p>
                        <span className="font-heading text-xs font-bold text-accent">
                          +₹{addon.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">{addon.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 7. FAQs Accordion */}
          {service.faqs?.length > 0 && (
            <div className="p-5 rounded-[20px] bg-card border border-border space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text block mb-1">
                Frequently Asked Questions
              </span>
              <div className="divide-y divide-border">
                {service.faqs.map((faq, idx) => {
                  const isOpen = expandedFaqIndex === idx;

                  return (
                    <div key={idx} className="py-2.5 first:pt-1 last:pb-1">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-xs font-bold text-text cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
                      </button>
                      {isOpen && (
                        <p className="text-[11px] text-text-muted mt-2 leading-relaxed font-sans">
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
          <div className="p-3.5 rounded-[16px] bg-bg-alt border border-border flex items-center gap-2 text-xs text-text">
            <ShieldCheck className="w-4 h-4 text-star shrink-0" />
            <span className="leading-snug">
              Free rescheduling or cancellation up to 4 hours prior to appointment slot. Sealed sterile kit included.
            </span>
          </div>
        </div>

        {/* Sticky Bottom Booking Action Bar */}
        <div className="p-4 sm:p-5 border-t border-border bg-card flex items-center justify-between gap-4 shrink-0 shadow-warm-lg">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl sm:text-2xl font-bold text-accent">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-xs text-text-muted line-through">
                  ₹{service.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-text-muted block">
              {isByopSelected
                ? `BYOP Labor Only (-₹${byopDiscountAmount.toLocaleString('en-IN')}) • Taxes included`
                : selectedAddonIds.length > 0
                ? `Includes ${selectedAddonIds.length} add-ons • All taxes included`
                : 'All taxes & sealed single-use kit included'}
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
              className="min-w-[180px] rounded-[14px]"
            >
              Reserve Appointment
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
