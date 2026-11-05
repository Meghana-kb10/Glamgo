import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { Artist } from '../types';
import { hoverElevate, tapScale, MOTION_PRIMITIVES, spatialSpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ArtistCardProps {
  artist: Artist;
  isWishlisted: boolean;
  onToggleWishlist: (artistId: string) => void;
  onSelectArtist: (artist: Artist) => void;
  isPriority?: boolean;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isWishlisted,
  onToggleWishlist,
  onSelectArtist,
  isPriority = false,
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

  const optimizedImage = artist.coverImage.includes('images.unsplash.com')
    ? `${artist.coverImage.split('?')[0]}?auto=format&fit=crop&w=600&q=80&fm=webp`
    : artist.coverImage;

  return (
    <motion.article
      layoutId={`artist-card-${artist.id}`}
      whileHover={hoverElevate}
      transition={spatialSpring}
      onClick={() => onSelectArtist(artist)}
      className="group relative bg-card rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-md border border-border cursor-pointer flex flex-col transition-all duration-200 focus-within:ring-2 focus-within:ring-accent"
    >
      {/* Cover Image Container with Shared Element layoutId */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-fill">
        <motion.img
          layoutId={`artist-image-${artist.id}`}
          src={optimizedImage}
          alt={artist.name}
          width={400}
          height={500}
          loading={isPriority ? undefined : 'lazy'}
          {...(isPriority ? { fetchpriority: 'high' } : {})}
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/20 to-transparent opacity-90" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          {/* Verified Pro Badge */}
          {artist.isVerified ? (
            <Badge type="verified" text="Verified Pro" className="bg-card/95 shadow-xs" />
          ) : <div />}

          {/* Micro-Interaction Wishlist Heart */}
          <motion.button
            type="button"
            aria-label={`Save ${artist.name} to wishlist`}
            whileTap={tapScale}
            onClick={handleHeartClick}
            className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-xs flex items-center justify-center text-text shadow-xs hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none cursor-pointer"
          >
            <motion.div
              animate={isHeartAnimating ? { scale: [0.9, 1.35, 1.0] } : { scale: 1 }}
              transition={MOTION_PRIMITIVES.tactile}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'fill-accent text-accent' : 'text-text'
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
                className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-text/70 border border-white/20 text-white backdrop-blur-xs"
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
              <p className="text-xs text-white/90 line-clamp-1">{artist.title}</p>
            </div>

            <div className="flex items-center gap-1 bg-card/20 backdrop-blur-xs border border-white/30 px-2.5 py-1 rounded-xl text-white">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              <span className="font-mono text-sm font-bold tabular-nums">
                {artist.rating.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body & Pricing */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-card space-y-3">
        
        {/* Distance & Location */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold text-text">{artist.location}</span>
          </div>
          <span className="font-mono text-xs text-text-muted">{artist.distance}</span>
        </div>

        {/* Hygiene & Experience */}
        <div className="py-2.5 border-t border-b border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>{artist.experienceYears} Years Editorial Pro</span>
          <span className="text-success font-semibold">99.4% Hygiene Score</span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted block font-semibold">
              Starting from
            </span>
            <span className="font-mono text-lg font-bold text-text tabular-nums">
              ₹{artist.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectArtist(artist);
            }}
            aria-label={`View lookbook for ${artist.name}`}
            className="bg-accent-soft hover:bg-accent hover:text-white text-accent-pressed rounded-xl text-xs font-semibold"
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
          >
            Lookbook
          </Button>
        </div>

      </div>
    </motion.article>
  );
};
