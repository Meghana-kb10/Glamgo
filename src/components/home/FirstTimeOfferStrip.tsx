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
    <section aria-labelledby="first-time-offers-title" className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="first-time-offers-title"
          className="font-serif text-lg sm:text-xl font-bold text-ink"
        >
          Glamgo First-Time Privileges
        </h2>
        {onOpenOffers && (
          <button
            type="button"
            onClick={onOpenOffers}
            className="text-xs font-semibold text-rose-plum hover:text-deep-plum flex items-center gap-1 cursor-pointer"
          >
            <span>All offers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Small Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {FIRST_TIME_OFFERS.map((offer) => {
          const Icon = getIcon(offer.iconName);
          return (
            <div
              key={offer.id}
              onClick={() => {
                if (offer.tag.includes('FIRST20') && onApplyCode) {
                  onApplyCode('FIRST20');
                } else if (onOpenOffers) {
                  onOpenOffers();
                }
              }}
              className="p-4 rounded-2xl bg-white border border-mist shadow-2xs hover:border-rose-plum/30 hover:shadow-xs transition-all flex items-start gap-3.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center text-rose-plum shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-ink group-hover:text-rose-plum transition-colors">
                    {offer.title}
                  </h3>
                  <span className="text-[10px] font-bold text-rose-plum bg-blush/80 px-2 py-0.5 rounded-full shrink-0">
                    {offer.tag}
                  </span>
                </div>
                <p className="text-[11px] text-mauve-grey mt-0.5 leading-snug">
                  {offer.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
