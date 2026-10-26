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

const API_BASE_URL = 'http://localhost:4000/api/v1';

// ----------------------------------------------------------------------------
// Dual-Mode State Tracker & Live Health Polling
// ----------------------------------------------------------------------------
let isLiveBackend = false;
let isCheckingHealth = false;
const listeners = new Set<(isLive: boolean) => void>();

export const getIsLiveBackend = () => isLiveBackend;

export const subscribeBackendStatus = (cb: (isLive: boolean) => void) => {
  listeners.add(cb);
  cb(isLiveBackend);
  return () => {
    listeners.delete(cb);
  };
};

export async function checkBackendHealth(): Promise<boolean> {
  if (typeof window === 'undefined' || isCheckingHealth) return isLiveBackend;
  isCheckingHealth = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 900);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      isLiveBackend = data.mode === 'live' || data.postgres?.connected;
    } else {
      isLiveBackend = false;
    }
  } catch {
    isLiveBackend = false;
  } finally {
    isCheckingHealth = false;
  }

  listeners.forEach((l) => l(isLiveBackend));
  return isLiveBackend;
}

// Automatically check health on load and every 10 seconds
if (typeof window !== 'undefined') {
  checkBackendHealth();
  setInterval(checkBackendHealth, 10000);
}

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  source?: 'live-postgres-redis' | 'simulated-database';
}

