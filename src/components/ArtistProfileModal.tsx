import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Heart,
  Share2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Artist, ServicePackage } from '../types';
import { spatialSpring, snappySpring, bouncySpring } from '../constants/motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { triggerChampagneSparkles } from '../utils/confetti';

interface ArtistProfileModalProps {
  artist: Artist | null;
  onClose: () => void;
  onBookPackage: (artist: Artist, pkg: ServicePackage) => void;
  selectedPackageId?: string;
  isWishlisted: boolean;
  onToggleWishlist: (artistId: string) => void;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  onClose,
  onBookPackage,
  selectedPackageId,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    artist?.packages[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<'packages' | 'beforeAfter' | 'portfolio' | 'reviews'>('packages');

  if (!artist) return null;

  const togglePackageExpand = (pkgId: string) => {
    setExpandedPackageId(expandedPackageId === pkgId ? null : pkgId);
  };

  const handleSelectPackage = (e: React.MouseEvent, pkg: ServicePackage) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    onBookPackage(artist, pkg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian/70 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6">
      
      {/* Modal Container */}
      <motion.div
        layoutId={`artist-card-${artist.id}`}
        transition={spatialSpring}
        className="relative w-full max-w-4xl bg-canvas-light sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh]"
      >
        {/* Floating Top Control Bar: Close & Share */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 py-3.5 glass-panel border-b border-rose-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-obsidian line-clamp-1">
              {artist.name}
            </span>
            {artist.isVerified && (
              <ShieldCheck className="w-4 h-4 text-champagne-dark shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onToggleWishlist(artist.id)}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-obsidian hover:text-rose-velvet border border-rose-gold/20 shadow-sm transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-velvet text-rose-velvet' : ''}`} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-obsidian border border-rose-gold/20 shadow-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 pb-24">
          
          {/* 1. Hero Cover Header with layoutId */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-obsidian">
            <motion.img
              layoutId={`artist-image-${artist.id}`}
              src={artist.coverImage}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

            {/* Profile Info Overlay */}
            <div className="absolute bottom-6 inset-x-6 z-10 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-champagne shadow-luxury"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-rose-velvet px-2.5 py-0.5 rounded-full text-white">
                      Celebrity Tier
                    </span>
                    <span className="text-xs text-rose-blush font-mono font-medium">{artist.handle}</span>
                  </div>
                  <motion.h2
                    layoutId={`artist-name-${artist.id}`}
                    className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white"
                  >
                    {artist.name}
                  </motion.h2>
                  <p className="text-xs sm:text-sm text-champagne-light">{artist.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 fill-champagne text-champagne" />
                    <span className="font-mono text-sm font-bold text-white">{artist.rating.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-white/80">{artist.reviewCount} Verified Brides</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Trust Metrics */}
          <div className="px-4 sm:px-8 py-6 border-b border-rose-gold/15 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-2xl bg-surface-cream/60 border border-rose-gold/15 mb-6 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">Experience</span>
                <span className="font-mono text-sm font-bold text-obsidian">{artist.experienceYears}+ Years</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">Hygiene Rating</span>
                <span className="font-mono text-sm font-bold text-emerald-700">Medical Grade</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">Location</span>
                <span className="text-xs font-semibold text-obsidian line-clamp-1">{artist.location}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">Booking</span>
                <span className="text-xs font-semibold text-rose-gold">Instant Available</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-obsidian-muted leading-relaxed">
              {artist.bio}
            </p>

            {/* Specialties */}
            <div className="mt-4 flex flex-wrap gap-2">
              {artist.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-surface-cream border border-rose-gold/25 text-xs font-medium text-obsidian flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-rose-gold" />
                  <span>{spec}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="sticky top-14 z-20 px-4 sm:px-8 py-3 bg-canvas-light/95 backdrop-blur-md border-b border-rose-gold/15 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'packages'
                  ? 'bg-obsidian text-white shadow-sm'
                  : 'bg-white hover:bg-surface-cream text-obsidian border border-rose-gold/20'
              }`}
            >
              Couture Packages ({artist.packages.length})
            </button>
            <button
              onClick={() => setActiveTab('beforeAfter')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'beforeAfter'
                  ? 'bg-obsidian text-white shadow-sm'
                  : 'bg-white hover:bg-surface-cream text-obsidian border border-rose-gold/20'
              }`}
            >
              <Sparkles className="w-3 h-3 text-rose-gold" />
              <span>Before & After Makeover Slider</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'bg-obsidian text-white shadow-sm'
                  : 'bg-white hover:bg-surface-cream text-obsidian border border-rose-gold/20'
              }`}
            >
              Verified Reviews ({artist.reviews.length})
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="px-4 sm:px-8 py-6">
            {/* TAB 1: Expanding Service Package Cards */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl font-bold text-obsidian">
                    Curated Bridal & Event Packages
                  </h3>
                  <span className="text-xs text-obsidian-subtle">
                    Tap any card to reveal products & inclusions
                  </span>
                </div>

                {artist.packages.map((pkg) => {
                  const isExpanded = expandedPackageId === pkg.id;
                  const isSelected = selectedPackageId === pkg.id;

                  return (
                    <motion.div
                      key={pkg.id}
                      layoutId={`pkg-card-${pkg.id}`}
                      transition={spatialSpring}
                      onClick={() => togglePackageExpand(pkg.id)}
                      className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-blush/30 border-rose-gold shadow-rose-glow'
                          : isExpanded
                          ? 'bg-white border-rose-gold/40 shadow-luxury'
                          : 'bg-white hover:bg-surface-cream/40 border-rose-gold/20 shadow-sm'
                      }`}
                    >
                      {/* Package Header Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-champagne-light/70 text-obsidian">
                              {pkg.tier}
                            </span>
                            {pkg.isPopular && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-velvet bg-rose-blush px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Most Booked</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg sm:text-xl font-bold text-obsidian">
                            {pkg.name}
                          </h4>

                          <p className="text-xs text-obsidian-muted mt-1">
                            {pkg.description}
                          </p>

                          <div className="mt-3 flex items-center gap-4 text-xs text-obsidian-subtle font-medium">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-rose-gold" />
                              <span className="font-mono">{pkg.durationMinutes} mins</span>
                            </div>
                            <span>•</span>
                            <span>Full Draping Included</span>
                            <span>•</span>
                            <span>Mink Lashes Included</span>
                          </div>
                        </div>

                        {/* Price and Expand Toggle */}
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xl sm:text-2xl font-bold text-obsidian block tabular-nums">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <button className="mt-2 text-xs font-semibold text-rose-gold hover:text-rose-velvet flex items-center gap-1 ml-auto">
                            <span>{isExpanded ? 'Less' : 'Details'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanding Breakdown Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={spatialSpring}
                            className="mt-6 pt-5 border-t border-rose-gold/15 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                              {/* Luxury Formulations & Brands Used */}
                              <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-obsidian flex items-center gap-1.5 mb-2.5">
                                  <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
                                  <span>Luxury Brands & Formulations Used</span>
                                </span>
                                <ul className="space-y-1.5 text-xs text-obsidian-muted">
                                  {pkg.productsUsed.map((brand, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-champagne-dark" />
                                      <span>{brand}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Inclusions Breakdown */}
                              <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-obsidian flex items-center gap-1.5 mb-2.5">
                                  <Layers className="w-3.5 h-3.5 text-rose-gold" />
                                  <span>What's Included in This Package</span>
                                </span>
                                <ul className="space-y-1.5 text-xs text-obsidian-muted">
                                  {pkg.inclusions.map((inc, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{inc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                            </div>

                            {/* Add Service + Select Slot Morphing Button */}
                            <div className="mt-6 pt-4 border-t border-rose-gold/10 flex items-center justify-between">
                              <span className="text-xs text-obsidian-subtle">
                                Includes 10-min slot lock & escrow refund protection
                              </span>

                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                transition={snappySpring}
                                onClick={(e) => handleSelectPackage(e, pkg)}
                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-obsidian hover:bg-obsidian-deep text-white'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <Check className="w-4 h-4 text-white" />
                                    <span>Selected for Slot Booking</span>
                                  </>
                                ) : (
                                  <>
                                    <Calendar className="w-4 h-4 text-champagne-light" />
                                    <span>Add Service + Select Slot</span>
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Physics-Based "Before / After" Makeover Slider */}
            {activeTab === 'beforeAfter' && (
              <div className="space-y-6">
                <BeforeAfterSlider data={artist.beforeAfter} />
                <div className="p-4 rounded-2xl bg-white border border-rose-gold/15 text-xs text-obsidian-muted">
                  <h5 className="font-semibold text-obsidian mb-1">Our High-Definition Philosophy:</h5>
                  <p>
                    All transformation photos are shot under raw studio lighting with zero digital smoothing or blurring filters.
                    We calibrate skin tones to match your exact undertone under both natural sunlight and 4K banquet flash photography.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {artist.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-rose-gold/15 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover border border-rose-gold/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-obsidian">{rev.author}</span>
                            {rev.verifiedBridal && (
                              <span className="text-[10px] font-semibold text-champagne-dark bg-champagne-light/50 px-2 py-0.5 rounded-full">
                                Verified Bride
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-obsidian-subtle">{rev.lookTitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-champagne text-champagne" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-obsidian-muted leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-obsidian-subtle mt-2 block font-mono">
                      Reviewed {rev.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sticky Bottom Booking Bar */}
        <div className="sticky bottom-0 z-30 px-6 py-4 glass-panel border-t border-rose-gold/20 flex items-center justify-between shadow-luxury">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-obsidian-subtle block font-semibold">
              Selected Package
            </span>
            <span className="font-serif text-lg font-bold text-obsidian line-clamp-1">
              {artist.packages[0]?.name}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={snappySpring}
            onClick={(e) => handleSelectPackage(e, artist.packages[0])}
            className="px-6 py-3 rounded-full bg-obsidian hover:bg-obsidian-deep text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-md"
          >
            <span>Proceed to Slot Lock</span>
            <ArrowRight className="w-4 h-4 text-champagne-light" />
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
