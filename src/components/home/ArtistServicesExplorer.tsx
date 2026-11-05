import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Filter,
  Star,
  Clock,
  Check,
  Calendar,
  Building2,
  Home,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ArrowRight,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Artist, ServicePackage } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { triggerChampagneSparkles } from '../../utils/confetti';
import { spatialSpring } from '../../constants/motion';

export interface ArtistServicesExplorerProps {
  artists: Artist[];
  onBookPackage: (artist: Artist, pkg: ServicePackage) => void;
  onSelectArtistProfile?: (artist: Artist) => void;
  initialArtistId?: string;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services' },
  { id: 'bridal', label: 'Bridal & Couture' },
  { id: 'makeup', label: 'Makeup & Glam' },
  { id: 'hair', label: 'Hair & Styling' },
  { id: 'skin', label: 'Skin & Facials' },
  { id: 'nails', label: 'Nails & Art' },
  { id: 'draping', label: 'Saree & Draping' },
];

export const ArtistServicesExplorer: React.FC<ArtistServicesExplorerProps> = ({
  artists,
  onBookPackage,
  onSelectArtistProfile,
  initialArtistId,
}) => {
  const [selectedArtistId, setSelectedArtistId] = useState<string>(
    initialArtistId || (artists[0] ? artists[0].id : '')
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'AT_VENUE' | 'IN_STUDIO'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  // Selected artist object
  const activeArtist = useMemo(() => {
    return artists.find((a) => a.id === selectedArtistId) || artists[0];
  }, [artists, selectedArtistId]);

  // Filter and sort packages for this particular artist
  const filteredPackages = useMemo(() => {
    if (!activeArtist || !activeArtist.packages) return [];
    let list = [...activeArtist.packages];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((pkg) => {
        const cat = pkg.category?.toLowerCase() || '';
        const name = pkg.name.toLowerCase();
        if (selectedCategory === 'bridal') {
          return cat === 'bridal' || name.includes('bridal') || pkg.tier === 'Bridal Couture';
        }
        if (selectedCategory === 'makeup') {
          return cat === 'makeup' || name.includes('glam') || name.includes('airbrush') || name.includes('makeup');
        }
        if (selectedCategory === 'hair') {
          return cat === 'hair' || name.includes('hair') || name.includes('blowout') || name.includes('updo');
        }
        if (selectedCategory === 'skin') {
          return cat === 'skin' || name.includes('facial') || name.includes('skin') || name.includes('hydra');
        }
        if (selectedCategory === 'nails') {
          return cat === 'nails' || name.includes('nail') || name.includes('gel') || name.includes('manicure');
        }
        if (selectedCategory === 'draping') {
          return cat === 'draping' || name.includes('drape') || name.includes('saree') || name.includes('pleat');
        }
        return cat === selectedCategory;
      });
    }

    // Service mode filter (At-Home vs In-Studio)
    if (selectedMode !== 'all') {
      list = list.filter((pkg) => {
        if (!pkg.serviceMode) return true;
        if (pkg.serviceMode === 'HYBRID') return true;
        return pkg.serviceMode === selectedMode;
      });
    }

    // Keyword search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q) ||
          pkg.tier.toLowerCase().includes(q) ||
          pkg.productsUsed.some((p) => p.toLowerCase().includes(q)) ||
          pkg.inclusions.some((inc) => inc.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return list;
  }, [activeArtist, selectedCategory, selectedMode, searchQuery, sortBy]);

  // Category count badges
  const categoryCounts = useMemo(() => {
    if (!activeArtist || !activeArtist.packages) return {};
    const counts: Record<string, number> = { all: activeArtist.packages.length };
    activeArtist.packages.forEach((pkg) => {
      const cat = pkg.category?.toLowerCase();
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [activeArtist]);

  const handleBook = (e: React.MouseEvent, pkg: ServicePackage) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    onBookPackage(activeArtist, pkg);
  };

  if (!activeArtist) return null;

  return (
    <section id="artist-services-suites" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header with Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div className="max-w-2xl space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-border shadow-warm-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent-pressed">
              Bespoke Studio &amp; Artisan Suites
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text tracking-tight">
            Explore All Services by Master Artist or Salon
          </h2>
          <p className="text-xs sm:text-sm text-text-muted font-sans leading-relaxed">
            Choose a verified artisan or luxury salon below to view their comprehensive service catalog, filter by your exact beauty requirements, and reserve your dedicated session.
          </p>
        </div>

        <span className="text-xs text-text-muted font-sans hidden md:block">
          {artists.length} verified ateliers available for online booking
        </span>
      </div>

      {/* 2. Interactive Artist / Salon Selection Rail */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-text-muted block">
          Select Master Artist or Salon:
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {artists.map((artist) => {
            const isSelected = artist.id === activeArtist.id;
            return (
              <button
                key={artist.id}
                type="button"
                onClick={() => {
                  setSelectedArtistId(artist.id);
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setExpandedPackageId(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer shrink-0 text-left select-none ${
                  isSelected
                    ? 'bg-card border-accent shadow-warm ring-2 ring-accent/20'
                    : 'bg-card hover:bg-fill/40 border-border shadow-warm-xs'
                }`}
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading text-sm font-bold text-text truncate">
                      {artist.name}
                    </span>
                    {artist.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <div className="flex items-center gap-1 text-text font-semibold">
                      <Star className="w-3 h-3 fill-star text-star" />
                      <span>{artist.rating.toFixed(2)}</span>
                    </div>
                    <span>•</span>
                    <span className="truncate">{artist.location.split(',')[0]}</span>
                    <span>•</span>
                    <span className="text-accent font-semibold">
                      {artist.packages?.length || 0} Services
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Artist Identity Showcase Strip */}
      <div className="rounded-3xl p-5 sm:p-6 bg-bg-alt border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-warm-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={activeArtist.avatar}
              alt={activeArtist.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-star shadow-warm-md"
            />
            {activeArtist.isVerified && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-card shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-white px-2.5 py-0.5 rounded-full">
                Active Atelier
              </span>
              <span className="text-xs text-text-muted font-mono">{activeArtist.handle}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-text">
              {activeArtist.name}
            </h3>
            <p className="text-xs text-text-muted max-w-xl font-sans line-clamp-2">
              {activeArtist.bio}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text font-sans">
              <span className="flex items-center gap-1 text-success font-semibold">
                <Check className="w-3.5 h-3.5" />
                {activeArtist.hygieneScore}
              </span>
              <span className="text-text-muted">•</span>
              <span className="flex items-center gap-1 text-text-muted">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {activeArtist.location}
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted">{activeArtist.experienceYears}+ years experience</span>
            </div>
          </div>
        </div>

        {onSelectArtistProfile && (
          <button
            type="button"
            onClick={() => onSelectArtistProfile(activeArtist)}
            className="px-4 py-2.5 rounded-xl bg-card hover:bg-fill border border-border text-xs font-semibold text-text hover:text-accent-pressed transition-all shadow-warm-xs shrink-0 flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span>View Full Portfolio &amp; Reviews</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </button>
        )}
      </div>

      {/* 4. Multi-Dimensional Filter Toolbar for the Selected Artist */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search within this artist */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeArtist.name}'s service menu...`}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-warm-xs font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* Service Mode Filter */}
            <div className="flex items-center bg-fill p-1 rounded-xl border border-border shadow-warm-xs text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedMode === 'all'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                All Modes
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('AT_VENUE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedMode === 'AT_VENUE'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>At-Home</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('IN_STUDIO')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedMode === 'IN_STUDIO'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Studio Visit</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3.5 rounded-xl bg-card border border-border text-xs font-semibold text-text focus:outline-none focus:border-accent transition-all cursor-pointer shadow-warm-xs font-sans"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count = categoryCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all cursor-pointer font-sans shrink-0 ${
                  isSelected
                    ? 'bg-accent text-white font-semibold shadow-xs'
                    : 'bg-card hover:bg-fill border border-border text-text hover:text-accent-pressed font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {count !== undefined && (
                  <span
                    className={`text-[11px] font-mono ${
                      isSelected ? 'text-white/90' : 'text-text-muted'
                    }`}
                  >
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Service Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card rounded-3xl border border-border p-8 shadow-warm-xs">
          <Filter className="w-10 h-10 mx-auto text-border" />
          <h4 className="font-heading text-lg font-bold text-text">No matching services found</h4>
          <p className="text-xs text-text-muted max-w-sm mx-auto font-sans">
            No services matched your current category or search criteria for {activeArtist.name}. Try selecting "All Services" or clearing your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedMode('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-pressed transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="group bg-card rounded-3xl border border-border hover:border-accent/40 shadow-warm hover:shadow-warm-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* 1. High-End Editorial Photography Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-fill">
                  <img
                    src={pkg.imageUrl || activeArtist.coverImage}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/20 to-transparent" />

                  {/* Luxury Tag on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-text/75 backdrop-blur-md text-star border border-star/30 shadow-xs">
                      {pkg.isPopular ? 'Most Booked' : pkg.tier}
                    </span>
                  </div>

                  {/* Duration & Service Mode Overlay Pill */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white/95 text-[11px] font-medium z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-text/65 backdrop-blur-md border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-star" />
                      <span className="font-mono">{pkg.durationMinutes} mins</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-text/65 backdrop-blur-md border border-white/10 text-white/90">
                      {pkg.serviceMode === 'IN_STUDIO' ? 'Studio Visit' : 'At-Home Service'}
                    </span>
                  </div>
                </div>

                {/* 2. Card Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg font-bold text-text group-hover:text-accent transition-colors line-clamp-1">
                      {pkg.name}
                    </h4>

                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-sans">
                      {pkg.description}
                    </p>

                    {/* Curated Inclusions Preview */}
                    <div className="pt-2 space-y-1.5 text-xs text-text/90 font-sans">
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-text-muted leading-tight">
                          <span className="text-accent font-bold shrink-0 mt-0.5">•</span>
                          <span className="line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expand/Collapse Formulations */}
                    {pkg.inclusions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                        className="text-[11px] font-semibold text-accent hover:text-accent-pressed flex items-center gap-1 cursor-pointer transition-colors pt-1"
                      >
                        <span>{isExpanded ? 'Hide Extra Details' : `+${pkg.inclusions.length - 2} More Inclusions & Formulations`}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={spatialSpring}
                          className="space-y-2 pt-2 border-t border-border/60 overflow-hidden text-xs"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                            Formulations Used:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {pkg.productsUsed.map((prod, i) => (
                              <span key={i} className="text-[10px] bg-accent-soft px-2 py-0.5 rounded-md text-accent-pressed">
                                {prod}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Pricing & Booking Action */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                        Session Fee
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-text tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleBook(e, pkg)}
                      className="h-10 px-4 rounded-xl bg-accent hover:bg-accent-pressed text-white text-xs font-semibold flex items-center gap-2 shadow-xs hover:shadow-warm transition-all cursor-pointer group/btn"
                    >
                      <span>Book with {activeArtist.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
