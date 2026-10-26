import { mockDb } from './mockDatabase';
import {
  SearchProfessionalsParams,
  GetSlotsResponse,
  LockSlotDto,
  LockSlotResponse,
  VerifyOtpDto,
  VerifyOtpResponse,
  HybridCheckoutDto,
  HybridCheckoutResponse,
  ProfessionalProfile,
  Product,
  ProductVariant,
  Booking,
  SubOrder,
  EscrowLedger,
} from '../types/database';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

export const glamgoApi = {
  // ==========================================
  // 1. AUTHENTICATION & ONBOARDING
  // ==========================================
  auth: {
    async sendOtp(phone: string): Promise<ApiResponse<{ message: string; testOtp: string }>> {
      await delay(120);
      return {
        success: true,
        data: {
          message: `6-digit verification code sent to ${phone}`,
          testOtp: '492104',
        },
        timestamp: new Date().toISOString(),
      };
    },

    async verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ token: string; user: any }>> {
      await delay(150);
      if (otp !== '492104' && otp.length !== 6) {
        throw new Error('Invalid OTP code. Please enter valid 6 digits.');
      }
      return {
        success: true,
        data: {
          token: `jwt_session_${Date.now()}`,
          user: mockDb.users[0],
        },
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 2. PROFESSIONALS & SERVICE DISCOVERY
  // ==========================================
  professionals: {
    async search(params: SearchProfessionalsParams): Promise<ApiResponse<any>> {
      await delay(140);
      const res = mockDb.searchProfessionals(params);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },

    async getById(id: string): Promise<ApiResponse<any>> {
      await delay(100);
      const pro = mockDb.professionalProfiles.find((p) => p.id === id);
      if (!pro) throw new Error('Professional not found');
      const packages = mockDb.serviceOfferings.filter((s) => s.professional_id === id);
      const user = mockDb.users.find((u) => u.id === pro.user_id);
      return {
        success: true,
        data: {
          ...pro,
          packages,
          user,
        },
        timestamp: new Date().toISOString(),
      };
    },

    async getSlots(
      proId: string,
      dateString: string,
      serviceOfferingIds: string[],
      venueAddress?: any
    ): Promise<ApiResponse<GetSlotsResponse>> {
      await delay(160);
      const res = mockDb.getAvailableSlots(proId, dateString, serviceOfferingIds, venueAddress);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 3. BOOKING ENGINE & 10-MIN REDIS LOCK
  // ==========================================
  bookings: {
    async lockSlot(dto: LockSlotDto): Promise<ApiResponse<LockSlotResponse>> {
      await delay(200);
      const res = mockDb.acquireSlotLock(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },

    async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<VerifyOtpResponse>> {
      await delay(180);
      const res = mockDb.verifyBookingOtp(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },

    async getBookingsByPro(proId: string): Promise<ApiResponse<Booking[]>> {
      await delay(120);
      const list = mockDb.bookings.filter((b) => b.professional_id === proId);
      return {
        success: true,
        data: list,
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 4. E-COMMERCE CATALOG & INVENTORY
  // ==========================================
  products: {
    async search(params?: { query?: string; category?: string }): Promise<
      ApiResponse<{ products: Product[]; variants: ProductVariant[] }>
    > {
      await delay(130);
      let list = [...mockDb.products];
      if (params?.query?.trim()) {
        const q = params.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.brand_name.toLowerCase().includes(q) ||
            p.category_path.toLowerCase().includes(q)
        );
      }
      return {
        success: true,
        data: {
          products: list,
          variants: mockDb.productVariants,
        },
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 5. HYBRID CHECKOUT & ESCROW SETTLEMENT
  // ==========================================
  checkout: {
    async process(dto: HybridCheckoutDto): Promise<ApiResponse<HybridCheckoutResponse>> {
      await delay(260); // payment processing simulation
      const res = mockDb.processHybridCheckout(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 6. VENDOR HUB & AWB GENERATION
  // ==========================================
  vendor: {
    async getInventory(): Promise<
      ApiResponse<{
        products: Product[];
        variants: ProductVariant[];
        subOrders: SubOrder[];
      }>
    > {
      await delay(140);
      return {
        success: true,
        data: {
          products: mockDb.products,
          variants: mockDb.productVariants,
          subOrders: mockDb.subOrders,
        },
        timestamp: new Date().toISOString(),
      };
    },

    async adjustStock(variantId: string, delta: number): Promise<ApiResponse<ProductVariant>> {
      await delay(100);
      const variant = mockDb.productVariants.find((v) => v.id === variantId);
      if (!variant) throw new Error('Variant not found');
      variant.stock_quantity = Math.max(0, variant.stock_quantity + delta);
      return {
        success: true,
        data: { ...variant },
        timestamp: new Date().toISOString(),
      };
    },

    async generateAwb(subOrderId: string, courier?: string): Promise<ApiResponse<SubOrder>> {
      await delay(300);
      const res = mockDb.generateShippingLabel(subOrderId, courier);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },
  },

  // ==========================================
  // 7. ADMIN GOVERNANCE & ESCROW LEDGERS
  // ==========================================
  admin: {
    async getEscrowLedgers(): Promise<ApiResponse<EscrowLedger[]>> {
      await delay(120);
      return {
        success: true,
        data: mockDb.escrowLedgers,
        timestamp: new Date().toISOString(),
      };
    },

    async decideKyc(proId: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<ProfessionalProfile>> {
      await delay(180);
      const pro = mockDb.professionalProfiles.find((p) => p.id === proId);
      if (!pro) throw new Error('Professional not found');
      pro.kyc_status = status;
      return {
        success: true,
        data: { ...pro },
        timestamp: new Date().toISOString(),
      };
    },
  },
};
