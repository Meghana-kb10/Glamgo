/**
 * Glamgo Promotional Coupon Service
 * Implements PRD BOOK-6 and PAY-4 coupon validation and discount computation.
 */

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isFirstBookingOnly?: boolean;
  tag?: string;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'GLAM100',
    title: 'Flat ₹100 Off',
    description: 'Flat ₹100 discount on all beauty services & luxury packages',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 999,
    tag: 'Popular',
  },
  {
    code: 'FIRST20',
    title: '20% Welcome Saving',
    description: 'Get 20% off on your first atelier appointment (up to ₹300)',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 1200,
    maxDiscount: 300,
    isFirstBookingOnly: true,
    tag: 'New User',
  },
  {
    code: 'WEDDING10',
    title: '10% Bridal Suite Off',
    description: 'Enjoy 10% instant discount on bridal packages and couture makeup (up to ₹2,000)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 15000,
    maxDiscount: 2000,
    tag: 'Bridal Exclusive',
  },
];

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
  error?: string;
}

export const couponService = {
  /**
   * Retrieve list of active coupons with eligibility flags
   */
  async getAvailableCoupons(orderSubtotal: number, isFirstBooking = true): Promise<Coupon[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return AVAILABLE_COUPONS;
  },

  /**
   * Validate coupon code against current subtotal
   */
  validateCoupon(code: string, orderSubtotal: number, isFirstBooking = true): CouponValidationResult {
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: 'Invalid coupon code',
        error: `Coupon "${cleanCode}" does not exist. Try GLAM100 or FIRST20.`,
      };
    }

    if (orderSubtotal < coupon.minOrderValue) {
      const needed = coupon.minOrderValue - orderSubtotal;
      return {
        valid: false,
        discount: 0,
        message: 'Minimum order requirement not met',
        error: `Add items worth ₹${needed.toLocaleString('en-IN')} more to use ${coupon.code}. Minimum order ₹${coupon.minOrderValue.toLocaleString('en-IN')}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'flat') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      coupon,
      discount,
      message: `You saved ₹${discount.toLocaleString('en-IN')} with ${coupon.code}!`,
    };
  },
};
