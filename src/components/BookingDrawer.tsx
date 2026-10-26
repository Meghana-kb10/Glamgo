import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Home,
  Building2,
  KeyRound,
  Check,
  ChevronRight,
  CreditCard,
  FileText
} from 'lucide-react';
import { Artist, ServicePackage, Product, CartItemService, CartItemProduct } from '../types';
import { spatialSpring, snappySpring, bouncySpring } from '../constants/motion';
import { triggerBookingSuccessCelebration } from '../utils/confetti';
import { useBookingLock, useHybridCheckout, useBookingOtp } from '../hooks/useGlamgoApi';
import { InvoiceModal, InvoiceModalData } from './InvoiceModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeService: CartItemService | null;
  productCartItems: CartItemProduct[];
  upsellProducts: Product[];
  onAddUpsellProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateServiceSlot: (date: string, timeSlot: string, venueAddress: string, venueType: 'Home / Venue' | 'Studio Visit') => void;
  onClearService: () => void;
}

const UPCOMING_DATES = [
  { dayName: 'Fri', dateNumber: '14', fullDate: '2026-11-14' },
  { dayName: 'Sat', dateNumber: '15', fullDate: '2026-11-15' },
  { dayName: 'Sun', dateNumber: '16', fullDate: '2026-11-16' },
  { dayName: 'Mon', dateNumber: '17', fullDate: '2026-11-17' },
  { dayName: 'Tue', dateNumber: '18', fullDate: '2026-11-18' },
  { dayName: 'Wed', dateNumber: '19', fullDate: '2026-11-19' },
  { dayName: 'Thu', dateNumber: '20', fullDate: '2026-11-20' },
];

