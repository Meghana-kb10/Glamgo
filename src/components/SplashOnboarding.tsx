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
    icon: <Sparkles className="w-5 h-5 text-champagne-gold" />,
    tag: 'Haute Artistry',
  },
  {
    title: 'Transparent prices. Verified pros.',
    subtitle: 'Background-checked stylists, 100% sealed single-use hygiene kits, and zero hidden charges.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80&fm=webp',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
    tag: 'Safe & Hygienic',
  },
  {
    title: 'Book in under a minute',
    subtitle: 'Pick your bespoke service, select a real-time slot, and enjoy seamless luxury with instant confirmation.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80&fm=webp',
    icon: <Clock className="w-5 h-5 text-rose-plum" />,
    tag: 'Instant Scheduling',
  },
];

const ONBOARDING_STORAGE_KEY = 'glamgo_onboarding_completed';

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'SPLASH' | 'ONBOARDING' | 'DONE'>('DONE');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!hasCompleted) {
        setPhase('SPLASH');
        const timer = setTimeout(() => {
          setPhase('ONBOARDING');
        }, 850); // <= 1.5s splash
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is unavailable, proceed normally
      setPhase('DONE');
    }
  }, []);

  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Could not persist onboarding state to localStorage', e);
    }
    setPhase('DONE');
    onComplete?.();
  };

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  if (phase === 'DONE') return null;

  return (
    <AnimatePresence>
      {/* 1. Splash Screen (<= 1.5s) */}
      {phase === 'SPLASH' && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-soft-ivory p-6 text-center select-none"
          role="dialog"
          aria-label="Glamgo Welcome Splash"
        >
          {/* Subtle Ambient Blush Radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blush/40 via-soft-ivory to-soft-ivory pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-plum via-deep-plum to-champagne-gold flex items-center justify-center text-white shadow-xl mb-4">
              <Sparkles className="w-8 h-8" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink">
              Glamgo
            </h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-mauve-grey font-medium font-sans border-t border-mist/80 pt-2 px-4">
              Luxury Beauty Atelier at Your Doorstep
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-10 flex items-center gap-2 text-xs text-mauve-grey font-sans"
          >
            <span className="w-2 h-2 rounded-full bg-rose-plum animate-ping" />
            <span>Curating private beauty suites...</span>
          </motion.div>
        </motion.div>
      )}

      {/* 2. Three-Slide Skippable Onboarding Carousel */}
      {phase === 'ONBOARDING' && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-md p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome Onboarding"
        >
          <div className="relative w-full max-w-md bg-soft-ivory border border-mist rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Top Bar with Brand and Skip Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-mist/60 bg-white/70 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold text-ink">Glamgo</span>
                <span className="text-xs text-rose-plum font-sans font-medium px-2 py-0.5 rounded-full bg-blush">
                  {ONBOARDING_SLIDES[currentSlide].tag}
                </span>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                aria-label="Skip onboarding"
                className="text-xs font-semibold text-mauve-grey hover:text-ink px-3 py-1.5 rounded-lg hover:bg-mist/40 transition-colors cursor-pointer min-h-[44px] flex items-center"
              >
                Skip
              </button>
            </div>

            {/* Slide Hero Image */}
            <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-mist/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={ONBOARDING_SLIDES[currentSlide].image}
                  alt={ONBOARDING_SLIDES[currentSlide].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-soft-ivory via-transparent to-black/15 pointer-events-none" />
            </div>

            {/* Content & Typography */}
            <div className="px-6 pt-5 pb-6 flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center min-h-[110px]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center mb-3">
                    {ONBOARDING_SLIDES[currentSlide].icon}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    {ONBOARDING_SLIDES[currentSlide].title}
                  </h2>
                  <p className="mt-2 text-sm text-mauve-grey font-sans leading-relaxed max-w-sm">
                    {ONBOARDING_SLIDES[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators */}
              <div
                className="flex items-center justify-center gap-1 my-3"
                role="tablist"
                aria-label="Onboarding slide indicators"
              >
                {ONBOARDING_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    role="tab"
                    aria-selected={currentSlide === idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum rounded-full"
                  >
                    <span
                      className={`h-2 rounded-full transition-all duration-300 block ${
                        currentSlide === idx ? 'w-8 bg-rose-plum' : 'w-2 bg-mist hover:bg-mauve-grey/50'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Action */}
              <div className="w-full mt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  rightIcon={
                    currentSlide === ONBOARDING_SLIDES.length - 1 ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                >
                  {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Start Exploring' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
