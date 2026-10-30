import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, PackageCheck, Clock, Award, CheckCircle2, X, Sparkles, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { spatialSpring } from '../../constants/motion';

export const TrustStrip: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const trustItems = [
    {
      icon: PackageCheck,
      title: 'Sealed Mono-Dose Kits',
      badge: 'Zero Adulteration',
      description: '100% genuine single-use sealed packs opened in front of you. Never decanted.',
      bg: '#FFF0F5',
      border: '#FAD2E1',
      iconBg: '#FCE7F0',
      iconColor: '#B8336A',
      details: [
        'Each treatment uses an individual factory-sealed mono-dose pack with manufacturer hologram.',
        'You inspect the barcode, packaging seal, and expiry date before the professional opens it.',
        'Zero reuse of wax cartridges, facial ampoules, sponges, or nail files.',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Roll-Out Clean Station',
      badge: 'Mess-Free Cleanup',
      description: 'Disposable floor sheet, bed roll & sanitized tools. We leave your home spotless.',
      bg: '#F0F8F4',
      border: '#D4EEDF',
      iconBg: '#E1F3EA',
      iconColor: '#1A7F54',
      details: [
        'Professional rolls out disposable protective mats over your bed, floor, and tabletop.',
        'All metal instruments undergo hospital-grade ultrasonic and autoclave sterilization.',
        'After service completion, the artist collects every single disposable and wipes the area clean.',
      ],
    },
    {
      icon: Clock,
      title: 'Punctuality Guarantee',
      badge: 'On-Time Arrival',
      description: 'Artist arrives on time or you receive ₹500 instant wallet credit. Free rescheduling.',
      bg: '#FFF8EE',
      border: '#FDE3C8',
      iconBg: '#FEF0DB',
      iconColor: '#C26E23',
      details: [
        'Live GPS arrival tracking and check-in OTP verification upon arrival.',
        'If the artist is more than 15 minutes late without prior consent, ₹500 is credited automatically.',
        'Free rescheduling or cancellation up to 2 hours before the scheduled time slot.',
      ],
    },
    {
      icon: Award,
      title: 'Top 1% Certified Pros',
      badge: 'Background Checked',
      description: 'Rigorous 3-stage police background verification & high-end bridal certification.',
      bg: '#FAF5EC',
      border: '#F3E4CD',
      iconBg: '#F6EBDA',
      iconColor: '#A0751A',
      details: [
        'Government Aadhaar & criminal background check verified by third-party authorities.',
        'Mandatory 50+ hours of advanced practical luxury and hygiene masterclasses.',
        'Covered by Glamgo ₹10,000 accidental property damage and spillage protection policy.',
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Eyebrow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-mist pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-plum bg-blush px-2.5 py-0.5 rounded-full inline-block mb-1">
            Glamgo Gold Standard Assurance
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
            The Glamgo Luxury Salon &amp; Hygiene Promise
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setActiveItemIndex(0);
            setIsModalOpen(true);
          }}
          className="text-xs font-semibold text-rose-plum hover:text-deep-plum flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <span>View 7-Point Hygiene Protocol</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                setActiveItemIndex(idx);
                setIsModalOpen(true);
              }}
              className="p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury border cursor-pointer group"
              style={{
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: item.iconBg,
                    color: item.iconColor,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-black/5 text-ink">
                  {item.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink font-sans group-hover:text-rose-plum transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-mauve-grey leading-relaxed mt-1 font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-ink group-hover:text-rose-plum">
                <span>Learn how it works</span>
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Hygiene Protocol Inspection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={spatialSpring}
              className="relative w-full max-w-xl bg-white rounded-3xl border border-mist shadow-2xl overflow-hidden z-10 p-6 sm:p-7 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-mist pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-rose-plum">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ink">
                      7-Point Salon Hygiene &amp; Quality Promise
                    </h3>
                    <p className="text-xs text-mauve-grey">
                      Certified hospital-grade sterilization and sealed single-use kit guarantee
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-mist/30 text-mauve-grey hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Protocol Highlights */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {trustItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      activeItemIndex === idx
                        ? 'bg-blush/30 border-rose-plum shadow-xs'
                        : 'bg-soft-ivory/60 border-mist'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-rose-plum" />
                        <h4 className="font-sans text-xs sm:text-sm font-bold text-ink">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-mauve-grey font-sans">
                      {item.details.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-ink/80">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-mist flex items-center justify-between text-xs text-mauve-grey">
                <span>Backed by ₹10,000 property protection</span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-rose-plum text-white font-semibold text-xs hover:bg-deep-plum transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
