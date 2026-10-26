import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Sparkles, Check, AlertCircle, ArrowRight, ShieldCheck, Crown, Brush, Store } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { MOTION_PRIMITIVES, tapScale } from '../constants/motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

const DEMO_PERSONAS = [
  {
    role: 'CUSTOMER' as UserRole,
    title: 'Bride Persona',
    name: 'Rhea Singhania',
    email: 'bride@glamgo.in',
    password: 'GlamgoBride2026!',
    badge: 'Bride / Client',
    icon: Crown,
  },
  {
    role: 'PROFESSIONAL' as UserRole,
    title: 'Celebrity MUA',
    name: 'Tanya Grewal',
    email: 'tanya@glamgo.in',
    password: 'TanyaArtistry2026!',
    badge: 'Master Artist',
    icon: Brush,
  },
  {
    role: 'VENDOR' as UserRole,
    title: 'Luxury Retailer',
    name: 'Glamgo Retail Node',
    email: 'vendor@glamgo.in',
    password: 'VendorLuxe2026!',
    badge: 'Brand Vendor',
    icon: Store,
  },
  {
    role: 'ADMIN' as UserRole,
    title: 'Platform Curator',
    name: 'Sophia Laurent',
    email: 'admin@glamgo.in',
    password: 'AdminGlamgo2026!',
    badge: 'Chief Admin',
    icon: ShieldCheck,
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'CUSTOMER',
  onSuccess,
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRole(defaultRole);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode, defaultRole]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        setShakeKey((prev) => prev + 1);
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must contain at least 8 characters.');
        setShakeKey((prev) => prev + 1);
        setIsLoading(false);
        return;
      }

      const res = await signup({
        fullName,
        email,
        password,
        role,
        phone: phone.trim() || undefined,
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Welcome to Glamgo Atelier. Your membership is active.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
        setShakeKey((prev) => prev + 1);
      }
    } else {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Signed in successfully. Welcome back.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 700);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
        setShakeKey((prev) => prev + 1);
      }
    }
  };

  const handleQuickPersona = async (persona: (typeof DEMO_PERSONAS)[0]) => {
    setEmail(persona.email);
    setPassword(persona.password);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const res = await login(persona.email, persona.password);
    setIsLoading(false);
    if (res.success) {
      setSuccessMessage(`Authenticated as ${persona.name} (${persona.badge})`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Quick login failed.');
      setShakeKey((prev) => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center min-h-screen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={MOTION_PRIMITIVES.spatial}
          className="relative w-full max-w-lg max-h-[calc(100vh-2.5rem)] overflow-y-auto my-auto bg-[#FAF8F5] border border-stone-200/90 rounded-3xl shadow-2xl p-5 sm:p-7 z-10"
        >
          {/* Subtle Atelier Brand Corner */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-200/60">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-sm uppercase text-stone-900 font-semibold">
                GLAMGO
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-[13px] text-stone-600 font-sans tracking-wide">
                Luxury Beauty Atelier
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close authentication modal"
              className="w-8 h-8 flex items-center justify-center rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Header */}
          <div className="mt-3.5 mb-4">
            <h2
              id="auth-modal-title"
              className="font-serif text-2xl sm:text-[1.7rem] text-stone-900 font-semibold tracking-tight"
            >
              {mode === 'login' ? 'Sign in to your account' : 'Join the Glamgo Atelier'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed font-sans">
              {mode === 'login'
                ? 'Access your luxury bridal reservations, portfolio bookings, and orders.'
                : 'Experience private bridal styling, certified cosmetics, and verified artistry.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Atelier Account
            </button>
          </div>

          {/* Quick Demo Personas Bar - Refined 2x2 Grid with Zero Truncation */}
          <div className="mb-4 p-3 bg-stone-100/90 border border-stone-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-800" />
                1-Click Demo Personas
              </span>
              <span className="text-xs text-stone-500 font-sans">Instant Sign In</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickPersona(persona)}
                    className="group flex items-center gap-2.5 p-2 bg-white border border-stone-200/80 rounded-xl hover:border-stone-900 hover:shadow-xs active:scale-[0.98] transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-stone-100 border border-stone-200/50 flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-amber-100 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-stone-900 truncate leading-snug">
                        {persona.title}
                      </div>
                      <div className="text-xs text-stone-500 truncate">
                        {persona.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0, y: -6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: [-6, 6, -4, 4, -2, 2, 0],
                }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mb-3.5 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-900"
              >
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-sm text-emerald-900"
              >
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                {/* Role Selector Chips */}
                <div>
                  <label className="block text-sm font-medium text-stone-800 mb-1">
                    Select Your Atelier Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'CUSTOMER' as UserRole, label: 'Client / Bride' },
                      { value: 'PROFESSIONAL' as UserRole, label: 'Master Artist' },
                      { value: 'VENDOR' as UserRole, label: 'Cosmetic Brand' },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        className={`py-1.5 px-2 text-center text-[13px] font-medium rounded-xl border transition-all cursor-pointer ${
                          role === item.value
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-stone-800 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rhea Singhania"
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-200/90 rounded-xl focus:outline-hidden focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@glamgo.in"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-200/90 rounded-xl focus:outline-hidden focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
              />
            </div>

            {/* Phone (Signup Only, Optional) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-1">
                  Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 99481"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-200/90 rounded-xl focus:outline-hidden focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-stone-800">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('bride@glamgo.in');
                      setPassword('GlamgoBride2026!');
                    }}
                    className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
                  >
                    Use demo password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
                  className="w-full min-h-[44px] px-3.5 pr-10 py-2 text-sm text-stone-900 bg-white border border-stone-200/90 rounded-xl focus:outline-hidden focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={tapScale}
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] mt-1 flex items-center justify-center gap-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 active:bg-stone-950 transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Glamgo' : 'Complete Atelier Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Luxury Footnote */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 text-center">
            <p className="text-xs text-stone-500 font-sans">
              Protected by 256-bit SSL encryption & Redis atomic rate limiting.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
