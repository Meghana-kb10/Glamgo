import { CartItemService, CartItemProduct } from '../types';

const STORAGE_KEYS = {
  CART_SERVICE: 'glamgo_cart_service',
  CART_PRODUCTS: 'glamgo_cart_products',
  GUEST_SESSION: 'glamgo_guest_session_id',
  BOOKING_STEP: 'glamgo_booking_step',
  SELECTED_DATE: 'glamgo_selected_date',
  SELECTED_SLOT: 'glamgo_selected_slot',
  SAVED_ADDRESS: 'glamgo_saved_address',
  CUSTOMER_BOOKINGS: 'glamgo_customer_bookings',
};

/**
 * Loads locally stored customer bookings
 */
export const loadCustomerBookings = (): any[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_BOOKINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Saves or prepends a confirmed customer booking into persistent localStorage
 */
export const saveCustomerBooking = (booking: any) => {
  try {
    const existing = loadCustomerBookings();
    const updated = [
      booking,
      ...existing.filter(
        (b: any) => b.id !== booking.id && b.booking_number !== booking.booking_number
      ),
    ];
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.warn('[Storage] Failed to save customer booking:', e);
  }
};

/**
 * Updates status of a local booking (e.g. CANCELLED_BY_CUSTOMER)
 */
export const updateCustomerBookingStatus = (bookingId: string, status: string) => {
  try {
    const existing = loadCustomerBookings();
    const updated = existing.map((b: any) =>
      b.id === bookingId || b.booking_number === bookingId ? { ...b, status } : b
    );
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.warn('[Storage] Failed to update customer booking status:', e);
  }
};

/**
 * Retrieves or lazily creates a persistent guest session ID
 */
export const getGuestSessionId = (): string => {
  try {
    let guestId = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
    if (!guestId) {
      guestId = `usr-guest-${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, guestId);
    }
    return guestId;
  } catch {
    return 'usr-guest-fallback';
  }
};

/**
 * Loads persisted service cart item
 */
export const loadServiceCart = (fallback: CartItemService | null = null): CartItemService | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART_SERVICE);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Saves service cart item
 */
export const saveServiceCart = (cart: CartItemService | null) => {
  try {
    if (cart) {
      localStorage.setItem(STORAGE_KEYS.CART_SERVICE, JSON.stringify(cart));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CART_SERVICE);
    }
  } catch {}
};

/**
 * Loads persisted product cart items
 */
export const loadProductCart = (fallback: CartItemProduct[] = []): CartItemProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Saves product cart items
 */
export const saveProductCart = (items: CartItemProduct[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART_PRODUCTS, JSON.stringify(items));
  } catch {}
};

/**
 * Generates dynamic calendar dates (today + next N days)
 */
export interface DynamicDateItem {
  dayName: string;
  dateNumber: string;
  dayNumber: number;
  monthShort: string;
  fullDate: string; // YYYY-MM-DD
  isToday: boolean;
  formattedLabel: string;
}

export const generateDynamicDates = (daysCount: number = 14): DynamicDateItem[] => {
  const dates: DynamicDateItem[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${dateNum}`;
    const dayName = dayNames[d.getDay()];
    const monthShort = monthNames[d.getMonth()];

    dates.push({
      dayName,
      dateNumber: String(d.getDate()),
      dayNumber: d.getDate(),
      monthShort,
      fullDate,
      isToday: i === 0,
      formattedLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName}, ${d.getDate()}`,
    });
  }

  return dates;
};

/**
 * Booking step persistence
 */
export const loadBookingStep = (defaultStep = 1): number => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKING_STEP);
    return raw ? parseInt(raw, 10) : defaultStep;
  } catch {
    return defaultStep;
  }
};

export const saveBookingStep = (step: number) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKING_STEP, String(step));
  } catch {}
};
