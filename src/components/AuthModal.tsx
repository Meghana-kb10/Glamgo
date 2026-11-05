import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crown,
  Brush,
  Store,
  AlertCircle,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService, AuthUser, DEV_OTP, isDevAuthEnabled } from '../services/authService';
import { Button } from './ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

type AuthStep = 'PHONE' | 'OTP' | 'SUCCESS_TICK' | 'PROFILE';

const DEMO_PERSONAS = [
  {
    role: 'CUSTOMER' as UserRole,
    title: 'Bride Persona',
    name: 'Rhea Singhania',
    phone: '9820199481',
    email: 'bride@glamgo.in',
    badge: 'Bride / Client',
    icon: Crown,
  },
  {
    role: 'PROFESSIONAL' as UserRole,
    title: 'Celebrity MUA',
    name: 'Tanya Grewal',
    phone: '9821034821',
    email: 'tanya@glamgo.in',
    badge: 'Master Artist',
    icon: Brush,
  },
  {
    role: 'VENDOR' as UserRole,
    title: 'Luxury Retailer',
    name: 'Glamgo Retail Node',
    phone: '9833445566',
    email: 'vendor@glamgo.in',
    badge: 'Brand Vendor',
    icon: Store,
  },
  {
    role: 'ADMIN' as UserRole,
    title: 'Platform Curator',
    name: 'Sophia Laurent',
    phone: '9811223344',
    email: 'admin@glamgo.in',
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
  const { loginWithAuthUser, login } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // New users: Name only
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showDevPersonas, setShowDevPersonas] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setPhone('');
      setPhoneError(null);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setFullName('');
      setNameError(null);
      setIsLoading(false);
      setShowDevPersonas(false);
      setPendingUser(null);
      setPendingToken(null);
    }
  }, [isOpen]);

  // 30-Second OTP Resend Timer
  useEffect(() => {
    if (step !== 'OTP' || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCooldown]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Format phone
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (phoneError) setPhoneError(null);
  };

  // Submit phone
  const handleSendOtp = async (channel: 'sms' | 'whatsapp' = 'sms') => {
    if (phone.length !== 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError(null);
    setIsLoading(true);

    try {
      const res = await authService.sendOtp(phone, channel);
      setIsLoading(false);

      if (res.success) {
        setStep('OTP');
        setResendCooldown(res.cooldownSeconds || 30);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError(null);
        toast.info(res.message || `OTP sent via ${channel.toUpperCase()}`, 'Verification Code Sent');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setPhoneError(res.error || 'Failed to dispatch verification code');
      }
    } catch (err: any) {
      setIsLoading(false);
      setPhoneError(err.message || 'Error sending OTP');
    }
  };

  // OTP inputs
  const handleOtpInput = (index: number, value: string) => {
    const val = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!val) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    if (index < 5 && val) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (index === 5 || newDigits.every((d) => d.length === 1)) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        triggerOtpVerification(fullCode);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        triggerOtpVerification(pasted);
      } else {
        otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      }
    }
  };

  const triggerOtpVerification = async (code: string) => {
    setIsLoading(true);
    setOtpError(null);

    try {
      const res = await authService.verifyOtp(phone, code);
      setIsLoading(false);

      if (res.success && res.user && res.token) {
        // Show SVG tick animation first
        setStep('SUCCESS_TICK');
        setPendingUser(res.user);
        setPendingToken(res.token);

        setTimeout(() => {
          if (res.isNewUser) {
            setStep('PROFILE');
          } else if (res.user && res.token) {
            loginWithAuthUser(res.user, res.token);
            toast.success(`Welcome back, ${res.user.fullName || 'Member'}!`, 'Authenticated');
            onSuccess?.();
            onClose();
          }
        }, 900);
      } else {
        setOtpError(res.error || `Incorrect code. Enter ${DEV_OTP} to test.`);
        setShakeKey((prev) => prev + 1);
      }
    } catch (err: any) {
      setIsLoading(false);
      setOtpError(err.message || 'Verification failed');
      setShakeKey((prev) => prev + 1);
    }
  };

  // Submit Name-Only Profile
  const handleNameOnlySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setNameError('Please enter your name');
      return;
    }
    if (!pendingUser || !pendingToken) return;

    setIsLoading(true);
    setNameError(null);

    try {
      const res = await authService.completeProfile(pendingUser.id, {
        fullName: fullName.trim(),
        preferredGender: 'female',
        city: 'Indiranagar, Bengaluru',
        pincode: '560038',
      });
      setIsLoading(false);

      if (res.success) {
        loginWithAuthUser(res.user, pendingToken);
        toast.success(`Welcome to Glamgo, ${res.user.fullName}!`, 'Profile Created');
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      setNameError(err.message || 'Failed to save profile');
    }
  };

  // Google sign in mock
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await authService.googleSignIn();
      setIsLoading(false);
      if (res.success && res.user && res.token) {
        loginWithAuthUser(res.user, res.token);
        toast.success(`Signed in with Google as ${res.user.fullName}`, 'Welcome Back');
        onSuccess?.();
        onClose();
      }
    } catch {
      setIsLoading(false);
      toast.error('Google Sign-In failed.', 'Auth Error');
    }
  };

  // Quick Persona
  const handleQuickPersona = async (persona: (typeof DEMO_PERSONAS)[0]) => {
    setIsLoading(true);
    try {
      const res = await login(persona.email, persona.role === 'CUSTOMER' ? 'GlamgoBride2026!' : 'Glamgo2026!');
      setIsLoading(false);
      if (res.success) {
        toast.success(`Signed in as ${persona.name}`, 'Persona Switched');
        onSuccess?.();
        onClose();
      } else {
        const verifyRes = await authService.verifyOtp(persona.phone, DEV_OTP || '123456');
        if (verifyRes.success && verifyRes.user && verifyRes.token) {
          loginWithAuthUser(verifyRes.user, verifyRes.token);
          toast.success(`Signed in as ${persona.name}`, 'Switched');
          onSuccess?.();
          onClose();
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Quick login failed', 'Error');
    }
  };

  if (!isOpen) return null;

  const maskedPhone =
    phone.length === 10
      ? `+91 ${phone.slice(0, 5)} •••••`
      : '+91 ••••• •••••';

  // Core Form Step Elements
  const renderFormContent = () => (
    <div className="flex flex-col justify-between h-full">
      {/* PHONE STEP */}
      {step === 'PHONE' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Log in or sign up
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Enter your mobile number to get instant booking OTP
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label
                htmlFor="auth-phone-input"
                className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
              >
                Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <div className="h-12 px-3 flex items-center justify-center gap-1.5 bg-fill border border-border-strong rounded-[14px] text-sm font-semibold text-text select-none">
                  <span className="text-xs font-bold text-text-muted">IN</span>
                  <span>+91</span>
                </div>
                <div className="relative flex-1">
                  <input
                    id="auth-phone-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoFocus
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="98765 43210"
                    aria-invalid={!!phoneError}
                    className={`w-full h-12 px-4 text-base font-medium text-text bg-card border rounded-[14px] focus:outline-none focus:ring-2 transition-colors ${
                      phoneError
                        ? 'border-error focus:ring-error/20'
                        : 'border-border-strong focus:border-accent focus:ring-accent-soft'
                    } placeholder:text-text-muted/60`}
                  />
                </div>
              </div>

              {phoneError && (
                <p role="alert" className="mt-1.5 text-xs text-error flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              disabled={phone.length !== 10}
              isLoading={isLoading}
              onClick={() => handleSendOtp('sms')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>

            {/* "or" Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative px-3 bg-card text-xs uppercase tracking-wider text-text-muted font-medium">
                or
              </span>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-12 px-4 rounded-[14px] border border-border bg-card hover:bg-fill/40 text-text text-sm font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-warm-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Skip for now / Browse as guest */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  onSuccess?.();
                  onClose();
                }}
                className="text-xs font-semibold text-text-muted hover:text-accent transition-colors cursor-pointer py-1"
              >
                Skip for now →
              </button>
            </div>

            {/* Dev Quick Personas */}
            {isDevAuthEnabled && (
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDevPersonas(!showDevPersonas)}
                  className="w-full text-center text-[11px] text-text-muted hover:text-text cursor-pointer py-1"
                >
                  {showDevPersonas ? 'Hide test personas ▲' : 'Quick Test Personas ▼'}
                </button>
                {showDevPersonas && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {DEMO_PERSONAS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.email}
                          type="button"
                          onClick={() => handleQuickPersona(p)}
                          className="flex items-center gap-2 p-2 rounded-[12px] border border-border bg-card hover:bg-fill/40 text-left transition-colors cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-fill flex items-center justify-center text-accent shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-text truncate">{p.name}</p>
                            <p className="text-[10px] text-text-muted truncate">{p.badge}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP STEP */}
      {step === 'OTP' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text tracking-tight">
              Enter verification code
            </h2>
            <p className="text-xs sm:text-sm text-text-muted flex items-center gap-2">
              <span>Code sent to {maskedPhone}</span>
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-xs font-bold text-accent hover:text-accent-pressed underline cursor-pointer"
              >
                Change number
              </button>
            </p>
          </div>

          {/* 6 OTP Boxes */}
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="my-4"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`Digit ${idx + 1} of verification code`}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-[12px] bg-card border transition-all ${
                    otpError
                      ? 'border-error text-error focus:ring-2 focus:ring-error/20'
                      : digit
                      ? 'border-accent text-accent-pressed bg-fill/30 ring-1 ring-accent'
                      : 'border-border-strong text-text focus:border-accent focus:ring-2 focus:ring-accent-soft'
                  }`}
                />
              ))}
            </div>

            {otpError && (
              <p role="alert" className="mt-2.5 text-xs text-error text-center font-medium flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{otpError}</span>
              </p>
            )}
          </motion.div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-sans px-1">
              <span className="text-text-muted">Didn&apos;t receive code?</span>
              {resendCooldown > 0 ? (
                <span className="text-text-muted font-medium">
                  Resend in 0:{resendCooldown.toString().padStart(2, '0')}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp('sms')}
                  className="font-bold text-accent hover:text-accent-pressed cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              disabled={otpDigits.some((d) => !d)}
              isLoading={isLoading}
              onClick={() => triggerOtpVerification(otpDigits.join(''))}
            >
              Verify &amp; Continue
            </Button>
          </div>
        </div>
      )}

      {/* SUCCESS TICK ANIMATION */}
      {step === 'SUCCESS_TICK' && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 text-success" viewBox="0 0 52 52">
              <circle className="stroke-success/20" cx="26" cy="26" r="24" fill="none" strokeWidth="3" />
              <motion.path
                fill="none"
                stroke="var(--success)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 17-17"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-heading font-bold text-xl text-text">Verified!</h3>
            <p className="text-xs text-text-muted mt-1">Taking you to your beauty atelier...</p>
          </div>
        </div>
      )}

      {/* PROFILE SETUP: Name only */}
      {step === 'PROFILE' && (
        <form onSubmit={handleNameOnlySubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text tracking-tight">
              What should we call you?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Enter your name to personalize your bookings and receipts
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label htmlFor="auth-name-input" className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Your Full Name
            </label>
            <input
              id="auth-name-input"
              type="text"
              autoFocus
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. Kavita Sharma"
              className={`w-full h-12 px-4 rounded-[14px] bg-card border text-sm text-text focus:outline-none focus:ring-2 ${
                nameError
                  ? 'border-error focus:ring-error/20'
                  : 'border-border-strong focus:border-accent focus:ring-accent-soft'
              } placeholder:text-text-muted/60`}
            />
            {nameError && (
              <p className="text-xs text-error font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Start Exploring
          </Button>
        </form>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-text/60 backdrop-blur-xs"
        />

        {/* MOBILE VIEW (<640px): Gradient top area + warm photo + rising Warm White card */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-h-[92vh] sm:hidden flex flex-col z-10 overflow-hidden"
        >
          {/* Top Beauty Photo Strip with Cream-to-Ivory Gradient */}
          <div className="relative h-44 bg-gradient-to-b from-bg-alt to-bg flex flex-col justify-between p-4 shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              alt="Glamgo Luxury Beauty"
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/20 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shadow-warm-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-heading font-bold text-lg text-text">Glamgo</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-xs flex items-center justify-center text-text hover:bg-card shadow-warm-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="relative z-10 text-xs font-semibold text-text max-w-[240px] leading-tight">
              Luxury beauty rituals delivered directly to your doorstep.
            </p>
          </div>

          {/* Rising Warm White Card from Bottom */}
          <div className="bg-card rounded-t-[24px] border-t border-border shadow-warm-sheet p-5 overflow-y-auto flex-1">
            {renderFormContent()}
          </div>
        </motion.div>

        {/* DESKTOP VIEW (>=640px): Two columns (photo left, form right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative hidden sm:grid sm:grid-cols-12 w-full max-w-2xl bg-card border border-border rounded-[24px] shadow-warm-modal overflow-hidden z-10"
        >
          {/* Left Column: Photo with warm gradient overlay */}
          <div className="sm:col-span-5 relative bg-bg-alt overflow-hidden min-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              alt="Glamgo Beauty Suite"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/30 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-warm-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-heading font-bold text-lg text-white">Glamgo</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-fill">
                  Atelier Access
                </span>
                <p className="font-heading font-bold text-base leading-snug text-white">
                  Beauty services at your doorstep.
                </p>
                <p className="text-[11px] text-border leading-relaxed">
                  100% verified professionals with sealed single-use kits.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form Area */}
          <div className="sm:col-span-7 p-7 flex flex-col justify-between bg-card relative">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close login dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-fill/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pt-2">
              {renderFormContent()}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
