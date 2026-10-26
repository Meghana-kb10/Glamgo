import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Package,
  Heart,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Compass,
  Zap,
  Sliders,
  Printer,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  X,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { PortalType, MarketplaceMode } from '../types';
import {
  MOTION_PRIMITIVES,
  SPRINGS,
  snappySpring,
  spatialSpring,
  gentleFloat,
  tapScale,
  hoverElevate
} from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { MOCK_ARTISTS, MOCK_PRODUCTS } from '../data/mockData';
import { subscribeBackendStatus } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface ShowcaseLandingPageProps {
  onNavigatePortal: (portal: PortalType) => void;
  onExploreMarketplace: (mode: MarketplaceMode) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const ShowcaseLandingPage: React.FC<ShowcaseLandingPageProps> = ({
  onNavigatePortal,
  onExploreMarketplace,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dual-mode backend health status
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  useEffect(() => {
    return subscribeBackendStatus((live) => setIsLiveBackend(live));
  }, []);

  // Motion Lab Tab State (Disciplines 1 - 5)
  const [activeLabTab, setActiveLabTab] = useState<'discipline1' | 'discipline2' | 'discipline3' | 'discipline4' | 'discipline5'>('discipline1');

  // Discipline 1 Interactive States
  const [heartLiked, setHeartLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [btnState, setBtnState] = useState<'idle' | 'loading' | 'confirmed'>('idle');
  const [morphMode, setMorphMode] = useState<'artists' | 'products'>('artists');

  // Discipline 2 Interactive States
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [miniModalOpen, setMiniModalOpen] = useState(false);

  // Discipline 3 Interactive States
  const [simulatedSeconds, setSimulatedSeconds] = useState(600); // 10 mins
  const [skeletonPreview, setSkeletonPreview] = useState(false);

  // Discipline 4 Interactive States
  const [shakeTriggered, setShakeTriggered] = useState(false);
  const [staggerKey, setStaggerKey] = useState(0);

  // Handlers for Discipline 1
  const handleHeartClick = (e: React.MouseEvent) => {
    const nextState = !heartLiked;
    setHeartLiked(nextState);
    setLikeCount((prev) => (nextState ? prev + 1 : prev - 1));
    if (nextState) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      triggerChampagneSparkles(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight
      );
    }
  };

  const handleActionBtnClick = () => {
    if (btnState !== 'idle') return;
    setBtnState('loading');
    setTimeout(() => {
      setBtnState('confirmed');
      setTimeout(() => setBtnState('idle'), 2200);
    }, 850);
  };

  // Discipline 4 Shake Trigger
  const triggerShake = () => {
    setShakeTriggered(true);
    setTimeout(() => setShakeTriggered(false), 450);
  };

  // Radial progress calculations for Discipline 3
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (600 - simulatedSeconds) / 600;
  const strokeDashoffset = circumference * progressPercent;

  return (
    <div className="min-h-screen bg-canvas-light text-obsidian overflow-x-hidden selection:bg-rose-blush selection:text-obsidian pb-24">
      
      {/* --------------------------------------------------------------------- */}
      {/* 1. STICKY TOP CONTROL STRIP                                           */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 px-6 sm:px-12 py-4 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-obsidian text-white flex items-center justify-center font-serif font-bold text-lg">
              G
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-obsidian tracking-tight block leading-none">
                Glamgo
              </span>
              <span className="text-sm font-sans text-obsidian-muted font-semibold">
                Haute Beauté
              </span>
            </div>
          </div>

          {/* Desktop Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-obsidian-muted">
            <a
              href="#architecture"
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-md px-2 py-1"
            >
              Architecture
            </a>
            <a
              href="#motion-lab"
              className="hover:text-obsidian transition-colors flex items-center gap-1.5 text-rose-dark focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-md px-2 py-1"
            >
              <Sparkles className="w-4 h-4 text-rose-dark" />
              <span>5 Motion Disciplines</span>
            </a>
            <a
              href="#portals"
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-md px-2 py-1"
            >
              The 4 Portals
            </a>
            <a
              href="#concurrency"
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded-md px-2 py-1"
            >
              Concurrency Guard
            </a>
          </nav>

          {/* Live Engine Indicator, Auth & Enter CTA */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold ${
                isLiveBackend
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-surface-cream text-obsidian'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-400' : 'bg-rose-dark'}`} />
              <span>{isLiveBackend ? 'PostGIS & Redis Live' : 'Simulated DB'}</span>
            </div>

            {/* User Session Pill or Sign In */}
            {user ? (
              <div className="relative">
                <motion.button
                  type="button"
                  whileTap={tapScale}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-surface-cream border border-rose-gold/30 hover:border-rose-gold/60 text-obsidian text-sm font-medium transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-obsidian text-amber-100 flex items-center justify-center font-serif text-xs font-semibold">
                    {user.fullName ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                  <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-white text-stone-700">
                    {user.roles?.[0] || 'MEMBER'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={snappySpring}
                      className="absolute right-0 mt-2 w-60 bg-white border border-stone-200/90 rounded-2xl shadow-xl p-3 z-50 text-left"
                    >
                      <div className="pb-2.5 border-b border-stone-100 px-2 pt-1">
                        <p className="text-sm font-semibold text-stone-900 truncate">{user.fullName}</p>
                        <p className="text-[13px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                type="button"
                whileHover={hoverElevate}
                whileTap={tapScale}
                transition={snappySpring}
                onClick={() => onOpenAuth?.('login')}
                className="px-4 py-2 rounded-full bg-surface-cream hover:bg-surface-hover text-obsidian text-sm font-medium border border-rose-gold/25 transition-colors cursor-pointer"
              >
                <span>Sign In</span>
              </motion.button>
            )}

            <motion.button
              whileHover={hoverElevate}
              whileTap={tapScale}
              onClick={() => onNavigatePortal('customer')}
              className="px-5 py-2.5 rounded-full bg-obsidian hover:bg-obsidian-deep text-white text-sm font-semibold flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
            >
              <span>Launch Marketplace</span>
              <ArrowRight className="w-4 h-4 text-champagne-light" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 2. EDITORIAL HERO SECTION WITH SPLIT PHOTOGRAPHY                     */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-canvas-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Narrative Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="lg:col-span-7 space-y-5"
            >
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] font-bold tracking-tight text-obsidian leading-[0.98] [text-wrap:balance]">
                Haute Beauté &amp; Zero Collision
              </h1>

              <p className="text-base text-obsidian-muted max-w-[55ch] font-normal leading-relaxed [text-wrap:pretty]">
                Glamgo connects discerning brides with verified celebrity artists and backstage formulations under a single luxury umbrella. Protected by real-time PostGIS 25km spatial routing, atomic Redis 7 Redlock reservation, and mathematical PostgreSQL 16 GiST exclusion.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={hoverElevate}
                  whileTap={tapScale}
                  onClick={() => onNavigatePortal('customer')}
                  className="px-8 py-3.5 rounded-full bg-obsidian hover:bg-obsidian-deep text-white text-sm font-semibold flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
                >
                  <span>Explore Customer Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-champagne-light" />
                </motion.button>

                <motion.button
                  whileHover={hoverElevate}
                  whileTap={tapScale}
                  onClick={() => onNavigatePortal('admin')}
                  className="px-7 py-3.5 rounded-full bg-surface-cream hover:bg-surface-hover text-obsidian text-sm font-semibold flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-dark" />
                  <span>Admin Concurrency Telemetry</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Editorial Photograph Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spatialSpring}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-surface-cream">
                <img
                  src={MOCK_ARTISTS[0].coverImage}
                  alt="Haute bridal makeover artistry by Tanya Grewal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/25 to-transparent flex flex-col justify-end p-8 text-white">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white [text-wrap:balance]">
                    Tanya Grewal Artistry
                  </h2>
                  <p className="text-sm text-white/90 mt-1">
                    Celebrity Atelier Master • Vogue Featured • 124 Royal Brides
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Typographic Metrics Statement Bar (Tonal background, zero hairlines) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spatialSpring}
            className="mt-10 w-full rounded-3xl bg-surface-cream p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          >
            {[
              { val: '5', label: 'Verified MUAs', color: 'text-obsidian' },
              { val: '23', label: 'Backstage Formulations', color: 'text-obsidian' },
              { val: '600s', label: 'Redis 7 Redlock', color: 'text-obsidian' },
              { val: '347ms', label: 'PostGIS p95 Routing', color: 'text-emerald-800' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spatialSpring, delay: i * 0.08 }}
              >
                <span className={`text-3xl font-bold ${stat.color} block`}>{stat.val}</span>
                <span className="text-sm font-medium text-obsidian-muted block mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* 3. THE 5-PILLAR MOTION LABORATORY                                     */}
      {/* --------------------------------------------------------------------- */}
      <motion.section
        id="motion-lab"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={spatialSpring}
        className="py-16 px-6 sm:px-10 max-w-7xl mx-auto space-y-12 scroll-mt-28"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian [text-wrap:balance]">
            The 5 Pillars of Natural UI Motion
          </h2>
          <p className="text-base text-obsidian-muted leading-relaxed max-w-[62ch] mx-auto [text-wrap:pretty]">
            Eliminating robotic transitions and cartoonish bounce in favor of Apple and Linear-grade spring physics, spatial layout continuity, and tactile resistance.
          </p>
        </div>

        {/* Tab Navigation for the 5 Disciplines (Wraps cleanly without clipping) */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-3xl sm:rounded-full bg-surface-cream max-w-4xl mx-auto">
          {[
            { id: 'discipline1', label: '1. Feedback & States' },
            { id: 'discipline2', label: '2. Navigation & Structure' },
            { id: 'discipline3', label: '3. Progress & Status' },
            { id: 'discipline4', label: '4. Focus & Guidance' },
            { id: 'discipline5', label: '5. Spatial Depth & Drag' },
          ].map((tab) => {
            const isActive = activeLabTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLabTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors select-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                  isActive ? 'bg-obsidian text-white' : 'text-obsidian hover:text-rose-dark'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Demonstrator Surface */}
        <div className="mt-8 space-y-8">
          
          {/* DISCIPLINE 1: FEEDBACK & STATE INTERACTIONS */}
          {activeLabTab === 'discipline1' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl font-bold text-obsidian [text-wrap:balance]">
                  Kinetic Feedback &amp; Tactile Press
                </h3>
                <p className="text-base text-obsidian-muted mt-2 max-w-[60ch] mx-auto [text-wrap:pretty]">
                  Every user interaction provides immediate, tangible feedback with sub-180ms damped spring settling and tactile resistance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* 1. Micro-Interaction Wishlist Heart */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between items-center text-center space-y-5">
                  <div>
                    <span className="text-base font-bold text-obsidian block">Elastic Heart Pop &amp; Confetti</span>
                    <span className="text-sm text-obsidian-muted mt-1 block">Damped scale with celebratory champagne burst</span>
                  </div>

                  <motion.button
                    whileTap={tapScale}
                    onClick={handleHeartClick}
                    aria-label="Toggle wishlist for artist"
                    className="w-16 h-16 rounded-full bg-white shadow-xs flex items-center justify-center cursor-pointer hover:border-rose-velvet transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
                  >
                    <motion.div
                      animate={heartLiked ? { scale: [0.9, 1.35, 1.0] } : { scale: 1 }}
                      transition={MOTION_PRIMITIVES.tactile}
                    >
                      <Heart
                        className={`w-7 h-7 transition-colors ${
                          heartLiked ? 'fill-rose-velvet text-rose-velvet' : 'text-obsidian'
                        }`}
                      />
                    </motion.div>
                  </motion.button>

                  <span className="text-sm font-bold text-obsidian">
                    {likeCount} Verified Brides Wishlisted
                  </span>
                </div>

                {/* 2. Active Press Button with State Morphing */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between items-center text-center space-y-5">
                  <div>
                    <span className="text-base font-bold text-obsidian block">Tactile Press State &amp; Morph</span>
                    <span className="text-sm text-obsidian-muted mt-1 block">Mechanical 1px depression with checkmark transition</span>
                  </div>

                  <motion.button
                    whileHover={hoverElevate}
                    whileTap={tapScale}
                    onClick={handleActionBtnClick}
                    disabled={btnState !== 'idle'}
                    className={`w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                      btnState === 'confirmed'
                        ? 'bg-emerald-700 text-white'
                        : btnState === 'loading'
                        ? 'bg-obsidian text-white'
                        : 'bg-obsidian text-white hover:bg-obsidian-deep cursor-pointer'
                    }`}
                  >
                    {btnState === 'loading' ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-champagne-light animate-spin" />
                        <span>Acquiring Lock...</span>
                      </>
                    ) : btnState === 'confirmed' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Slot Reserved!</span>
                      </>
                    ) : (
                      <>
                        <span>Add Service + Select Slot</span>
                        <ArrowRight className="w-4 h-4 text-champagne-light" />
                      </>
                    )}
                  </motion.button>

                  <span className="text-sm text-obsidian-muted">
                    Spring: stiffness 420, damping 32
                  </span>
                </div>

                {/* 3. Sliding Morphing Mode Pill */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between items-center text-center space-y-5">
                  <div>
                    <span className="text-base font-bold text-obsidian block">Morphing Toggle Pill</span>
                    <span className="text-sm text-obsidian-muted mt-1 block">Smooth container repositioning with spring physics</span>
                  </div>

                  <div className="p-1 rounded-full bg-white flex items-center gap-1">
                    <button
                      onClick={() => setMorphMode('artists')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                        morphMode === 'artists' ? 'bg-obsidian text-white' : 'text-obsidian'
                      }`}
                    >
                      Book Artists
                    </button>

                    <button
                      onClick={() => setMorphMode('products')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none ${
                        morphMode === 'products' ? 'bg-obsidian text-white' : 'text-obsidian'
                      }`}
                    >
                      Shop Glam
                    </button>
                  </div>

                  <span className="text-sm text-obsidian font-semibold">
                    Current Mode: {morphMode === 'artists' ? 'Couture Services' : 'Backstage Retail'}
                  </span>
                </div>

              </div>
            </motion.div>
          )}

          {/* DISCIPLINE 2: NAVIGATION & STRUCTURAL TRANSITIONS */}
          {activeLabTab === 'discipline2' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl font-bold text-obsidian [text-wrap:balance]">
                  Spatial Continuity: Shared Elements &amp; Expanding Cards
                </h3>
                <p className="text-base text-obsidian-muted mt-2 max-w-[60ch] mx-auto [text-wrap:pretty]">
                  Elements retain visual persistence across screens, expanding from compact discovery cards into rich detail views without jarring page reloads.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Expanding Package Accordion Card */}
                <motion.div
                  layout
                  transition={spatialSpring}
                  onClick={() => setIsCardExpanded(!isCardExpanded)}
                  className="p-8 rounded-3xl bg-surface-cream cursor-pointer space-y-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-obsidian [text-wrap:balance]">
                        Signature Sabyasachi Bridal HD Package
                      </h4>
                      <p className="text-sm text-obsidian-muted mt-1">
                        180 mins • High Definition Bridal Glow with Royal Draping
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-obsidian">₹32,000</span>
                      {isCardExpanded ? (
                        <ChevronUp className="w-5 h-5 text-rose-dark" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-rose-dark" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCardExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={spatialSpring}
                        className="pt-4 space-y-3 text-sm"
                      >
                        <div>
                          <span className="font-bold text-obsidian block">Products Formulated:</span>
                          <span className="text-obsidian-muted">Charlotte Tilbury Hollywood Filter, NARS Sheer Glow, Dior Backstage</span>
                        </div>
                        <div>
                          <span className="font-bold text-obsidian block">Atelier Inclusions:</span>
                          <span className="text-obsidian-muted">Full Dupatta Draping, Mink Lashes, Hair Couture, Touch-Up Kit</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <span className="text-sm text-obsidian-muted block text-center pt-2">
                    Tap to toggle animated luxury specification
                  </span>
                </motion.div>

                {/* Shared Element Modal Morph Simulation */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between space-y-5">
                  <div>
                    <span className="text-base font-bold text-obsidian block">Shared Element Transition (`layoutId`)</span>
                    <span className="text-sm text-obsidian-muted mt-1 block">Smooth geometric expansion from thumbnail into hero modal</span>
                  </div>

                  <motion.div
                    layoutId="shared-lab-card"
                    onClick={() => setMiniModalOpen(true)}
                    className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-obsidian group cursor-pointer"
                  >
                    <motion.img
                      layoutId="shared-lab-img"
                      src={MOCK_ARTISTS[0].coverImage}
                      alt="Artist Cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent flex items-end p-5">
                      <div>
                        <span className="text-sm font-semibold text-champagne-light tracking-wide">Tap to Trigger Modal Morph</span>
                        <h4 className="font-serif font-bold text-white text-xl">Tanya Grewal Artistry</h4>
                      </div>
                    </div>
                  </motion.div>

                  <button
                    onClick={() => setMiniModalOpen(true)}
                    className="w-full py-3.5 rounded-2xl bg-white text-obsidian text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-hover transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
                  >
                    <Sparkles className="w-4 h-4 text-rose-dark" />
                    <span>Open Live Shared Element Modal</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* DISCIPLINE 3: PROGRESS & SYSTEM STATUS */}
          {activeLabTab === 'discipline3' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl font-bold text-obsidian [text-wrap:balance]">
                  System Status: Radial Slot-Lock Rings &amp; Shimmers
                </h3>
                <p className="text-base text-obsidian-muted mt-2 max-w-[60ch] mx-auto [text-wrap:pretty]">
                  Keep users confident through live radial timers that transition to Velvet Crimson when urgency peaks, and warm shimmer placeholders that accelerate perceived loading.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* 10-Minute Radial Progress Countdown Ring */}
                <div className="p-8 rounded-3xl bg-[#0E0B0A] text-white space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-champagne-light block">
                        10-Min Redis Redlock Ring
                      </span>
                      <span className="text-sm text-white/80 mt-1 block">Radial countdown with urgency shift under 120s</span>
                    </div>

                    <span className="text-sm bg-white/10 text-champagne-light px-3 py-1 rounded-full font-semibold">
                      Redis 7 Redlock
                    </span>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          fill="transparent"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="3.5"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          fill="transparent"
                          stroke={simulatedSeconds < 120 ? '#B42318' : '#D4AF37'}
                          strokeWidth="3.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-300 ease-linear"
                        />
                      </svg>
                      <Lock className={`w-4 h-4 absolute ${simulatedSeconds < 120 ? 'text-crimson' : 'text-champagne'}`} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-white/80 block">Time Remaining on Held Calendar Slot:</span>
                      <span className={`text-3xl font-bold block ${simulatedSeconds < 120 ? 'text-crimson animate-pulse' : 'text-white'}`}>
                        {Math.floor(simulatedSeconds / 60).toString().padStart(2, '0')}:{(simulatedSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Slider to test color shift */}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                      <span>Scrub Timer to Test Urgency Color Shift:</span>
                      <span className="text-champagne-light font-bold">{simulatedSeconds}s</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="600"
                      aria-label="Simulate lease time remaining"
                      value={simulatedSeconds}
                      onChange={(e) => setSimulatedSeconds(Number(e.target.value))}
                      className="w-full accent-champagne cursor-pointer focus-visible:ring-2 focus-visible:ring-champagne focus-visible:outline-none"
                    />
                  </div>
                </div>

                {/* Skeleton Shimmer Preview vs Hydrated State */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-obsidian block">Warm Champagne Shimmer Skeletons</span>
                      <span className="text-sm text-obsidian-muted mt-1 block">Eliminates harsh gray loading flickers</span>
                    </div>

                    <button
                      onClick={() => setSkeletonPreview(!skeletonPreview)}
                      className="px-4 py-2 rounded-full bg-white text-sm font-semibold hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
                    >
                      {skeletonPreview ? 'Show Hydrated' : 'Show Skeleton'}
                    </button>
                  </div>

                  {skeletonPreview ? (
                    <div className="p-5 rounded-2xl bg-white space-y-3">
                      <div className="h-32 rounded-xl champagne-shimmer" />
                      <div className="h-5 w-3/4 rounded champagne-shimmer" />
                      <div className="h-4 w-1/2 rounded champagne-shimmer" />
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-white space-y-2">
                      <img
                        src={MOCK_PRODUCTS[0].image}
                        alt="Product"
                        className="h-32 w-full object-cover rounded-xl"
                      />
                      <h4 className="font-serif font-bold text-sm text-obsidian">24K Gold Camellia Glow Serum</h4>
                      <span className="text-sm font-bold text-obsidian">₹3,600 • In Stock</span>
                    </div>
                  )}

                  <span className="text-sm text-obsidian-muted block text-center">
                    Smooth CSS Shimmer Animation
                  </span>
                </div>

              </div>
            </motion.div>
          )}

          {/* DISCIPLINE 4: ATTENTION GUIDANCE & FOCUS DIRECTION */}
          {activeLabTab === 'discipline4' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl font-bold text-obsidian [text-wrap:balance]">
                  Attention Guidance: Error Shakes &amp; Cascades
                </h3>
                <p className="text-base text-obsidian-muted mt-2 max-w-[60ch] mx-auto [text-wrap:pretty]">
                  Guide customer attention intuitively without disruptive browser alerts using calibrated horizontal error shakes and staggered entrance choreography.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Horizontal Attention Guidance Shake Box */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between space-y-5">
                  <div>
                    <span className="text-base font-bold text-obsidian block">Horizontal Attention Guidance Shake</span>
                    <span className="text-sm text-obsidian-muted mt-1 block">
                      Elastic impulse when required slot is missing
                    </span>
                  </div>

                  <motion.div
                    animate={shakeTriggered ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                    transition={{ duration: 0.38, ease: 'easeInOut' }}
                    className={`p-5 rounded-2xl bg-white transition-colors ${
                      shakeTriggered ? 'border-2 border-red-600 bg-red-50/50' : 'border border-rose-gold/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="font-semibold text-obsidian">Select Booking Time Slot:</span>
                      <span className="text-sm text-red-700 font-bold">
                        {shakeTriggered ? 'Required!' : 'Unselected'}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      {['10:00 AM', '02:30 PM', '05:00 PM'].map((t, i) => (
                        <div key={i} className="flex-1 py-2.5 text-center rounded-xl bg-surface-cream text-sm font-semibold text-obsidian">
                          {t}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <button
                    onClick={triggerShake}
                    className="w-full py-3.5 rounded-2xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
                  >
                    <span>Trigger Attention Guidance Shake</span>
                  </button>
                </div>

                {/* Staggered Cascade Entrance Demonstration */}
                <div className="p-8 rounded-3xl bg-surface-cream flex flex-col justify-between space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-obsidian block">100ms Staggered Cascade</span>
                      <span className="text-sm text-obsidian-muted mt-1 block">Orchestrated entry sequence</span>
                    </div>
                    <button
                      onClick={() => setStaggerKey((prev) => prev + 1)}
                      className="px-4 py-1.5 rounded-full bg-white text-sm font-semibold hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none cursor-pointer"
                    >
                      Replay
                    </button>
                  </div>

                  <motion.div
                    key={staggerKey}
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                    className="space-y-2.5"
                  >
                    {['1. High-Contrast Serif Headline', '2. Value Proposition Paragraph', '3. Interactive Location & Date Search Bar', '4. Quick Category Pills (Bridal, Editorial)'].map((step, idx) => (
                      <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0, transition: spatialSpring },
                        }}
                        className="p-3 rounded-xl bg-white text-sm font-medium text-obsidian flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{step}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <span className="text-sm text-obsidian-muted block text-center">
                    Staggered Entrance Sequence
                  </span>
                </div>

              </div>
            </motion.div>
          )}

          {/* DISCIPLINE 5: SPATIAL DEPTH & CONTEXTUAL MOTION */}
          {activeLabTab === 'discipline5' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spatialSpring}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif text-2xl font-bold text-obsidian [text-wrap:balance]">
                  Real-World Physics: Makeover Split-Screen Slider
                </h3>
                <p className="text-base text-obsidian-muted mt-2 max-w-[60ch] mx-auto [text-wrap:pretty]">
                  Drag the central handle left and right to inspect raw skin texture versus Ultra HD Bridal Glamour with tactile momentum and rubber-band boundary constraints.
                </p>
              </div>

              {/* Embedded Interactive Before / After Slider */}
              <div className="max-w-3xl mx-auto aspect-[16/9] w-full">
                <BeforeAfterSlider data={MOCK_ARTISTS[0].beforeAfter!} />
              </div>
            </motion.div>
          )}

        </div>
      </motion.section>

      {/* --------------------------------------------------------------------- */}
      {/* 4. THE 4 PORTALS SHOWCASE WITH EDITORIAL PHOTOGRAPHY                   */}
      {/* --------------------------------------------------------------------- */}
      <motion.section
        id="portals"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={spatialSpring}
        className="py-16 px-6 sm:px-10 max-w-7xl mx-auto space-y-12 scroll-mt-28"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian [text-wrap:balance]">
            4 Interlocking Systems. 1 Unified Ecosystem.
          </h2>
          <p className="text-base text-obsidian-muted leading-relaxed max-w-[62ch] mx-auto [text-wrap:pretty]">
            Every booking and checkout triggers coordinated real-time state changes across all 4 personas. Tap any portal to jump straight in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Portal 1: Customer Discovery Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spatialSpring}
            className="rounded-3xl bg-surface-cream overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/9] w-full relative">
              <img
                src={MOCK_ARTISTS[0].coverImage}
                alt="Customer Discovery Marketplace"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-obsidian text-white text-sm font-semibold px-3.5 py-1.5 rounded-full">
                Dual-Marketplace
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian [text-wrap:balance]">
                  Customer Discovery
                </h3>
                <p className="text-base text-obsidian-muted leading-relaxed [text-wrap:pretty]">
                  Switch seamlessly between verified celebrity artists and luxury backstage cosmetics. Features interactive Before and After sliders, 10-minute Redis Redlock radial timers, and hybrid checkouts.
                </p>
                
                <ul className="space-y-2 text-sm text-obsidian font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>PostGIS ST_DWithin 25km radius search</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Interactive Split-Screen Makeover Slider</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Split-Tax GST Invoicing and Receipts</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={hoverElevate}
                whileTap={tapScale}
                onClick={() => onNavigatePortal('customer')}
                className="mt-6 w-full py-3.5 rounded-2xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
              >
                <span>Launch Customer Marketplace</span>
                <ArrowRight className="w-4 h-4 text-champagne-light" />
              </motion.button>
            </div>
          </motion.div>

          {/* Portal 2: Partner Pro Studio OS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spatialSpring, delay: 0.1 }}
            className="rounded-3xl bg-surface-cream overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/9] w-full relative">
              <img
                src={MOCK_ARTISTS[1].coverImage}
                alt="Partner Pro Studio OS"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-obsidian text-white text-sm font-semibold px-3.5 py-1.5 rounded-full">
                Operational OS
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian [text-wrap:balance]">
                  Partner Pro Studio
                </h3>
                <p className="text-base text-obsidian-muted leading-relaxed [text-wrap:pretty]">
                  Dedicated operating system for verified MUAs and hair couturiers. Manage bridal booking requests, synchronize weekly availability windows, and verify customer 4-digit check-in OTPs.
                </p>
                
                <ul className="space-y-2 text-sm text-obsidian font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Weekly slot locking and personal prep blocking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Customer 4-Digit Check-In OTP verification</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Instant GiST Slot Freeing upon client cancellation</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={hoverElevate}
                whileTap={tapScale}
                onClick={() => onNavigatePortal('pro')}
                className="mt-6 w-full py-3.5 rounded-2xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
              >
                <span>Launch Pro Studio OS</span>
                <ArrowRight className="w-4 h-4 text-champagne-light" />
              </motion.button>
            </div>
          </motion.div>

          {/* Portal 3: Product Vendor Fulfillment Hub */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spatialSpring}
            className="rounded-3xl bg-surface-cream overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/9] w-full relative">
              <img
                src={MOCK_PRODUCTS[0].image}
                alt="Product Vendor Hub"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-obsidian text-white text-sm font-semibold px-3.5 py-1.5 rounded-full">
                3PL &amp; Logistics
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian [text-wrap:balance]">
                  Product Vendor Hub
                </h3>
                <p className="text-base text-obsidian-muted leading-relaxed [text-wrap:pretty]">
                  Manage cosmetic inventory and batch metadata. Generate 3PL carrier airway bills (BlueDart Priority Air) and preview printable 4x6 inch thermal shipping labels with warehouse checklists.
                </p>
                
                <ul className="space-y-2 text-sm text-obsidian font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Real-time SKU quantities tied to SQL check constraints</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>3PL Courier Airway Bill generation (AWB)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Printable 4x6 Thermal Shipping Labels</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={hoverElevate}
                whileTap={tapScale}
                onClick={() => onNavigatePortal('vendor')}
                className="mt-6 w-full py-3.5 rounded-2xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
              >
                <span>Launch Vendor Hub</span>
                <ArrowRight className="w-4 h-4 text-champagne-light" />
              </motion.button>
            </div>
          </motion.div>

          {/* Portal 4: Trust & Safety Admin Command Center */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spatialSpring, delay: 0.1 }}
            className="rounded-3xl bg-surface-cream overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/9] w-full relative">
              <img
                src={MOCK_ARTISTS[2].coverImage}
                alt="Admin Command Center"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-obsidian text-white text-sm font-semibold px-3.5 py-1.5 rounded-full">
                Trust &amp; Safety
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian [text-wrap:balance]">
                  Admin Command Center
                </h3>
                <p className="text-base text-obsidian-muted leading-relaxed [text-wrap:pretty]">
                  Approve or reject artist KYC credentials, calibrate marketplace split-commission escrow parameters, audit GST tax invoices, and run the automated 50-user concurrency benchmark.
                </p>
                
                <ul className="space-y-2 text-sm text-obsidian font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>KYC Credential and Portfolio Video Inspection</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Dynamic Split-Commission Sliders (18% and 12%)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Live 50-User Concurrency Torture Benchmark (347ms)</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={hoverElevate}
                whileTap={tapScale}
                onClick={() => onNavigatePortal('admin')}
                className="mt-6 w-full py-3.5 rounded-2xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
              >
                <span>Launch Admin Command Center</span>
                <ArrowRight className="w-4 h-4 text-champagne-light" />
              </motion.button>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* --------------------------------------------------------------------- */}
      {/* 5. ARCHITECTURE & CONCURRENCY GUARD                                   */}
      {/* --------------------------------------------------------------------- */}
      <motion.section
        id="concurrency"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={spatialSpring}
        className="py-16 px-6 sm:px-10 max-w-7xl mx-auto space-y-10 scroll-mt-28"
      >
        <div className="p-10 sm:p-14 rounded-3xl bg-[#0E0B0A] text-white space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white [text-wrap:balance]">
                Anti-Collision Engine
              </h3>
              <p className="text-base text-white/80 mt-2 leading-relaxed [text-wrap:pretty]">
                Under peak bridal demand, hundreds of users contend for identical slots. Glamgo prevents collisions at two distinct architectural layers:
              </p>
            </div>

            <div className="text-left lg:text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 block">100% Concurrency Suite Passed</span>
              <span className="text-sm text-white/70 block mt-1">1 Concurrency Victor / 49 Defended in 347ms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Layer 1: Redis Redlock */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spatialSpring}
              className="space-y-4"
            >
              <div className="flex items-center gap-2.5 text-champagne-light">
                <Lock className="w-5 h-5 text-champagne-light" />
                <h4 className="font-serif font-bold text-xl text-white">Layer 1: Redis 7 Atomic Redlock</h4>
              </div>
              <p className="text-base text-white/80 leading-relaxed [text-wrap:pretty]">
                When a user selects a slot, Glamgo executes atomic <code className="bg-white/10 px-2 py-0.5 rounded text-champagne-light text-sm font-sans font-semibold">SET lock:prof:ID:slot:DATE:TIME user_id NX EX 600</code>.
                If another user attempts to select that slot within the 10-minute window, Redis instantly denies the contender with 409 SLOT_ALREADY_LOCKED.
              </p>
            </motion.div>

            {/* Layer 2: PostgreSQL GiST */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spatialSpring, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2.5 text-champagne-light">
                <Database className="w-5 h-5 text-champagne-light" />
                <h4 className="font-serif font-bold text-xl text-white">Layer 2: PostgreSQL 16 btree_gist Exclusion</h4>
              </div>
              <p className="text-base text-white/80 leading-relaxed [text-wrap:pretty]">
                Even under extreme race conditions that bypass cache, the database engine enforces:
                <code className="block bg-white/10 p-3 rounded text-sm font-sans font-semibold text-emerald-300 mt-2">
                  EXCLUDE USING gist (professional_id WITH =, slot_range WITH &amp;&amp;)
                </code>
                Overlapping ranges are mathematically rejected by the storage engine before a row can be committed.
              </p>
            </motion.div>
          </div>

          {/* Quick CLI Test Prompt */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2.5 text-champagne-light">
              <Cpu className="w-5 h-5 text-champagne-light" />
              <span className="text-base">Run the CLI Concurrency Torture Benchmark locally:</span>
            </div>
            <code className="bg-white/10 px-4 py-2 rounded-xl text-white font-sans font-bold text-sm">
              npm run verify:concurrency
            </code>
          </div>

        </div>

      </motion.section>

      {/* --------------------------------------------------------------------- */}
      {/* 6. HAUTE EDITORIAL FOOTER                                             */}
      {/* --------------------------------------------------------------------- */}
      <footer className="py-14 px-6 sm:px-12 bg-surface-cream text-sm text-obsidian-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif font-bold text-xl text-obsidian">Glamgo</span>
              <span className="text-sm text-obsidian font-semibold">Haute Beauté</span>
            </div>
            <p className="text-sm text-obsidian-muted">
              Proprietary Dual-Marketplace Architecture • Level 14 Platina Towers, BKC, Mumbai
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => onNavigatePortal('customer')}
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded"
            >
              Customer Portal
            </button>
            <button
              onClick={() => onNavigatePortal('pro')}
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded"
            >
              Pro Studio OS
            </button>
            <button
              onClick={() => onNavigatePortal('vendor')}
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded"
            >
              Vendor Hub
            </button>
            <button
              onClick={() => onNavigatePortal('admin')}
              className="hover:text-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none rounded"
            >
              Admin Command
            </button>
          </div>

          <div className="text-sm text-obsidian-muted sm:text-right">
            <span>PostgreSQL 16 + PostGIS 3.4 • Redis 7 • React 18 • Framer Motion</span>
          </div>
        </div>
      </footer>

      {/* --------------------------------------------------------------------- */}
      {/* 7. LIVE IN-LAB SHARED ELEMENT MODAL                                   */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {miniModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setMiniModalOpen(false)}
              className="absolute inset-0 bg-obsidian/60"
            />
            <motion.div
              layoutId="shared-lab-card"
              transition={spatialSpring}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-rose-gold/30 shadow-2xl overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full">
                <motion.img
                  layoutId="shared-lab-img"
                  src={MOCK_ARTISTS[0].coverImage}
                  alt="Tanya Grewal"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setMiniModalOpen(false)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-obsidian/80 text-white flex items-center justify-center hover:bg-obsidian transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent text-white">
                  <h3 className="font-serif text-2xl font-bold">Tanya Grewal Artistry</h3>
                  <p className="text-sm text-white/90 mt-1">Bandra West, Mumbai • ★ 4.98 (124 Royal Brides)</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-base text-obsidian-muted leading-relaxed [text-wrap:pretty]">
                  Notice how the image and card container smoothly morph from their original rectangular boundaries into this luxury presentation modal using Framer Motion’s layoutId without triggering any DOM flicker or layout shift.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setMiniModalOpen(false);
                      onNavigatePortal('customer');
                    }}
                    className="flex-1 py-3 rounded-xl bg-obsidian text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-obsidian-deep cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
                  >
                    <span>View in Discovery Marketplace</span>
                    <ArrowRight className="w-4 h-4 text-champagne-light" />
                  </button>
                  <button
                    onClick={() => setMiniModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-surface-cream text-obsidian text-sm font-semibold hover:bg-surface-hover cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};