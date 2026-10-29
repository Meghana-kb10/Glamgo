export * from './database';

export type MarketplaceMode = 'services' | 'shop';

export type PortalType = 'landing' | 'customer' | 'pro' | 'vendor' | 'admin';

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  tier: 'Signature' | 'Bridal Couture' | 'Red Carpet' | 'Classic';
  category?: 'bridal' | 'makeup' | 'hair' | 'skin' | 'nails' | 'draping' | 'spa';
  serviceMode?: 'AT_VENUE' | 'IN_STUDIO' | 'HYBRID';
  productsUsed: string[];
  inclusions: string[];
  isPopular?: boolean;
}

export interface BeforeAfterImage {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  skinType: string;
  transformationType: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBridal: boolean;
  lookTitle: string;
}

export interface Artist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  portfolioImages: string[];
  title: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  distance: string;
  location: string;
  serviceTypes: ('At-Home Service' | 'Studio Visit' | 'Destination Event')[];
  specialties: string[];
  isVerified: boolean;
  isBridalCertified: boolean;
  isInstantBook: boolean;
  bio: string;
  experienceYears: number;
  hygieneScore: string;
  packages: ServicePackage[];
  beforeAfter: BeforeAfterImage;
  reviews: Review[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  shades?: { name: string; hex: string }[];
  isBestseller?: boolean;
  stockCount: number;
}

export interface CartItemProduct {
  type: 'product';
  product: Product;
  selectedShade?: string;
  quantity: number;
}

export interface CartItemService {
  type: 'service';
  artist: Artist;
  package: ServicePackage;
  date: string;
  timeSlot: string;
  venueAddress: string;
  venueType: 'Home / Venue' | 'Studio Visit';
  lockExpiresAt?: number;
  bookingNumber?: string;
  startOtp?: string;
  completeOtp?: string;
}

export type CartItem = CartItemProduct | CartItemService;

export interface IncomingBookingRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  packageName: string;
  serviceType: string;
  date: string;
  time: string;
  venue: string;
  amount: number;
  depositPaid: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  countdownSeconds: number;
}

export interface CalendarTimeSlot {
  id: string;
  day: string;
  time: string;
  clientName?: string;
  serviceName?: string;
  status: 'available' | 'booked' | 'blocked';
  price?: number;
}

export interface VendorInventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  inStock: number;
  reserved: number;
  reorderPoint: number;
  price: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';
  shippingStatus: 'READY' | 'LABEL_GENERATED' | 'SHIPPED';
}

export interface KycApplicant {
  id: string;
  artistName: string;
  avatar: string;
  category: string;
  city: string;
  experienceYears: number;
  idProof: string;
  certificate: string;
  portfolioSamples: string[];
  instagramHandle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
