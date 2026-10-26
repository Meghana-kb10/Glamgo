import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, MapPin, Sparkles, Heart, Clock, ArrowUpRight } from 'lucide-react';
import { Artist } from '../types';
import { snappySpring, hoverElevate, tapScale, MOTION_PRIMITIVES, spatialSpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';

interface ArtistCardProps {
  artist: Artist;
  isWishlisted: boolean;
  onToggleWishlist: (artistId: string) => void;
  onSelectArtist: (artist: Artist) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isWishlisted,
  onToggleWishlist,
  onSelectArtist,
}) => {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    if (!isWishlisted) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerChampagneSparkles(x, y);
    }
    onToggleWishlist(artist.id);
    setTimeout(() => setIsHeartAnimating(false), 400);
  };

  return (
    <motion.div
      layoutId={`artist-card-${artist.id}`}
      whileHover={hoverElevate}
      transition={spatialSpring}
      onClick={() => onSelectArtist(artist)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectArtist(artist);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View lookbook for ${artist.name}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-luxury border border-rose-gold/15 border-t-white/80 cursor-pointer flex flex-col transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
    >
      {/* Cover Image Container with Shared Element layoutId */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-cream">
        <motion.img
          layoutId={`artist-image-${artist.id}`}
          src={artist.coverImage}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent opacity-90" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          {/* Verified Pro Pill */}
          {artist.isVerified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[13px] font-semibold text-obsidian shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Pro</span>
            </div>
          )}

          {/* Micro-Interaction Wishlist Heart */}
          <motion.button
            type="button"
            aria-label={`Wishlist ${artist.name}`}
            whileTap={tapScale}
            onClick={handleHeartClick}
            className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center text-obsidian shadow-xs hover:text-rose-velvet transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
          >
            <motion.div
              animate={isHeartAnimating ? { scale: [0.9, 1.35, 1.0] } : { scale: 1 }}
              transition={MOTION_PRIMITIVES.tactile}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'fill-rose-velvet text-rose-velvet' : 'text-obsidian'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Bottom Image Overlay Details: Specialties & Rating */}
        <div className="absolute bottom-3.5 inset-x-3.5 z-10 text-white space-y-1">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {artist.specialties.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[13px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <motion.h3
                layoutId={`artist-name-${artist.id}`}
                className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]"
              >
                {artist.name}
              </motion.h3>
              <p className="text-sm text-white/90 line-clamp-1">{artist.title}</p>
            </div>

            <div className="flex items-center gap-1 bg-white/20 border border-white/30 px-2.5 py-1 rounded-xl text-white">
              <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
              <span className="font-mono text-sm font-bold tabular-nums">
                {artist.rating.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body & Pricing */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-white space-y-3">
        
        {/* Distance & Location */}
        <div className="flex items-center justify-between text-sm text-obsidian-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-dark" />
            <span className="font-semibold text-obsidian">{artist.location}</span>
          </div>
          <span className="font-mono text-sm text-obsidian-muted">{artist.distance}</span>
        </div>

        {/* Hygiene & Experience */}
        <div className="py-2.5 border-t border-b border-rose-gold/10 flex items-center justify-between text-[13px] text-obsidian-muted">
          <span>{artist.experienceYears} Years Editorial Pro</span>
          <span className="text-emerald-700 font-semibold">99.4% Hygiene Score</span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <span className="text-[13px] uppercase tracking-wider text-obsidian-muted block font-semibold">
              Starting from
            </span>
            <span className="font-mono text-lg font-bold text-obsidian tabular-nums">
              ₹{artist.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <motion.div
            whileHover={hoverElevate}
            whileTap={tapScale}
            transition={snappySpring}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-cream text-obsidian group-hover:bg-obsidian group-hover:text-white transition-colors text-sm font-semibold shadow-xs"
          >
            <span>View Lookbook</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
