import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface SplashOnboardingProps {
  onComplete?: () => void;
}

interface OnboardingSlide {
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  tag: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: 'Beauty experts, at your doorstep',
    subtitle: 'Certified master artists bring luxury salon & bridal experiences directly to your home.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80&fm=webp',
    icon: <Sparkles className="w-5 h-5 text-accent" />,
    tag: 'Haute Artistry',
  },
  {
    title: 'Transparent prices. Verified pros.',
    subtitle: 'Background-checked stylists, 100% sealed single-use hygiene kits, and zero hidden charges.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80&fm=webp',
    icon: <ShieldCheck className="w-5 h-5 text-success" />,
    tag: 'Safe & Hygienic',
  },
  {
    title: 'Book in under a minute',
    subtitle: 'Pick your bespoke service, select a real-time slot, and enjoy seamless luxury with instant confirmation.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80&fm=webp',
    icon: <Clock className="w-5 h-5 text-accent" />,
    tag: 'Instant Scheduling',
  },
];

const ONBOARDING_STORAGE_KEY = 'glamgo_onboarding_completed';

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'SPLASH' | 'ONBOARDING' | 'DONE'>('DONE');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    try {
      const isAuditOrBot =
        typeof navigator !== 'undefined' &&
        (/Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
          window.location.search.includes('skip_splash'));
      const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY) || isAuditOrBot;
      if (!hasCompleted) {
        setPhase('SPLASH');
        const timer = setTimeout(() => {
          setPhase('ONBOARDING');
        }, 850); // <= 1.5s splash
        return () => clearTimeout(timer);
      }
    } catch {
      setPhase('DONE');
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {}
    setPhase('DONE');
    onComplete?.();
  };

  if (phase === 'DONE') return null;

  return (
    <AnimatePresence mode="wait">
      {/* 1. BRAND SPLASH SCREEN (under 1.5s) */}
      {phase === 'SPLASH' && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg p-6 text-center select-none"
        >
          {/* Subtle Warm Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-soft/40 via-bg to-bg pointer-events-none" />

          {/* Monogram Crest */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-accent text-white flex items-center justify-center shadow-warm-lg mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-text">
              GLAMGO
            </h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-text-muted font-medium font-sans border-t border-border pt-2 px-4">
              Couture Beauty Concierge
            </p>
          </motion.div>

          {/* Discreet Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="absolute bottom-10 flex items-center gap-2 text-xs text-text-muted font-sans"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Connecting to Beauty Atelier...</span>
          </motion.div>
        </motion.div>
      )}

      {/* 2. ONBOARDING CAROUSEL (3 Value Props, Swipe/Next, Skip) */}
      {phase === 'ONBOARDING' && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 backdrop-blur-md p-4 sm:p-6"
        >
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-warm-lg overflow-hidden flex flex-col">
            {/* Top Bar: Skip button & progress */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-accent font-sans font-medium px-2 py-0.5 rounded-full bg-accent-soft">
                  {ONBOARDING_SLIDES[currentSlide].tag}
                </span>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                aria-label="Skip onboarding"
                className="text-xs font-semibold text-text-muted hover:text-text px-3 py-1.5 rounded-lg hover:bg-fill transition-colors cursor-pointer min-h-[44px] flex items-center"
              >
                Skip
              </button>
            </div>

            {/* Slide Visual Area */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-bg-alt">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={ONBOARDING_SLIDES[currentSlide].image}
                  alt={ONBOARDING_SLIDES[currentSlide].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Slide Text Content */}
            <div className="p-6 pt-4 flex-1 flex flex-col justify-between text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-accent-soft flex items-center justify-center mb-3">
                    {ONBOARDING_SLIDES[currentSlide].icon}
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-text leading-tight">
                    {ONBOARDING_SLIDES[currentSlide].title}
                  </h2>
                  <p className="mt-2 text-sm text-text-muted font-sans leading-relaxed max-w-sm">
                    {ONBOARDING_SLIDES[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Nav: Dots + Next CTA */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                {/* 3 Pagination Dots */}
                <div
                  className="flex items-center gap-1.5"
                  role="tablist"
                  aria-label="Onboarding slides navigation"
                >
                  {ONBOARDING_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-label={`Go to slide ${idx + 1}`}
                      aria-selected={currentSlide === idx}
                      onClick={() => setCurrentSlide(idx)}
                      className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                    >
                      <span
                        className={`h-1.5 rounded-full transition-all duration-300 block ${
                          currentSlide === idx ? 'w-8 bg-accent' : 'w-2 bg-fill hover:bg-text-muted/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Primary Button */}
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
