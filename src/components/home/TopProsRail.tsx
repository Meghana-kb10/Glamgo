import React, { useRef, useState, useEffect } from 'react';
import { Star, ShieldCheck, Heart, MapPin, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Artist } from '../../types';

interface TopProsRailProps {
  artists: Artist[];
  favorites: string[];
  onToggleFavorite: (artistId: string) => void;
  onSelectArtist: (artist: Artist) => void;
}

export const TopProsRail: React.FC<TopProsRailProps> = ({
  artists,
  favorites,
  onToggleFavorite,
  onSelectArtist,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [artists]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            Curated Artisans
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans tracking-tight">
            Top-Rated Professionals Near You
          </h2>
        </div>
        <span className="text-xs text-mauve-grey hidden sm:inline">
          Verified Background &amp; Certified Portfolios
        </span>
      </div>

      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous professionals"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
        )}

        {/* Horizontal Portrait Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        >
          {artists.map((artist) => {
            const isFav = favorites.includes(artist.id);
            const startingPrice = artist.packages?.[0]?.price || 4500;

            return (
              <div
                key={artist.id}
                onClick={() => onSelectArtist(artist)}
                className="relative w-[260px] sm:w-[290px] h-[370px] sm:h-[390px] shrink-0 snap-start rounded-3xl overflow-hidden cursor-pointer select-none group shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-ink flex flex-col justify-between"
              >
                {/* Full-Bleed Portrait Photo */}
                <img
                  src={artist.avatar || artist.coverImage}
                  alt={artist.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Soft Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                {/* Top Floating Badges */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Pro</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(artist.id);
                    }}
                    aria-label={isFav ? `Remove ${artist.name} from favorites` : `Save ${artist.name} to favorites`}
                    className="w-8 h-8 rounded-full bg-ink/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-coral-red transition-colors shadow-xs cursor-pointer active:scale-90"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'text-coral-red fill-coral-red' : ''}`}
                    />
                  </button>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 p-5 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-champagne-gold fill-champagne-gold" />
                      <span className="font-bold">{artist.rating}</span>
                      <span className="text-white/70">({artist.reviewCount})</span>
                    </div>

                    <span className="text-[11px] text-white/80 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-champagne-gold" />
                      <span>{artist.location.split(',')[0]}</span>
                    </span>
                  </div>

                  <h3 className="font-sans text-lg font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {artist.name}
                  </h3>

                  <p className="text-xs text-white/80 line-clamp-1 font-sans">
                    {artist.title}
                  </p>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/70 uppercase block">Starts from</span>
                      <span className="font-sans text-sm font-bold text-white">
                        ₹{startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Lookbook</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next professionals"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-ink shadow-lg border border-mist flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-ink" />
          </button>
        )}
      </div>
    </section>
  );
};
