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
  RefreshCw
} from 'lucide-react';
import { spatialSpring } from '../constants/motion';
import { glamgoApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import { InvoiceModal, InvoiceModalData } from './InvoiceModal';
import { subscribeToSse } from '../hooks/useSseEvents';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { loadCustomerBookings, updateCustomerBookingStatus } from '../utils/storage';

interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
  onBookAgain?: (booking: any) => void;
}

export const CustomerBookingsModal: React.FC<CustomerBookingsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onBookAgain,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders'>('bookings');
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

  // Subscribe to live SSE events to update real-time tracking
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
      artistName: bk.professional?.business_name || 'Tanya Grewal Artistry Studio',
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
        res.data?.message || 'Your appointment has been cancelled and PostgreSQL GiST slot freed.',
        'Cancellation Confirmed'
      );
      setCancellingBookingId(null);
      await fetchCustomerData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to cancel booking', 'Error');
    } finally {
      setIsCancelling(false);
    }
  };

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
        className="fixed inset-0 bg-ink/70 backdrop-blur-md"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-ink">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={spatialSpring}
          className="relative w-full max-w-3xl bg-soft-ivory rounded-3xl shadow-2xl border border-mist overflow-hidden flex flex-col max-h-[90vh]"
          style={{ backgroundColor: '#FFFBF8' }}
        >
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-mist flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blush/60 text-rose-plum flex items-center justify-center border border-rose-plum/20 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="customer-bookings-title"
                  className="font-serif text-xl font-bold text-ink tracking-tight"
                >
                  My Atelier Reservations &amp; Orders
                </h3>
                <span className="text-xs text-mauve-grey font-medium">
                  PRD CUST-06 • Post-Booking Lifecycle &amp; 3PL Logistics
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchCustomerData}
                disabled={isLoading}
                title="Refresh Status"
                className="p-2 rounded-xl text-mauve-grey hover:text-ink hover:bg-mist/40 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-plum' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl text-mauve-grey hover:text-ink hover:bg-mist/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="px-6 pt-4 pb-2 bg-white/70 border-b border-mist flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'text-mauve-grey hover:text-ink hover:bg-blush/30'
              }`}
            >
              Bridal Reservations ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-rose-plum text-white shadow-xs'
                  : 'text-mauve-grey hover:text-ink hover:bg-blush/30'
              }`}
            >
              Cosmetics Shipments ({orders.length})
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {isLoading && (
              <div className="py-12 text-center text-mauve-grey space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-plum" />
                <p className="text-sm font-medium">Rehydrating your reservation telemetry...</p>
              </div>
            )}

            {!isLoading && activeTab === 'bookings' && (
              <div className="space-y-5">
                {bookings.length === 0 ? (
                  <div className="py-16 text-center text-mauve-grey space-y-3">
                    <Calendar className="w-10 h-10 mx-auto text-mist stroke-1" />
                    <h4 className="font-serif text-lg font-semibold text-ink">No Active Reservations</h4>
                    <p className="text-xs text-mauve-grey max-w-sm mx-auto">
                      Explore master artists in the bridal discovery gallery and reserve your wedding appointment.
                    </p>
                  </div>
                ) : (
                  bookings.map((bk) => {
                    const isCancelled = bk.status === 'CANCELLED_BY_CUSTOMER' || bk.status === 'CANCELLED_BY_PRO';
                    const isCompleted = bk.status === 'COMPLETED';
                    const isInProgress = bk.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={bk.id}
                        className={`p-6 rounded-2xl bg-white border transition-all shadow-xs ${
                          isCancelled
                            ? 'border-mist bg-soft-ivory/70 opacity-75'
                            : 'border-mist hover:border-rose-plum/40'
                        }`}
                      >
                        {/* Top Metadata Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-mist/60">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-ink bg-mist/40 px-2 py-0.5 rounded-md">
                                #{bk.booking_number}
                              </span>
                              <span
                                className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                                  isCancelled
                                    ? 'bg-coral-red/10 text-coral-red border border-coral-red/20'
                                    : isCompleted
                                    ? 'bg-mist text-ink'
                                    : isInProgress
                                    ? 'bg-blush text-rose-plum border border-rose-plum/20'
                                    : 'bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20'
                                }`}
                              >
                                {bk.status}
                              </span>
                            </div>
                            <span className="text-xs text-mauve-grey block mt-1">
                              Booked on {new Date(bk.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Check-In OTP Card (Prominent Callout) */}
                          {!isCancelled && (
                            <div className="p-3 rounded-xl bg-champagne-gold/15 border border-champagne-gold/30 flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink block">
                                  Check-In OTP (Show Artist)
                                </span>
                                <span className="font-mono text-lg font-bold tracking-widest text-ink block">
                                  {bk.start_otp_hash || '582914'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyOtp(bk.start_otp_hash || '582914')}
                                className="p-2 rounded-lg bg-white border border-champagne-gold/30 text-ink hover:bg-champagne-gold/20 transition-colors shadow-xs cursor-pointer"
                                title="Copy 6-Digit Check-In OTP"
                              >
                                {copiedOtp === (bk.start_otp_hash || '582914') ? (
                                  <Check className="w-4 h-4 text-emerald-accent" />
                                ) : (
                                  <Copy className="w-4 h-4 text-ink" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Artist & Service Information */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={bk.professional?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80&fm=webp'}
                              alt={bk.professional?.business_name}
                              className="w-12 h-12 rounded-2xl object-cover border border-mist"
                            />
                            <div>
                              <h4 className="font-serif text-base font-bold text-ink">
                                {bk.professional?.business_name || 'Tanya Grewal Artistry Studio'}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-mauve-grey">
                                <Star className="w-3.5 h-3.5 fill-champagne-gold text-champagne-gold" />
                                <span className="font-semibold text-ink">{bk.professional?.rating_avg || 4.95}</span>
                                <span>({bk.professional?.review_count || 120} verified brides)</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs text-ink">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-rose-plum shrink-0" />
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
                              <Clock className="w-4 h-4 text-rose-plum shrink-0" />
                              <span className="font-mono text-xs">
                                {new Date(bk.slot_start || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                {' — '}
                                {new Date(bk.slot_end || Date.now() + 3 * 3600000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-rose-plum shrink-0" />
                              <span className="truncate">{bk.venue_address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial Ledger & Actions Footer */}
                        <div className="pt-4 border-t border-mist flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-xs text-mauve-grey space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span>Total Package:</span>
                              <span className="font-mono font-bold text-ink tabular-nums">
                                ₹{Number(bk.total_amount).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-accent font-medium">
                              <span>30% Deposit Paid (Escrow Held):</span>
                              <span className="font-mono font-bold tabular-nums">
                                ₹{Number(bk.deposit_paid_amount || bk.total_amount * 0.3).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-mauve-grey">
                              <span>Venue Balance Due:</span>
                              <span className="font-mono tabular-nums">
                                ₹{Number(bk.balance_due_amount || bk.total_amount * 0.7).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
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
                              leftIcon={<FileText className="w-3.5 h-3.5 text-rose-plum" />}
                              className="rounded-xl text-xs font-semibold"
                            >
                              GST Tax Invoice
                            </Button>

                            {!isCancelled && !isCompleted && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setCancellingBookingId(bk.id)}
                                leftIcon={<Ban className="w-3.5 h-3.5" />}
                                className="rounded-xl text-xs font-semibold"
                              >
                                Cancel Booking
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

            {!isLoading && activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-16 text-center text-mauve-grey space-y-3">
                    <Package className="w-10 h-10 mx-auto text-mist stroke-1" />
                    <h4 className="font-serif text-lg font-semibold text-ink">No Retail Orders Yet</h4>
                    <p className="text-xs text-mauve-grey max-w-sm mx-auto">
                      Explore our backstage cosmetics shop to purchase high-definition primers, lipsticks, and bridal kits.
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
                        className="p-6 rounded-2xl bg-white border border-mist shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-mist">
                          <div>
                            <span className="font-mono text-xs font-bold text-ink bg-mist/40 px-2 py-0.5 rounded-md">
                              #{ord.order_number}
                            </span>
                            <span className="text-xs text-mauve-grey ml-2">
                              {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-mauve-grey">Total:</span>
                            <span className="font-mono text-sm font-bold text-ink tabular-nums">
                              ₹{Number(ord.total_amount || 3600).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Courier Tracking Banner */}
                        <div className="p-4 rounded-xl bg-champagne-gold/15 border border-champagne-gold/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-ink">
                              <Truck className="w-4 h-4 text-rose-plum" />
                              <span>{courierName}</span>
                            </div>
                            <span className="font-mono text-xs text-ink bg-white px-2 py-0.5 rounded border border-mist">
                              AWB: {awbNumber}
                            </span>
                          </div>

                          {/* Tracking Progress Milestones */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                            <div className="space-y-1">
                              <div className="w-3 h-3 rounded-full bg-emerald-accent mx-auto" />
                              <span className="font-semibold text-ink block">Picked Up</span>
                              <span className="text-[11px] text-mauve-grey block">BOM Central Hub</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-emerald-accent' : 'bg-rose-plum animate-ping'}`} />
                              <span className="font-semibold text-ink block">In Transit</span>
                              <span className="text-[11px] text-mauve-grey block">Air Express</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-emerald-accent' : 'bg-mist'}`} />
                              <span className={`font-semibold block ${isDelivered ? 'text-emerald-accent font-bold' : 'text-mauve-grey'}`}>
                                Delivered
                              </span>
                              <span className="text-[11px] text-mauve-grey block">Recipient Address</span>
                            </div>
                          </div>
                        </div>

                        {/* Order SKUs */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-mauve-grey block">
                            Packaged Items
                          </span>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-soft-ivory border border-mist">
                            <Package className="w-5 h-5 text-rose-plum shrink-0" />
                            <div className="flex-1 text-xs">
                              <span className="font-semibold text-ink block">
                                {ord.items?.[0]?.product?.title || '24K Gold Camellia Glow Serum Primer'}
                              </span>
                              <span className="text-mauve-grey">
                                Brand: {ord.items?.[0]?.product?.brand_name || 'Backstage Formulations'} • Shade: Champagne Luster
                              </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-ink tabular-nums">
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
          <div className="px-6 py-4 bg-white border-t border-mist flex items-center justify-between text-xs text-mauve-grey">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-champagne-gold" />
              <span>Razorpay Route Escrow • Instant PostGIS Exclusion Release Guarantee</span>
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
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 border border-coral-red/30 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-3 text-coral-red">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif text-lg font-bold text-ink">
                  Cancel Appointment?
                </h4>
              </div>

              <div className="text-xs text-mauve-grey space-y-2 bg-blush/40 p-3 rounded-xl border border-blush">
                <p className="font-semibold text-rose-plum">
                  Glamgo Cancellation Policy Tiers:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Notice &gt; 24h:</strong> 100% full refund returned to source account.</li>
                  <li><strong>Notice &lt; 24h:</strong> 70% refund; 30% artist compensation fee applies.</li>
                </ul>
                <p className="pt-1">
                  Confirming will immediately release your slot in the PostgreSQL GiST index for other brides.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCancellingBookingId(null)}
                  disabled={isCancelling}
                  className="rounded-xl text-xs font-semibold text-mauve-grey hover:text-ink"
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
