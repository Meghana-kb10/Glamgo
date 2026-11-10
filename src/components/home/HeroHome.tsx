import React from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { StatStrip } from './StatStrip';
import { LocationItem } from '../../services/marketplaceService';
import { AudienceType } from '../../config/marketing';

interface HeroHomeProps {
  currentLocation: LocationItem;
  onOpenSearch: () => void;
  onOpenLocationSheet: () => void;
  onSelectCategory: (categorySlug: string) => void;
  audience: AudienceType;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  currentLocation, onOpenSearch, onOpenLocationSheet, onSelectCategory, audience,
}) => {
  const quickChips = audience === 'kids'
    ? [{ label: 'Haircuts', slug: 'hair' }, { label: 'Spa', slug: 'spa' }]
    : [{ label: 'Facials', slug: 'skin' }, { label: 'Haircuts', slug: 'hair' }, { label: 'Spa', slug: 'spa' }];

  return (
    <section aria-labelledby="home-title" className="pb-5 sm:pb-6">
      <div className="grid lg:grid-cols-2 items-center gap-7 lg:gap-10 rounded-3xl bg-bg-alt p-5 sm:p-8 lg:p-10">
        <div>
          <h1 id="home-title" className="font-heading text-[32px] sm:text-[40px] xl:text-[48px] font-semibold text-text tracking-tight leading-[1.12] max-w-xl">
            Beauty, at your doorstep.
          </h1>
          <p className="mt-5 text-base text-text-muted leading-relaxed max-w-md">
            Book salon, skin and spa care at home. Choose your service, professional and time.
          </p>
          <button type="button" onClick={onOpenLocationSheet} className="mt-4 min-h-11 flex items-center gap-2 text-sm text-text-muted text-left" aria-label={`Change service location, currently ${currentLocation.name}, ${currentLocation.city}`}>
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{currentLocation.name}, {currentLocation.city}</span>
            <span className="underline underline-offset-4 text-text shrink-0">Change</span>
          </button>
          <button type="button" onClick={onOpenSearch} className="mt-5 min-h-12 px-6 py-3 bg-accent text-white rounded-full inline-flex items-center justify-center gap-3 font-semibold text-sm hover:bg-accent-pressed w-full sm:w-auto">
            <Search className="w-4 h-4" />
            Find a service
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex flex-wrap items-center gap-x-4 mt-4">
            <span className="text-sm text-text-muted">Popular:</span>
            {quickChips.map((chip) => <button key={chip.slug} type="button" onClick={() => onSelectCategory(chip.slug)} className="min-h-11 text-sm font-medium text-text underline decoration-border-field underline-offset-4 hover:decoration-text">{chip.label}</button>)}
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl bg-fill aspect-[16/9] lg:aspect-[4/3]">
          <img src="/images/hero-2.webp" alt="A professional applying a facial treatment" width={640} height={800} className="w-full h-full object-cover" loading="eager" decoding="async" />
        </div>
      </div>
      <div className="mt-5"><StatStrip /></div>
    </section>
  );
};
