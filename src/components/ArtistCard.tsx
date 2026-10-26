import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, MapPin, Sparkles, Heart, Clock, ArrowUpRight } from 'lucide-react';
import { Artist } from '../types';
import { snappySpring, bouncySpring } from '../constants/motion';
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
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerChampagneSparkles(x, y);
    }
    onToggleWishlist(artist.id);
    setTimeout(() => setIsHeartAnimating(false), 450);
  };

  return (
    <motion.div
      layoutId={`artist-card-${artist.id}`}
      whileHover={{ y: -6 }}
      transition={snappySpring}
      onClick={() => onSelectArtist(artist)}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-rose-gold/15 cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* Cover Image Container with Shared Element layoutId */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-cream">
        <motion.img
          layoutId={`artist-image-${artist.id}`}
          src={artist.coverImage}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/10 to-transparent opacity-80" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          {/* Verified Pro Pill */}
          {artist.isVerified && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-champagne/40 text-[11px] font-semibold text-obsidian shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-dark" />
              <span>Verified Pro</span>
            </div>
          )}

          {/* Micro-Interaction Wishlist Heart */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleHeartClick}
            className="ml-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-obsidian shadow-md hover:text-rose-velvet transition-colors"
          >
            <motion.div
              animate={isHeartAnimating ? { scale: [0.8, 1.45, 1.0] } : { scale: 1 }}
              transition={bouncySpring}
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
        <div className="absolute bottom-3.5 inset-x-3.5 z-10 text-white">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {artist.specialties.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <motion.h3
                layoutId={`artist-name-${artist.id}`}
                className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight"
              >
                {artist.name}
              </motion.h3>
              <p className="text-xs text-rose-blush/90 line-clamp-1">{artist.title}</p>
            </div>

            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-champagne-light text-champagne-light" />
              <span className="font-mono text-xs font-bold text-white tabular-nums">
                {artist.rating.toFixed(2)}
              </span>
              <span className="text-[10px] text-white/70">({artist.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body & Pricing */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        
        {/* Distance & Location */}
        <div className="flex items-center justify-between text-xs text-obsidian-subtle mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-gold" />
            <span className="font-medium text-obsidian">{artist.location}</span>
          </div>
          <span className="font-mono text-[11px] text-obsidian-muted">{artist.distance}</span>
        </div>

        {/* Hygiene & Experience */}
        <div className="py-2 border-t border-b border-rose-gold/10 flex items-center justify-between text-[11px] text-obsidian-muted">
          <span>{artist.experienceYears} Years Editorial Pro</span>
          <span className="text-emerald-700 font-medium">99.4% Hygiene Score</span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-obsidian-subtle block font-semibold">
              Starting from
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-obsidian tabular-nums">
              ₹{artist.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={snappySpring}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-surface-cream text-obsidian group-hover:bg-obsidian group-hover:text-white transition-colors text-xs font-semibold shadow-sm"
          >
            <span>View Lookbook</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
