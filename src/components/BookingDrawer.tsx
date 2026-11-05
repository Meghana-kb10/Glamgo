import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Home as HomeIcon,
  Briefcase,
  HelpCircle,
  ShoppingBag,
  Star,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CartItemProduct, CartItemService, Artist, Product } from '../types';
import { MOCK_ARTISTS } from '../data/mockData';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Chip } from './ui/Chip';
import { BottomSheet } from './ui/BottomSheet';
import { Coupon, AVAILABLE_COUPONS } from '../services/couponService';
import { CouponSheet } from './booking/CouponSheet';
import { ProfessionalPickerSheet } from './booking/ProfessionalPickerSheet';
import { BookingConfirmation } from './booking/BookingConfirmation';
import { addressService, SavedAddress } from '../services/addressService';
import { bookingSlotService, TimeSlot } from '../services/bookingSlotService';
import { pricingService, POPULAR_ADDONS, ServiceAddon, PaymentScheme } from '../services/pricingService';
import { bookingDraftStorage, BookingDraft } from '../utils/bookingDraft';
import { saveCustomerBooking } from '../utils/storage';
import { mockDb } from '../services/mockDatabase';
import { useBookingLock, useHybridCheckout } from '../hooks/useGlamgoApi';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeService: CartItemService | null;
  productCartItems: CartItemProduct[];
  upsellProducts?: Product[];
  onAddUpsellProduct?: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateServiceSlot: (
    date: string,
    timeSlot: string,
    venueAddress: string,
    venueType: 'Home / Venue' | 'Studio Visit'
  ) => void;
  onClearService: () => void;
  onRequireAuth?: (onSuccess: () => void) => void;
  onOpenBookingsModal?: () => void;
  onBookingSuccess?: (booking: any) => void;
  initialStep?: 1 | 2 | 3 | 4;
}

type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'PAY_AFTER_SERVICE';
type UpiAppType = 'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER';