const TIME_SLOTS = [
  '08:30 AM',
  '11:00 AM',
  '02:30 PM',
  '05:00 PM',
  '07:30 PM',
];

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  activeService,
  productCartItems,
  upsellProducts,
  onAddUpsellProduct,
  onRemoveProduct,
  onUpdateServiceSlot,
  onClearService,
}) => {
  // Auth Context
  const { user } = useAuth();
  const toast = useToast();

  // Local slot & address states
  const [selectedDate, setSelectedDate] = useState<string>(
    activeService?.date || UPCOMING_DATES[1].fullDate
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    activeService?.timeSlot || '02:30 PM'
  );
  const [venueAddress, setVenueAddress] = useState<string>(
    activeService?.venueAddress || 'Sea View Penthouse, Bandra West, Mumbai'
  );
  const [venueType, setVenueType] = useState<'Home / Venue' | 'Studio Visit'>(
    activeService?.venueType || 'Home / Venue'
  );

  // API Hooks
  const { lockSlot, lockedBooking, isLocking } = useBookingLock();
  const { checkout, checkoutResult, isCheckingOut } = useHybridCheckout();
  const { verifyOtp, verificationResult, isVerifying, error: otpError } = useBookingOtp();

  // Validation Shake Trigger states
  const [slotShake, setSlotShake] = useState(false);
  const [addressShake, setAddressShake] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // OTP Verification Interactive State
  const [otpInput, setOtpInput] = useState('');
  const [otpMode, setOtpMode] = useState<'START' | 'COMPLETE'>('START');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);

  // 10-Minute Radial Lock Countdown Timer (seconds from 600 down to 0)
  const [secondsRemaining, setSecondsRemaining] = useState(600);

  useEffect(() => {
    if (!isOpen || !activeService) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeService]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Radial progress calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (600 - secondsRemaining) / 600;
  const strokeDashoffset = circumference * progressPercent;

  // Totals
  const servicePrice = activeService ? activeService.package.price : 0;
  const productSubtotal = productCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const escrowDepositDueToday = Math.round(servicePrice * 0.3) + productSubtotal;
  const balanceAtVenue = Math.round(servicePrice * 0.7);

  const handleCheckout = async () => {
    if (activeService && !selectedTime) {
      setSlotShake(true);
      setTimeout(() => setSlotShake(false), 500);
      return;
    }
    if (activeService && venueType === 'Home / Venue' && (!venueAddress || venueAddress.trim() === '')) {
      setAddressShake(true);
      setTimeout(() => setAddressShake(false), 500);
      return;
    }

    try {
      let createdBookingId = undefined;

      // 1. Lock slot via API if active service exists
      if (activeService) {
        const lockRes = await lockSlot({
          customer_id: 'usr-cust-001',
          professional_id: 'pro-001',
          service_offering_ids: ['srv-001'],
          service_mode: venueType === 'Home / Venue' ? 'AT_VENUE' : 'IN_STUDIO',
          venue_address: {
            street: venueAddress,
            city: 'Mumbai',
            state: 'MH',
            postal_code: '400050',
            latitude: 19.0607,
            longitude: 72.8362,
          },
          slot_start: `${selectedDate}T14:30:00Z`,
          slot_end: `${selectedDate}T17:30:00Z`,
        });
        createdBookingId = lockRes.booking.id;
      }

      // 2. Process Hybrid Checkout via API
      await checkout({
        customer_id: user?.id || 'usr-cust-001',
        booking_id: createdBookingId,
        items: productCartItems.map((p) => ({
          variant_id: 'var-001',
          quantity: p.quantity,
        })),
        shipping_address: {
          street: venueAddress,
          city: 'Mumbai',
          state: 'MH',
          postal_code: '400050',
          latitude: 19.0607,
          longitude: 72.8362,
        },
        gateway_provider: 'RAZORPAY',
      });

      setBookingConfirmed(true);
      triggerBookingSuccessCelebration();
      toast.success(
        'Your luxury bridal reservation & order are secured with 0-collision guarantee.',
        'Reservation Confirmed'
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Booking transaction failed', 'Booking Alert');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length < 6) return;
    try {
      const res = await verifyOtp({
        booking_id: checkoutResult?.booking?.id || 'bk-seed-001',
        otp_type: otpMode,
        otp_code: otpInput,
      });
      setOtpSuccessMessage(res.message);
      toast.success(
        res.message || 'OTP verified! Escrow payout settled to artist account.',
        otpMode === 'START' ? 'Service Commenced' : 'Escrow Settled'
      );
      if (otpMode === 'START') {
        setOtpMode('COMPLETE');
        setOtpInput('');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Invalid OTP code', 'Verification Alert');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={spatialSpring}
          className="w-screen max-w-xl bg-canvas-light shadow-2xl flex flex-col border-l border-rose-gold/25"
        >
          {/* Header */}
          <div className="px-6 py-4 glass-panel border-b border-rose-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-gold" />
              <div>
                <h2 className="font-serif text-xl font-bold text-obsidian">
                  Hybrid Booking & Glam Cart
                </h2>
                <span className="text-[11px] text-obsidian-subtle font-mono">
                  API: /api/v1/bookings/lock & /api/v1/cart/checkout
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-obsidian border border-rose-gold/20 shadow-sm"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            
            {/* 1. 10-Minute Slot-Lock Radial Progress Ring Banner */}
            {activeService && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-obsidian via-obsidian-deep to-obsidian text-white shadow-luxury flex items-center justify-between border border-champagne/30"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        fill="transparent"
                        stroke={secondsRemaining < 120 ? '#B42318' : '#D4AF37'}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <Lock className={`w-4 h-4 absolute inset-auto transition-colors ${secondsRemaining < 120 ? 'text-crimson' : 'text-champagne'}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-champagne-light uppercase tracking-wider">
                        Slot Reserved & Locked
                      </span>
                      <span className="text-[10px] bg-champagne-dark/40 px-1.5 py-0.2 rounded font-mono text-champagne">
                        Redis Redlock Active
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80">
                      Calendar held for you. Expires in{' '}
                      <strong className={`font-mono tabular-nums ${secondsRemaining < 120 ? 'text-crimson font-bold animate-pulse' : 'text-white'}`}>
                        {formatTimer(secondsRemaining)}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-white/60 block">Status</span>
                  <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PostgreSQL GIST Protected</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. Booked Service Card */}
            {activeService ? (
              <div className="p-4 rounded-2xl bg-white border border-rose-gold/25 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeService.artist.avatar}
                      alt={activeService.artist.name}
                      className="w-12 h-12 rounded-xl object-cover border border-champagne"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-gold tracking-wider">
                        Booked Master Artist
                      </span>
                      <h4 className="font-serif text-base font-bold text-obsidian">
                        {activeService.artist.name}
                      </h4>
                      <p className="text-xs text-obsidian-muted">{activeService.package.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-obsidian tabular-nums">
                      ₹{activeService.package.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={onClearService}
                      className="text-xs text-rose-velvet hover:underline flex items-center gap-1 mt-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Date & Time Slot Picker */}
                <motion.div
                  animate={slotShake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className={`pt-3 border-t border-rose-gold/15 space-y-3 rounded-xl p-2.5 transition-colors ${
                    slotShake ? 'border-2 border-rose-velvet bg-rose-blush/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-obsidian flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-gold" />
                      <span>Select Appointment Date</span>
                    </span>
                    <span className="text-[11px] font-mono text-obsidian-subtle">
                      {selectedDate}
                    </span>
                  </div>

                  {/* Horizontal momentum date ribbon */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {UPCOMING_DATES.map((item) => {
                      const isSelected = selectedDate === item.fullDate;
                      return (
                        <motion.button
                          key={item.fullDate}
                          whileTap={{ scale: 0.94 }}
                          transition={snappySpring}
                          onClick={() => {
                            setSelectedDate(item.fullDate);
                            onUpdateServiceSlot(item.fullDate, selectedTime, venueAddress, venueType);
                          }}
                          className={`shrink-0 w-14 py-2 rounded-xl text-center border transition-all ${
                            isSelected
                              ? 'bg-obsidian text-white border-obsidian shadow-sm'
                              : 'bg-white hover:bg-surface-cream text-obsidian border-rose-gold/20'
                          }`}
                        >
                          <span className="text-[10px] block opacity-80 uppercase">{item.dayName}</span>
                          <span className="font-mono text-sm font-bold block">{item.dateNumber}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Time slot pills */}
                  <div>
                    <span className="text-xs font-semibold text-obsidian flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-rose-gold" />
                      <span>Select Preferred Arrival Slot</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <motion.button
                            key={slot}
                            whileTap={{ scale: 0.94 }}
                            transition={snappySpring}
                            onClick={() => {
                              setSelectedTime(slot);
                              onUpdateServiceSlot(selectedDate, slot, venueAddress, venueType);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
                              isSelected
                                ? 'bg-rose-velvet text-white border-rose-velvet shadow-sm'
                                : 'bg-surface-cream text-obsidian border-rose-gold/20 hover:border-rose-gold/50'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Venue / Location selection */}
                  <motion.div
                    animate={addressShake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className={`mt-2 pt-2 border-t border-rose-gold/10 ${
                      addressShake ? 'border-2 border-rose-velvet p-2 rounded-lg bg-rose-blush/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-obsidian">Service Location Mode</span>
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-cream border border-rose-gold/20 text-[11px]">
                        <button
                          onClick={() => setVenueType('Home / Venue')}
                          className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            venueType === 'Home / Venue' ? 'bg-white font-bold shadow-xs' : 'text-obsidian-subtle'
                          }`}
                        >
                          <Home className="w-3 h-3 text-rose-gold" />
                          <span>AT_VENUE</span>
                        </button>
                        <button
                          onClick={() => setVenueType('Studio Visit')}
                          className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            venueType === 'Studio Visit' ? 'bg-white font-bold shadow-xs' : 'text-obsidian-subtle'
                          }`}
                        >
                          <Building2 className="w-3 h-3 text-rose-gold" />
                          <span>IN_STUDIO</span>
                        </button>
                      </div>
                    </div>

                    {venueType === 'Home / Venue' ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-cream/50 border border-rose-gold/20 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-rose-gold shrink-0" />
                        <input
                          type="text"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          placeholder="Enter your hotel suite or home address..."
                          className="w-full bg-transparent outline-none text-obsidian font-medium"
                        />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-surface-cream text-xs text-obsidian-muted flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-rose-gold" />
                        <span>Studio: Glamgo Atelier, 4th Floor, Pali Hill, Bandra West, Mumbai</span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-rose-gold/30 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-rose-gold mx-auto" />
                <h4 className="font-serif font-bold text-obsidian">No Artist Service Selected</h4>
                <p className="text-xs text-obsidian-muted max-w-xs mx-auto">
                  Browse master artists from discovery and tap "Add Service + Select Slot" to lock in your bridal appointment.
                </p>
              </div>
            )}

            {/* 3. Physical Beauty Products in Cart */}
            {productCartItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-obsidian">
                    Cosmetics & Retail SKUs ({productCartItems.length})
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Free Express Delivery (Vendor Sub-Orders)
                  </span>
                </div>

                {productCartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-white border border-rose-gold/20 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain rounded-lg bg-surface-cream p-1"
                      />
                      <div>
                        <span className="text-[10px] font-semibold text-rose-gold uppercase">
                          {item.product.brand}
                        </span>
                        <h5 className="font-serif text-xs font-bold text-obsidian line-clamp-1">
                          {item.product.name}
                        </h5>
                        {item.selectedShade && (
                          <span className="text-[10px] text-obsidian-subtle">
                            Shade: {item.selectedShade}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-obsidian tabular-nums block">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => onRemoveProduct(item.product.id)}
                        className="text-xs text-rose-velvet hover:underline flex items-center gap-1 ml-auto mt-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Complete Your Look Upsell */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-obsidian flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-dark" />
                  <span>Complete Your Look — Editorial Add-ons</span>
                </span>
                <span className="text-[11px] text-obsidian-subtle">Backstage Essentials</span>
              </div>

              <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none">
                {upsellProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="shrink-0 w-44 p-3 rounded-2xl bg-white border border-rose-gold/20 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="aspect-square w-full rounded-xl bg-surface-cream/60 p-2 flex items-center justify-center mb-2">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[9px] uppercase font-bold text-rose-gold block">
                        {prod.brand}
                      </span>
                      <h6 className="font-serif text-xs font-bold text-obsidian line-clamp-1">
                        {prod.name}
                      </h6>
                    </div>

                    <div className="mt-3 pt-2 border-t border-rose-gold/10 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-obsidian tabular-nums">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onAddUpsellProduct(prod)}
                        className="p-1.5 rounded-lg bg-obsidian hover:bg-obsidian-deep text-white shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-champagne-light" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Booking Confirmation & OTP Terminal */}
            <AnimatePresence>
              {bookingConfirmed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-4"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md mb-2">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-emerald-900">
                      Booking & Escrow Confirmed!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                      Transaction ID: <span className="font-mono font-bold">{checkoutResult?.payment_transaction.gateway_payment_id || 'pay_rzp_94819'}</span>
                    </p>
                    {checkoutResult?.booking && (
                      <span className="inline-block mt-1 font-mono text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md font-semibold">
                        Booking #{checkoutResult.booking.booking_number}
                      </span>
                    )}
                  </div>

                  {/* Interactive OTP Verification Simulation */}
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <KeyRound className="w-4 h-4 text-emerald-700" />
                        <span>Interactive Service State Machine (OTP Terminal)</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-100 px-2 py-0.5 rounded font-bold text-emerald-800">
                        Mode: {otpMode}
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      {otpMode === 'START'
                        ? 'When the makeup artist reaches your venue, enter the 6-digit Start OTP (Test OTP: 582914) to transition status to IN_PROGRESS.'
                        : 'Once hair and bridal makeup are finished, enter the 6-digit Complete OTP (Test OTP: 394812) to release Escrow funds!'}
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder={otpMode === 'START' ? 'Enter 582914' : 'Enter 394812'}
                        className="flex-1 px-3 py-2 rounded-lg bg-surface-cream border border-emerald-300 font-mono text-center text-sm font-bold tracking-widest text-obsidian outline-none focus:border-emerald-600"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVerifyOtp}
                        disabled={isVerifying || otpInput.length < 6}
                        className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify OTP'}
                      </motion.button>
                    </div>

                    {otpError && (
                      <span className="text-[11px] text-red-600 font-medium block">
                        {otpError}
                      </span>
                    )}

                    {otpSuccessMessage && (
                      <span className="text-[11px] text-emerald-700 font-semibold block">
                        ✓ {otpSuccessMessage}
                      </span>
                    )}
                  </div>

                  {/* Operational Artifact: View Split-Tax GST Invoice & Receipt */}
                  <div className="space-y-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsInvoiceOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-600 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>View Split-Tax GST Invoice & Receipt</span>
                    </motion.button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setBookingConfirmed(false);
                          onClose();
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm"
                      >
                        Return to Discovery
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Checkout Footer */}
          <div className="p-6 glass-panel border-t border-rose-gold/25 space-y-3 shadow-luxury">
            <div className="space-y-1.5 text-xs text-obsidian-muted">
              {activeService && (
                <>
                  <div className="flex justify-between">
                    <span>Artist Service Total:</span>
                    <span className="font-mono tabular-nums text-obsidian">
                      ₹{servicePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700">
                    <span>30% Escrow Hold (Paid Today):</span>
                    <span className="font-mono tabular-nums font-semibold">
                      ₹{Math.round(servicePrice * 0.3).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-obsidian-subtle">
                    <span>70% Balance (Payable at Venue):</span>
                    <span className="font-mono tabular-nums">
                      ₹{balanceAtVenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}

              {productSubtotal > 0 && (
                <div className="flex justify-between">
                  <span>Luxury Products Subtotal:</span>
                  <span className="font-mono tabular-nums text-obsidian">
                    ₹{productSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-rose-gold/15 flex justify-between items-baseline text-obsidian">
                <span className="font-serif text-base font-bold">Total Due Today:</span>
                <motion.span
                  key={escrowDepositDueToday}
                  initial={{ scale: 1.15, color: '#C87D65' }}
                  animate={{ scale: 1, color: '#181311' }}
                  transition={bouncySpring}
                  className="font-mono text-2xl font-bold tabular-nums"
                >
                  ₹{escrowDepositDueToday.toLocaleString('en-IN')}
                </motion.span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={snappySpring}
              onClick={handleCheckout}
              disabled={(!activeService && productCartItems.length === 0) || isLocking || isCheckingOut}
              className="w-full py-3.5 rounded-2xl bg-obsidian hover:bg-obsidian-deep disabled:bg-obsidian/40 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isLocking || isCheckingOut ? (
                <>
                  <Sparkles className="w-4 h-4 text-champagne-light animate-spin" />
                  <span>Processing Razorpay Escrow Intent...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-champagne-light" />
                  <span>Lock Slot & Proceed to Escrow Payment</span>
                  <ArrowRight className="w-4 h-4 text-champagne-light" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-obsidian-subtle">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-dark" />
              <span>Razorpay Route Escrow • PostgreSQL 16 `EXCLUDE USING gist` Protected</span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Split-Tax GST Invoice & Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        data={{
          orderNumber: (checkoutResult as any)?.order_id || checkoutResult?.order?.id || 'GLAM-ORD-948201',
          bookingNumber: (checkoutResult as any)?.booking_id || checkoutResult?.booking?.id || 'GLAM-BK-492104',
          artistName: activeService?.artist.name || 'Tanya Grewal Artistry Studio',
          packageName: activeService?.package.name || 'Signature Sabyasachi Bridal HD Package',
          packagePrice: activeService?.package.price || 32000,
          checkInOtp: (checkoutResult as any)?.check_in_otp || '4921',
          venueAddress: venueAddress || 'Suite 4B, Pali Hill Heritage, Bandra West, Mumbai 400050',
          products: productCartItems.map((item) => ({
            title: item.product.name || 'Cosmetic Formulation',
            brand: item.product.brand || 'Glamgo Atelier',
            batchNumber: 'BOM-2026-B81',
            expiryDate: '12/2027',
            hsnCode: '3304',
            price: item.product.price,
            quantity: item.quantity,
          })),
        }}
      />
    </div>
  );
};
