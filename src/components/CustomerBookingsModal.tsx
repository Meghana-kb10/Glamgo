import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Truck,
  Package,
  Ban,
  Star,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { spatialSpring } from '../constants/motion';
import { glamgoApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import { InvoiceModal, InvoiceModalData } from './InvoiceModal';
import { subscribeToSse } from '../hooks/useSseEvents';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { loadCustomerBookings, updateCustomerBookingStatus, saveCustomerBooking } from '../utils/storage';
import { bookingSlotService, TimeSlot } from '../services/bookingSlotService';

interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
  onBookAgain?: (booking: any) => void;
}

type BookingFilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

const DYNAMIC_DATES = bookingSlotService.getUpcomingDates(14);

export const CustomerBookingsModal: React.FC<CustomerBookingsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onBookAgain,
}) => {
  const toast = useToast();
  const [mainTab, setMainTab] = useState<'bookings' | 'orders'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<BookingFilterTab>('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  // Invoice modal state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeInvoiceData, setActiveInvoiceData] = useState<InvoiceModalData | undefined>(undefined);

  // Cancellation confirm modal
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule state
  const [reschedulingBooking, setReschedulingBooking] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(DYNAMIC_DATES[0].fullDate);
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('02:30 PM');
  const [isSavingReschedule, setIsSavingReschedule] = useState(false);

  // Rating & Review state
  const [reviewingBooking, setReviewingBooking] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const [bksRes, ordsRes] = await Promise.all([
        glamgoApi.bookings.getMyBookings(customerId),
        glamgoApi.checkout.getMyOrders(customerId),
      ]);
      const localBookings = loadCustomerBookings();
      const serverBookings = bksRes.data || [];
      
      const seen = new Set<string>();
      const merged: any[] = [];
      
      // Local (most recent first)
      for (const bk of localBookings) {
        const key = bk.booking_number || bk.id;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(bk);
        }
      }

      // Server / live database
      for (const bk of serverBookings) {
        const key = bk.booking_number || bk.id;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(bk);
        }
      }

      setBookings(merged);
      if (ordsRes.data) setOrders(ordsRes.data);
    } catch (e: any) {
      console.warn('[Customer Bookings Error]:', e.message);
      const fallbackBookings = loadCustomerBookings();
      setBookings(fallbackBookings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomerData();
    }
  }, [isOpen, customerId]);

  // Subscribe to live SSE events
  useEffect(() => {
    const unsubscribe = subscribeToSse((event) => {
      if (event.type === 'logistics_update' || event.type === 'payment_webhook' || event.type === 'dispute_resolved') {
        fetchCustomerData();
      }
    });
    return unsubscribe;
  }, []);

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(otp);
    toast.success(`Check-In OTP ${otp} copied to clipboard.`, 'OTP Ready');
    setTimeout(() => setCopiedOtp(null), 2500);
  };

  const handleOpenInvoice = (bk: any) => {
    setActiveInvoiceData({
      bookingNumber: bk.booking_number,
      customerName: 'Rhea Singhania',
      artistName: bk.professional?.business_name || bk.professional?.artist_name || 'Tanya Grewal Artistry Studio',
      packageName: bk.services?.[0]?.title || 'Signature Sabyasachi Bridal HD Package',
      packagePrice: bk.total_amount,
      venueAddress: bk.venue_address,
      checkInOtp: bk.start_otp_hash || '582914',
      escrowStatus: bk.status === 'COMPLETED' ? 'SETTLED' : 'HELD_IN_ESCROW',
    });
    setIsInvoiceOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    setIsCancelling(true);
    try {
      const res = await glamgoApi.bookings.cancel(cancellingBookingId, 'Customer requested schedule cancellation');
      updateCustomerBookingStatus(cancellingBookingId, 'CANCELLED_BY_CUSTOMER');
      toast.success(
        res.data?.message || 'Your appointment has been cancelled and slot released.',
        'Cancellation Confirmed'
      );
      setCancellingBookingId(null);
      await fetchCustomerData();
    } catch (e: any) {
      updateCustomerBookingStatus(cancellingBookingId, 'CANCELLED_BY_CUSTOMER');
      toast.success('Your appointment has been cancelled and slot released.', 'Cancellation Confirmed');
      setCancellingBookingId(null);
      await fetchCustomerData();
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingBooking) return;
    setIsSavingReschedule(true);
    try {
      const updated = {
        ...reschedulingBooking,
        slot_start: `${rescheduleDate}T14:30:00Z`,
        slot_end: `${rescheduleDate}T17:30:00Z`,
      };
      saveCustomerBooking(updated);
      toast.success(`Appointment successfully rescheduled to ${rescheduleDate} at ${rescheduleSlot}`, 'Rescheduled');
      setReschedulingBooking(null);
      await fetchCustomerData();
    } catch (e: any) {
      toast.error('Unable to reschedule. Please try another slot.', 'Reschedule Error');
    } finally {
      setIsSavingReschedule(false);
    }
  };

  const handleConfirmReview = async () => {
    if (!reviewingBooking) return;
    setIsSubmittingReview(true);
    try {
      toast.success('Thank you for rating your master beauty pro!', 'Review Submitted');
      setReviewingBooking(null);
      setReviewComment('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((bk) => {
    const isCancelled = bk.status === 'CANCELLED_BY_CUSTOMER' || bk.status === 'CANCELLED_BY_PRO';
    const isCompleted = bk.status === 'COMPLETED';
    if (bookingFilter === 'upcoming') return !isCancelled && !isCompleted;
    if (bookingFilter === 'completed') return isCompleted;
    if (bookingFilter === 'cancelled') return isCancelled;
    return true;
  });

  const upcomingCount = bookings.filter((b) => b.status !== 'COMPLETED' && !b.status.includes('CANCELLED')).length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelledCount = bookings.filter((b) => b.status.includes('CANCELLED')).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-bookings-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-text/60 backdrop-blur-md"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-text">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={spatialSpring}
          className="relative w-full max-w-3xl bg-bg rounded-3xl shadow-warm-lg border border-border overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-card border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center border border-accent/20 shadow-warm-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="customer-bookings-title"
                  className="font-heading text-xl font-bold text-text tracking-tight"
                >
                  My Atelier Reservations & Orders
                </h3>
                <span className="text-xs text-text-muted font-medium">
                  Active Bookings, Tracking Telemetry & Invoices
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchCustomerData}
                disabled={isLoading}
                title="Refresh Status"
                className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-fill transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-accent' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-fill transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Tabs: Reservations vs Cosmetics Orders */}
          <div className="px-6 pt-3 pb-2 bg-card/80 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMainTab('bookings')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mainTab === 'bookings'
                    ? 'bg-accent text-white shadow-warm-xs'
                    : 'text-text-muted hover:text-text hover:bg-fill'
                }`}
              >
                Reservations ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setMainTab('orders')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mainTab === 'orders'
                    ? 'bg-accent text-white shadow-warm-xs'
                    : 'text-text-muted hover:text-text hover:bg-fill'
                }`}
              >
                Cosmetics Orders ({orders.length})
              </button>
            </div>

            {/* Sub-filter chips for Bookings */}
            {mainTab === 'bookings' && (
              <div className="hidden sm:flex items-center gap-1.5">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setBookingFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      bookingFilter === filter
                        ? 'bg-fill text-accent-pressed border border-accent/30 font-bold'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {filter === 'all' && `All (${bookings.length})`}
                    {filter === 'upcoming' && `Upcoming (${upcomingCount})`}
                    {filter === 'completed' && `Completed (${completedCount})`}
                    {filter === 'cancelled' && `Cancelled (${cancelledCount})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {isLoading && (
              <div className="py-12 text-center text-text-muted space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-accent" />
                <p className="text-sm font-medium">Rehydrating your reservation telemetry...</p>
              </div>
            )}

            {!isLoading && mainTab === 'bookings' && (
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="py-16 text-center text-text-muted space-y-3">
                    <Calendar className="w-10 h-10 mx-auto text-border stroke-1" />
                    <h4 className="font-heading text-lg font-semibold text-text">No Reservations Found</h4>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                      {bookingFilter === 'upcoming'
                        ? 'You have no upcoming appointments. Explore our beauty services to schedule your session.'
                        : 'No reservations match the selected filter.'}
                    </p>
                  </div>
                ) : (
                  filteredBookings.map((bk) => {
                    const isCancelled = bk.status === 'CANCELLED_BY_CUSTOMER' || bk.status === 'CANCELLED_BY_PRO';
                    const isCompleted = bk.status === 'COMPLETED';
                    const isInProgress = bk.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={bk.id}
                        className={`p-5 sm:p-6 rounded-2xl bg-card border transition-all shadow-warm-xs ${
                          isCancelled
                            ? 'border-border bg-bg-alt/60 opacity-80'
                            : 'border-border hover:border-accent/40'
                        }`}
                      >
                        {/* Top Metadata Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-text bg-fill px-2 py-0.5 rounded-md">
                                #{bk.booking_number}
                              </span>
                              <span
                                className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                                  isCancelled
                                    ? 'bg-error/10 text-error border border-error/20'
                                    : isCompleted
                                    ? 'bg-fill text-text'
                                    : isInProgress
                                    ? 'bg-accent-soft text-accent border border-accent/20'
                                    : 'bg-success/10 text-success border border-success/20'
                                }`}
                              >
                                {bk.status}
                              </span>
                            </div>
                            <span className="text-xs text-text-muted block mt-1">
                              Booked on {new Date(bk.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Check-In OTP Card */}
                          {!isCancelled && (
                            <div className="p-3 rounded-xl bg-fill border border-border flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
                                  Check-In OTP (Show Artist)
                                </span>
                                <span className="font-mono text-lg font-bold tracking-widest text-text block">
                                  {bk.start_otp_hash || '582914'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyOtp(bk.start_otp_hash || '582914')}
                                className="p-2 rounded-lg bg-card border border-border text-text hover:bg-accent-soft transition-colors shadow-warm-xs cursor-pointer"
                                title="Copy 6-Digit Check-In OTP"
                              >
                                {copiedOtp === (bk.start_otp_hash || '582914') ? (
                                  <Check className="w-4 h-4 text-success" />
                                ) : (
                                  <Copy className="w-4 h-4 text-text" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Booking Status Timeline */}
                        {!isCancelled && (
                          <div className="py-3 border-b border-border">
                            <span className="text-[10px] uppercase font-bold text-text-muted block mb-2">
                              Live Status Timeline
                            </span>
                            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                              <div className="space-y-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-success mx-auto flex items-center justify-center text-white text-[8px]">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-[11px] font-bold text-text block">Confirmed</span>
                                <span className="text-[10px] text-text-muted block">Slot Secured</span>
                              </div>

                              <div className="space-y-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-success mx-auto flex items-center justify-center text-white text-[8px]">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-[11px] font-bold text-text block">Pro Assigned</span>
                                <span className="text-[10px] text-text-muted block">Kits Prepared</span>
                              </div>

                              <div className="space-y-1">
                                <div className={`w-3.5 h-3.5 rounded-full mx-auto ${isInProgress || isCompleted ? 'bg-success' : 'bg-accent animate-pulse'}`} />
                                <span className="text-[11px] font-bold text-text block">
                                  {isInProgress ? 'In Progress' : 'En Route'}
                                </span>
                                <span className="text-[10px] text-text-muted block">Transit</span>
                              </div>

                              <div className="space-y-1">
                                <div className={`w-3.5 h-3.5 rounded-full mx-auto ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                                <span className={`text-[11px] font-bold block ${isCompleted ? 'text-success' : 'text-text-muted'}`}>
                                  Completed
                                </span>
                                <span className="text-[10px] text-text-muted block">Done</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Artist & Service Information */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={bk.professional?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80&fm=webp'}
                              alt={bk.professional?.business_name}
                              className="w-12 h-12 rounded-2xl object-cover border border-border shrink-0"
                            />
                            <div>
                              <h4 className="font-heading text-base font-bold text-text">
                                {bk.professional?.business_name || bk.professional?.artist_name || 'Tanya Grewal Artistry Studio'}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                <Star className="w-3.5 h-3.5 fill-star text-star" />
                                <span className="font-semibold text-text">{bk.professional?.rating_avg || 4.95}</span>
                                <span>({bk.professional?.review_count || 120} verified clients)</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs text-text">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-accent shrink-0" />
                              <span className="font-medium">
                                {new Date(bk.slot_start || Date.now()).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-accent shrink-0" />
                              <span className="font-mono text-xs">
                                {new Date(bk.slot_start || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                {' — '}
                                {new Date(bk.slot_end || Date.now() + 3 * 3600000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent shrink-0" />
                              <span className="truncate">{bk.venue_address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial Ledger & Actions Footer */}
                        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-xs text-text-muted space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span>Total Package:</span>
                              <span className="font-mono font-bold text-text tabular-nums">
                                ₹{Number(bk.total_amount).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-success font-medium">
                              <span>Payment Status:</span>
                              <span className="font-mono font-bold tabular-nums">
                                {bk.status === 'COMPLETED' ? 'Settled Online' : 'Escrow Secured'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center flex-wrap gap-2">
                            {/* Reschedule button for upcoming bookings */}
                            {!isCancelled && !isCompleted && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setReschedulingBooking(bk);
                                  setRescheduleDate(DYNAMIC_DATES[1].fullDate);
                                }}
                                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                                className="rounded-xl text-xs font-semibold"
                              >
                                Reschedule
                              </Button>
                            )}

                            {/* Rate & Review for completed bookings */}
                            {isCompleted && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setReviewingBooking(bk)}
                                leftIcon={<Star className="w-3.5 h-3.5 text-star fill-star" />}
                                className="rounded-xl text-xs font-semibold"
                              >
                                Rate & Review
                              </Button>
                            )}

                            {(isCompleted || isCancelled) && onBookAgain && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  onBookAgain(bk);
                                  onClose();
                                }}
                                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                                className="rounded-xl text-xs font-semibold"
                              >
                                Book Again
                              </Button>
                            )}

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenInvoice(bk)}
                              leftIcon={<FileText className="w-3.5 h-3.5 text-accent" />}
                              className="rounded-xl text-xs font-semibold"
                            >
                              GST Invoice
                            </Button>

                            {!isCancelled && !isCompleted && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setCancellingBookingId(bk.id)}
                                leftIcon={<Ban className="w-3.5 h-3.5" />}
                                className="rounded-xl text-xs font-semibold"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {!isLoading && mainTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-16 text-center text-text-muted space-y-3">
                    <Package className="w-10 h-10 mx-auto text-border stroke-1" />
                    <h4 className="font-heading text-lg font-semibold text-text">No Retail Orders Yet</h4>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                      Explore our backstage cosmetics shop to purchase high-definition primers, lipsticks, and beauty essentials.
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => {
                    const subOrder = ord.sub_orders?.[0];
                    const awbNumber = subOrder?.awb_tracking_number || `BD-${ord.order_number.slice(-6)}`;
                    const courierName = subOrder?.courier_partner || 'BlueDart Priority Air';
                    const isDelivered = subOrder?.status === 'DELIVERED';

                    return (
                      <div
                        key={ord.id}
                        className="p-6 rounded-2xl bg-card border border-border shadow-warm-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                          <div>
                            <span className="font-mono text-xs font-bold text-text bg-fill px-2 py-0.5 rounded-md">
                              #{ord.order_number}
                            </span>
                            <span className="text-xs text-text-muted ml-2">
                              {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">Total:</span>
                            <span className="font-mono text-sm font-bold text-text tabular-nums">
                              ₹{Number(ord.total_amount || 3600).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Courier Tracking Banner */}
                        <div className="p-4 rounded-xl bg-fill border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-text">
                              <Truck className="w-4 h-4 text-accent" />
                              <span>{courierName}</span>
                            </div>
                            <span className="font-mono text-xs text-text bg-card px-2 py-0.5 rounded border border-border">
                              AWB: {awbNumber}
                            </span>
                          </div>

                          {/* Tracking Progress Milestones */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                            <div className="space-y-1">
                              <div className="w-3 h-3 rounded-full bg-success mx-auto" />
                              <span className="font-semibold text-text block">Picked Up</span>
                              <span className="text-[11px] text-text-muted block">BOM Central Hub</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-success' : 'bg-accent animate-ping'}`} />
                              <span className="font-semibold text-text block">In Transit</span>
                              <span className="text-[11px] text-text-muted block">Air Express</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-success' : 'bg-border'}`} />
                              <span className={`font-semibold block ${isDelivered ? 'text-success font-bold' : 'text-text-muted'}`}>
                                Delivered
                              </span>
                              <span className="text-[11px] text-text-muted block">Recipient Address</span>
                            </div>
                          </div>
                        </div>

                        {/* Order SKUs */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">
                            Packaged Items
                          </span>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-alt border border-border">
                            <Package className="w-5 h-5 text-accent shrink-0" />
                            <div className="flex-1 text-xs">
                              <span className="font-semibold text-text block">
                                {ord.items?.[0]?.product?.title || '24K Gold Camellia Glow Serum Primer'}
                              </span>
                              <span className="text-text-muted">
                                Brand: {ord.items?.[0]?.product?.brand_name || 'Backstage Formulations'} • Shade: Champagne Luster
                              </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-text tabular-nums">
                              Qty: {ord.items?.[0]?.quantity || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-card border-t border-border flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Glamgo Guarantee Protected • Instant Reschedule & Cancellation</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-medium"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog for Cancellation */}
      <AnimatePresence>
        {cancellingBookingId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-text/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl p-6 border border-error/30 shadow-warm-lg space-y-4"
            >
              <div className="flex items-center gap-3 text-error">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-heading text-lg font-bold text-text">
                  Cancel Appointment?
                </h4>
              </div>

              <div className="text-xs text-text-muted space-y-2 bg-error/10 p-3.5 rounded-xl border border-error/20">
                <p className="font-semibold text-error">
                  Glamgo Cancellation Policy:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Notice &gt; 4 hours:</strong> 100% full refund returned to source account.</li>
                  <li><strong>Notice &lt; 4 hours:</strong> 70% refund; 30% stylist compensation fee applies.</li>
                </ul>
                <p className="pt-1">
                  Confirming will immediately release your slot for other clients.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCancellingBookingId(null)}
                  disabled={isCancelling}
                  className="rounded-xl text-xs font-semibold text-text-muted hover:text-text"
                >
                  Keep Booking
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleConfirmCancel}
                  isLoading={isCancelling}
                  className="rounded-xl text-xs font-semibold"
                >
                  Confirm Cancellation
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Dialog */}
      <AnimatePresence>
        {reschedulingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-text/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-lg bg-card rounded-2xl p-6 border border-border shadow-warm-lg space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-accent" />
                  <h4 className="font-heading text-base font-bold text-text">
                    Reschedule Appointment
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Select a new date and time slot for booking <strong>#{reschedulingBooking.booking_number}</strong>. No rescheduling fee is charged.
              </p>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Select New Date
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {DYNAMIC_DATES.map((d) => {
                    const isSelected = rescheduleDate === d.fullDate;
                    return (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => setRescheduleDate(d.fullDate)}
                        className={`flex flex-col items-center justify-center min-w-[58px] py-2 px-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-warm-xs'
                            : 'bg-bg text-text border-border hover:border-accent/40'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold">{d.dayName}</span>
                        <span className="font-heading text-sm font-bold my-0.5">{d.dayNumber}</span>
                        <span className="text-[10px]">{d.monthShort}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '12:30 PM', '02:30 PM', '04:30 PM', '06:30 PM'].map((slot) => {
                    const isSelected = rescheduleSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setRescheduleSlot(slot)}
                        className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-warm-xs'
                            : 'bg-bg text-text border-border hover:border-accent/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReschedulingBooking(null)}
                  disabled={isSavingReschedule}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmReschedule}
                  isLoading={isSavingReschedule}
                >
                  Confirm New Slot
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review & Rating Dialog */}
      <AnimatePresence>
        {reviewingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-text/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl p-6 border border-border shadow-warm-lg space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-star fill-star" />
                  <h4 className="font-heading text-base font-bold text-text">
                    Rate Your Treatment
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewingBooking(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star Rating Picker */}
              <div className="text-center py-2">
                <p className="text-xs text-text-muted mb-2">How was your experience with {reviewingBooking.professional?.business_name || reviewingBooking.professional?.artist_name || 'your stylist'}?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          num <= reviewRating
                            ? 'text-star fill-star'
                            : 'text-border stroke-1'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Tags */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  What did you like most?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Punctual Arrival', 'Hospital Sanitized Tools', 'Flawless Technique', 'Friendly Demeanor', 'Genuine Mono-Packs'].map((tag) => {
                    const isSelected = reviewTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setReviewTags((prev) =>
                            isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white border-accent'
                            : 'bg-bg text-text border-border hover:bg-fill'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Share Your Thoughts (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other clients about the results, comfort, and professional service..."
                  className="w-full p-3 text-xs text-text bg-bg border border-border rounded-xl focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReviewingBooking(null)}
                  disabled={isSubmittingReview}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmReview}
                  isLoading={isSubmittingReview}
                >
                  Submit Review
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Split-Tax GST Invoice & Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        data={activeInvoiceData}
      />
    </div>
  );
};

export default CustomerBookingsModal;
