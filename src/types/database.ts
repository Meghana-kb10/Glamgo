/**
 * Glamgo Database Schema Types & Backend DTOs
 * Aligned 1:1 with PostgreSQL 16 schema in glamgo_database_schema_data_model.md
 * and REST OpenAPI contracts in glamgo_backend_architecture.md
 */

// ==========================================
// 1. ENUMS (PostgreSQL Types)
// ==========================================

export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'VENDOR' | 'ADMIN';

export type KycStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type ServiceLocationMode = 'AT_VENUE' | 'IN_STUDIO' | 'BOTH';

export type BookingStatus =
  | 'LOCKED_PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'ARTIST_EN_ROUTE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_PRO'
  | 'DISPUTED'
  | 'EXPIRED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'REFUNDED';

export type EscrowStatus =
  | 'HELD'
  | 'ELIGIBLE_FOR_PAYOUT'
  | 'SETTLED'
  | 'REFUNDED'
  | 'ON_HOLD_DISPUTE';

export type GatewayProvider = 'RAZORPAY' | 'STRIPE';

export type PaymentStatus = 'INITIATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

// ==========================================
// 2. RELATIONAL TABLES / ENTITIES
// ==========================================

export interface User {
  id: string; // UUIDv7
  phone: string;
  email: string | null;
  full_name: string;
  avatar_url: string | null;
  roles: UserRole[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id?: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

export interface ProfessionalProfile {
  id: string; // UUIDv7
  user_id: string;
  slug: string;
  business_name: string;
  bio: string;
  experience_years: number;
  specialties: string[];
  service_mode: ServiceLocationMode;
  studio_location: { latitude: number; longitude: number } | null;
  studio_address: Address | null;
  max_travel_radius_km: number;
  travel_fee_per_km: number;
  kyc_status: KycStatus;
  rating_avg: number;
  review_count: number;
  commission_rate_pct: number;
  avatar_url?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string; // UUIDv7
  user_id: string;
  brand_name: string;
  slug: string;
  gstin_or_tax_id: string;
  warehouse_address: Address;
  kyc_status: KycStatus;
  commission_rate_pct: number;
  created_at: string;
}

export interface ServiceOffering {
  id: string; // UUIDv7
  professional_id: string;
  category: string;
  title: string;
  description: string;
  products_used: string[];
  duration_minutes: number;
  buffer_minutes: number;
  base_price: number;
  deposit_pct: number;
  is_addon: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string; // UUIDv7
  professional_id: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url: string;
  thumbnail_url: string;
  occasion_tag: string;
  tagged_variant_ids: string[];
  created_at: string;
}

export interface AvailabilityRule {
  id: string; // UUIDv7
  professional_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string; // '09:00:00'
  end_time: string; // '20:00:00'
  is_day_off: boolean;
}

export interface Booking {
  id: string; // UUIDv7
  booking_number: string; // e.g., 'GLAM-BK-202611-9481'
  customer_id: string;
  professional_id: string;
  status: BookingStatus;
  service_mode: ServiceLocationMode;
  venue_address: Address | null;
  slot_start: string; // ISO 8601
  slot_end: string;   // ISO 8601
  lock_expires_at: string | null; // 10-minute Redis Redlock TTL timestamp
  subtotal_amount: number;
  travel_fee: number;
  tax_amount: number;
  total_amount: number;
  deposit_paid_amount: number;
  balance_due_amount: number;
  start_otp_hash: string | null; // e.g., '582914'
  complete_otp_hash: string | null; // e.g., '394812'
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  service_offering_id: string;
  quantity: number;
  unit_price: number;
  duration_minutes: number;
}

export interface Product {
  id: string; // UUIDv7
  vendor_id: string;
  slug: string;
  title: string;
  brand_name: string;
  category_path: string;
  description: string;
  ingredients: string | null;
  is_pro_equipment: boolean;
  b2b_only: boolean;
  rating_avg: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string; // UUIDv7
  product_id: string;
  sku: string;
  shade_name: string | null;
  shade_hex: string | null;
  size_label: string | null;
  mrp_price: number;
  retail_price: number;
  pro_wholesale_price: number | null;
  stock_quantity: number;
  reserved_quantity: number;
  batch_number: string | null;
  expiry_date: string | null;
  images: string[];
  updated_at: string;
}

export interface Order {
  id: string; // UUIDv7
  order_number: string; // e.g. 'GLAM-ORD-202611-3091'
  customer_id: string;
  shipping_address: Address;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_payable: number;
  created_at: string;
}

export interface SubOrder {
  id: string; // UUIDv7
  order_id: string;
  vendor_id: string;
  status: OrderStatus;
  awb_tracking_number: string | null;
  courier_partner: string | null;
  subtotal: number;
  delivered_at: string | null;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  sub_order_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PaymentTransaction {
  id: string; // UUIDv7
  user_id: string;
  booking_id: string | null;
  order_id: string | null;
  gateway_provider: GatewayProvider;
  gateway_order_id: string;
  gateway_payment_id: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: PaymentStatus;
  created_at: string;
}

export interface EscrowLedger {
  id: string; // UUIDv7
  payment_transaction_id: string;
  beneficiary_user_id: string;
  booking_id: string | null;
  sub_order_id: string | null;
  gross_amount: number;
  platform_commission: number;
  tax_withheld: number;
  net_payout_amount: number;
  status: EscrowStatus;
  eligible_release_at: string | null;
  settled_at: string | null;
  created_at: string;
}

// ==========================================
// 3. BACKEND API DTOs & CONTRACTS
// ==========================================

export interface SearchProfessionalsParams {
  lat?: number;
  lng?: number;
  radius_km?: number;
  date?: string;
  category_id?: string;
  category?: string;
  instant_book?: boolean;
  min_rating?: number;
  occasion?: string;
  service_mode?: ServiceLocationMode;
  min_price?: number;
  max_price?: number;
  sort_by?: 'rating' | 'price-asc' | 'featured';
  query?: string;
}

export interface ComputedSlot {
  time: string; // '08:30 AM'
  slot_start: string; // ISO
  slot_end: string;   // ISO
  is_available: boolean;
  reason?: 'BOOKED' | 'BLOCKED' | 'OUTSIDE_WORKING_HOURS';
  travel_buffer_minutes: number;
}

export interface GetSlotsResponse {
  date: string;
  professional_id: string;
  service_mode: ServiceLocationMode;
  travel_fee: number;
  total_duration_minutes: number;
  available_slots: ComputedSlot[];
}

export interface LockSlotDto {
  customer_id: string;
  professional_id: string;
  service_offering_ids: string[];
  service_mode: ServiceLocationMode;
  venue_address: Address;
  slot_start: string;
  slot_end: string;
}

export interface LockSlotResponse {
  booking: Booking;
  booking_items: BookingItem[];
  redis_lock_key: string;
  lock_expires_at: string;
  seconds_remaining: number;
}

export interface VerifyOtpDto {
  booking_id: string;
  otp_type: 'START' | 'COMPLETE';
  otp_code: string;
}

export interface VerifyOtpResponse {
  booking_id: string;
  status: BookingStatus;
  message: string;
  escrow_ledger_updated?: EscrowLedger;
}

export interface HybridCheckoutDto {
  customer_id: string;
  booking_id?: string;
  items: {
    variant_id: string;
    quantity: number;
  }[];
  shipping_address: Address;
  gateway_provider: GatewayProvider;
}

export interface HybridCheckoutResponse {
  payment_transaction: PaymentTransaction;
  booking?: Booking;
  order?: Order;
  sub_orders?: SubOrder[];
  escrow_ledgers: EscrowLedger[];
  receipt: {
    deposit_today: number;
    balance_at_venue: number;
    grand_total: number;
  };
}
