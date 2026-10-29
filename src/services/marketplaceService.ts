/**
 * Glamgo Marketplace Service
 * Implements PRD HOME-1 to HOME-9, SVC-1 to SVC-7, and PRO-1 to PRO-7.
 * Provides curated categories, banner carousels, locations, recommendations, and search indexing.
 */

import { Artist, Product, ServicePackage } from '../types';
import { MOCK_ARTISTS, MOCK_PRODUCTS } from '../data/mockData';

export interface LocationItem {
  id: string;
  name: string;
  area: string;
  city: string;
  pincode: string;
  isPopular?: boolean;
}

export const POPULAR_LOCATIONS: LocationItem[] = [
  { id: 'loc-01', name: 'Indiranagar 100ft Road', area: 'Indiranagar', city: 'Bengaluru', pincode: '560038', isPopular: true },
  { id: 'loc-02', name: 'Koramangala 4th Block', area: 'Koramangala', city: 'Bengaluru', pincode: '560034', isPopular: true },
  { id: 'loc-03', name: 'HSR Layout Sector 1', area: 'HSR Layout', city: 'Bengaluru', pincode: '560102', isPopular: true },
  { id: 'loc-04', name: 'Lavelle Road & UB City', area: 'Central Bengaluru', city: 'Bengaluru', pincode: '560001', isPopular: true },
  { id: 'loc-05', name: 'Sadashivanagar', area: 'North Bengaluru', city: 'Bengaluru', pincode: '560080', isPopular: true },
  { id: 'loc-06', name: 'Whitefield EPIP Zone', area: 'Whitefield', city: 'Bengaluru', pincode: '560066', isPopular: true },
  { id: 'loc-07', name: 'Jayanagar 4th Block', area: 'South Bengaluru', city: 'Bengaluru', pincode: '560011', isPopular: true },
  { id: 'loc-08', name: 'Carter Road, Bandra West', area: 'Bandra', city: 'Mumbai', pincode: '400050', isPopular: false },
];

export interface MarketplaceCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  iconName: string; // Lucide icon identifier
  imageUrl: string;
  subcategories: string[];
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'cat-makeup',
    slug: 'makeup',
    name: 'Makeup',
    tagline: 'HD party, airbrush & glam',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Makeup', 'Party Glam', 'Airbrush', 'Engagement', 'Cocktail', 'Editorial'],
  },
  {
    id: 'cat-hair',
    slug: 'hair',
    name: 'Hair',
    tagline: 'Blowouts, styling & drape',
    iconName: 'Scissors',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Hair', 'Blowdry & Curls', 'Braids & Updos', 'Keratin & Spa', 'Extensions'],
  },
  {
    id: 'cat-nails',
    slug: 'nails',
    name: 'Nails',
    tagline: 'Gel couture & nail art',
    iconName: 'Gem',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Nails', 'Gel Extensions', 'Chrome & Art', 'Classic Manicure', 'Pedicure'],
  },
  {
    id: 'cat-skin',
    slug: 'skin',
    name: 'Skin',
    tagline: 'Hydra facial & cleanups',
    iconName: 'Droplets',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Skin', 'Hydra Infusion', 'Bridal Radiance', 'Deep Cleanup', 'Organic Peels'],
  },
  {
    id: 'cat-waxing',
    slug: 'waxing',
    name: 'Waxing',
    tagline: 'Rica roll-on & sensitive peel',
    iconName: 'Feather',
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6c51842?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Waxing', 'Rica Italian Wax', 'Full Body Glow', 'Bikini Care', 'Chocolate Wax'],
  },
  {
    id: 'cat-bridal',
    slug: 'bridal',
    name: 'Bridal',
    tagline: 'Master bridal packages',
    iconName: 'Crown',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Bridal', 'Sabyasachi HD', 'Muhurtham Traditional', 'Reception Airbrush', 'Pre-Bridal Package'],
  },
  {
    id: 'cat-spa',
    slug: 'spa',
    name: 'Spa',
    tagline: 'Relaxation & massages',
    iconName: 'Flower2',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Spa', 'Aromatherapy', 'Swedish Massage', 'Foot Reflexology', 'Body Polish'],
  },
  {
    id: 'cat-mens',
    slug: 'mens',
    name: "Men's",
    tagline: 'Grooming & beard sculpting',
    iconName: 'UserCheck',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80',
    subcategories: ['All Grooming', 'Haircut & Style', 'Beard Trim & Oil', 'De-tan Facial', 'Groom Styling'],
  },
];

export interface OfferBanner {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  code: string;
  discount: string;
  imageUrl: string;
  actionText: string;
  linkCategory: string;
}

export interface SpotlightItem {
  id: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaVariant: 'light' | 'dark';
  bgColor: string;
  textColor: string;
  imageUrl: string;
  category: string;
  serviceId?: string;
}

