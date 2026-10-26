import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight,
  UserCheck,
  FileText,
  RotateCcw,
  BadgeCheck
} from 'lucide-react';
import { MOCK_INCOMING_REQUESTS, MOCK_CALENDAR_SLOTS } from '../data/mockData';
import { IncomingBookingRequest, CalendarTimeSlot } from '../types';
import { snappySpring, spatialSpring, bouncySpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';
import { InvoiceModal, InvoiceModalData } from './InvoiceModal';
import { glamgoApi } from '../services/apiClient';

export const ProStudioDashboard: React.FC = () => {
  const [requests, setRequests] = useState<IncomingBookingRequest[]>(MOCK_INCOMING_REQUESTS);
  const [calendarSlots, setCalendarSlots] = useState<CalendarTimeSlot[]>(MOCK_CALENDAR_SLOTS);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'payouts'>('requests');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeInvoiceData, setActiveInvoiceData] = useState<InvoiceModalData | undefined>(undefined);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  const [payoutsData, setPayoutsData] = useState<{
    gross_revenue: number;
    escrow_held: number;
    platform_commission: number;
    settled_earnings: number;
    total_events: number;
    upcoming_events: number;
    recent_transactions: any[];
  }>({
    gross_revenue: 384000,
    escrow_held: 118000,
    platform_commission: 69120,
    settled_earnings: 314880,
    total_events: 14,
    upcoming_events: 4,
    recent_transactions: [],
  });

  const fetchPayouts = () => {
    glamgoApi.professionals.getPayouts().then((res) => {
      if (res.data) setPayoutsData(res.data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleOpenInvoice = (req: IncomingBookingRequest) => {
    setActiveInvoiceData({
      bookingNumber: req.id,
      customerName: req.clientName,
      packageName: req.packageName,
      packagePrice: req.amount,
      venueAddress: req.venue,
      checkInOtp: '4921',
      escrowStatus: 'HELD_IN_ESCROW',
    });
    setIsInvoiceOpen(true);
  };

  const handleCancelBooking = async (reqId: string) => {
    try {
      const res = await glamgoApi.bookings.cancel(reqId, 'Cancelled from Pro Studio Dashboard');
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: 'DECLINED' } : r))
      );
      setCancelNotice(res.data?.message || 'Slot successfully freed in PostgreSQL GiST index.');
      setTimeout(() => setCancelNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Accept / Decline handlers
  const handleAction = (id: string, action: 'ACCEPTED' | 'DECLINED', e: React.MouseEvent) => {
    if (action === 'ACCEPTED') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      triggerChampagneSparkles(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight
      );
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  // Toggle calendar slot block/available
  const handleToggleSlot = (slotId: string) => {
    setCalendarSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        if (s.status === 'booked') return s; // cannot toggle booked
        return {
          ...s,
          status: s.status === 'available' ? 'blocked' : 'available',
        };
      })
    );
  };

  const days = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredSlots =
    selectedDay === 'All'
      ? calendarSlots
      : calendarSlots.filter((s) => s.day === selectedDay);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Studio Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-gold/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-gold bg-rose-blush/60 px-2.5 py-0.5 rounded-full">
              Partner Pro Studio OS
            </span>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Calendar Live & Synchronized</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian mt-1.5">
            Tanya Grewal Artistry Studio
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-muted">
            Manage bridal inquiries, lock weekly slots, and track milestone payouts held in Escrow.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface-cream rounded-2xl border border-rose-gold/20">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-obsidian text-white shadow-sm'
                : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            Live Inquiries ({requests.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-obsidian text-white shadow-sm'
                : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            Weekly Availability Grid
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'payouts'
                ? 'bg-obsidian text-white shadow-sm'
                : 'text-obsidian-muted hover:text-obsidian'
            }`}
          >
            Escrow & Earnings
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-rose-gold/20 shadow-luxury">
          <div className="flex items-center justify-between text-xs text-obsidian-subtle mb-2">
            <span>This Month's Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-mono text-2xl font-bold text-obsidian block tabular-nums">
            ₹{payoutsData.gross_revenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            PostgreSQL Escrow Ledger Verified
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-gold/20 shadow-luxury">
          <div className="flex items-center justify-between text-xs text-obsidian-subtle mb-2">
            <span>Escrow Vault (Held Safe)</span>
            <Lock className="w-4 h-4 text-champagne-dark" />
          </div>
          <span className="font-mono text-2xl font-bold text-champagne-dark block tabular-nums">
            ₹{payoutsData.escrow_held.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-obsidian-subtle mt-1 block">
            {payoutsData.upcoming_events} events pending completion OTP
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-gold/20 shadow-luxury">
          <div className="flex items-center justify-between text-xs text-obsidian-subtle mb-2">
            <span>Settled to Bank (Net)</span>
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-800 block tabular-nums">
            ₹{payoutsData.settled_earnings.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            After 18% Glamgo commission (₹{payoutsData.platform_commission.toLocaleString('en-IN')})
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-gold/20 shadow-luxury">
          <div className="flex items-center justify-between text-xs text-obsidian-subtle mb-2">
            <span>Upcoming Bridal Events</span>
            <CalendarIcon className="w-4 h-4 text-rose-gold" />
          </div>
          <span className="font-mono text-2xl font-bold text-obsidian block tabular-nums">
            {payoutsData.total_events} Bookings
          </span>
          <span className="text-[11px] text-obsidian-subtle mt-1 block">
            PostGIS radius filtered
          </span>
        </div>
      </div>

      {/* TAB 1: Live Incoming Booking Request Cards with Elastic Accept/Decline */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-obsidian">
                Real-Time Booking Inquiries
              </h2>
              <p className="text-xs text-obsidian-muted">
                Clients who have locked dates and deposited 30% into Escrow awaiting your confirmation.
              </p>
            </div>
            <span className="text-xs font-mono text-rose-gold font-semibold">
              Live Redis Locks Active
            </span>
          </div>

          {cancelNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cancelNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={spatialSpring}
                  className={`p-5 rounded-3xl bg-white border flex flex-col justify-between shadow-luxury transition-all ${
                    req.status === 'ACCEPTED'
                      ? 'border-emerald-500 bg-emerald-50/40'
                      : req.status === 'DECLINED'
                      ? 'border-rose-300 opacity-60 bg-gray-50'
                      : 'border-rose-gold/25 hover:border-rose-gold/50'
                  }`}
                >
                  <div>
                    {/* Header with Client Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.clientAvatar}
                          alt={req.clientName}
                          className="w-12 h-12 rounded-2xl object-cover border border-rose-gold/30"
                        />
                        <div>
                          <h4 className="font-serif text-base font-bold text-obsidian">
                            {req.clientName}
                          </h4>
                          <span className="text-[11px] text-rose-gold font-medium">
                            {req.serviceType}
                          </span>
                        </div>
                      </div>

                      {req.status === 'PENDING' && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{req.countdownSeconds}s left</span>
                        </div>
                      )}
                    </div>

                    {/* Booking Specs */}
                    <div className="p-3.5 rounded-2xl bg-surface-cream/60 space-y-2 text-xs border border-rose-gold/15">
                      <div className="flex justify-between">
                        <span className="text-obsidian-subtle">Package:</span>
                        <span className="font-semibold text-obsidian text-right line-clamp-1">
                          {req.packageName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-obsidian-subtle">Date & Time:</span>
                        <span className="font-mono font-medium text-obsidian">
                          {req.date} • {req.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-obsidian-subtle">Venue:</span>
                        <span className="font-medium text-obsidian text-right line-clamp-1">
                          {req.venue}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-rose-gold/15 flex justify-between items-baseline">
                        <span className="text-obsidian-subtle">Total / Escrow Deposit:</span>
                        <span className="font-mono text-sm font-bold text-obsidian">
                          ₹{req.amount.toLocaleString('en-IN')}{' '}
                          <span className="text-emerald-700 text-xs">
                            (₹{req.depositPaid.toLocaleString('en-IN')} held)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="mt-4 pt-3 border-t border-rose-gold/15">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          transition={snappySpring}
                          onClick={(e) => handleAction(req.id, 'ACCEPTED', e)}
                          className="flex-1 py-2.5 rounded-xl bg-obsidian hover:bg-obsidian-deep text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accept & Confirm</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          transition={snappySpring}
                          onClick={(e) => handleAction(req.id, 'DECLINED', e)}
                          className="px-3 py-2.5 rounded-xl bg-surface-cream text-obsidian-muted hover:text-rose-velvet text-xs font-semibold border border-rose-gold/20"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span
                            className={
                              req.status === 'ACCEPTED'
                                ? 'text-emerald-700 flex items-center gap-1'
                                : 'text-rose-700'
                            }
                          >
                            {req.status === 'ACCEPTED' ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>Confirmed & Held in Calendar</span>
                              </>
                            ) : (
                              'Declined / Slot Cancelled'
                            )}
                          </span>
                        </div>

                        {req.status === 'ACCEPTED' && (
                          <div className="flex items-center gap-2 pt-1">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleOpenInvoice(req)}
                              className="flex-1 py-1.5 rounded-lg bg-surface-cream hover:bg-rose-blush border border-rose-gold/25 text-obsidian text-[11px] font-semibold flex items-center justify-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-rose-gold" />
                              <span>View Split-Tax Invoice</span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelBooking(req.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold flex items-center gap-1"
                              title="Free Slot in PostgreSQL GiST Index"
                            >
                              <RotateCcw className="w-3 h-3 text-red-600" />
                              <span>Free Slot</span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* TAB 2: Weekly Availability Calendar (Click-to-block slots) */}
      {activeTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-white border border-rose-gold/20 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-obsidian">
                Weekly Availability & Slot Locking
              </h2>
              <p className="text-xs text-obsidian-muted">
                Tap any available slot to block it for private travel or personal prep.
              </p>
            </div>

            {/* Day filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDay === day
                      ? 'bg-obsidian text-white'
                      : 'bg-surface-cream text-obsidian hover:bg-rose-blush/60'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSlots.map((slot) => {
              const isAvailable = slot.status === 'available';
              const isBooked = slot.status === 'booked';
              const isBlocked = slot.status === 'blocked';

              return (
                <motion.div
                  key={slot.id}
                  whileTap={!isBooked ? { scale: 0.96 } : {}}
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isBooked
                      ? 'bg-rose-blush/40 border-rose-gold/30 cursor-default'
                      : isBlocked
                      ? 'bg-gray-100 border-gray-300 opacity-70'
                      : 'bg-white hover:border-champagne border-rose-gold/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-obsidian-subtle">
                      {slot.day}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        isBooked
                          ? 'bg-rose-velvet text-white'
                          : isBlocked
                          ? 'bg-gray-300 text-gray-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <span className="font-mono text-base font-bold text-obsidian block">
                    {slot.time}
                  </span>

                  {isBooked ? (
                    <div className="mt-2 text-xs">
                      <span className="font-semibold text-obsidian block">{slot.clientName}</span>
                      <span className="text-[11px] text-obsidian-subtle">{slot.serviceName}</span>
                    </div>
                  ) : isBlocked ? (
                    <span className="text-[11px] text-gray-500 mt-2 block">
                      Tap to unblock slot
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-700 mt-2 block font-medium">
                      Open for Instant Booking
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Escrow & Payouts Bar Chart Tracker */}
      {activeTab === 'payouts' && (
        <div className="p-6 rounded-3xl bg-white border border-rose-gold/20 shadow-luxury space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-obsidian">
              Escrow Protection & Payout Progress
            </h2>
            <p className="text-xs text-obsidian-muted">
              Glamgo holds client deposits in an RBI-compliant nodal escrow vault. Funds are released within 2 hours of service OTP verification.
            </p>
          </div>

          {/* Animated Bar Chart Simulation */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-obsidian-subtle block">
              Recent Payout Cycles
            </span>

            <div className="grid grid-cols-7 gap-2 items-end h-44 pt-6 pb-2 border-b border-rose-gold/20">
              {[
                { day: 'Mon', amount: '₹32,000', height: '65%' },
                { day: 'Tue', amount: '₹18,000', height: '40%' },
                { day: 'Wed', amount: '₹45,000', height: '85%' },
                { day: 'Thu', amount: '₹28,000', height: '55%' },
                { day: 'Fri', amount: '₹62,000', height: '100%' },
                { day: 'Sat', amount: '₹55,000', height: '90%' },
                { day: 'Sun', amount: '₹38,000', height: '70%' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-mono font-bold text-obsidian opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.amount}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: item.height }}
                    transition={{ ...spatialSpring, delay: i * 0.05 }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-obsidian via-rose-gold to-champagne shadow-xs"
                  />
                  <span className="text-[10px] font-bold text-obsidian-subtle">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Escrow Ledger Settlement Table (PRD PRO-05) */}
          <div className="pt-4 border-t border-rose-gold/15 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-obsidian">
                  Direct Bank Transfers &amp; Escrow Ledgers
                </h4>
                <p className="text-xs text-obsidian-muted">
                  Live state synchronized with PostgreSQL 16 `escrow_ledger_entries`
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                Auto-Release Active
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-rose-gold/15 bg-surface-cream/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-cream text-obsidian-subtle uppercase text-[10px] tracking-wider border-b border-rose-gold/15">
                  <tr>
                    <th className="px-4 py-3">Transaction UTR</th>
                    <th className="px-4 py-3">Gross Booking</th>
                    <th className="px-4 py-3">Glamgo Take (18%)</th>
                    <th className="px-4 py-3">Net Artist Payout</th>
                    <th className="px-4 py-3">Escrow Status</th>
                    <th className="px-4 py-3 text-right">Settled Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-gold/10">
                  {payoutsData.recent_transactions.length > 0 ? (
                    payoutsData.recent_transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-rose-blush/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-obsidian">
                          {tx.reference?.slice(0, 16) || tx.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-obsidian">
                          ₹{Number(tx.gross_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-stone-500">
                          -₹{Number(tx.commission).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold tabular-nums text-emerald-800">
                          ₹{Number(tx.net_payout).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tx.status === 'SETTLED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-stone-500 font-mono text-[11px]">
                          {new Date(tx.date || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-stone-500">
                        All eligible bridal milestones have been settled to your verified HDFC bank account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Split-Tax GST Invoice & Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        data={activeInvoiceData}
      />
    </div>
  );
};
