/**
 * Glamgo Booking Draft State Persistence Helper
 * Implements PRD BOOK-4 and UI/UX §5.11 progress persistence.
 */

import { CartItemProduct, CartItemService, Artist } from '../types';
import { SavedAddress } from '../services/addressService';
import { Coupon } from '../services/couponService';

export interface BookingDraft {
  step: 1 | 2 | 3 | 4;
  activeService: CartItemService | null;
  serviceQuantity: number;
  selectedAddonIds: string[];
  productCartItems: CartItemProduct[];
  date: string;
  timeSlot: string;
  assignedProfessionalType: 'best_available' | 'custom';
  selectedArtist: Artist | null;
  selectedAddress: SavedAddress | null;
  specialInstructions: string;
  isForSomeoneElse: boolean;
  recipientName: string;
  recipientPhone: string;
  appliedCoupon: Coupon | null;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'PAY_AFTER_SERVICE';
  upiApp?: 'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER';
  upiId?: string;
  lastUpdated: number;
  dateExpiredNotice?: string;
}

const DRAFT_STORAGE_KEY = 'glamgo_booking_draft';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const bookingDraftStorage = {
  save(draft: Partial<BookingDraft>): void {
    try {
      const existing = this.loadRaw() || {};
      const merged: BookingDraft = {
        step: 1,
        activeService: null,
        serviceQuantity: 1,
        selectedAddonIds: [],
        productCartItems: [],
        date: '',
        timeSlot: '02:30 PM',
        assignedProfessionalType: 'best_available',
        selectedArtist: null,
        selectedAddress: null,
        specialInstructions: '',
        isForSomeoneElse: false,
        recipientName: '',
        recipientPhone: '',
        appliedCoupon: null,
        paymentMethod: 'UPI',
        upiApp: 'GPAY',
        ...existing,
        ...draft,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Could not persist booking draft to localStorage', e);
    }
  },

  loadRaw(): BookingDraft | null {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignored
    }
    return null;
  },

  load(): BookingDraft | null {
    try {
      const draft = this.loadRaw();
      if (!draft) return null;

      // 1. Expire drafts older than 7 days (PRD BOOK-4)
      if (draft.lastUpdated && Date.now() - draft.lastUpdated > SEVEN_DAYS_MS) {
        this.clear();
        return null;
      }

      // 2. Discard/reset if appointment date has passed
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (draft.date && draft.date < todayStr) {
        draft.date = '';
        draft.timeSlot = '';
        if (draft.step > 2) {
          draft.step = 2;
        }
        draft.dateExpiredNotice = 'Your previously selected appointment date has passed. Please select a fresh date and time.';
        this.save(draft);
      }

      return draft;
    } catch {
      // Ignored
    }
    return null;
  },

  clear(): void {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignored
    }
  },

  hasDraft(): boolean {
    const draft = this.load();
    return Boolean(draft && (draft.activeService || draft.productCartItems?.length));
  },
};
