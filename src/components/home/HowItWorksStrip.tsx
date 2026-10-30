import React from 'react';
import { Sparkles, Calendar, Home } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../config/marketing';

interface HowItWorksStripProps {
  className?: string;
}

export const HowItWorksStrip: React.FC<HowItWorksStripProps> = ({ className = '' }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return Sparkles;
      case 'Calendar':
        return Calendar;
      case 'Home':
      default:
        return Home;
    }
  };

  return (
    <section aria-labelledby="how-it-works-title" className={`py-8 ${className}`}>
      <div className="text-center mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
          Simple &amp; Seamless Experience
        </span>
        <h2
          id="how-it-works-title"
          className="font-serif text-xl sm:text-2xl font-bold text-ink"
        >
          How It Works
        </h2>
        <p className="text-xs sm:text-sm text-mauve-grey mt-0.5 max-w-md mx-auto">
          Delivering salon perfection to your doorstep in three easy steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
        {HOW_IT_WORKS_STEPS.map((stepItem, index) => {
          const Icon = getIcon(stepItem.iconName);
          return (
            <div
              key={stepItem.step}
              className="p-6 rounded-2xl bg-white border border-mist shadow-2xs hover:shadow-card hover:border-rose-plum/30 transition-all text-center flex flex-col items-center"
            >
              {/* Step Number Badge */}
              <div className="w-12 h-12 rounded-2xl bg-blush text-rose-plum font-bold flex items-center justify-center mb-4 relative shadow-2xs">
                <Icon className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-plum text-white text-[10px] font-mono flex items-center justify-center shadow-xs">
                  {stepItem.step}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-ink mb-1">
                {stepItem.title}
              </h3>
              <p className="text-xs font-semibold text-rose-plum mb-2">
                {stepItem.subtitle}
              </p>
              <p className="text-xs text-mauve-grey leading-relaxed">
                {stepItem.details}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