const DYNAMIC_DATES = bookingSlotService.getUpcomingDates(14);

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  activeService,
  productCartItems,
  upsellProducts = [],
  onAddUpsellProduct,
  onRemoveProduct,
  onUpdateServiceSlot,
  onClearService,
  onRequireAuth,
  onOpenBookingsModal,
  onBookingSuccess,
  initialStep = 1,
}) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Wizard Step State (1: Services, 2: Professional, 3: Date & Slot, 4: Address & Summary, 5: Confirmation)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(initialStep);

  // Step 1: Service Quantity & Add-ons
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Step 2: Professional Selection
  const [assignedProType, setAssignedProType] = useState<'best_available' | 'custom'>('best_available');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(
    activeService?.artist || bookingSlotService.getBestAvailableProfessional(MOCK_ARTISTS)
  );
  const [isProPickerOpen, setIsProPickerOpen] = useState(false);

  // Step 3: Date & Time Slot
  const [selectedDate, setSelectedDate] = useState<string>(
    activeService?.date || DYNAMIC_DATES[0].fullDate
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    activeService?.timeSlot || '02:30 PM'
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [venueType, setVenueType] = useState<'Home / Venue' | 'Studio Visit'>('Home / Venue');

  // Step 4: Address, Details & Payment
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() =>
    addressService.getSavedAddresses()
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const addresses = addressService.getSavedAddresses();
    const def = addresses.find((a) => a.isDefault);
    return def ? def.id : addresses[0]?.id || '';
  });
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newHouse, setNewHouse] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newPincode, setNewPincode] = useState('400050');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Hotel / Venue' | 'Other'>('Home');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isForSomeoneElse, setIsForSomeoneElse] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Step 4: Coupons & Payment Plan
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCouponSheetOpen, setIsCouponSheetOpen] = useState(false);
  const [paymentScheme, setPaymentScheme] = useState<PaymentScheme>('ONLINE_FULL');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [upiApp, setUpiApp] = useState<UpiAppType>('GPAY');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isCancellationExpanded, setIsCancellationExpanded] = useState(false);
  const [dateNotice, setDateNotice] = useState<string | null>(null);

  // Step 5: Confirmed Booking ID
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Validation & Loading
  const [shakeStep, setShakeStep] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Hooks
  const { lockSlot } = useBookingLock();
  const { checkout } = useHybridCheckout();

  // Load slot availability when selected date changes
  useEffect(() => {
    let isMounted = true;
    bookingSlotService.getSlotsForDate(selectedDate).then((slots) => {
      if (isMounted) setAvailableSlots(slots);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Load saved draft on open
  useEffect(() => {
    if (!isOpen) return;
    const draft = bookingDraftStorage.load();
    if (draft && draft.activeService) {
      if (draft.step) setCurrentStep(draft.step as any);
      if (draft.serviceQuantity) setServiceQuantity(draft.serviceQuantity);
      if (draft.selectedAddonIds) setSelectedAddonIds(draft.selectedAddonIds);
      if (draft.date) setSelectedDate(draft.date);
      if (draft.timeSlot) setSelectedSlot(draft.timeSlot);
      if (draft.assignedProfessionalType) setAssignedProType(draft.assignedProfessionalType);
      if (draft.selectedArtist) setSelectedArtist(draft.selectedArtist);
      if (draft.selectedAddress) setSelectedAddressId(draft.selectedAddress.id);
      if (draft.specialInstructions) setSpecialInstructions(draft.specialInstructions);
      if (draft.isForSomeoneElse) setIsForSomeoneElse(draft.isForSomeoneElse);
      if (draft.recipientName) setRecipientName(draft.recipientName);
      if (draft.recipientPhone) setRecipientPhone(draft.recipientPhone);
      if (draft.appliedCoupon) setAppliedCoupon(draft.appliedCoupon);
      if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
      if (draft.upiApp) setUpiApp(draft.upiApp);
      if (draft.dateExpiredNotice) setDateNotice(draft.dateExpiredNotice);
    }
  }, [isOpen]);

  // Pricing Calculation
  const bill = useMemo(() => {
    return pricingService.calculateBill({
      activeService,
      serviceQuantity,
      selectedAddonIds,
      productCartItems,
      appliedCoupon,
    });
  }, [activeService, serviceQuantity, selectedAddonIds, productCartItems, appliedCoupon]);

  const activeAddress = savedAddresses.find((a) => a.id === selectedAddressId);
  const formattedAddress = activeAddress
    ? `${activeAddress.street}, ${activeAddress.area}, ${activeAddress.city} - ${activeAddress.pincode}`
    : 'Select Address';

  // Navigation handlers
  const handleNextStep = () => {
    setStepError(null);

    // Validation for Step 1
    if (currentStep === 1) {
      if (!activeService && productCartItems.length === 0) {
        setStepError('Please add at least one service or beauty product.');
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (assignedProType === 'custom' && !selectedArtist) {
        setStepError('Please select a professional or choose Best Available.');
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        return;
      }
      setCurrentStep(3);
      return;
    }

    // Validation for Step 3
    if (currentStep === 3) {
      if (!selectedSlot) {
        setStepError('Please select a valid time slot.');
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        return;
      }
      setCurrentStep(4);
      return;
    }

    // Validation for Step 4
    if (currentStep === 4) {
      if (!selectedAddressId) {
        setStepError('Please select or add a venue address.');
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        return;
      }
      if (isForSomeoneElse && (!recipientName.trim() || recipientPhone.length !== 10)) {
        setStepError('Please enter a recipient name and valid 10-digit mobile number.');
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        return;
      }

      // Deferred Login check
      if (!isAuthenticated || !user) {
        if (onRequireAuth) {
          onRequireAuth(() => {
            handleFinalCheckout();
          });
          return;
        }
      }

      handleFinalCheckout();
    }
  };

  const handleBackStep = () => {
    setStepError(null);
    if (currentStep > 1 && currentStep <= 4) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  // Add new address submit
  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse.trim() || !newArea.trim() || !newPincode.trim()) {
      return;
    }
    const created = addressService.saveAddress({
      label: newLabel,
      street: newHouse.trim(),
      area: newArea.trim(),
      landmark: newLandmark.trim() || undefined,
      city: newCity.trim(),
      state: 'Maharashtra',
      pincode: newPincode.trim(),
      isDefault: true,
    });
    setSavedAddresses(addressService.getSavedAddresses());
    setSelectedAddressId(created.id);
    setIsAddAddressOpen(false);
    toast.success('Address saved and selected', 'Saved');
  };

  // Final Checkout & Payment
  const handleFinalCheckout = async () => {
    if (!isAuthenticated || !user) {
      if (onRequireAuth) {
        onRequireAuth(() => {
          handleFinalCheckout();
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const proId =
        assignedProType === 'custom' && selectedArtist
          ? selectedArtist.id
          : activeService?.artist?.id || 'pro-001';

      const srvIds = activeService?.package?.id
        ? [activeService.package.id, ...selectedAddonIds]
        : ['srv-001'];

      // 1. Lock slot via API
      let lockedId: string | undefined = undefined;
      if (activeService) {
        try {
          const lockRes = await lockSlot({
            customer_id: user?.id || 'usr-cust-001',
            professional_id: proId,
            service_offering_ids: srvIds,
            service_mode: 'AT_VENUE',
            venue_address: {
              street: activeAddress?.street || 'Carter Road',
              city: activeAddress?.city || 'Mumbai',
              state: activeAddress?.state || 'MH',
              postal_code: activeAddress?.pincode || '400050',
              latitude: 19.0607,
              longitude: 72.8362,
            },
            slot_start: `${selectedDate}T14:30:00Z`,
            slot_end: `${selectedDate}T17:30:00Z`,
          });
          lockedId = lockRes.booking.id;
        } catch (e: any) {
          console.warn('[Slot Lock Warning]: Falling back to local reservation slot');
        }
      }

      // 2. Complete Checkout via API
      try {
        await checkout({
          customer_id: user?.id || 'usr-cust-001',
          booking_id: lockedId,
          items: productCartItems.map((p) => ({
            variant_id: p.product.id,
            quantity: p.quantity,
          })),
          shipping_address: {
            street: activeAddress?.street || 'Carter Road',
            city: activeAddress?.city || 'Mumbai',
            state: activeAddress?.state || 'MH',
            postal_code: activeAddress?.pincode || '400050',
            latitude: 19.0607,
            longitude: 72.8362,
          },
          gateway_provider: 'RAZORPAY',
        });
      } catch (e: any) {
        console.warn('[Checkout API Warning]: Using offline transaction settlement');
      }

      const refId = `GLAM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setConfirmedBookingId(refId);

      const newBooking = {
        id: lockedId || `bk-local-${Date.now()}`,
        booking_number: refId,
        status: 'CONFIRMED',
        service_mode: (venueType === 'Studio Visit' ? 'IN_STUDIO' : 'AT_VENUE') as any,
        slot_start: `${selectedDate}T14:30:00Z`,
        slot_end: `${selectedDate}T17:30:00Z`,
        total_amount: bill.grandTotal,
        deposit_paid_amount: bill.depositDueToday || Math.round(bill.grandTotal * 0.3),
        balance_due_amount: bill.balanceAtVenue || (bill.grandTotal - (bill.depositDueToday || 0)),
        start_otp_hash: '582914',
        complete_otp_hash: '394812',
        created_at: new Date().toISOString(),
        professional: {
          id: proId,
          business_name: selectedArtist?.name || 'Tanya Grewal Artistry Studio',
          slug: selectedArtist?.name.toLowerCase().replace(/\s+/g, '-') || 'tanya-grewal',
          rating_avg: selectedArtist?.rating || 4.98,
          review_count: selectedArtist?.reviewCount || 142,
          artist_name: selectedArtist?.name || 'Tanya Grewal',
          avatar_url: selectedArtist?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        services: activeService ? [{
          id: activeService.package.id,
          title: activeService.package.name,
          category: (activeService.package as any).category || 'Bridal',
          base_price: activeService.package.price,
          duration_minutes: activeService.package.durationMinutes,
        }] : [],
        venue_address: formattedAddress || 'Carter Road, Bandra West, Mumbai 400050',
      };
      saveCustomerBooking(newBooking);
      try {
        mockDb.bookings.unshift(newBooking as any);
      } catch {}

      onClearService();
      bookingDraftStorage.clear();
      onBookingSuccess?.(newBooking);
      setCurrentStep(5);
    } catch (err: any) {
      toast.error('Booking confirmation failed. Please check network or try again.', 'Booking Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-wizard-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-text/60 backdrop-blur-md"
        />

        {/* Wizard Container: Full-Height Sheet on Mobile, Centered Modal on Desktop */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] bg-bg border border-border rounded-t-3xl sm:rounded-3xl shadow-warm-lg flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar: Progress Indicator & Navigation */}
          {currentStep <= 4 && (
            <div className="px-5 sm:px-8 py-3.5 border-b border-border bg-card/90 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBackStep}
                    aria-label="Back to previous step"
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-fill transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h2
                    id="booking-wizard-title"
                    className="font-heading text-base sm:text-lg font-bold text-text"
                  >
                    {currentStep === 1 && '1. Service & Package Selection'}
                    {currentStep === 2 && '2. Professional Selection'}
                    {currentStep === 3 && '3. Date & Time Slot Selection'}
                    {currentStep === 4 && '4. Address & Booking Summary'}
                  </h2>
                  <p className="text-[11px] text-text-muted font-sans hidden sm:block">
                    Step {currentStep} of 4 • Progress saved automatically
                  </p>
                </div>
              </div>

              {/* Progress Steps Indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep) setCurrentStep(stepNum as any);
                    }}
                    disabled={stepNum > currentStep}
                    aria-label={`Jump to step ${stepNum}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === stepNum
                        ? 'w-7 sm:w-8 bg-accent'
                        : stepNum < currentStep
                        ? 'w-2.5 sm:w-3 bg-success cursor-pointer'
                        : 'w-2 sm:w-2.5 bg-fill'
                    }`}
                  />
                ))}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close booking drawer"
                  className="ml-3 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-fill transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7">
            {/* Step 5: Booking Confirmation View */}
            {currentStep === 5 && (
              <BookingConfirmation
                bookingId={confirmedBookingId || 'GLAM-2026-94812'}
                serviceTitle={activeService?.package?.name || 'Luxury Artistry Package'}
                artistName={
                  assignedProType === 'custom' && selectedArtist
                    ? selectedArtist.name
                    : 'Best Available Master Artist'
                }
                date={selectedDate}
                timeSlot={selectedSlot}
                address={formattedAddress}
                paymentMethod={paymentMethod}
                grandTotal={bill.grandTotal}
                onViewBooking={() => {
                  onClose();
                  onOpenBookingsModal?.();
                }}
                onClose={onClose}
                onAddProduct={(p) => {
                  onAddUpsellProduct?.(p);
                  toast.success(`Added ${p.name} to your beauty bag`, 'Bag Updated');
                }}
              />
            )}

            {/* Steps 1 to 4: 2-Column Desktop Grid */}
            {currentStep <= 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Active Step Details (60%) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* STEP 1: Services & Add-ons */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      {/* Active Service Card */}
                      {activeService ? (
                        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-warm-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2 py-0.5 rounded-md">
                                {activeService.package.tier || 'Signature Atelier'}
                              </span>
                              <h3 className="font-heading text-lg font-bold text-text mt-1.5">
                                {activeService.package.name}
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5 font-sans">
                                {activeService.package.durationMinutes} mins • Verified Professional Service
                              </p>
                              <p className="font-heading text-base font-bold text-text mt-2">
                                ₹{activeService.package.price.toLocaleString('en-IN')}
                              </p>
                            </div>

                            {/* Stepper & Remove */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center border border-border rounded-xl bg-fill p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setServiceQuantity((q) => Math.max(1, q - 1))}
                                  aria-label="Decrease quantity"
                                  className="w-7 h-7 flex items-center justify-center text-text hover:bg-card rounded-lg text-sm font-bold cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-text font-mono">
                                  {serviceQuantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setServiceQuantity((q) => q + 1)}
                                  aria-label="Increase quantity"
                                  className="w-7 h-7 flex items-center justify-center text-text hover:bg-card rounded-lg text-sm font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={onClearService}
                                className="text-xs text-error hover:underline flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-card border border-dashed border-border text-center">
                          <p className="text-sm font-medium text-text-muted">
                            No service package currently selected.
                          </p>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 text-xs font-bold text-accent hover:underline cursor-pointer"
                          >
                            Explore Master Artists →
                          </button>
                        </div>
                      )}

                      {/* Optional Add-ons Checklist */}
                      <div className="pt-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
                          Enhance Your Appointment (Optional Add-ons)
                        </h4>
                        <div className="space-y-2">
                          {POPULAR_ADDONS.map((addon) => {
                            const isChecked = selectedAddonIds.includes(addon.id);
                            return (
                              <label
                                key={addon.id}
                                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                                  isChecked
                                    ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                                    : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setSelectedAddonIds((prev) =>
                                        isChecked
                                          ? prev.filter((id) => id !== addon.id)
                                          : [...prev, addon.id]
                                      );
                                    }}
                                    className="mt-1 w-4 h-4 rounded text-accent accent-accent cursor-pointer"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-text">{addon.name}</p>
                                    <p className="text-[11px] text-text-muted font-sans">
                                      {addon.description}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-heading text-xs font-bold text-text whitespace-nowrap">
                                  +₹{addon.price.toLocaleString('en-IN')}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Retail Products in Bag (Delivered to You) */}
                      {productCartItems.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                            <span>Delivered to Your Venue (Beauty Products)</span>
                          </h4>
                          <div className="space-y-2">
                            {productCartItems.map((item) => (
                              <div
                                key={item.product.id}
                                className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-3 shadow-warm-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                                  />
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-text truncate">{item.product.name}</p>
                                    <p className="font-heading text-xs text-accent font-semibold">
                                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onRemoveProduct(item.product.id)}
                                  className="text-xs text-text-muted hover:text-error cursor-pointer p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: Professional Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Choose Who Performs Your Service
                        </h4>
                        <p className="text-xs text-text-muted mb-3">
                          Select the recommended master professional or hand-pick a specific artist based on their lookbook and client reviews.
                        </p>
                      </div>

                      {/* Option 1: Best Available Professional */}
                      <button
                        type="button"
                        onClick={() => {
                          setAssignedProType('best_available');
                        }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          assignedProType === 'best_available'
                            ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                            : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shrink-0 shadow-warm-xs">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-text">
                                Best Available Professional
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent">
                                Recommended
                              </span>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5 leading-relaxed font-sans">
                              Glamgo algorithm assigns the highest-rated (4.9+) background-verified stylist closest to your venue for zero delay.
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-success font-semibold font-sans">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>100% verified credentials & hospital-sterilized tools</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              assignedProType === 'best_available'
                                ? 'border-accent bg-accent text-white'
                                : 'border-border bg-card'
                            }`}
                          >
                            {assignedProType === 'best_available' && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </button>

                      {/* Option 2: Specific Master Artists List */}
                      <div className="pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
                          Or Select a Specific Master Artist
                        </p>

                        <div className="space-y-2.5">
                          {MOCK_ARTISTS.slice(0, 3).map((artist) => {
                            const isSelected = assignedProType === 'custom' && selectedArtist?.id === artist.id;

                            return (
                              <button
                                key={artist.id}
                                type="button"
                                onClick={() => {
                                  setAssignedProType('custom');
                                  setSelectedArtist(artist);
                                }}
                                className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                  isSelected
                                    ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                                    : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={artist.avatar}
                                    alt={artist.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h5 className="text-sm font-bold text-text">{artist.name}</h5>
                                      {artist.isVerified && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-success" />
                                      )}
                                    </div>
                                    <p className="text-xs text-text-muted truncate max-w-[200px]">
                                      {artist.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-text-muted">
                                      <span className="flex items-center gap-0.5 text-text font-semibold">
                                        <Star className="w-3 h-3 fill-star text-star" />
                                        {artist.rating}
                                      </span>
                                      <span>•</span>
                                      <span>{artist.reviewCount} reviews</span>
                                      <span>•</span>
                                      <span className="text-accent font-semibold">{artist.location}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                      isSelected
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-border bg-card'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Date & Time Slot Selection */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      {/* Service Mode Selector */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Service Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setVenueType('Home / Venue')}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              venueType === 'Home / Venue'
                                ? 'bg-accent text-white border-accent shadow-warm-xs'
                                : 'bg-card text-text border-border hover:bg-fill'
                            }`}
                          >
                            <HomeIcon className="w-4 h-4" />
                            <span>Doorstep At-Home</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setVenueType('Studio Visit')}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              venueType === 'Studio Visit'
                                ? 'bg-accent text-white border-accent shadow-warm-xs'
                                : 'bg-card text-text border-border hover:bg-fill'
                            }`}
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Salon / Studio Visit</span>
                          </button>
                        </div>
                      </div>

                      {/* Expired Date Notice Banner */}
                      {dateNotice && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-warm-xs">
                          <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="font-medium">{dateNotice}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDateNotice(null)}
                            aria-label="Dismiss date notice"
                            className="text-amber-800 hover:text-text cursor-pointer p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Dynamic 14-Day Date Strip */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Select Appointment Date (Next 14 Days)
                        </label>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                          {DYNAMIC_DATES.map((d) => {
                            const isSelected = selectedDate === d.fullDate;
                            return (
                              <button
                                key={d.fullDate}
                                type="button"
                                onClick={() => setSelectedDate(d.fullDate)}
                                className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-2xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-accent text-white border-accent shadow-warm-xs'
                                    : 'bg-card text-text border-border hover:border-accent/40'
                                }`}
                              >
                                <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                                  {d.dayName}
                                </span>
                                <span className="font-heading text-lg font-bold leading-tight my-0.5">
                                  {d.dayNumber}
                                </span>
                                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                                  {d.monthShort}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots Grouped by Period */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Choose Arrival Window
                        </label>
                        <div className="space-y-3">
                          {(['Morning', 'Afternoon', 'Evening'] as const).map((period) => {
                            const periodSlots = availableSlots.filter((s) => s.period === period);
                            return (
                              <div key={period} className="bg-card p-3 rounded-2xl border border-border shadow-warm-xs">
                                <span className="text-xs font-bold text-text mb-2 block">{period}</span>
                                <div className="grid grid-cols-3 gap-2">
                                  {periodSlots.map((slot) => {
                                    const isSelected = selectedSlot === slot.time;
                                    return (
                                      <button
                                        key={slot.id}
                                        type="button"
                                        disabled={!slot.isAvailable}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center cursor-pointer ${
                                          !slot.isAvailable
                                            ? 'bg-fill/40 text-text-muted/40 border-border cursor-not-allowed line-through'
                                            : isSelected
                                            ? 'bg-accent text-white border-accent shadow-warm-xs'
                                            : 'bg-bg text-text border-border hover:border-accent/40'
                                        }`}
                                      >
                                        <span>{slot.time}</span>
                                        {!slot.isAvailable && (
                                          <span className="text-[9px] uppercase tracking-wider text-text-muted/60 no-underline">
                                            Booked
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Address, Details & Review */}
                  {currentStep === 4 && (
                    <div className="space-y-5">
                      {/* Saved Address Cards */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                            Service Venue Address
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddAddressOpen(true)}
                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {savedAddresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            const Icon = addr.label === 'Work' ? Briefcase : HomeIcon;

                            return (
                              <label
                                key={addr.id}
                                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                                    : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    name="selected-address"
                                    checked={isSelected}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="mt-1 w-4 h-4 text-accent accent-accent"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <Icon className="w-3.5 h-3.5 text-accent" />
                                      <span className="text-xs font-bold text-text">{addr.label}</span>
                                      {addr.isDefault && (
                                        <span className="text-[10px] font-semibold text-text-muted">
                                          (Default)
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-text font-medium mt-1">
                                      {addr.street}, {addr.area}
                                    </p>
                                    <p className="text-[11px] text-text-muted font-sans">
                                      {addr.city} - {addr.pincode}
                                      {addr.landmark && ` • Landmark: ${addr.landmark}`}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Instructions for Professional */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                          Special Instructions for Professional (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="e.g. Please ring bell twice, parking available in visitor bay, floor 4 with lift"
                          className="w-full p-3 text-xs sm:text-sm text-text bg-card border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-text-muted/50"
                        />
                      </div>

                      {/* "Booking for someone else?" Toggle */}
                      <div className="p-4 rounded-2xl bg-card border border-border shadow-warm-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-text">Booking for someone else?</p>
                            <p className="text-[11px] text-text-muted font-sans">
                              We will send appointment SMS & tracking to the recipient
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isForSomeoneElse}
                            onChange={(e) => setIsForSomeoneElse(e.target.checked)}
                            className="w-4 h-4 text-accent accent-accent cursor-pointer"
                          />
                        </div>

                        {isForSomeoneElse && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border"
                          >
                            <Input
                              label="Recipient Name *"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              placeholder="e.g. Diya Mehta"
                            />
                            <Input
                              label="Recipient Mobile *"
                              type="tel"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="98765 43210"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Coupon Row */}
                      <div className="p-3.5 rounded-2xl bg-card border border-border shadow-warm-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-bold text-text">
                              {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Apply Coupon / Voucher'}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {appliedCoupon
                                ? `You saved ₹${bill.couponDiscount}`
                                : 'Save up to ₹2,000 with available offers'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsCouponSheetOpen(true)}
                          className="text-xs font-bold text-accent hover:underline cursor-pointer"
                        >
                          {appliedCoupon ? 'Change' : 'View Offers →'}
                        </button>
                      </div>

                      {/* Payment Plan Selection */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Choose Payment Plan
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Full Online */}
                          <div
                            onClick={() => {
                              setPaymentScheme('ONLINE_FULL');
                              if (paymentMethod === 'PAY_AFTER_SERVICE') setPaymentMethod('UPI');
                            }}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                              paymentScheme === 'ONLINE_FULL'
                                ? 'border-accent bg-accent-soft/40 shadow-warm-xs ring-1 ring-accent'
                                : 'border-border bg-card hover:border-accent/40'
                            }`}
                          >
                            <span className="text-[11px] font-bold text-text block">Pay Full Online</span>
                            <span className="font-heading text-sm font-bold text-accent block mt-0.5">
                              ₹{bill.grandTotal.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-text-muted block mt-1">₹0 due at door • Fast check-in</span>
                          </div>

                          {/* Pay After Service */}
                          <div
                            onClick={() => {
                              setPaymentScheme('PAY_AFTER_SERVICE');
                              setPaymentMethod('PAY_AFTER_SERVICE');
                            }}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                              paymentScheme === 'PAY_AFTER_SERVICE'
                                ? 'border-accent bg-accent-soft/40 shadow-warm-xs ring-1 ring-accent'
                                : 'border-border bg-card hover:border-accent/40'
                            }`}
                          >
                            <span className="text-[11px] font-bold text-text block">Pay After Service</span>
                            <span className="font-heading text-sm font-bold text-success block mt-0.5">
                              ₹0 now
                            </span>
                            <span className="text-[10px] text-text-muted block mt-1">
                              ₹{bill.grandTotal.toLocaleString('en-IN')} at your door
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          {paymentScheme === 'PAY_AFTER_SERVICE' ? 'Doorstep Settlement' : 'Payment Method'}
                        </label>
                        <div className="space-y-2">
                          {paymentScheme !== 'PAY_AFTER_SERVICE' ? (
                            <>
                              <label
                                className={`p-3.5 rounded-2xl border flex flex-col gap-2 cursor-pointer transition-all ${
                                  paymentMethod === 'UPI'
                                    ? 'border-accent bg-accent-soft/40'
                                    : 'border-border bg-card'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="radio"
                                      name="pay-method"
                                      checked={paymentMethod === 'UPI'}
                                      onChange={() => setPaymentMethod('UPI')}
                                      className="w-4 h-4 text-accent accent-accent"
                                    />
                                    <span className="text-xs font-bold text-text">UPI (Instant & Zero Fee)</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                    Recommended
                                  </span>
                                </div>

                                {paymentMethod === 'UPI' && (
                                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
                                    {(['GPAY', 'PHONEPE', 'PAYTM', 'OTHER'] as const).map((app) => (
                                      <button
                                        key={app}
                                        type="button"
                                        onClick={() => setUpiApp(app)}
                                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                          upiApp === app
                                            ? 'bg-accent text-white border-accent'
                                            : 'bg-card text-text border-border hover:bg-fill'
                                        }`}
                                      >
                                        {app}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </label>

                              <label
                                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                  paymentMethod === 'CARD'
                                    ? 'border-accent bg-accent-soft/40'
                                    : 'border-border bg-card'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="radio"
                                    name="pay-method"
                                    checked={paymentMethod === 'CARD'}
                                    onChange={() => setPaymentMethod('CARD')}
                                    className="w-4 h-4 text-accent accent-accent"
                                  />
                                  <span className="text-xs font-bold text-text">Credit / Debit Cards</span>
                                </div>
                                <CreditCard className="w-4 h-4 text-text-muted" />
                              </label>
                            </>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center gap-3">
                              <Wallet className="w-5 h-5 text-accent shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-text">Pay After Service Complete</p>
                                <p className="text-[11px] text-text-muted">
                                  Pay via Cash or UPI directly to your stylist after verifying your treatment satisfaction.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transparent Cancellation Policy Accordion */}
                      <div className="p-3.5 rounded-2xl bg-bg-alt border border-border">
                        <button
                          type="button"
                          onClick={() => setIsCancellationExpanded((prev) => !prev)}
                          className="w-full flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-text">
                            <ShieldCheck className="w-4 h-4 text-accent" />
                            <span>Glamgo Cancellation & Safety Promise</span>
                          </div>
                          {isCancellationExpanded ? (
                            <ChevronUp className="w-4 h-4 text-text-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted" />
                          )}
                        </button>

                        {isCancellationExpanded && (
                          <div className="mt-2.5 pt-2.5 border-t border-border text-[11px] text-text-muted leading-relaxed font-sans space-y-1">
                            <p>• <strong>Free cancellation</strong> up to 4 hours before your selected arrival slot.</p>
                            <p>• 100% single-use mono-dose packs opened fresh before you.</p>
                            <p>• Background-verified, certified master professionals only.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Sticky Summary & Bill Breakdown (40%) */}
                <div className="lg:col-span-5">
                  <div className="sticky top-0 p-5 rounded-2xl bg-card border border-border shadow-warm space-y-4">
                    <h3 className="font-heading text-sm font-bold text-text pb-2 border-b border-border">
                      Booking Summary
                    </h3>

                    {/* Quick Recap */}
                    <div className="space-y-2 text-xs">
                      {activeService && (
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-text">{activeService.package.name} (x{serviceQuantity})</span>
                          <span className="font-bold text-text">₹{(activeService.package.price * serviceQuantity).toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Professional Assigned */}
                      <div className="flex items-center justify-between text-text-muted pt-1">
                        <span>Professional:</span>
                        <span className="font-semibold text-text">
                          {assignedProType === 'best_available' ? 'Best Available Pro' : selectedArtist?.name}
                        </span>
                      </div>

                      {/* Date & Slot */}
                      <div className="flex items-center justify-between text-text-muted">
                        <span>Arrival Slot:</span>
                        <span className="font-semibold text-text">{selectedDate} • {selectedSlot}</span>
                      </div>

                      {/* Add-ons line */}
                      {bill.addonsTotal > 0 && (
                        <div className="flex items-center justify-between text-text-muted">
                          <span>Add-ons ({selectedAddonIds.length}):</span>
                          <span className="font-semibold text-text">+₹{bill.addonsTotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Retail items */}
                      {bill.productsTotal > 0 && (
                        <div className="flex items-center justify-between text-text-muted">
                          <span>Beauty Products:</span>
                          <span className="font-semibold text-text">+₹{bill.productsTotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Coupon discount */}
                      {bill.couponDiscount > 0 && (
                        <div className="flex items-center justify-between text-success font-semibold">
                          <span>Coupon Discount:</span>
                          <span>−₹{bill.couponDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Hygiene and Safety Fee */}
                      <div className="flex items-center justify-between text-text-muted">
                        <span>Hygiene & Sanitized Kits:</span>
                        <span className="text-success font-bold">FREE (₹0)</span>
                      </div>
                    </div>

                    {/* Total Divider */}
                    <div className="pt-3 border-t border-border flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-text-muted block">Grand Total</span>
                        <span className="text-[10px] text-text-muted">Taxes included</span>
                      </div>
                      <span className="font-heading text-xl font-bold text-accent">
                        ₹{bill.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Step Error Notice */}
                    {stepError && (
                      <div
                        className={`p-2.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2 ${
                          shakeStep ? 'animate-shake' : ''
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{stepError}</span>
                      </div>
                    )}

                    {/* Continue Button */}
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      onClick={handleNextStep}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Securing Reservation...</span>
                        </span>
                      ) : currentStep === 4 ? (
                        paymentScheme === 'PAY_AFTER_SERVICE'
                          ? 'Confirm Booking (Pay at Door)'
                          : `Pay ₹${bill.grandTotal.toLocaleString('en-IN')} & Confirm`
                      ) : (
                        `Continue to Step ${currentStep + 1} →`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sheet Modals: Coupon Sheet & Pro Picker */}
      <CouponSheet
        isOpen={isCouponSheetOpen}
        onClose={() => setIsCouponSheetOpen(false)}
        orderSubtotal={bill.grandTotal}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(cpn) => {
          setAppliedCoupon(cpn);
          toast.success(`Coupon ${cpn.code} applied!`, 'Discount Activated');
        }}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          toast.info('Coupon removed', 'Discount');
        }}
      />

      <ProfessionalPickerSheet
        isOpen={isProPickerOpen}
        onClose={() => setIsProPickerOpen(false)}
        selectedArtist={selectedArtist}
        assignedType={assignedProType}
        onSelectBestAvailable={() => {
          setAssignedProType('best_available');
          setSelectedArtist(bookingSlotService.getBestAvailableProfessional(MOCK_ARTISTS));
          toast.info('Matched with highest-rated available stylist', 'Pro Assigned');
        }}
        onSelectArtist={(artist) => {
          setAssignedProType('custom');
          setSelectedArtist(artist);
          toast.info(`Selected ${artist.name}`, 'Pro Assigned');
        }}
      />
    </AnimatePresence>
  );
};
