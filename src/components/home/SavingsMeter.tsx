import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SavingsMeterProps {
  currentTotal: number;
  targetTotal?: number;
  discountPercentage?: number;
  className?: string;
}

export const SavingsMeter: React.FC<SavingsMeterProps> = ({
  currentTotal,
  targetTotal = 1500,
  discountPercentage = 15,
  className = '',
}) => {
  const isUnlocked = currentTotal >= targetTotal;
  const progressRatio = Math.min(1, currentTotal / targetTotal);
  const progressPercent = Math.round(progressRatio * 100);
  const remainingAmount = Math.max(0, targetTotal - currentTotal);

  return (
    <div
      role="region"
      aria-label="Package savings progress"
      className={`p-3 rounded-xl bg-blush/60 border border-rose-plum/20 ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
        <div className="flex items-center gap-1.5 text-ink">
          {isUnlocked ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-700">
                You unlocked {discountPercentage}% package savings!
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-rose-plum shrink-0" />
              <span>
                Add <span className="font-bold text-rose-plum">₹{remainingAmount}</span> more to save {discountPercentage}%
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-mono text-mauve-grey">
          ₹{currentTotal}/₹{targetTotal}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 rounded-full bg-mist/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isUnlocked ? 'bg-emerald-500' : 'bg-gradient-to-r from-rose-plum to-champagne-gold'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
