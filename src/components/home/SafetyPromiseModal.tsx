import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, Lock, Award, PackageCheck, Thermometer } from 'lucide-react';

interface SafetyPromiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAFETY_PILLARS = [
  {
    icon: Award,
    title: '3-Stage Skill & Background Vetting',
    desc: 'Each beauty professional undergoes criminal background checks, Aadhaar verification, and hands-on trade testing by veteran master trainers.',
  },
  {
    icon: PackageCheck,
    title: 'Sealed Mono-Dose Sachets',
    desc: 'All waxes, facial serums, and scrubs are packaged in single-use sealed sachets and cartridges. Opened exclusively in front of the customer.',
  },
  {
    icon: Lock,
    title: 'Start OTP Verification',
    desc: 'Your professional will share a unique 4-digit start OTP upon arrival. No job begins without two-way customer verification.',
  },
  {
    icon: ShieldCheck,
    title: 'Hospital-Grade Autoclave Sterilization',
    desc: 'Metal tools, cuticle pushers, and scissors are sealed in sterilization pouches following medical autoclaving standards.',
  },
  {
    icon: Thermometer,
    title: 'Temperature & Hygiene Protocols',
    desc: 'Daily health checks, sanitization of beauty caddies, and clean disposable mats, capes, and bedsheets provided for every appointment.',
  },
  {
    icon: CheckCircle2,
    title: 'Zero Mess Post-Service Cleanup',
    desc: 'Professionals bring biodegradable trash disposal bags and leave your living room, vanity table, and bathroom completely spotless.',
  },
];

export const SafetyPromiseModal: React.FC<SafetyPromiseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/50 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-mist">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Our Safety Promise</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Haute Beauté Hygiene &amp; Trust Protocol
              </h2>
              <p className="text-xs text-mauve-grey mt-0.5">
                Every service adheres to hospital-grade sterilization and sealed authentic formulas.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close safety promise modal"
              className="w-8 h-8 rounded-full bg-soft-ivory hover:bg-blush flex items-center justify-center text-ink transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Safety Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {SAFETY_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-soft-ivory border border-mist/80 space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-blush flex items-center justify-center text-rose-plum">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-ink">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-mauve-grey leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-mauve-grey">
              Questions? Our safety escalation desk is active 24/7.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-plum text-white font-bold hover:bg-deep-plum transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
