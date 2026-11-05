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
      className={`p-3.5 rounded-[16px] bg-card border border-border shadow-warm-sm ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <div className="flex items-center gap-1.5 text-text">
          {isUnlocked ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              <span className="font-bold text-success-text">
                You unlocked {discountPercentage}% package savings!
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>
                Add <span className="font-bold text-accent">₹{remainingAmount}</span> more to save {discountPercentage}%
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-mono text-text-muted">
          ₹{currentTotal}/₹{targetTotal}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 rounded-full bg-fill overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isUnlocked ? 'bg-success' : 'bg-gradient-to-r from-accent to-star'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