// ----------------------------------------------------------------------------
// Core API Client with Transparent Failover
// ----------------------------------------------------------------------------
export const glamgoApi = {
  getIsLiveBackend,
  subscribeBackendStatus,
  checkBackendHealth,

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
      if (isLiveBackend) {
        try {
          const qs = new URLSearchParams();
          if (params.lat !== undefined) qs.set('lat', params.lat.toString());
          if (params.lng !== undefined) qs.set('lng', params.lng.toString());
          if (params.radius_km) qs.set('radiusKm', params.radius_km.toString());
          if (params.category) qs.set('category', params.category);
          if (params.instant_book) qs.set('instantBook', 'true');
          if (params.min_rating) qs.set('minRating', params.min_rating.toString());

          const res = await fetch(`${API_BASE_URL}/discover/professionals?${qs.toString()}`);
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Discovery endpoint offline, falling back to mockDb:', e.message);
        }
      }

      await delay(140);
      const res = mockDb.searchProfessionals(params);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
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
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/slots/lock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
          });

          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || json.error || 'Failed to lock slot');
          }

          return {
            ...json,
            source: 'live-postgres-redis',
          };
        } catch (e: any) {
          if (e.message.includes('reserved by another customer')) {
            throw e;
          }
          console.warn('⚠️ [API Client] Live lock server unreachable, using mock lock:', e.message);
        }
      }

      await delay(200);
      const res = mockDb.acquireSlotLock(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
      };
    },

    async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<VerifyOtpResponse>> {
      if (isLiveBackend && dto.booking_id) {
        try {
          const res = await fetch(`${API_BASE_URL}/bookings/${dto.booking_id}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
          });
          const json = await res.json();
          if (res.ok) {
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] OTP server offline, falling back to mockDb:', e.message);
        }
      }

      await delay(180);
      const res = mockDb.verifyBookingOtp(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
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

    async cancel(bookingId: string, reason?: string): Promise<ApiResponse<any>> {
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
          });
          const json = await res.json();
          if (res.ok) {
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Live cancel error, falling back to mockDb:', e.message);
        }
      }

      await delay(200);
      const booking = mockDb.bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = 'CANCELLED_BY_CUSTOMER';
      }
      return {
        success: true,
        data: {
          booking_id: bookingId,
          status: 'CANCELLED_BY_CUSTOMER',
          cancellation_tier: 'FULL_REFUND (>24h Notice)',
          refund_percentage: 100,
          refund_amount: 32000,
          artist_compensation_fee: 0,
          slot_freed: true,
          message: 'Booking cancelled. Slot has been freed for re-booking.',
        },
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
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
      if (isLiveBackend) {
        try {
          const qs = new URLSearchParams();
          if (params?.query) qs.set('query', params.query);
          if (params?.category) qs.set('category', params.category);

          const res = await fetch(`${API_BASE_URL}/products?${qs.toString()}`);
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Live products server offline, using mockDb:', e.message);
        }
      }

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
        source: 'simulated-database',
      };
    },
  },

  // ==========================================
  // 5. HYBRID CHECKOUT & ESCROW SETTLEMENT
  // ==========================================
  checkout: {
    async process(dto: HybridCheckoutDto): Promise<ApiResponse<HybridCheckoutResponse>> {
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/checkout/hybrid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
          });

          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || json.error || 'Checkout transaction failed');
          }

          return {
            ...json,
            source: 'live-postgres-redis',
          };
        } catch (e: any) {
          if (e.message.includes('double-booking') || e.message.includes('GiST')) {
            throw e;
          }
          console.warn('⚠️ [API Client] Live checkout error, falling back to mockDb:', e.message);
        }
      }

      await delay(260); // payment processing simulation
      const res = mockDb.processHybridCheckout(dto);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
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
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/vendor/inventory`);
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Vendor endpoint fallback:', e.message);
        }
      }

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
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/vendor/awb`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subOrderId, courier }),
          });
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] AWB endpoint fallback:', e.message);
        }
      }

      await delay(300);
      const res = mockDb.generateShippingLabel(subOrderId, courier);
      return {
        success: true,
        data: res,
        timestamp: new Date().toISOString(),
      };
    },

    async generateShippingLabel(payload: {
      orderId?: string;
      subOrderId?: string;
      courier?: string;
      weightKg?: number;
    }): Promise<ApiResponse<any>> {
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/vendor/shipments/label`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Live shipments/label error, using mockDb fallback:', e.message);
        }
      }

      await delay(250);
      const courier = payload.courier || 'BlueDart Priority Air';
      const awb = `BLR-BD-${Math.floor(1000000 + Math.random() * 9000000)}`;
      return {
        success: true,
        data: {
          awb_number: awb,
          carrier: courier,
          routing_code: 'BOM/MAH/HUB-09',
          order_id: payload.orderId || 'ord-001',
          sub_order_id: payload.subOrderId || 'sub-001',
          dispatch_hub: 'BOM-BKC-HUB-04 (Glamgo Central)',
          destination_pincode: '400050',
          recipient: {
            name: 'Rhea Singhania',
            phone: '+91 98201 99481',
            address: 'Suite 4B, Pali Hill Heritage, Bandra West, Mumbai, MH - 400050',
          },
          package_specs: {
            weight_kg: payload.weightKg || 0.65,
            dimensions: '20 x 15 x 10 cm',
            declared_value: 3600,
            handling: 'FRAGILE - COSMETIC TEMPERATURE SENSITIVE',
          },
          skus: [
            {
              title: '24K Gold Camellia Glow Serum Primer',
              brand: 'Backstage Formulations',
              batch_number: 'BOM-2026-B81',
              expiry: '12/2027',
              quantity: 1,
              hsn_code: '3304',
              shade: 'Champagne Luster',
            },
          ],
          dispatch_date: new Date().toISOString(),
          estimated_delivery: '28 Oct 2026',
          status: 'DISPATCH_READY',
        },
        timestamp: new Date().toISOString(),
        source: 'simulated-database',
      };
    },
  },

  // ==========================================
  // 7. ADMIN GOVERNANCE & ESCROW LEDGERS
  // ==========================================
  admin: {
    async getEscrowLedgers(): Promise<ApiResponse<EscrowLedger[]>> {
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/escrows`);
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] Admin escrows endpoint fallback:', e.message);
        }
      }

      await delay(120);
      return {
        success: true,
        data: mockDb.escrowLedgers,
        timestamp: new Date().toISOString(),
      };
    },

    async decideKyc(proId: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<ProfessionalProfile>> {
      if (isLiveBackend) {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/kyc/${proId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
          if (res.ok) {
            const json = await res.json();
            return {
              ...json,
              source: 'live-postgres-redis',
            };
          }
        } catch (e: any) {
          console.warn('⚠️ [API Client] KYC endpoint fallback:', e.message);
        }
      }

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
