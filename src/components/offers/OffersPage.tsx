import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, Check, ArrowLeft, Percent, ShieldCheck, Sparkles } from 'lucide-react';
import { COUPONS_DATA, CouponItem } from '../../config/marketing';

interface OffersPageProps {
  onBackToHome: () => void;
  onApplyCoupon: (code: string) => void;
}

type OfferTab = 'for_you' | 'bank_upi' | 'packages';

export const OffersPage: React.FC<OffersPageProps> = ({
  onBackToHome,
  onApplyCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<OfferTab>('for_you');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCoupons = COUPONS_DATA.filter((c) => c.tab === activeTab);

  const handleCopy = (code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg pb-28 pt-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Back Nav & Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent">
              <Tag className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">
              Offers &amp; Exclusive Privileges
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            Apply valid coupon codes at checkout for instant discounts and bank cashbacks.
          </p>
        </div>

        {/* 3 Tabs: For you | Bank & UPI | Packages */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-card border border-border shadow-warm-xs mb-6 w-fit">
          {[
            { id: 'for_you' as OfferTab, label: 'For you' },
            { id: 'bank_upi' as OfferTab, label: 'Bank & UPI' },
            { id: 'packages' as OfferTab, label: 'Packages' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isSelected ? 'text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="offers-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-accent shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.id}
                className="p-5 rounded-2xl bg-card border border-border shadow-warm-xs hover:shadow-warm hover:border-accent/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Coupon Code Badge + Copy */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm tracking-wider px-3 py-1 rounded-lg bg-accent-soft text-accent-pressed border border-accent/20">
                        {coupon.code}
                      </span>
                      {coupon.isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-star/20 text-text">
                          Popular
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-success/10 text-success'
                          : 'hover:bg-fill text-text-muted hover:text-text'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success animate-scale" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-bold text-base text-text mb-1">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-3">
                    {coupon.description}
                  </p>

                  {/* Terms summary */}
                  <div className="space-y-1 text-[11px] text-text-muted pt-1">
                    {coupon.terms.map((term, i) => (
                      <p key={i}>• {term}</p>
                    ))}
                  </div>
                </div>

                {/* Footer with expiry and Apply CTA */}
                <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-text-muted font-mono">
                    {coupon.expiryDate}
                  </span>

                  <button
                    type="button"
                    onClick={() => onApplyCoupon(coupon.code)}
                    className="px-4 py-1.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-pressed transition-all shadow-xs cursor-pointer"
                  >
                    Apply at checkout
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
