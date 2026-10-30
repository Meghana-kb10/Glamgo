import React from 'react';
import { Award, PackageCheck, ReceiptText, ShieldCheck, Check } from 'lucide-react';
import { WHY_GLAMGO_POINTS, BRAND_PLACEHOLDERS } from '../../config/marketing';

interface WhyGlamgoStripProps {
  className?: string;
  onOpenSafetyPromise?: () => void;
}

export const WhyGlamgoStrip: React.FC<WhyGlamgoStripProps> = ({
  className = '',
  onOpenSafetyPromise,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Award':
        return Award;
      case 'PackageCheck':
        return PackageCheck;
      case 'ReceiptText':
        return ReceiptText;
      case 'ShieldCheck':
      default:
        return ShieldCheck;
    }
  };

  return (
    <section aria-labelledby="why-glamgo-title" className={`py-8 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            The Glamgo Standard
          </span>
          <h2
            id="why-glamgo-title"
            className="font-serif text-xl sm:text-2xl font-bold text-ink"
          >
            Why Glamgo
          </h2>
        </div>
        {onOpenSafetyPromise && (
          <button
            type="button"
            onClick={onOpenSafetyPromise}
            className="text-xs font-semibold text-rose-plum hover:text-deep-plum cursor-pointer"
          >
            Read our 7-point safety protocol →
          </button>
        )}
      </div>

      {/* 4 Icon Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHY_GLAMGO_POINTS.map((card) => {
          const Icon = getIcon(card.iconName);
          return (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-white border border-mist shadow-2xs hover:shadow-card hover:border-rose-plum/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center text-rose-plum mb-3.5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-ink mb-1.5 leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-mauve-grey leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-mist/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{card.bullet}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Products we use" Strip of Neutral Grey Box Placeholders */}
      <div className="mt-8 pt-6 border-t border-mist/80">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mauve-grey block">
            Products We Use
          </span>
          <p className="text-xs text-mauve-grey mt-0.5">
            Only genuine, salon-exclusive formulations in sealed single-use units
          </p>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-4">
          {BRAND_PLACEHOLDERS.map((brand) => (
            <div
              key={brand.id}
              title={`${brand.name} - ${brand.description}`}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 border border-gray-200/90 text-gray-700 font-medium text-xs tracking-tight transition-colors flex items-center gap-2 select-none"
            >
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="font-heading font-semibold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
