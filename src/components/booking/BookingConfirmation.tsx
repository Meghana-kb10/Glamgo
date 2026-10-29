import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Share2,
  Download,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';

interface BookingConfirmationProps {
  bookingId: string;
  serviceTitle: string;
  artistName: string;
  date: string;
  timeSlot: string;
  address: string;
  paymentMethod: string;
  grandTotal: number;
  onViewBooking: () => void;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  serviceTitle,
  artistName,
  date,
  timeSlot,
  address,
  paymentMethod,
  grandTotal,
  onViewBooking,
  onClose,
  onAddProduct,
}) => {
  // Calendar (.ics) Download Generator
  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Glamgo Atelier//Beauty Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Glamgo: ${serviceTitle}`,
      `DESCRIPTION:Your appointment with ${artistName} is confirmed. Booking ID: ${bookingId}`,
      `LOCATION:${address}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Glamgo_Booking_${bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Web Share or Clipboard Copy
  const handleShare = async () => {
    const text = `I just booked "${serviceTitle}" with ${artistName} on Glamgo! Booking ID: ${bookingId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Glamgo Booking',
          text,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4 sm:p-6 max-w-xl mx-auto">
      {/* Animated Success Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 mb-4"
      >
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Confirmed &amp; Secured
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-2.5">
          Booking Confirmed
        </h2>
        <p className="text-xs sm:text-sm text-mauve-grey mt-1 font-sans">
          Reservation Reference:{' '}
          <span className="font-mono font-bold text-ink">{bookingId}</span>
        </p>
      </motion.div>

      {/* Reservation Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full mt-5 text-left bg-white border border-mist rounded-2xl p-4 shadow-sm"
      >
        <div className="pb-3 border-b border-mist/80">
          <h3 className="font-serif text-base font-bold text-ink">{serviceTitle}</h3>
          <p className="text-xs text-rose-plum font-medium mt-0.5 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Artist: {artistName}</span>
          </p>
        </div>

        <div className="py-3 space-y-2 text-xs font-sans">
          <div className="flex items-center gap-2 text-ink">
            <Calendar className="w-4 h-4 text-mauve-grey shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <Clock className="w-4 h-4 text-mauve-grey shrink-0" />
            <span>{timeSlot}</span>
          </div>
          <div className="flex items-start gap-2 text-ink">
            <MapPin className="w-4 h-4 text-mauve-grey shrink-0 mt-0.5" />
            <span className="line-clamp-2">{address}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-mist/80 flex items-center justify-between">
          <span className="text-xs text-mauve-grey">
            Payment: {paymentMethod === 'PAY_AFTER_SERVICE' ? 'Pay at Venue' : 'Paid via UPI'}
          </span>
          <span className="font-serif text-sm font-bold text-ink">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full grid grid-cols-2 gap-2 mt-4"
      >
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleDownloadCalendar}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Add to Calendar
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleShare}
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Share Details
        </Button>
      </motion.div>

      <div className="w-full mt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onViewBooking}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View in My Bookings
        </Button>
      </div>

      {/* "Complete your look" Beauty Products Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="w-full mt-7 pt-5 border-t border-mist text-left"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-champagne-gold" />
          <h4 className="font-serif text-sm font-bold text-ink">
            Complete Your Look
          </h4>
        </div>
        <p className="text-xs text-mauve-grey mb-3 font-sans">
          Recommended pre-care and touch-up formulations delivered to your venue:
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {MOCK_PRODUCTS.slice(0, 2).map((prod) => (
            <div
              key={prod.id}
              className="p-2.5 rounded-xl border border-mist bg-white hover:border-rose-plum/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-10 h-10 rounded-lg object-cover border border-mist shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-ink truncate">{prod.name}</p>
                  <p className="font-serif text-xs font-semibold text-rose-plum">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAddProduct(prod)}
                className="mt-2 w-full py-1 rounded-lg bg-soft-ivory hover:bg-blush text-rose-plum text-xs font-semibold border border-mist transition-colors cursor-pointer"
              >
                + Add to Bag
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
