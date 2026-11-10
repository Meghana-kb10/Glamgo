import React from 'react';
import { Percent, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { FIRST_TIME_OFFERS } from '../../config/marketing';

interface FirstTimeOfferStripProps {
  onOpenOffers?: () => void;
  onApplyCode?: (code: string) => void;
}

export const FirstTimeOfferStrip: React.FC<FirstTimeOfferStripProps> = ({
  onOpenOffers,
  onApplyCode,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Percent':
        return Percent;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'CreditCard':
      default:
        return CreditCard;
    }
  };

  return (
    <section aria-labelledby="first-time-offers-title" className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2
          id="first-time-offers-title"
          className="font-serif text-lg sm:text-xl font-bold text-text"
        >
          Your first booking
        </h2>
        {onOpenOffers && (
          <button
            type="button"
            onClick={onOpenOffers}
            className="text-xs font-semibold text-accent hover:text-accent-pressed flex items-center gap-1 cursor-pointer"
          >
            <span>All offers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Small Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {FIRST_TIME_OFFERS.map((offer) => {
          const Icon = getIcon(offer.iconName);
          return (
            <button
              type="button"
              key={offer.id}
              onClick={() => {
                if (offer.tag.includes('FIRST20') && onApplyCode) {
                  onApplyCode('FIRST20');
                } else if (onOpenOffers) {
                  onOpenOffers();
                }
              }}
              className="p-4 sm:p-5 rounded-[18px] bg-card border border-border shadow-warm-card hover:border-accent/40 hover:shadow-warm-md transition-all text-left flex items-start gap-3.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-fill flex items-center justify-center text-accent-pressed shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-text group-hover:text-accent transition-colors">
                    {offer.title}
                  </h3>
                  <span className="text-xs font-semibold text-accent-pressed bg-accent-soft px-2.5 py-0.5 rounded-full shrink-0 border border-accent/20">
                    {offer.tag}
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {offer.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
