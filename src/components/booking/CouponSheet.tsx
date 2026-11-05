import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Check, AlertCircle, X, Sparkles, ArrowRight } from 'lucide-react';
import { AVAILABLE_COUPONS, Coupon, couponService } from '../../services/couponService';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';

interface CouponSheetProps {
  isOpen: boolean;
  onClose: () => void;
  orderSubtotal: number;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon, discount: number) => void;
  onRemoveCoupon: () => void;
}

export const CouponSheet: React.FC<CouponSheetProps> = ({
  isOpen,
  onClose,
  orderSubtotal,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleApply = (codeToApply: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = couponService.validateCoupon(codeToApply, orderSubtotal);
    if (res.valid && res.coupon) {
      onApplyCoupon(res.coupon, res.discount);
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error || 'Coupon cannot be applied');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Apply Coupon & Offers">
      <div className="space-y-4 pb-4">
        {/* Manual Coupon Code Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Enter Promo Code
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value.toUpperCase());
                  setErrorMsg(null);
                }}
                placeholder="e.g. GLAM100"
                className="w-full h-11 px-3.5 text-sm font-semibold uppercase tracking-wider text-text bg-card border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-text-muted/50 placeholder:normal-case"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!manualCode.trim()}
              onClick={() => handleApply(manualCode)}
            >
              Apply
            </Button>
          </div>

          {errorMsg && (
            <p className="mt-1.5 text-xs text-error flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}

          {successMsg && (
            <p className="mt-1.5 text-xs text-success flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>{successMsg}</span>
            </p>
          )}
        </div>

        {/* Currently Applied Coupon Banner */}
        {appliedCoupon && (
          <div className="p-3.5 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-text tracking-wide">
                  {appliedCoupon.code} Applied
                </p>
                <p className="text-[11px] text-text-muted">
                  {appliedCoupon.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs font-semibold text-error hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        {/* Available Coupons List */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
            Available Offers for You
          </h4>

          <div className="space-y-2.5">
            {AVAILABLE_COUPONS.map((coupon) => {
              const isEligible = orderSubtotal >= coupon.minOrderValue;
              const isCurrent = appliedCoupon?.code === coupon.code;

              return (
                <div
                  key={coupon.code}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                      : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-accent-soft text-accent border border-accent/20">
                          {coupon.code}
                        </span>
                        {coupon.tag && (
                          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                            {coupon.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-text">{coupon.title}</p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed font-sans">
                        {coupon.description}
                      </p>
                      <p className="text-[10px] text-text-muted/80 mt-1 font-sans">
                        Min. booking value: ₹{coupon.minOrderValue.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      {isCurrent ? (
                        <span className="text-xs font-semibold text-success flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant={isEligible ? 'secondary' : 'ghost'}
                          size="sm"
                          disabled={!isEligible}
                          onClick={() => handleApply(coupon.code)}
                        >
                          {isEligible ? 'Apply' : 'Not Eligible'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
