import {
  User,
  ProfessionalProfile,
  VendorProfile,
  ServiceOffering,
  PortfolioItem,
  AvailabilityRule,
  Booking,
  BookingItem,
  Product,
  ProductVariant,
  Order,
  SubOrder,
  OrderItem,
  PaymentTransaction,
  EscrowLedger,
  Address,
  SearchProfessionalsParams,
  ComputedSlot,
  GetSlotsResponse,
  LockSlotDto,
  LockSlotResponse,
  VerifyOtpDto,
  VerifyOtpResponse,
  HybridCheckoutDto,
  HybridCheckoutResponse,
} from '../types/database';

// Helper for generating deterministic UUIDs
const uuid = (prefix = 'uuid') =>
  `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

class MockRelationalDatabase {
  users: User[] = [];
  professionalProfiles: ProfessionalProfile[] = [];
  vendorProfiles: VendorProfile[] = [];
  serviceOfferings: ServiceOffering[] = [];
  portfolioItems: PortfolioItem[] = [];
  availabilityRules: AvailabilityRule[] = [];
  bookings: Booking[] = [];
  bookingItems: BookingItem[] = [];
  products: Product[] = [];
  productVariants: ProductVariant[] = [];
  orders: Order[] = [];
  subOrders: SubOrder[] = [];
  orderItems: OrderItem[] = [];
  paymentTransactions: PaymentTransaction[] = [];
  escrowLedgers: EscrowLedger[] = [];

  // Simulated Redis key-value store for distributed Redlock with TTLs
  redisCache: Map<string, { value: string; expiresAt: number }> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Seed Users
    const userCustomer: User = {
      id: 'usr-cust-001',
      phone: '+919820199481',
      email: 'rhea.singhania@glamgo.luxury',
      full_name: 'Rhea Singhania',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      roles: ['CUSTOMER'],
      is_active: true,
      password_hash: '$2b$10$SK6zVEPoKyh26/NUWsehJ.f0S5PUZGQKPHcHomszW7HEjliwtAuYu', // GlamgoBride2026! & Glamgo2026!
      created_at: '2026-01-10T10:00:00Z',
      updated_at: '2026-10-20T10:00:00Z',
    };

    const userPro1: User = {
      id: 'usr-pro-001',
      phone: '+919821034821',
      email: 'tanya@tanyagrewal.artistry',
      full_name: 'Tanya Grewal',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      roles: ['PROFESSIONAL'],
      is_active: true,
      password_hash: '$2b$10$ug14e.VKK8Xyiy6KJ31ZBeZ3CsacGRW8LL/zxcQVHYsPdn3LkyIti', // TanyaArtistry2026! & Glamgo2026!
      created_at: '2025-11-12T08:30:00Z',
      updated_at: '2026-10-25T14:20:00Z',
    };

    const userPro2: User = {
      id: 'usr-pro-002',
      phone: '+919820874192',
      email: 'zoya@zoyakhtarglam.com',
      full_name: 'Zoya Akhtar Malik',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      roles: ['PROFESSIONAL'],
      is_active: true,
      password_hash: '$2b$10$EDkvOMLMSBvGcWM9HtJ/I.LJnq7W8nvWvIfpcxcYdhkDV8L2e4Cfu', // Glamgo2026!
      created_at: '2026-02-14T09:00:00Z',
      updated_at: '2026-10-24T12:00:00Z',
    };

    const userPro3: User = {
      id: 'usr-pro-003',
      phone: '+919819204812',
      email: 'kabir@kabiraarav.couture',
      full_name: 'Kabir Deshmukh',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      roles: ['PROFESSIONAL'],
      is_active: true,
      password_hash: '$2b$10$EDkvOMLMSBvGcWM9HtJ/I.LJnq7W8nvWvIfpcxcYdhkDV8L2e4Cfu', // Glamgo2026!
      created_at: '2025-08-01T10:00:00Z',
      updated_at: '2026-10-21T09:00:00Z',
    };

    const userVendor1: User = {
      id: 'usr-vnd-001',
      phone: '+919833445566',
      email: 'atelier@glamgo.luxury',
      full_name: 'Glamgo Luxury Retail Node',
      avatar_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
      roles: ['VENDOR'],
      is_active: true,
      password_hash: '$2b$10$IcQuSy2WmX4wrXIMuCI8o.f6jOOuq9Vs7CsHYaoVkrcg6O4uERdK2', // VendorLuxe2026! & Glamgo2026!
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    };

    const userAdmin: User = {
      id: 'usr-adm-001',
      phone: '+919800000001',
      email: 'admin@glamgo.in',
      full_name: 'Sophia Laurent (Chief Curator)',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      roles: ['ADMIN'],
      is_active: true,
      password_hash: '$2b$10$BPDubddFU85rW59HBwyMHeNSoHxREZemwKv360/lGTqMQqa18uPPW', // AdminGlamgo2026! & Glamgo2026!
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    };

    this.users.push(userCustomer, userPro1, userPro2, userPro3, userVendor1, userAdmin);

    // 2. Seed Professional Profiles
    const pro1: ProfessionalProfile = {
      id: 'pro-001',
      user_id: userPro1.id,
      slug: 'tanya-grewal-artistry',
      business_name: 'Tanya Grewal Artistry Studio',
      bio: 'Vogue India featured bridal artist with 9+ years elevating modern South Asian brides. Specialized in timeless regal aesthetics with radiant, weightless skin finish that lasts 18+ hours under high-definition wedding lights.',
      experience_years: 9,
      specialties: ['Sabyasachi Bridal HD', 'Dewy Glass Skin', 'Royal Heritage Draping'],
      service_mode: 'BOTH',
      studio_location: { latitude: 19.0607, longitude: 72.8362 }, // Bandra West
      studio_address: {
        street: 'Suite 4B, Pali Hill Heritage',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400050',
        latitude: 19.0607,
        longitude: 72.8362,
      },
      max_travel_radius_km: 35.0,
      travel_fee_per_km: 45.0,
      kyc_status: 'APPROVED',
      rating_avg: 4.98,
      review_count: 142,
      commission_rate_pct: 15.0,
      avatar_url: userPro1.avatar_url || '',
      cover_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
      created_at: '2025-11-12T08:30:00Z',
      updated_at: '2026-10-25T14:20:00Z',
    };

    const pro2: ProfessionalProfile = {
      id: 'pro-002',
      user_id: userPro2.id,
      slug: 'zoya-akhtar-glam',
      business_name: 'Zoya Akhtar Glam Studio',
      bio: 'Former Lakmé Fashion Week lead backstage artist. Passionate about enhancing authentic facial bone structure with micro-concealing and luminous monochromatic tones.',
      experience_years: 7,
      specialties: ['Editorial Glass Skin', 'Feathered Brows', 'Effortless Modern Bride'],
      service_mode: 'BOTH',
      studio_location: { latitude: 19.1075, longitude: 72.8263 }, // Juhu
      studio_address: {
        street: 'Level 2, Juhu Beach Studios',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400049',
        latitude: 19.1075,
        longitude: 72.8263,
      },
      max_travel_radius_km: 25.0,
      travel_fee_per_km: 50.0,
      kyc_status: 'APPROVED',
      rating_avg: 4.94,
      review_count: 98,
      commission_rate_pct: 15.0,
      avatar_url: userPro2.avatar_url || '',
      cover_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
      created_at: '2026-02-14T09:00:00Z',
      updated_at: '2026-10-24T12:00:00Z',
    };

    const pro3: ProfessionalProfile = {
      id: 'pro-003',
      user_id: userPro3.id,
      slug: 'kabir-aarav-couture',
      business_name: 'Kabir & Aarav Couture Atelier',
      bio: 'Dual artist powerhouse duo catering to high-profile brides across India, Dubai, and Lake Como. Famous for 60-second indestructible drape engineering and sculptural hair art.',
      experience_years: 12,
      specialties: ['Architectural Updos', 'Kanjivaram Saree Pleating', 'Real Flower Floral Cascades'],
      service_mode: 'BOTH',
      studio_location: { latitude: 18.9220, longitude: 72.8347 }, // Colaba
      studio_address: {
        street: 'Colaba Causeway Royal Chambers',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400005',
        latitude: 18.9220,
        longitude: 72.8347,
      },
      max_travel_radius_km: 50.0,
      travel_fee_per_km: 60.0,
      kyc_status: 'APPROVED',
      rating_avg: 4.96,
      review_count: 180,
      commission_rate_pct: 15.0,
      avatar_url: userPro3.avatar_url || '',
      cover_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85',
      created_at: '2025-08-01T10:00:00Z',
      updated_at: '2026-10-21T09:00:00Z',
    };

    this.professionalProfiles.push(pro1, pro2, pro3);

    // 3. Seed Vendor Profiles
    const vendor1: VendorProfile = {
      id: 'vnd-001',
      user_id: userVendor1.id,
      brand_name: 'Glamgo Luxury Beauty Node',
      slug: 'glamgo-luxury-beauty-node',
      gstin_or_tax_id: '27AABCG9481Q1ZP',
      warehouse_address: {
        street: 'Fulfillment Hub 4, BKC Logistics Zone',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400051',
        latitude: 19.0662,
        longitude: 72.8687,
      },
      kyc_status: 'APPROVED',
      commission_rate_pct: 12.0,
      created_at: '2025-06-01T00:00:00Z',
    };
    this.vendorProfiles.push(vendor1);

    // 4. Seed Service Offerings
    const srv1: ServiceOffering = {
      id: 'srv-001',
      professional_id: pro1.id,
      category: 'Bridal',
      title: 'Signature Sabyasachi Bridal HD Package',
      description: 'Complete royal wedding day look. Customized color correction, ultra-dewy waterproof HD base, bespoke cut-crease eye artistry, and royal lehenga draping.',
      products_used: [
        'Charlotte Tilbury Hollywood Flawless Filter',
        'NARS Natural Radiant Longwear Foundation',
        'Pat McGrath Mothership VII Divine Rose Palette',
        'Tom Ford Shade and Illuminate Duo',
        'Huda Beauty Easy Bake Loose Powder',
      ],
      duration_minutes: 180,
      buffer_minutes: 45,
      base_price: 32000,
      deposit_pct: 30.0,
      is_addon: false,
      is_active: true,
      created_at: '2025-11-15T00:00:00Z',
    };

    const srv2: ServiceOffering = {
      id: 'srv-002',
      professional_id: pro1.id,
      category: 'Bridal',
      title: 'Royal Heritage Airbrush Bridal Package',
      description: 'Micro-fine Temptu silicon airbrush technology providing flawless 24-hour heat and humidity resistance.',
      products_used: [
        'Temptu Pro Silicon Airbrush System',
        'Dior Backstage Glow Face Palette',
        'Hourglass Veil Mineral Primer',
      ],
      duration_minutes: 210,
      buffer_minutes: 45,
      base_price: 38000,
      deposit_pct: 30.0,
      is_addon: false,
      is_active: true,
      created_at: '2025-11-15T00:00:00Z',
    };

    const srv3: ServiceOffering = {
      id: 'srv-003',
      professional_id: pro2.id,
      category: 'Bridal',
      title: 'Modern Minimalist Bride Edition',
      description: 'Refined, featherlight complexion work with micro-draping of peachy blush and natural fluttery lashes.',
      products_used: [
        'Westman Atelier Vital Skin Foundation Stick',
        'Chanel Les Beiges Water-Fresh Tint',
        'Rose Inc Cream Blush',
      ],
      duration_minutes: 150,
      buffer_minutes: 30,
      base_price: 25000,
      deposit_pct: 30.0,
      is_addon: false,
      is_active: true,
      created_at: '2026-02-15T00:00:00Z',
    };

    this.serviceOfferings.push(srv1, srv2, srv3);

    // 5. Seed Availability Rules (Working 09:00 - 20:00 daily except Sunday)
    [pro1.id, pro2.id, pro3.id].forEach((pId) => {
      for (let day = 0; day <= 6; day++) {
        this.availabilityRules.push({
          id: uuid('avail'),
          professional_id: pId,
          day_of_week: day,
          start_time: '08:30:00',
          end_time: '20:30:00',
          is_day_off: day === 0, // Sunday day-off
        });
      }
    });

    // 6. Seed Existing Confirmed Bookings (for collision detection)
    const existingBooking: Booking = {
      id: 'bk-seed-001',
      booking_number: 'GLAM-BK-202611-1001',
      customer_id: userCustomer.id,
      professional_id: pro1.id,
      status: 'CONFIRMED',
      service_mode: 'AT_VENUE',
      venue_address: {
        street: 'Sea View Suite 402, Bandra',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400050',
        latitude: 19.0607,
        longitude: 72.8362,
      },
      slot_start: '2026-11-15T14:30:00Z',
      slot_end: '2026-11-15T17:30:00Z',
      lock_expires_at: null,
      subtotal_amount: 32000,
      travel_fee: 450,
      tax_amount: 5841,
      total_amount: 38291,
      deposit_paid_amount: 11487,
      balance_due_amount: 26804,
      start_otp_hash: '582914',
      complete_otp_hash: '394812',
      created_at: '2026-10-25T10:00:00Z',
      updated_at: '2026-10-25T10:05:00Z',
    };
    this.bookings.push(existingBooking);

    // 7. Seed Products & Variants
    const p1: Product = {
      id: 'prod-001',
      vendor_id: vendor1.id,
      slug: 'airbrush-flawless-setting-spray',
      title: 'Airbrush Flawless Setting Spray (100ml)',
      brand_name: 'Charlotte Tilbury',
      category_path: 'Makeup/Face/Setting',
      description: 'Weightless, oil-free, pore-blurring shield that locks bridal makeup in place for up to 16 hours without melting or settling in fine lines.',
      ingredients: 'Aqua/Water, AMP-Acrylates Copolymer, Aloe Barbadensis Leaf Juice, Camellia Sinensis Leaf Extract.',
      is_pro_equipment: false,
      b2b_only: false,
      rating_avg: 4.9,
      review_count: 840,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    };

    const v1: ProductVariant = {
      id: 'var-001',
      product_id: p1.id,
      sku: 'GLAM-CT-SPRAY-100ML',
      shade_name: null,
      shade_hex: null,
      size_label: '100ml',
      mrp_price: 4200,
      retail_price: 3600,
      pro_wholesale_price: 3100,
      stock_quantity: 18,
      reserved_quantity: 3,
      batch_number: 'LOT-CT-2026B',
      expiry_date: '2028-12-31',
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
      ],
      updated_at: '2026-10-26T00:00:00Z',
    };

    const p2: Product = {
      id: 'prod-002',
      vendor_id: vendor1.id,
      slug: 'backstage-glow-face-palette',
      title: 'Backstage Glow Face Palette (001 Universal)',
      brand_name: 'Dior',
      category_path: 'Makeup/Face/Highlighter',
      description: 'The secret weapon of bridal makeup artists worldwide. 4 iridescent shades delivering ethereal, glass-skin reflection.',
      ingredients: 'Mica, Talc, Synthetic Fluorphlogopite, Dimethicone.',
      is_pro_equipment: true,
      b2b_only: false,
      rating_avg: 4.95,
      review_count: 512,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    };

    const v2: ProductVariant = {
      id: 'var-002',
      product_id: p2.id,
      sku: 'GLAM-DIOR-GLOW-001',
      shade_name: '001 Universal Glow',
      shade_hex: '#F9F1DC',
      size_label: '10g',
      mrp_price: 5500,
      retail_price: 4900,
      pro_wholesale_price: 4200,
      stock_quantity: 4,
      reserved_quantity: 2,
      batch_number: 'LOT-DIOR-009A',
      expiry_date: '2028-09-30',
      images: [
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      ],
      updated_at: '2026-10-26T00:00:00Z',
    };

    const p3: Product = {
      id: 'prod-003',
      vendor_id: vendor1.id,
      slug: 'faux-mink-3d-couture-bridal-lashes',
      title: 'Faux Mink 3D Couture Bridal Lashes (Pack of 3)',
      brand_name: 'Glamgo Atelier',
      category_path: 'Makeup/Eyes/Lashes',
      description: 'Handcrafted cruelty-free ultra-fine tapered fibers on a featherlight invisible cotton band.',
      ingredients: 'Synthetic Silk Protein Polymer.',
      is_pro_equipment: false,
      b2b_only: false,
      rating_avg: 4.88,
      review_count: 310,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    };

    const v3: ProductVariant = {
      id: 'var-003',
      product_id: p3.id,
      sku: 'GLAM-LASH-3D-MINK-03',
      shade_name: 'Natural Wispy Flutter',
      shade_hex: '#181311',
      size_label: '3 Pairs',
      mrp_price: 2400,
      retail_price: 1850,
      pro_wholesale_price: 1400,
      stock_quantity: 45,
      reserved_quantity: 5,
      batch_number: 'LOT-LASH-2026X',
      expiry_date: '2030-01-01',
      images: [
        'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=600&q=80',
      ],
      updated_at: '2026-10-26T00:00:00Z',
    };

    this.products.push(p1, p2, p3);
    this.productVariants.push(v1, v2, v3);
  }

  // ==========================================
  // QUERY / API IMPLEMENTATIONS
  // ==========================================

  /**
   * GET /api/v1/professionals/search
   */
  searchProfessionals(params: SearchProfessionalsParams): {
    data: (ProfessionalProfile & { distance_km: number; starting_price: number })[];
    total: number;
  } {
    const userLat = params.lat || 19.0760; // Default Mumbai center
    const userLng = params.lng || 72.8777;

    let results = this.professionalProfiles.map((pro) => {
      const distance = pro.studio_location
        ? calculateDistanceKm(userLat, userLng, pro.studio_location.latitude, pro.studio_location.longitude)
        : 2.5;

      const proServices = this.serviceOfferings.filter((s) => s.professional_id === pro.id);
      const startingPrice = proServices.length > 0 ? Math.min(...proServices.map((s) => s.base_price)) : 20000;

      return {
        ...pro,
        distance_km: distance,
        starting_price: startingPrice,
      };
    });

    if (params.query?.trim()) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.business_name.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params.service_mode) {
      results = results.filter((p) => p.service_mode === params.service_mode || p.service_mode === 'BOTH');
    }

    if (params.min_price) {
      results = results.filter((p) => p.starting_price >= params.min_price!);
    }

    if (params.sort_by === 'price-asc') {
      results.sort((a, b) => a.starting_price - b.starting_price);
    } else if (params.sort_by === 'rating') {
      results.sort((a, b) => b.rating_avg - a.rating_avg);
    } else {
      // Default: distance & rating composite
      results.sort((a, b) => a.distance_km - b.distance_km);
    }

    return {
      data: results,
      total: results.length,
    };
  }

  /**
   * GET /api/v1/professionals/:id/slots
   * Implements formula from section 3.1: [S_start, S_end] ∩ [B_i_start, B_i_end] = ∅
   */
  getAvailableSlots(
    proId: string,
    dateString: string, // '2026-11-15'
    serviceOfferingIds: string[],
    venueAddress?: Address
  ): GetSlotsResponse {
    const pro = this.professionalProfiles.find((p) => p.id === proId);
    if (!pro) throw new Error(`Professional ${proId} not found`);

    const selectedServices = this.serviceOfferings.filter((s) => serviceOfferingIds.includes(s.id));
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0) || 180;
    const maxBuffer = selectedServices.reduce((max, s) => Math.max(max, s.buffer_minutes), 30);

    // Calculate travel fee
    let travelFee = 0;
    if (venueAddress && pro.studio_location) {
      const dist = calculateDistanceKm(
        pro.studio_location.latitude,
        pro.studio_location.longitude,
        venueAddress.latitude,
        venueAddress.longitude
      );
      travelFee = Math.round(dist * pro.travel_fee_per_km);
    }

    // Candidate intervals to test
    const candidateTimes = ['08:30 AM', '11:00 AM', '02:30 PM', '05:00 PM', '07:30 PM'];

    // Get confirmed bookings for this pro
    const activeBookings = this.bookings.filter(
      (b) =>
        b.professional_id === proId &&
        ['LOCKED_PENDING_PAYMENT', 'CONFIRMED', 'ARTIST_EN_ROUTE', 'IN_PROGRESS'].includes(b.status)
    );

    const availableSlots: ComputedSlot[] = candidateTimes.map((timeStr) => {
      // Create slot timestamps
      const [timePart, modifier] = timeStr.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const slotStart = new Date(`${dateString}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`);
      const slotEnd = new Date(slotStart.getTime() + (totalDuration + maxBuffer) * 60 * 1000);

      // Check collision with active bookings
      const hasCollision = activeBookings.some((b) => {
        const bStart = new Date(b.slot_start).getTime();
        const bEnd = new Date(b.slot_end).getTime();
        const sStart = slotStart.getTime();
        const sEnd = slotEnd.getTime();
        // Intersection condition: max(sStart, bStart) < min(sEnd, bEnd)
        return Math.max(sStart, bStart) < Math.min(sEnd, bEnd);
      });

      // Check Redis lock
      const lockKey = `lock:pro:${proId}:${dateString}:${timeStr}`;
      const cachedLock = this.redisCache.get(lockKey);
      const isLockedInRedis = cachedLock ? cachedLock.expiresAt > Date.now() : false;

      const isAvailable = !hasCollision && !isLockedInRedis;

      return {
        time: timeStr,
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString(),
        is_available: isAvailable,
        reason: hasCollision ? 'BOOKED' : isLockedInRedis ? 'BLOCKED' : undefined,
        travel_buffer_minutes: maxBuffer,
      };
    });

    return {
      date: dateString,
      professional_id: proId,
      service_mode: pro.service_mode,
      travel_fee: travelFee,
      total_duration_minutes: totalDuration,
      available_slots: availableSlots,
    };
  }

  /**
   * POST /api/v1/bookings/lock
   * Acquires Redis Redlock with 600s TTL and creates booking row with LOCKED_PENDING_PAYMENT
   */
  acquireSlotLock(dto: LockSlotDto): LockSlotResponse {
    const pro = this.professionalProfiles.find((p) => p.id === dto.professional_id);
    if (!pro) throw new Error('Professional not found');

    const redisKey = `lock:pro:${dto.professional_id}:${dto.slot_start}`;
    const ttlSeconds = 600; // 10 minutes
    const lockExpiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

    // Check Redis lock key
    const existingLock = this.redisCache.get(redisKey);
    if (existingLock && existingLock.expiresAt > Date.now()) {
      throw new Error('This time slot is temporarily locked by another user. Please select another slot.');
    }

    // Set lock in Redis
    this.redisCache.set(redisKey, { value: dto.customer_id, expiresAt: Date.now() + ttlSeconds * 1000 });

    const selectedServices = this.serviceOfferings.filter((s) => dto.service_offering_ids.includes(s.id));
    const subtotal = selectedServices.reduce((sum, s) => sum + s.base_price, 0);
    const travelFee = dto.service_mode === 'AT_VENUE' ? 450 : 0;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + travelFee + tax;
    const depositPct = selectedServices[0]?.deposit_pct || 30;
    const depositAmount = Math.round((total * depositPct) / 100);
    const balanceDue = total - depositAmount;

    // Generate random 6-digit OTP hashes
    const startOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const completeOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const bookingId = uuid('bk');
    const newBooking: Booking = {
      id: bookingId,
      booking_number: `GLAM-BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: dto.customer_id,
      professional_id: dto.professional_id,
      status: 'LOCKED_PENDING_PAYMENT',
      service_mode: dto.service_mode,
      venue_address: dto.venue_address,
      slot_start: dto.slot_start,
      slot_end: dto.slot_end,
      lock_expires_at: lockExpiresAt,
      subtotal_amount: subtotal,
      travel_fee: travelFee,
      tax_amount: tax,
      total_amount: total,
      deposit_paid_amount: depositAmount,
      balance_due_amount: balanceDue,
      start_otp_hash: startOtp,
      complete_otp_hash: completeOtp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const bookingItems: BookingItem[] = selectedServices.map((s) => ({
      id: uuid('bki'),
      booking_id: bookingId,
      service_offering_id: s.id,
      quantity: 1,
      unit_price: s.base_price,
      duration_minutes: s.duration_minutes,
    }));

    this.bookings.push(newBooking);
    this.bookingItems.push(...bookingItems);

    return {
      booking: newBooking,
      booking_items: bookingItems,
      redis_lock_key: redisKey,
      lock_expires_at: lockExpiresAt,
      seconds_remaining: ttlSeconds,
    };
  }

  /**
   * POST /api/v1/cart/checkout
   * Processes hybrid payment: confirms locked booking + creates order & split vendor escrow ledgers
   */
  processHybridCheckout(dto: HybridCheckoutDto): HybridCheckoutResponse {
    const paymentId = uuid('pay');
    let booking: Booking | undefined;
    let order: Order | undefined;
    const subOrders: SubOrder[] = [];
    const createdEscrowLedgers: EscrowLedger[] = [];

    let totalAmount = 0;
    let depositPaidToday = 0;
    let balanceAtVenue = 0;

    // 1. Process Booking if present
    if (dto.booking_id) {
      booking = this.bookings.find((b) => b.id === dto.booking_id);
      if (booking) {
        booking.status = 'CONFIRMED';
        booking.updated_at = new Date().toISOString();

        depositPaidToday += booking.deposit_paid_amount;
        balanceAtVenue += booking.balance_due_amount;
        totalAmount += booking.total_amount;

        // Escrow ledger for Professional
        const pro = this.professionalProfiles.find((p) => p.id === booking!.professional_id);
        const commissionPct = pro?.commission_rate_pct || 15;
        const platformCommission = Math.round((booking.total_amount * commissionPct) / 100);
        const netPayout = booking.total_amount - platformCommission;

        const proEscrow: EscrowLedger = {
          id: uuid('escrow'),
          payment_transaction_id: paymentId,
          beneficiary_user_id: pro?.user_id || 'usr-pro-001',
          booking_id: booking.id,
          sub_order_id: null,
          gross_amount: booking.total_amount,
          platform_commission: platformCommission,
          tax_withheld: Math.round(booking.total_amount * 0.01), // 1% TDS
          net_payout_amount: netPayout,
          status: 'HELD',
          eligible_release_at: new Date(new Date(booking.slot_end).getTime() + 2 * 3600 * 1000).toISOString(), // 2h post slot
          settled_at: null,
          created_at: new Date().toISOString(),
        };

        this.escrowLedgers.push(proEscrow);
        createdEscrowLedgers.push(proEscrow);
      }
    }

    // 2. Process Physical Product items
    if (dto.items && dto.items.length > 0) {
      let productSubtotal = 0;
      const orderId = uuid('ord');
      const orderNumber = `GLAM-ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Group items by vendor
      const vendorItemsMap = new Map<string, { variant: ProductVariant; product: Product; qty: number }[]>();

      dto.items.forEach(({ variant_id, quantity }) => {
        const variant = this.productVariants.find((v) => v.id === variant_id);
        if (!variant) return;
        const product = this.products.find((p) => p.id === variant.product_id);
        if (!product) return;

        productSubtotal += variant.retail_price * quantity;

        // Decrement stock atomically
        variant.stock_quantity = Math.max(0, variant.stock_quantity - quantity);
        variant.reserved_quantity = Math.max(0, variant.reserved_quantity - quantity);

        const list = vendorItemsMap.get(product.vendor_id) || [];
        list.push({ variant, product, qty: quantity });
        vendorItemsMap.set(product.vendor_id, list);
      });

      const taxAmount = Math.round(productSubtotal * 0.18);
      const netPayable = productSubtotal + taxAmount;
      depositPaidToday += netPayable;
      totalAmount += netPayable;

      order = {
        id: orderId,
        order_number: orderNumber,
        customer_id: dto.customer_id,
        shipping_address: dto.shipping_address,
        total_amount: productSubtotal,
        discount_amount: 0,
        tax_amount: taxAmount,
        net_payable: netPayable,
        created_at: new Date().toISOString(),
      };
      this.orders.push(order);

      // Create SubOrders per vendor
      vendorItemsMap.forEach((items, vendorId) => {
        const subOrderId = uuid('subord');
        const subSubtotal = items.reduce((sum, item) => sum + item.variant.retail_price * item.qty, 0);

        const subOrder: SubOrder = {
          id: subOrderId,
          order_id: orderId,
          vendor_id: vendorId,
          status: 'CONFIRMED',
          awb_tracking_number: null,
          courier_partner: 'Delhivery Surface Pro',
          subtotal: subSubtotal,
          delivered_at: null,
          updated_at: new Date().toISOString(),
        };
        this.subOrders.push(subOrder);
        subOrders.push(subOrder);

        items.forEach(({ variant, qty }) => {
          this.orderItems.push({
            id: uuid('ordi'),
            sub_order_id: subOrderId,
            variant_id: variant.id,
            quantity: qty,
            unit_price: variant.retail_price,
            total_price: variant.retail_price * qty,
          });
        });

        // Vendor Escrow Ledger
        const vendor = this.vendorProfiles.find((v) => v.id === vendorId);
        const commissionPct = vendor?.commission_rate_pct || 12;
        const commission = Math.round((subSubtotal * commissionPct) / 100);

        const vendorEscrow: EscrowLedger = {
          id: uuid('escrow'),
          payment_transaction_id: paymentId,
          beneficiary_user_id: vendor?.user_id || 'usr-vnd-001',
          booking_id: null,
          sub_order_id: subOrderId,
          gross_amount: subSubtotal,
          platform_commission: commission,
          tax_withheld: Math.round(subSubtotal * 0.01),
          net_payout_amount: subSubtotal - commission,
          status: 'HELD',
          eligible_release_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), // T+7 days
          settled_at: null,
          created_at: new Date().toISOString(),
        };
        this.escrowLedgers.push(vendorEscrow);
        createdEscrowLedgers.push(vendorEscrow);
      });
    }

    // 3. Create Gateway Payment Transaction
    const paymentTransaction: PaymentTransaction = {
      id: paymentId,
      user_id: dto.customer_id,
      booking_id: booking ? booking.id : null,
      order_id: order ? order.id : null,
      gateway_provider: dto.gateway_provider || 'RAZORPAY',
      gateway_order_id: `order_rzp_${Date.now()}`,
      gateway_payment_id: `pay_rzp_${Math.random().toString(36).substring(2, 10)}`,
      amount: depositPaidToday,
      currency: 'INR',
      status: 'CAPTURED',
      created_at: new Date().toISOString(),
    };
    this.paymentTransactions.push(paymentTransaction);

    return {
      payment_transaction: paymentTransaction,
      booking,
      order,
      sub_orders: subOrders,
      escrow_ledgers: createdEscrowLedgers,
      receipt: {
        deposit_today: depositPaidToday,
        balance_at_venue: balanceAtVenue,
        grand_total: totalAmount,
      },
    };
  }

  /**
   * POST /api/v1/bookings/:id/verify-otp
   * Verifies START or COMPLETE OTP and triggers escrow payout release
   */
  verifyBookingOtp(dto: VerifyOtpDto): VerifyOtpResponse {
    const booking = this.bookings.find((b) => b.id === dto.booking_id);
    if (!booking) throw new Error('Booking not found');

    if (dto.otp_type === 'START') {
      if (booking.start_otp_hash !== dto.otp_code) {
        throw new Error('Invalid 6-digit Service Start OTP. Please ask the client to re-read from their Glamgo app.');
      }
      booking.status = 'IN_PROGRESS';
      booking.updated_at = new Date().toISOString();
      return {
        booking_id: booking.id,
        status: 'IN_PROGRESS',
        message: 'Start OTP verified successfully. Appointment is now IN_PROGRESS.',
      };
    } else {
      if (booking.complete_otp_hash !== dto.otp_code) {
        throw new Error('Invalid 6-digit Service Completion OTP.');
      }
      booking.status = 'COMPLETED';
      booking.updated_at = new Date().toISOString();

      // Release Escrow Ledger
      const ledger = this.escrowLedgers.find((e) => e.booking_id === booking.id);
      if (ledger) {
        ledger.status = 'SETTLED';
        ledger.settled_at = new Date().toISOString();
      }

      return {
        booking_id: booking.id,
        status: 'COMPLETED',
        message: 'Completion OTP verified! Escrow payout of ₹' + (ledger?.net_payout_amount || 0).toLocaleString('en-IN') + ' has been settled to the master artist account.',
        escrow_ledger_updated: ledger,
      };
    }
  }

  /**
   * POST /api/v1/vendor/orders/:id/generate-awb
   */
  generateShippingLabel(subOrderId: string, courier = 'Bluedart Air Express'): SubOrder {
    let subOrder = this.subOrders.find((s) => s.id === subOrderId);
    if (!subOrder) {
      subOrder = {
        id: subOrderId,
        order_id: 'ord-seed-001',
        vendor_id: 'vnd-001',
        subtotal: 3600,
        status: 'SHIPPED',
        awb_tracking_number: `BD-AWB-${Math.floor(100000000 + Math.random() * 900000000)}`,
        courier_partner: courier,
        delivered_at: null,
        updated_at: new Date().toISOString(),
      };
      this.subOrders.push(subOrder);
      return subOrder;
    }

    subOrder.awb_tracking_number = `BD-AWB-${Math.floor(100000000 + Math.random() * 900000000)}`;
    subOrder.courier_partner = courier;
    subOrder.status = 'SHIPPED';
    subOrder.updated_at = new Date().toISOString();

    return subOrder;
  }

  /**
   * Find user by email (case-insensitive, supporting demo aliases)
   */
  findUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    
    // Check direct email match
    const user = this.users.find((u) => u.email?.toLowerCase() === normalized);
    if (user) return user;

    // Check demo aliases
    if (normalized === 'bride@glamgo.in') {
      return this.users.find((u) => u.email === 'rhea.singhania@glamgo.luxury');
    }
    if (normalized === 'tanya@glamgo.in') {
      return this.users.find((u) => u.email === 'tanya@tanyagrewal.artistry');
    }
    if (normalized === 'vendor@glamgo.in') {
      return this.users.find((u) => u.email === 'atelier@glamgo.luxury');
    }
    if (normalized === 'admin@glamgo.in' || normalized === 'admin@glamgo.luxury') {
      return this.users.find((u) => u.email === 'admin@glamgo.in');
    }

    return undefined;
  }

  /**
   * Create a new user with secure password hash
   */
  createUser(userData: {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: 'CUSTOMER' | 'PROFESSIONAL' | 'VENDOR' | 'ADMIN';
    phone?: string;
  }): User {
    const newUser: User = {
      id: uuid('usr'),
      phone: userData.phone || `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: userData.email.trim().toLowerCase(),
      full_name: userData.fullName.trim(),
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      roles: [userData.role || 'CUSTOMER'],
      is_active: true,
      password_hash: userData.passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * GET /api/v1/bookings/my
   * Retrieve customer's active and completed bookings with pro details
   */
  getMyBookings(userId?: string) {
    const list = userId ? this.bookings.filter((b) => b.customer_id === userId) : this.bookings;
    return list.map((b) => {
      const pro = this.professionalProfiles.find((p) => p.id === b.professional_id);
      const proUser = pro ? this.users.find((u) => u.id === pro.user_id) : undefined;
      const addr = b.venue_address;
      const items = this.bookingItems.filter((i) => i.booking_id === b.id);
      const offerings = items.map((i) => this.serviceOfferings.find((s) => s.id === i.service_offering_id)).filter(Boolean);

      return {
        id: b.id,
        booking_number: b.booking_number,
        status: b.status,
        service_mode: b.service_mode || 'AT_VENUE',
        slot_start: b.slot_start,
        slot_end: b.slot_end,
        total_amount: b.total_amount,
        deposit_paid_amount: b.deposit_paid_amount,
        balance_due_amount: b.balance_due_amount,
        start_otp_hash: b.start_otp_hash,
        complete_otp_hash: b.complete_otp_hash,
        created_at: b.created_at,
        professional: {
          id: pro?.id || b.professional_id,
          business_name: pro?.business_name || 'Master Beauty Atelier',
          slug: pro?.slug || 'master-artist',
          rating_avg: pro?.rating_avg || 4.95,
          review_count: pro?.review_count || 128,
          artist_name: proUser?.full_name || 'Tanya Grewal',
          avatar_url: proUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        services: offerings,
        venue_address: addr
          ? `${addr.street}, ${addr.city}, ${addr.postal_code}`
          : 'Suite 4B, Pali Hill Heritage, Bandra West, Mumbai 400050',
      };
    });
  }

  /**
   * GET /api/v1/orders/my
   * Retrieve customer's retail beauty orders with sub-orders and tracking
   */
  getMyOrders(userId?: string) {
    const list = userId ? this.orders.filter((o) => o.customer_id === userId) : this.orders;
    return list.map((o) => {
      const subOrders = this.subOrders.filter((s) => s.order_id === o.id);
      const items = this.orderItems
        .filter((i) => subOrders.some((s) => s.id === i.sub_order_id))
        .map((i) => {
          const variant = this.productVariants.find((v) => v.id === i.variant_id);
          const product = variant ? this.products.find((p) => p.id === variant.product_id) : undefined;
          return {
            ...i,
            variant,
            product,
          };
        });

      return {
        id: o.id,
        order_number: o.order_number,
        total_amount: o.total_amount,
        net_payable: o.net_payable,
        status: (o as any).status || subOrders[0]?.status || 'CONFIRMED',
        created_at: o.created_at,
        sub_orders: subOrders,
        items,
      };
    });
  }

  /**
   * GET /api/v1/pro/payouts
   * Calculate professional earnings, escrow held, and settlement ledger
   */
  getProPayouts(proId?: string) {
    const bookings = proId ? this.bookings.filter((b) => b.professional_id === proId) : this.bookings;
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
    const inProgressBookings = bookings.filter((b) => b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED');

    const grossRevenue = completedBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const platformCommission = Math.round(grossRevenue * 0.18);
    const settledEarnings = grossRevenue - platformCommission;

    const escrowHeld = inProgressBookings.reduce((sum, b) => {
      const gross = Number(b.total_amount) || 0;
      return sum + (gross - Math.round(gross * 0.18));
    }, 0);

    const transactions = this.escrowLedgers
      .filter((e) => e.booking_id)
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        reference: e.id,
        gross_amount: e.gross_amount,
        commission: e.platform_commission,
        net_payout: e.net_payout_amount,
        status: e.status,
        date: e.settled_at || e.created_at,
      }));

    return {
      total_events: completedBookings.length,
      upcoming_events: inProgressBookings.length,
      gross_revenue: grossRevenue || 384000,
      platform_commission: platformCommission || Math.round(384000 * 0.18),
      settled_earnings: settledEarnings || Math.round(384000 * 0.82),
      escrow_held: escrowHeld || 118000,
      recent_transactions: transactions,
    };
  }

  /**
   * POST /api/v1/webhooks/logistics
   * 3PL carrier callback to advance package tracking state and trigger escrow release
   */
  updateLogisticsStatus(awb: string, status: 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RTO', location?: string) {
    let subOrder = this.subOrders.find((s) => s.awb_tracking_number === awb);
    if (!subOrder && this.subOrders.length > 0) {
      subOrder = this.subOrders[0];
      subOrder.awb_tracking_number = awb;
    }

    if (subOrder) {
      subOrder.status = status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED';
      subOrder.updated_at = new Date().toISOString();
      if (status === 'DELIVERED') {
        subOrder.delivered_at = new Date().toISOString();

        // Release or mark vendor escrow eligible for payout (T+7 days window)
        const escrow = this.escrowLedgers.find((e) => e.sub_order_id === subOrder!.id);
        if (escrow) {
          escrow.status = 'ELIGIBLE_FOR_PAYOUT';
          escrow.eligible_release_at = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
        }
      }
    }

    return {
      awb,
      status,
      location: location || 'BOM Central Express Hub',
      updated_at: new Date().toISOString(),
      sub_order: subOrder,
    };
  }

  /**
   * POST /api/v1/admin/disputes/resolve
   * Admin dispute arbitration engine
   */
  resolveDispute(bookingId: string, resolution: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'RELEASE_ESCROW', refundAmount?: number) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      if (resolution === 'FULL_REFUND') {
        booking.status = 'CANCELLED_BY_CUSTOMER';
      } else if (resolution === 'RELEASE_ESCROW') {
        booking.status = 'COMPLETED';
      }
      booking.updated_at = new Date().toISOString();
    }

    const ledger = this.escrowLedgers.find((e) => e.booking_id === bookingId);
    if (ledger) {
      if (resolution === 'FULL_REFUND') {
        ledger.status = 'REFUNDED';
      } else if (resolution === 'RELEASE_ESCROW') {
        ledger.status = 'SETTLED';
        ledger.settled_at = new Date().toISOString();
      } else if (resolution === 'PARTIAL_REFUND' && refundAmount) {
        ledger.net_payout_amount = Math.max(0, ledger.net_payout_amount - refundAmount);
        ledger.status = 'SETTLED';
        ledger.settled_at = new Date().toISOString();
      }
    }

    return {
      booking_id: bookingId,
      resolution,
      refund_amount: refundAmount || 0,
      booking_status: booking?.status,
      escrow_status: ledger?.status,
    };
  }
}

// Export singleton instance
export const mockDb = new MockRelationalDatabase();
