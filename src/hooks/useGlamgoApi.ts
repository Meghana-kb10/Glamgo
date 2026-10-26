import { useState, useEffect, useCallback } from 'react';
import { glamgoApi } from '../services/apiClient';
import {
  SearchProfessionalsParams,
  GetSlotsResponse,
  LockSlotDto,
  LockSlotResponse,
  VerifyOtpDto,
  VerifyOtpResponse,
  HybridCheckoutDto,
  HybridCheckoutResponse,
  SubOrder,
  EscrowLedger,
  ProductVariant,
} from '../types/database';

/**
 * Hook to search professionals via GET /api/v1/professionals/search
 */
export function useProfessionalsSearch(params: SearchProfessionalsParams) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPros = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await glamgoApi.professionals.search(params);
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to search professionals');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchPros();
  }, [fetchPros]);

  return { data, total, isLoading, error, refetch: fetchPros };
}

/**
 * Hook to compute real-time available intervals via GET /api/v1/professionals/:id/slots
 */
export function useProfessionalSlots(
  proId: string | null,
  dateString: string,
  serviceOfferingIds: string[],
  venueAddress?: any
) {
  const [slotsData, setSlotsData] = useState<GetSlotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!proId || !dateString) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await glamgoApi.professionals.getSlots(proId, dateString, serviceOfferingIds, venueAddress);
      setSlotsData(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate available slots');
    } finally {
      setIsLoading(false);
    }
  }, [proId, dateString, JSON.stringify(serviceOfferingIds), JSON.stringify(venueAddress)]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slotsData, isLoading, error, refetch: fetchSlots };
}

/**
 * Hook for acquiring 10-minute Redis lock via POST /api/v1/bookings/lock
 */
export function useBookingLock() {
  const [lockedBooking, setLockedBooking] = useState<LockSlotResponse | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lockSlot = async (dto: LockSlotDto) => {
    setIsLocking(true);
    setError(null);
    try {
      const res = await glamgoApi.bookings.lockSlot(dto);
      setLockedBooking(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to lock slot');
      throw err;
    } finally {
      setIsLocking(false);
    }
  };

  return { lockSlot, lockedBooking, isLocking, error, setLockedBooking };
}

/**
 * Hook for unified hybrid checkout via POST /api/v1/cart/checkout
 */
export function useHybridCheckout() {
  const [checkoutResult, setCheckoutResult] = useState<HybridCheckoutResponse | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (dto: HybridCheckoutDto) => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const res = await glamgoApi.checkout.process(dto);
      setCheckoutResult(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to process checkout');
      throw err;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return { checkout, checkoutResult, isCheckingOut, error };
}

/**
 * Hook for service Start & Complete OTP verification via POST /api/v1/bookings/:id/verify-otp
 */
export function useBookingOtp() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyOtpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = async (dto: VerifyOtpDto) => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await glamgoApi.bookings.verifyOtp(dto);
      setVerificationResult(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifyOtp, verificationResult, isVerifying, error };
}

/**
 * Hook for Vendor operations (Inventory & AWB generation)
 */
export function useVendorInventory() {
  const [inventory, setInventory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await glamgoApi.vendor.getInventory();
      setInventory(res.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const adjustStock = async (variantId: string, delta: number) => {
    const res = await glamgoApi.vendor.adjustStock(variantId, delta);
    setInventory((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        variants: prev.variants.map((v: ProductVariant) =>
          v.id === variantId ? { ...v, stock_quantity: res.data.stock_quantity } : v
        ),
      };
    });
    return res.data;
  };

  const generateAwb = async (subOrderId: string, courier?: string) => {
    const res = await glamgoApi.vendor.generateAwb(subOrderId, courier);
    setInventory((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        subOrders: prev.subOrders.map((s: SubOrder) =>
          s.id === subOrderId ? res.data : s
        ),
      };
    });
    return res.data;
  };

  return { inventory, isLoading, adjustStock, generateAwb, refetch: fetchInventory };
}

/**
 * Hook for Admin Escrow tracking & KYC approvals
 */
export function useAdminEscrow() {
  const [ledgers, setLedgers] = useState<EscrowLedger[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLedgers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await glamgoApi.admin.getEscrowLedgers();
      setLedgers(res.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);

  const decideKyc = async (proId: string, status: 'APPROVED' | 'REJECTED') => {
    const res = await glamgoApi.admin.decideKyc(proId, status);
    return res.data;
  };

  return { ledgers, isLoading, decideKyc, refetch: fetchLedgers };
}
