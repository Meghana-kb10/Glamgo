/**
 * Glamgo Pricing & Bill Breakdown Service
 * Implements PRD BOOK-5, PAY-1 and UI/UX §5.11 Step 4 itemized billing.
 */

import { Coupon } from './couponService';
import { CartItemProduct, CartItemService } from '../types';

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export const POPULAR_ADDONS: ServiceAddon[] = [
  {
    id: 'addon-01',
    name: 'Hydra-Boost Pre-Makeup Sheet Mask',
    description: 'Hyaluronic acid infusion for 24-hr dewy skin prep',
    price: 600,
    durationMinutes: 15,
  },
  {
    id: 'addon-02',
    name: 'Royal Drape Styling & Saree Pleating',
    description: 'Custom pinless pleating & heavy dupatta setting',
    price: 1200,
    durationMinutes: 30,
  },
  {
    id: 'addon-03',
    name: '3D Mink Lashes & Custom Application',
    description: 'Feather-light reusable lashes with waterproof adhesive',
    price: 800,
    durationMinutes: 15,
  },
  {
    id: 'addon-04',
    name: 'Botanical Hair Scalp Shield',
    description: 'Thermal protection serum prior to hot-tool styling',
    price: 450,
    durationMinutes: 10,
  },
];

export type PaymentScheme = 'ONLINE_FULL' | 'ONLINE_DEPOSIT' | 'PAY_AFTER_SERVICE';

export interface PaymentAmountBreakdown {
  scheme: PaymentScheme;
  payNow: number;
  payLater: number;
  label: string;
  subtext: string;
}

export interface BillBreakdown {
  serviceSubtotal: number;
  serviceQuantity: number;
  addonsTotal: number;
  selectedAddons: ServiceAddon[];
  productsTotal: number;
  grossSubtotal: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  taxes: number; // 18% GST
  convenienceFee: number; // ₹99
  grandTotal: number;
  depositDueToday: number; // 30% deposit
  balanceAtVenue: number; // 70% balance
  paymentSchemes: Record<PaymentScheme, PaymentAmountBreakdown>;
}

export const pricingService = {
  getAvailableAddons(): ServiceAddon[] {
    return POPULAR_ADDONS;
  },

  calculateBill(params: {
    activeService: CartItemService | null;
    serviceQuantity?: number;
    selectedAddonIds: string[];
    productCartItems: CartItemProduct[];
    appliedCoupon: Coupon | null;
  }): BillBreakdown {
    const qty = Math.max(1, params.serviceQuantity || 1);
    const unitServicePrice = params.activeService?.package?.price || 0;
    const serviceSubtotal = unitServicePrice * qty;

    const selectedAddons = POPULAR_ADDONS.filter((a) =>
      params.selectedAddonIds.includes(a.id)
    );
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

    const productsTotal = params.productCartItems.reduce(
      (sum, p) => sum + p.product.price * p.quantity,
      0
    );

    const grossSubtotal = serviceSubtotal + addonsTotal + productsTotal;

    // Coupon discount
    let couponDiscount = 0;
    if (params.appliedCoupon && grossSubtotal >= params.appliedCoupon.minOrderValue) {
      if (params.appliedCoupon.discountType === 'flat') {
        couponDiscount = params.appliedCoupon.discountValue;
      } else {
        couponDiscount = Math.round((grossSubtotal * params.appliedCoupon.discountValue) / 100);
        if (params.appliedCoupon.maxDiscount && couponDiscount > params.appliedCoupon.maxDiscount) {
          couponDiscount = params.appliedCoupon.maxDiscount;
        }
      }
    }

    // 18% GST on net service + addons
    const taxableServiceAmount = Math.max(0, serviceSubtotal + addonsTotal - couponDiscount);
    const taxes = Math.round(taxableServiceAmount * 0.18);

    // Standard single-use hygiene kit & safety fee
    const convenienceFee = serviceSubtotal > 0 ? 99 : 0;

    const grandTotal = Math.max(0, grossSubtotal - couponDiscount + taxes + convenienceFee);

    const deposit30 = Math.round(grandTotal * 0.3);
    const balance70 = grandTotal - deposit30;

    const paymentSchemes: Record<PaymentScheme, PaymentAmountBreakdown> = {
      ONLINE_FULL: {
        scheme: 'ONLINE_FULL',
        payNow: grandTotal,
        payLater: 0,
        label: 'Pay Full Online',
        subtext: 'Complete payment now via UPI, Cards, or Net Banking',
      },
      ONLINE_DEPOSIT: {
        scheme: 'ONLINE_DEPOSIT',
        payNow: deposit30,
        payLater: balance70,
        label: 'Pay 30% Deposit',
        subtext: `Pay ₹${deposit30.toLocaleString('en-IN')} now to reserve. Balance ₹${balance70.toLocaleString('en-IN')} due at venue`,
      },
      PAY_AFTER_SERVICE: {
        scheme: 'PAY_AFTER_SERVICE',
        payNow: 0,
        payLater: grandTotal,
        label: 'Pay After Service',
        subtext: `Pay ₹0 now. Settle ₹${grandTotal.toLocaleString('en-IN')} via Cash or UPI at venue after service`,
      },
    };

    return {
      serviceSubtotal,
      serviceQuantity: qty,
      addonsTotal,
      selectedAddons,
      productsTotal,
      grossSubtotal,
      couponDiscount,
      appliedCoupon: params.appliedCoupon,
      taxes,
      convenienceFee,
      grandTotal,
      balanceAtVenue: balance70,
      depositDueToday: deposit30,
      paymentSchemes,
    };
  },
};