export const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 'spotlight-1',
    badge: 'New launch',
    badgeBg: '#5A1C32',
    badgeColor: '#FFFFFF',
    title: 'Japanese glow rituals',
    subtitle: 'Starting ₹1,399',
    ctaText: 'Book now',
    ctaVariant: 'light',
    bgColor: '#4A5B4C',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    category: 'skin',
    serviceId: 'srv-005',
  },
  {
    id: 'spotlight-2',
    badge: 'Special Edition',
    badgeBg: '#C9A25B',
    badgeColor: '#1F1A1D',
    title: 'Gift a relaxing spa',
    subtitle: 'Discover luxury spa & massage hampers',
    ctaText: 'Book now',
    ctaVariant: 'light',
    bgColor: '#4A152E',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    category: 'spa',
    serviceId: 'srv-005',
  },
  {
    id: 'spotlight-3',
    badge: 'Intense Cleanse',
    badgeBg: '#1F1A1D',
    badgeColor: '#FFFFFF',
    title: 'Hydro-infusion facial',
    subtitle: 'Deep pore refinement & glow',
    ctaText: 'Book now',
    ctaVariant: 'dark',
    bgColor: '#2E4A42',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b6f3b018?auto=format&fit=crop&w=600&q=80',
    category: 'skin',
    serviceId: 'srv-005',
  },
  {
    id: 'spotlight-4',
    badge: 'Wedding Season',
    badgeBg: '#C9A25B',
    badgeColor: '#1F1A1D',
    title: 'Signature bridal atelier',
    subtitle: 'HD makeup & saree draping from ₹12,999',
    ctaText: 'Book now',
    ctaVariant: 'light',
    bgColor: '#382218',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    category: 'bridal',
    serviceId: 'srv-001',
  },
  {
    id: 'spotlight-5',
    badge: 'Trending',
    badgeBg: '#B8336A',
    badgeColor: '#FFFFFF',
    title: 'Express blowdry & styling',
    subtitle: 'Salon blowout at home from ₹799',
    ctaText: 'Book now',
    ctaVariant: 'light',
    bgColor: '#5B2536',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
    category: 'hair',
    serviceId: 'srv-003',
  },
];

export const OFFER_BANNERS: OfferBanner[] = [
  {
    id: 'offer-01',
    title: 'The Royal Bridal Atelier',
    tagline: 'Book celebrity MUAs with 25% savings on Sabyasachi & Manish Malhotra couture looks',
    badge: 'Limited Wedding Season',
    code: 'WEDDING10',
    discount: '25% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    actionText: 'Explore Bridal Packages',
    linkCategory: 'bridal',
  },
  {
    id: 'offer-02',
    title: 'Indiranagar Flagship Launch',
    tagline: 'Complimentary Hydra-Boost Pre-Makeup Mask with every hair & makeup reservation',
    badge: 'Bengaluru Exclusive',
    code: 'GLAM100',
    discount: 'Flat ₹500 OFF',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    actionText: 'Reserve Slot Now',
    linkCategory: 'makeup',
  },
  {
    id: 'offer-03',
    title: 'Weekend Self-Care Glow',
    tagline: 'Certified sterile single-use kits delivered to your doorstep in 45 minutes',
    badge: 'Instant Slot Confirmation',
    code: 'FIRST20',
    discount: '20% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    actionText: 'Book At-Home Spa',
    linkCategory: 'spa',
  },
];

export interface DetailedService {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  price: number;
  originalPrice: number;
  savingsAmount: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  galleryImages: string[];
  description: string;
  whatIsIncluded: string[];
  productsUsed: string[];
  isMostBooked?: boolean;
  isAvailableToday?: boolean;
  serviceMode: 'AT_VENUE' | 'IN_STUDIO' | 'HYBRID';
  faqs: { question: string; answer: string }[];
  beforeImage?: string;
  afterImage?: string;
}

