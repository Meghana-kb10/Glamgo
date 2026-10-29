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
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService, AuthUser, DEV_OTP, isDevAuthEnabled } from '../services/authService';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Chip } from './ui/Chip';
import { BottomSheet } from './ui/BottomSheet';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

type AuthStep = 'PHONE' | 'OTP' | 'PROFILE' | 'LOCATION';

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
  const { loginWithAuthUser, updateUser, login } = useAuth();
  const toast = useToast();

  // Screen state
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  // Phone Step State
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // OTP Step State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Profile Step State (New Users)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [preferredGender, setPreferredGender] = useState<'female' | 'male' | 'none'>('female');

  // Location Step State
  const [manualCity, setManualCity] = useState('Mumbai');
  const [manualPincode, setManualPincode] = useState('400050');
  const [isLocating, setIsLocating] = useState(false);

  // General Loading & Developer Bypass State
  const [isLoading, setIsLoading] = useState(false);
  const [showDevPersonas, setShowDevPersonas] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  // Detect mobile width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setPhone('');
      setPhoneError(null);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setFullName('');
      setEmail('');
      setNameError(null);
      setPreferredGender('female');
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

  // Escape key listener for desktop dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Phone input formatting (only 10 digits)
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (phoneError) setPhoneError(null);
  };

  // Submit Phone & Send OTP
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
        // Auto-focus first OTP input after render
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setPhoneError(res.error || 'Failed to dispatch verification code');
      }
    } catch (err: any) {
      setIsLoading(false);
      setPhoneError(err.message || 'Error sending OTP');
    }
  };

  // Auto-verify OTP when 6th digit entered
  const handleOtpInput = (index: number, value: string) => {
    const val = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!val) {
      // Backspace
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // Single character entry
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-advance to next box if available
    if (index < 5 && val) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit
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
        if (res.isNewUser) {
          // New customer: navigate to profile onboarding
          setPendingUser(res.user);
          setPendingToken(res.token);
          setStep('PROFILE');
        } else {
          // Returning customer: complete login
          loginWithAuthUser(res.user, res.token);
          toast.success(`Welcome back, ${res.user.fullName || 'Member'}!`, 'Authenticated');
          onSuccess?.();
          onClose();
        }
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

  // Submit Profile Setup
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setNameError('Full name is required');
      return;
    }
    setNameError(null);
    setStep('LOCATION');
  };

  // Location Confirmation & Finalize New User
  const handleFinalizeNewUser = async (locationCity: string, locationPincode: string) => {
    if (!pendingUser) return;
    setIsLoading(true);

    try {
      const res = await authService.completeProfile(pendingUser.id, {
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        preferredGender,
        city: locationCity,
        pincode: locationPincode,
      });

      setIsLoading(false);
      if (res.success && pendingToken) {
        loginWithAuthUser(res.user, pendingToken);
        toast.success(`Welcome to Glamgo Atelier, ${res.user.fullName}!`, 'Profile Created');
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Failed to complete profile', 'Error');
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          handleFinalizeNewUser('Bandra West, Mumbai', '400050');
        },
        () => {
          setIsLocating(false);
          handleFinalizeNewUser(manualCity, manualPincode);
        },
        { timeout: 3000 }
      );
    } else {
      setIsLocating(false);
      handleFinalizeNewUser(manualCity, manualPincode);
    }
  };

  // Google Sign-In Mock
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
      toast.error('Google Sign-In failed. (Requires VITE_GOOGLE_CLIENT_ID in live production)', 'Auth Error');
    }
  };

  // Developer Quick Persona Bypass
  const handleQuickPersona = async (persona: (typeof DEMO_PERSONAS)[0]) => {
    setIsLoading(true);
    try {
      // Use existing email/password auth for quick admin / pro / vendor review
      const res = await login(persona.email, persona.role === 'CUSTOMER' ? 'GlamgoBride2026!' : 'Glamgo2026!');
      setIsLoading(false);
      if (res.success) {
        toast.success(`Signed in as ${persona.name} (${persona.badge})`, 'Persona Switched');
        onSuccess?.();
        onClose();
      } else {
        // Fallback: verify phone directly
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

  // Masked phone for display
  const maskedPhone =
    phone.length === 10
      ? `+91 ${phone.slice(0, 5)} •••••`
      : '+91 ••••• •••••';

  // Modal Content Form
  const renderAuthContent = () => {
    return (
      <div className="flex flex-col">
        {/* Step 1: Phone Entry Screen */}
        {step === 'PHONE' && (
          <div>
            {/* Header with Playfair Typography */}
            <div className="text-center pt-2 pb-5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blush flex items-center justify-center text-rose-plum mb-3 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2
                id="auth-modal-title"
                className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-tight"
              >
                Welcome to Glamgo
              </h2>
              <p className="text-xs sm:text-sm text-mauve-grey mt-1 font-sans">
                Sign in to book beauty services in seconds
              </p>
            </div>

            {/* Phone Input with +91 Country Code Chip */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="customer-phone-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-mauve-grey mb-1.5"
                >
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-12 px-3.5 flex items-center justify-center gap-1.5 bg-mist/50 border border-mist rounded-xl text-sm font-semibold text-ink select-none">
                    <span className="text-xs font-bold text-mauve-grey tracking-wider">IN</span>
                    <span>+91</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      id="customer-phone-input"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      autoFocus
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="98765 43210"
                      aria-invalid={!!phoneError}
                      aria-describedby={phoneError ? 'phone-error-msg' : undefined}
                      className={`w-full h-12 px-4 text-base font-medium text-ink bg-white border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                        phoneError
                          ? 'border-coral-red focus:ring-coral-red/20'
                          : 'border-mist focus:border-rose-plum focus:ring-rose-plum/15'
                      } placeholder:text-mauve-grey/50`}
                    />
                  </div>
                </div>

                {phoneError && (
                  <p
                    id="phone-error-msg"
                    role="alert"
                    aria-live="assertive"
                    className="mt-1.5 text-xs text-coral-red flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              {/* Continue CTA */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={phone.length !== 10}
                isLoading={isLoading}
                onClick={() => handleSendOtp('sms')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-1"
              >
                Continue
              </Button>

              {/* "or" Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-mist" />
                </div>
                <span className="relative px-3 bg-soft-ivory text-xs uppercase tracking-wider text-mauve-grey font-medium">
                  or
                </span>
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 px-4 rounded-xl border border-mist bg-white hover:bg-mist/30 text-ink text-sm font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer active:scale-98 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Browse as Guest Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess?.();
                    onClose();
                  }}
                  className="text-xs sm:text-sm font-medium text-rose-plum hover:text-deep-plum transition-colors cursor-pointer py-1.5"
                >
                  Browse as guest →
                </button>
              </div>

              {/* Developer Access Accordion (Dev Only) */}
              {isDevAuthEnabled && (
                <div className="pt-2 border-t border-mist/80">
                  <button
                    type="button"
                    onClick={() => setShowDevPersonas(!showDevPersonas)}
                    className="w-full text-center text-[11px] font-sans text-mauve-grey hover:text-ink cursor-pointer py-1"
                  >
                    {showDevPersonas ? 'Hide developer personas ▲' : 'Developer access (Quick Personas) ▼'}
                  </button>

                  {showDevPersonas && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 gap-2 mt-2 pt-1"
                    >
                      {DEMO_PERSONAS.map((persona) => {
                        const Icon = persona.icon;
                        return (
                          <button
                            key={persona.email}
                            type="button"
                            onClick={() => handleQuickPersona(persona)}
                            className="flex items-center gap-2 p-2 rounded-xl border border-mist bg-white hover:bg-blush/40 text-left transition-colors cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-soft-ivory flex items-center justify-center text-rose-plum">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-ink truncate">{persona.name}</p>
                              <p className="text-[10px] text-mauve-grey truncate">{persona.badge}</p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Footer Terms */}
              <p className="text-[11px] text-mauve-grey/80 text-center leading-relaxed font-sans pt-1">
                By continuing, you agree to our{' '}
                <a href="#terms" className="underline hover:text-ink">Terms</a> &amp;{' '}
                <a href="#privacy" className="underline hover:text-ink">Privacy Policy</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: 6-Box OTP Verification Screen */}
        {step === 'OTP' && (
          <div>
            <div className="text-center pt-1 pb-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blush flex items-center justify-center text-rose-plum mb-3 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-tight">
                Verify your number
              </h2>
              <p className="text-xs sm:text-sm text-mauve-grey mt-1 font-sans flex items-center justify-center gap-2">
                <span>Code sent to {maskedPhone}</span>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-xs font-semibold text-rose-plum hover:text-deep-plum underline cursor-pointer"
                >
                  Edit
                </button>
              </p>

              {/* Review Tip (Dev Only) */}
              {isDevAuthEnabled && DEV_OTP && (
                <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-champagne-gold/15 text-ink text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
                  <span>For review, enter OTP: <strong>{DEV_OTP}</strong></span>
                </div>
              )}
            </div>

            {/* 6 OTP Boxes with Shake animation on error */}
            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="my-3"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
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
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                      otpError
                        ? 'border-coral-red focus:ring-coral-red/20 text-coral-red'
                        : digit
                        ? 'border-rose-plum text-ink bg-blush/10'
                        : 'border-mist text-ink focus:border-rose-plum focus:ring-rose-plum/15'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="mt-2 text-xs text-coral-red text-center font-medium flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </motion.div>

            {/* Resend Timer & WhatsApp Option */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans px-1">
                <span className="text-mauve-grey">Didn't receive code?</span>
                {resendCooldown > 0 ? (
                  <span className="text-mauve-grey font-medium">
                    Resend OTP in 0:{resendCooldown.toString().padStart(2, '0')}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp('sms')}
                    className="font-semibold text-rose-plum hover:text-deep-plum cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* WhatsApp Alternative */}
              <button
                type="button"
                onClick={() => handleSendOtp('whatsapp')}
                className="w-full h-11 rounded-xl border border-mist bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Get OTP on WhatsApp</span>
              </button>

              {/* Manual Verify Fallback button if needed */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={otpDigits.some((d) => !d)}
                isLoading={isLoading}
                onClick={() => triggerOtpVerification(otpDigits.join(''))}
                className="mt-1"
              >
                Verify &amp; Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: New User Profile Setup */}
        {step === 'PROFILE' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4 pt-1">
            <div className="text-center pb-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-tight">
                Complete your profile
              </h2>
              <p className="text-xs sm:text-sm text-mauve-grey mt-1 font-sans">
                Tell us a bit about you to personalize your beauty suite
              </p>
            </div>

            <div>
              <Input
                label="Full Name *"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rhea Singhania"
                error={nameError || undefined}
              />
            </div>

            <div>
              <Input
                label="Email Address (Optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rhea@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-mauve-grey mb-2">
                Preferred Professional Gender (Optional)
              </label>
              <div className="flex items-center gap-2">
                {(['female', 'male', 'none'] as const).map((gender) => (
                  <Chip
                    key={gender}
                    label={gender === 'female' ? 'Female' : gender === 'male' ? 'Male' : 'No Preference'}
                    selected={preferredGender === gender}
                    onClick={() => setPreferredGender(gender)}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-3"
            >
              Continue to Location
            </Button>
          </form>
        )}

        {/* Step 4: Location Setup Screen */}
        {step === 'LOCATION' && (
          <div className="space-y-4 pt-1">
            <div className="text-center pb-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blush flex items-center justify-center text-rose-plum mb-3 shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-tight">
                Find beauty experts near you
              </h2>
              <p className="text-xs sm:text-sm text-mauve-grey mt-1 font-sans max-w-sm mx-auto">
                We use your location to show available master artists, travel distance, and exact transparent pricing.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLocating}
              onClick={handleUseCurrentLocation}
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Use Current Location
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mist" />
              </div>
              <span className="relative px-3 bg-soft-ivory text-xs uppercase tracking-wider text-mauve-grey font-medium">
                or enter area manually
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="City / Locality"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="e.g. Mumbai"
              />
              <Input
                label="Pincode"
                value={manualPincode}
                onChange={(e) => setManualPincode(e.target.value)}
                placeholder="400050"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onClick={() => handleFinalizeNewUser(manualCity, manualPincode)}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Start Exploring
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render on Mobile as BottomSheet (< 640px)
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={step === 'OTP' ? 'Verification' : step === 'PROFILE' ? 'Profile Setup' : step === 'LOCATION' ? 'Location' : 'Sign In'}
      >
        <div className="pb-4">
          {renderAuthContent()}
        </div>
      </BottomSheet>
    );
  }

  // Render on Desktop as Centered Modal Dialog (>= 640px)
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
          className="fixed inset-0 bg-ink/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-soft-ivory border border-mist rounded-3xl shadow-2xl p-6 sm:p-7 z-10"
          style={{ backgroundColor: '#FFFBF8' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-mist/80 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-sm uppercase text-ink font-semibold">
                GLAMGO
              </span>
              <span className="text-mist">|</span>
              <span className="text-[12px] text-mauve-grey font-sans">
                Atelier Access
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close authentication modal"
              className="w-8 h-8 flex items-center justify-center rounded-full text-mauve-grey hover:text-ink hover:bg-mist/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {renderAuthContent()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
