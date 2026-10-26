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
  ChevronRight,
  ExternalLink,
  Ban,
  Star,
  RefreshCw
} from 'lucide-react';
import { snappySpring, spatialSpring } from '../constants/motion';
import { glamgoApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import { InvoiceModal, InvoiceModalData } from './InvoiceModal';
import { subscribeToSse } from '../hooks/useSseEvents';

interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
}

export const CustomerBookingsModal: React.FC<CustomerBookingsModalProps> = ({
  isOpen,
  onClose,
  customerId,
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
      if (bksRes.data) setBookings(bksRes.data);
      if (ordsRes.data) setOrders(ordsRes.data);
    } catch (e: any) {
      console.warn('⚠️ [Customer Bookings Error]:', e.message);
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-stone-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={spatialSpring}
          className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 tracking-tight">
                  My Atelier Reservations &amp; Orders
                </h3>
                <span className="text-[13px] text-stone-500 font-medium">
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
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="px-6 pt-4 pb-2 bg-white/70 border-b border-stone-200/80 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-stone-900 text-stone-50 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Bridal Reservations ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-stone-50 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Cosmetics Shipments ({orders.length})
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {isLoading && (
              <div className="py-12 text-center text-stone-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600" />
                <p className="text-sm font-medium">Rehydrating your reservation telemetry...</p>
              </div>
            )}

            {!isLoading && activeTab === 'bookings' && (
              <div className="space-y-5">
                {bookings.length === 0 ? (
                  <div className="py-16 text-center text-stone-500 space-y-3">
                    <Calendar className="w-10 h-10 mx-auto text-stone-400 stroke-1" />
                    <h4 className="font-serif text-lg font-semibold text-stone-800">No Active Reservations</h4>
                    <p className="text-sm text-stone-500 max-w-sm mx-auto">
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
                            ? 'border-stone-200 bg-stone-50/70 opacity-75'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        {/* Top Metadata Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                                #{bk.booking_number}
                              </span>
                              <span
                                className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                                  isCancelled
                                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                    : isCompleted
                                    ? 'bg-stone-100 text-stone-800'
                                    : isInProgress
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {bk.status}
                              </span>
                            </div>
                            <span className="text-[13px] text-stone-500 block mt-1">
                              Booked on {new Date(bk.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Check-In OTP Card (Prominent Callout) */}
                          {!isCancelled && (
                            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 block">
                                  Check-In OTP (Show Artist)
                                </span>
                                <span className="font-mono text-lg font-bold tracking-widest text-stone-900 block">
                                  {bk.start_otp_hash || '582914'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyOtp(bk.start_otp_hash || '582914')}
                                className="p-2 rounded-lg bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
                                title="Copy 6-Digit Check-In OTP"
                              >
                                {copiedOtp === (bk.start_otp_hash || '582914') ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-stone-700" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Artist & Service Information */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={bk.professional?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={bk.professional?.business_name}
                              className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="font-serif text-base font-bold text-stone-900">
                                {bk.professional?.business_name || 'Tanya Grewal Artistry Studio'}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span className="font-semibold text-stone-900">{bk.professional?.rating_avg || 4.95}</span>
                                <span>({bk.professional?.review_count || 120} verified brides)</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[13px] text-stone-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
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
                              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                              <span className="font-mono text-xs">
                                {new Date(bk.slot_start || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                {' — '}
                                {new Date(bk.slot_end || Date.now() + 3 * 3600000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                              <span className="truncate">{bk.venue_address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial Ledger & Actions Footer */}
                        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-xs text-stone-600 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span>Total Package:</span>
                              <span className="font-mono font-bold text-stone-900 tabular-nums">
                                ₹{Number(bk.total_amount).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-800 font-medium">
                              <span>30% Deposit Paid (Escrow Held):</span>
                              <span className="font-mono font-bold tabular-nums">
                                ₹{Number(bk.deposit_paid_amount || bk.total_amount * 0.3).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-500">
                              <span>Venue Balance Due:</span>
                              <span className="font-mono tabular-nums">
                                ₹{Number(bk.balance_due_amount || bk.total_amount * 0.7).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenInvoice(bk)}
                              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-stone-700" />
                              <span>GST Tax Invoice</span>
                            </button>

                            {!isCancelled && !isCompleted && (
                              <button
                                type="button"
                                onClick={() => setCancellingBookingId(bk.id)}
                                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancel Booking</span>
                              </button>
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
                  <div className="py-16 text-center text-stone-500 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-stone-400 stroke-1" />
                    <h4 className="font-serif text-lg font-semibold text-stone-800">No Retail Orders Yet</h4>
                    <p className="text-sm text-stone-500 max-w-sm mx-auto">
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
                        className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                          <div>
                            <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                              #{ord.order_number}
                            </span>
                            <span className="text-[13px] text-stone-500 ml-2">
                              {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">Total:</span>
                            <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                              ₹{Number(ord.total_amount || 3600).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Courier Tracking Banner */}
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                              <Truck className="w-4 h-4 text-amber-700" />
                              <span>{courierName}</span>
                            </div>
                            <span className="font-mono text-xs text-stone-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                              AWB: {awbNumber}
                            </span>
                          </div>

                          {/* Tracking Progress Milestones */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                            <div className="space-y-1">
                              <div className="w-3 h-3 rounded-full bg-emerald-600 mx-auto" />
                              <span className="font-semibold text-stone-900 block">Picked Up</span>
                              <span className="text-[11px] text-stone-500 block">BOM Central Hub</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-emerald-600' : 'bg-amber-600 animate-ping'}`} />
                              <span className="font-semibold text-stone-900 block">In Transit</span>
                              <span className="text-[11px] text-stone-500 block">Air Express</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`w-3 h-3 rounded-full mx-auto ${isDelivered ? 'bg-emerald-600' : 'bg-stone-300'}`} />
                              <span className={`font-semibold block ${isDelivered ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                                Delivered
                              </span>
                              <span className="text-[11px] text-stone-500 block">Recipient Address</span>
                            </div>
                          </div>
                        </div>

                        {/* Order SKUs */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                            Packaged Items
                          </span>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                            <Package className="w-5 h-5 text-amber-700 shrink-0" />
                            <div className="flex-1 text-xs">
                              <span className="font-semibold text-stone-900 block">
                                {ord.items?.[0]?.product?.title || '24K Gold Camellia Glow Serum Primer'}
                              </span>
                              <span className="text-stone-500">
                                Brand: {ord.items?.[0]?.product?.brand_name || 'Backstage Formulations'} • Shade: Champagne Luster
                              </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-stone-900 tabular-nums">
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
          <div className="px-6 py-4 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Razorpay Route Escrow • Instant PostGIS Exclusion Release Guarantee</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog for Cancellation */}
      <AnimatePresence>
        {cancellingBookingId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 border border-rose-200 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-700">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Cancel Appointment?
                </h4>
              </div>

              <div className="text-xs text-stone-600 space-y-2 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                <p className="font-semibold text-rose-900">
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
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  disabled={isCancelling}
                  className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 text-xs font-semibold"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm"
                >
                  {isCancelling ? 'Releasing Slot...' : 'Confirm Cancellation'}
                </button>
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