export const CURATED_SERVICES: DetailedService[] = [
  {
    id: 'srv-001',
    title: 'Signature Sabyasachi Bridal HD Package',
    category: 'bridal',
    durationMinutes: 180,
    price: 32000,
    originalPrice: 38000,
    savingsAmount: 6000,
    rating: 4.98,
    reviewCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Bespoke bridal transformation using high-definition micro-pigment formulas engineered for 4K photography, flash stability, and 16-hour sweat resistance.',
    whatIsIncluded: [
      'Pre-session ultrasonic skin hydra-prep',
      'Full HD contouring and editorial eye artistry',
      'Custom 3D silk mink lashes & waterproof bonding',
      'Dupatta setting & pinless Sabyasachi saree pleating',
      'Hair ornamentation & fresh floral garland styling',
      'Sealed single-use sterilised beauty tool kit',
    ],
    productsUsed: [
      'Charlotte Tilbury Magic Cream & Flawless Filter',
      'Huda Beauty Faux Filter High Coverage Foundation',
      'Dior Backstage Glow Face Palette',
      'Urban Decay All Nighter Extra Hold Setting Spray',
      'MAC Retro Matte Liquid Lipcolour in Ruby Woo / Velvet Teddy',
    ],
    isMostBooked: true,
    isAvailableToday: false,
    serviceMode: 'AT_VENUE',
    faqs: [
      {
        question: 'How early should I book my bridal date?',
        answer: 'We recommend reserving 3 to 6 months in advance for peak auspicious wedding dates in Bengaluru and Mumbai.',
      },
      {
        question: 'What are the travel charges for at-venue bookings?',
        answer: 'Travel within 15 km of the master artist’s central studio is included. Beyond 15 km, a nominal ₹25/km fuel surcharge applies.',
      },
      {
        question: 'Can I do a trial session before the wedding?',
        answer: 'Yes! You can book a 90-minute bridal preview consultation with any master artist directly from their profile.',
      },
    ],
    beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    afterImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'srv-002',
    title: 'Red Carpet HD Airbrush Glam',
    category: 'makeup',
    durationMinutes: 90,
    price: 6500,
    originalPrice: 8000,
    savingsAmount: 1500,
    rating: 4.94,
    reviewCount: 428,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Micro-fine airbrush application that diffuses fine lines and delivers a seamless, pore-blurring glass-skin finish with zero cakeyness.',
    whatIsIncluded: [
      'Gentle enzymatic pore exfoliation & primer',
      'Compressor-powered silicone airbrush foundation',
      'Smokey or soft-glam eyeshadow sculpting',
      'Volumizing individual lash clusters',
      'Gloss or velvet matte lip perfection',
    ],
    productsUsed: ['TEMPTU Pro Airbrush Pods', 'Pat McGrath Mothership Palette', 'Fenty Beauty Gloss Bomb'],
    isMostBooked: true,
    isAvailableToday: true,
    serviceMode: 'HYBRID',
    faqs: [
      {
        question: 'Is airbrush makeup suitable for oily skin?',
        answer: 'Yes, our silicone-based TEMPTU airbrush formula creates a water-resistant veil that repels excess sebum and sweat for 14+ hours.',
      },
    ],
  },
  {
    id: 'srv-003',
    title: 'Hollywood Bouncy Blowout & Scalp Therapy',
    category: 'hair',
    durationMinutes: 60,
    price: 2400,
    originalPrice: 3000,
    savingsAmount: 600,
    rating: 4.91,
    reviewCount: 194,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Dyson Supersonic powered blowout combined with botanical peptide serum to deliver voluminous, red-carpet bounce with brilliant shine.',
    whatIsIncluded: [
      'Scalp detox massage with rosemary-peppermint elixir',
      'Heat protection thermal shield spray',
      'Ceramic barrel tension blowout',
      'Curved pin setting for 48-hour curl retention',
    ],
    productsUsed: ['Olaplex No. 7 Bonding Oil', 'Moroccanoil Treatment Original', 'Dyson Airwrap Styler'],
    isMostBooked: true,
    isAvailableToday: true,
    serviceMode: 'AT_VENUE',
    faqs: [
      {
        question: 'How long will the blowout hold?',
        answer: 'With our pin-setting technique, the blowout retains bounce and body for up to 48 hours in normal humidity.',
      },
    ],
  },
  {
    id: 'srv-004',
    title: 'Russian Gel Extension & Chrome Nail Couture',
    category: 'nails',
    durationMinutes: 75,
    price: 3200,
    originalPrice: 4000,
    savingsAmount: 800,
    rating: 4.96,
    reviewCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Dry e-file Russian cuticle manicure followed by sculpted gel tips and mirror-glaze chrome pigments.',
    whatIsIncluded: [
      'Diamond bit precision cuticle care',
      'Polygel / soft gel tip length extensions',
      'Glazed donut or holographic chrome finish',
      'Organic cold-pressed cuticle oil massage',
    ],
    productsUsed: ['OPI GelColor', 'Apres Gel-X', 'Bio Seaweed Gel'],
    isMostBooked: false,
    isAvailableToday: true,
    serviceMode: 'HYBRID',
    faqs: [
      {
        question: 'Are gel extensions damaging to natural nails?',
        answer: 'Our soak-off system preserves natural nail integrity without aggressive buffing.',
      },
    ],
  },
  {
    id: 'srv-005',
    title: 'Hydra-Oxygen Facial Radiance Treatment',
    category: 'skin',
    durationMinutes: 60,
    price: 3900,
    originalPrice: 4800,
    savingsAmount: 900,
    rating: 4.95,
    reviewCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Medical-grade vortex suction infusing hyaluronic acid, niacinamide, and antioxidants directly into dermal layers.',
    whatIsIncluded: [
      'Vortex extraction of blackheads and sebum',
      'Oxygen spray jet infusion',
      'Cryo cooling firming wand massage',
      'Bio-cellulose peptide collagen mask',
    ],
    productsUsed: ['SkinCeuticals C E Ferulic', 'The Ordinary Niacinamide', 'Bioderma Sensibio'],
    isMostBooked: true,
    isAvailableToday: true,
    serviceMode: 'AT_VENUE',
    faqs: [
      {
        question: 'Is there any downtime after the treatment?',
        answer: 'Zero downtime. Your skin will look instantly plump, luminous, and camera-ready.',
      },
    ],
  },
  {
    id: 'srv-006',
    title: 'Rica White Chocolate Painless Full Body Wax',
    category: 'waxing',
    durationMinutes: 90,
    price: 2800,
    originalPrice: 3500,
    savingsAmount: 700,
    rating: 4.89,
    reviewCount: 460,
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6c51842?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512290900672-1f02e6c51842?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Italian Rica colophony-free wax formulated for sensitive skin, leaving arms, legs, and underarms silky and stubble-free.',
    whatIsIncluded: [
      'Pre-wax cleansing lotion with chamomile',
      'Low-temperature cartridge roller wax',
      'Soothing post-wax lotus flower oil',
      'Sanitary disposable sheets & disposable spatulas',
    ],
    productsUsed: ['Rica White Chocolate Liposoluble Wax', 'Rica Post-Epil Lotus Oil'],
    isMostBooked: false,
    isAvailableToday: true,
    serviceMode: 'AT_VENUE',
    faqs: [
      {
        question: 'Does Rica wax cause redness or rashes?',
        answer: 'No, Rica is 100% colophony-free and enriched with titanium dioxide to prevent skin irritation.',
      },
    ],
  },
];

