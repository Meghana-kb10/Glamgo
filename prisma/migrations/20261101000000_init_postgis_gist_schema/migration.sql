-- ============================================================================
-- Glamgo Production Database Migration: PostgreSQL 16 + PostGIS + btree_gist
-- Migration: 20261101000000_init_postgis_gist_schema.sql
-- Description: Enables spatial & concurrency extensions, defines luxury beauty
--              domain enums, tables, spatial GIST indexes, and anti-collision
--              exclusion constraints.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Enable Required PostgreSQL Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ----------------------------------------------------------------------------
-- 2. Define Strict Domain Enums
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CUSTOMER', 'PROFESSIONAL', 'VENDOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('HOME_VISIT', 'STUDIO', 'VENUE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE service_location_mode AS ENUM ('AT_VENUE', 'IN_STUDIO', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'LOCKED_PENDING_PAYMENT',
        'CONFIRMED',
        'ARTIST_EN_ROUTE',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED_BY_CUSTOMER',
        'CANCELLED_BY_PRO',
        'DISPUTED',
        'EXPIRED'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING_PAYMENT',
        'CONFIRMED',
        'PACKED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'RETURN_REQUESTED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE escrow_status AS ENUM (
        'HELD',
        'ELIGIBLE_FOR_PAYOUT',
        'SETTLED',
        'REFUNDED',
        'ON_HOLD_DISPUTE'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_gateway AS ENUM ('RAZORPAY', 'STRIPE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('INITIATED', 'CAPTURED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Core Identity & User Addresses
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    roles user_role[] NOT NULL DEFAULT '{CUSTOMER}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_type location_type NOT NULL DEFAULT 'HOME_VISIT',
    title VARCHAR(100), -- e.g. 'Bandra Sea View Penthouse'
    street_line1 VARCHAR(255) NOT NULL,
    street_line2 VARCHAR(255),
    landmark VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'IN',
    location GEOGRAPHY(Point, 4326) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_location 
    ON user_addresses USING GIST (location);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id 
    ON user_addresses(user_id);

-- ----------------------------------------------------------------------------
-- 4. Professional Profiles, Services, Rules & Portfolio Media
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(180) UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    bio TEXT,
    experience_years INT NOT NULL DEFAULT 0,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    service_mode service_location_mode NOT NULL DEFAULT 'BOTH',
    studio_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
    studio_location GEOGRAPHY(Point, 4326),
    max_travel_radius_km NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    travel_fee_per_km NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
    kyc_status kyc_status NOT NULL DEFAULT 'PENDING',
    hygiene_score NUMERIC(4, 1) NOT NULL DEFAULT 99.4,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    review_count INT NOT NULL DEFAULT 0,
    commission_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    cover_image_url TEXT,
    instagram_handle VARCHAR(100),
    is_instant_bookable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pro_studio_location 
    ON professional_profiles USING GIST (studio_location);

CREATE INDEX IF NOT EXISTS idx_pro_specialties 
    ON professional_profiles USING GIN (specialties);

CREATE TABLE IF NOT EXISTS service_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- e.g. 'Bridal', 'Party Makeup', 'Editorial Hair'
    tier VARCHAR(50) NOT NULL DEFAULT 'Signature',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    products_used TEXT[] NOT NULL DEFAULT '{}',
    inclusions TEXT[] NOT NULL DEFAULT '{}',
    duration_minutes INT NOT NULL CHECK (duration_minutes >= 15),
    buffer_minutes INT NOT NULL DEFAULT 30 CHECK (buffer_minutes >= 0),
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price > 0),
    deposit_pct NUMERIC(5, 2) NOT NULL DEFAULT 30.00 CHECK (deposit_pct BETWEEN 10.00 AND 100.00),
    is_addon BOOLEAN NOT NULL DEFAULT FALSE,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_professional_id 
    ON service_offerings(professional_id);

CREATE TABLE IF NOT EXISTS professional_availability_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_day_off BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_pro_day UNIQUE (professional_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS portfolio_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    occasion_tag VARCHAR(80),
    is_before_after BOOLEAN NOT NULL DEFAULT FALSE,
    before_image_url TEXT,
    after_image_url TEXT,
    transformation_title VARCHAR(200),
    skin_type VARCHAR(100),
    display_order INT NOT NULL DEFAULT 0,
    tagged_sku_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_pro_id 
    ON portfolio_media(professional_id);

-- ----------------------------------------------------------------------------
-- 5. Vendor Profiles, Products & Product SKUs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(200) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    gstin_or_tax_id VARCHAR(50) UNIQUE NOT NULL,
    warehouse_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
    kyc_status kyc_status NOT NULL DEFAULT 'APPROVED',
    commission_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 12.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    slug VARCHAR(220) UNIQUE NOT NULL,
    title VARCHAR(250) NOT NULL,
    brand_name VARCHAR(150) NOT NULL,
    category_path VARCHAR(255) NOT NULL, -- e.g. 'Makeup/Face/Highlighter'
    description TEXT NOT NULL,
    ingredients TEXT,
    is_pro_equipment BOOLEAN NOT NULL DEFAULT FALSE,
    b2b_only BOOLEAN NOT NULL DEFAULT FALSE,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    review_count INT NOT NULL DEFAULT 0,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_vendor_id 
    ON products(vendor_id);

CREATE TABLE IF NOT EXISTS product_skus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    shade_name VARCHAR(100),
    shade_hex CHAR(7),
    size_label VARCHAR(50),
    mrp_price NUMERIC(12, 2) NOT NULL CHECK (mrp_price > 0),
    retail_price NUMERIC(12, 2) NOT NULL CHECK (retail_price > 0),
    pro_wholesale_price NUMERIC(12, 2) CHECK (pro_wholesale_price IS NULL OR pro_wholesale_price > 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    batch_number VARCHAR(80),
    expiry_date DATE,
    images TEXT[] NOT NULL DEFAULT '{}',
    reorder_threshold INT NOT NULL DEFAULT 10 CHECK (reorder_threshold >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_skus_product_id 
    ON product_skus(product_id);

-- ----------------------------------------------------------------------------
-- 6. Bookings with PostgreSQL Exclusion Constraint (GiST Concurrency Guard)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE RESTRICT,
    status booking_status NOT NULL DEFAULT 'LOCKED_PENDING_PAYMENT',
    location_type location_type NOT NULL DEFAULT 'HOME_VISIT',
    venue_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
    venue_location GEOGRAPHY(Point, 4326),
    slot_start TIMESTAMPTZ NOT NULL,
    slot_end TIMESTAMPTZ NOT NULL,
    -- Time-range column generated dynamically for strict GiST overlap indexing
    slot_range TSTZRANGE GENERATED ALWAYS AS (tstzrange(slot_start, slot_end, '[)')) STORED,
    lock_expires_at TIMESTAMPTZ,
    subtotal_amount NUMERIC(12, 2) NOT NULL CHECK (subtotal_amount >= 0),
    travel_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (travel_fee >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    deposit_paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (deposit_paid_amount >= 0),
    balance_due_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance_due_amount >= 0),
    start_otp_hash VARCHAR(128),
    complete_otp_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- MATHEMATICAL CONCURRENCY GUARD:
    -- Prevents overlapping active bookings for the same professional under race conditions.
    CONSTRAINT no_overlapping_active_bookings EXCLUDE USING gist (
        professional_id WITH =,
        slot_range WITH &&
    ) WHERE (status IN ('LOCKED_PENDING_PAYMENT', 'CONFIRMED', 'ARTIST_EN_ROUTE', 'IN_PROGRESS'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_venue_location 
    ON bookings USING GIST (venue_location);

CREATE INDEX IF NOT EXISTS idx_bookings_pro_slot_range 
    ON bookings USING GIST (professional_id, slot_range);

CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_offering_id UUID NOT NULL REFERENCES service_offerings(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0)
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id 
    ON booking_items(booking_id);

-- ----------------------------------------------------------------------------
-- 7. E-Commerce Orders & Order Items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    shipping_address_id UUID NOT NULL REFERENCES user_addresses(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL CHECK (tax_amount >= 0),
    net_payable NUMERIC(12, 2) NOT NULL CHECK (net_payable >= 0),
    status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
    product_sku_id UUID NOT NULL REFERENCES product_skus(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    awb_tracking_number VARCHAR(100),
    courier_partner VARCHAR(100),
    status order_status NOT NULL DEFAULT 'PENDING_PAYMENT'
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
    ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id 
    ON order_items(vendor_id);

-- ----------------------------------------------------------------------------
-- 8. Payment Transactions & Escrow Ledger Entries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    gateway_provider payment_gateway NOT NULL DEFAULT 'RAZORPAY',
    gateway_order_id VARCHAR(150) UNIQUE NOT NULL,
    gateway_payment_id VARCHAR(150) UNIQUE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    status payment_status NOT NULL DEFAULT 'INITIATED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(100) NOT NULL,
    beneficiary_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    gross_amount NUMERIC(12, 2) NOT NULL CHECK (gross_amount >= 0),
    platform_commission NUMERIC(12, 2) NOT NULL CHECK (platform_commission >= 0),
    escrow_guarantee_reserve NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (escrow_guarantee_reserve >= 0),
    tax_withheld NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tax_withheld >= 0),
    net_payout_amount NUMERIC(12, 2) NOT NULL CHECK (net_payout_amount >= 0),
    status escrow_status NOT NULL DEFAULT 'HELD',
    eligible_release_at TIMESTAMPTZ,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_beneficiary_status 
    ON escrow_ledger_entries(beneficiary_user_id, status);

CREATE INDEX IF NOT EXISTS idx_escrow_booking_id 
    ON escrow_ledger_entries(booking_id);