export const TRENDING_SEARCHES = [
  'Sabyasachi Bridal HD',
  'Airbrush Makeup Indiranagar',
  'OPI Gel Manicure',
  'Keratin Hair Treatment',
  'Charlotte Tilbury Glow',
  'Dyson Blowout Koramangala',
  'Hydra Facial Whitefield',
  'Groom Beard Sculpting',
];

export interface SearchResultGroup {
  services: DetailedService[];
  professionals: Artist[];
  products: Product[];
}

export const marketplaceService = {
  getLocations(): LocationItem[] {
    return POPULAR_LOCATIONS;
  },

  getCurrentLocation(): LocationItem {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('glamgo_user_location');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return POPULAR_LOCATIONS[0];
  },

  setCurrentLocation(loc: LocationItem): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('glamgo_user_location', JSON.stringify(loc));
      } catch {}
    }
  },

  getCategories(): MarketplaceCategory[] {
    return MARKETPLACE_CATEGORIES;
  },

  getOfferBanners(): OfferBanner[] {
    return OFFER_BANNERS;
  },

  getSpotlightItems(): SpotlightItem[] {
    return SPOTLIGHT_ITEMS;
  },

  getMostBookedServices(): DetailedService[] {
    return CURATED_SERVICES.filter((s) => s.isMostBooked);
  },

  getServicesByCategory(categorySlug: string): DetailedService[] {
    if (!categorySlug || categorySlug === 'all') return CURATED_SERVICES;
    return CURATED_SERVICES.filter((s) => s.category.toLowerCase() === categorySlug.toLowerCase());
  },

  getServiceById(id: string): DetailedService | undefined {
    return CURATED_SERVICES.find((s) => s.id === id);
  },

  getTopProfessionals(): Artist[] {
    return MOCK_ARTISTS.filter((a) => a.rating >= 4.9);
  },

  getBridalPackages(): DetailedService[] {
    return CURATED_SERVICES.filter((s) => s.category === 'bridal');
  },

  getCuratedProducts(): Product[] {
    return MOCK_PRODUCTS;
  },

  /**
   * Typo-tolerant global search across services, artists, and retail items
   */
  search(query: string): SearchResultGroup {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        services: CURATED_SERVICES.slice(0, 4),
        professionals: MOCK_ARTISTS.slice(0, 3),
        products: MOCK_PRODUCTS.slice(0, 3),
      };
    }

    const services = CURATED_SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.productsUsed.some((p) => p.toLowerCase().includes(q))
    );

    const professionals = MOCK_ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.specialties.some((sp) => sp.toLowerCase().includes(q)) ||
        a.location.toLowerCase().includes(q) ||
        a.packages.some((p) => p.name.toLowerCase().includes(q))
    );

    const products = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    return { services, professionals, products };
  },
};
