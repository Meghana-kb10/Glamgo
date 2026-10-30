/**
 * Glamgo Marketing & Content Configuration
 * Centralized store for editable marketing metrics, announcement copies,
 * brand partner placeholders, audience mappings, and offer vouchers.
 */

export type AudienceType = 'women' | 'men' | 'kids';

export interface MarketingStat {
  label: string;
  value: string;
  subtext?: string;
}

export const MARKETING_STATS = {
  averageRating: '4.8',
  ratingScale: '5.0',
  happyCustomers: '10,000+',
  verifiedPros: '500+',
  fullStripText: '4.8 average rating • 10,000+ happy customers • 500+ verified professionals',
  statsList: [
    { label: 'Rating', value: '4.8 ★', subtext: 'Based on 45,000+ verified reviews' },
    { label: 'Happy Customers', value: '10,000+', subtext: 'In Bengaluru & Mumbai' },
    { label: 'Verified Pros', value: '500+', subtext: 'Background-verified & certified' },
  ],
};

export const ANNOUNCEMENT_BAR_CONFIG = {
  storageKey: 'glamgo_announcement_dismissed_v1',
  text: 'Get 20% off your first booking • No convenience fee. Use',
  code: 'FIRST20',
  badge: 'Welcome Offer',
  discountText: '20% OFF',
};

export interface FirstTimeOfferItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'Percent' | 'ShieldCheck' | 'CreditCard';
  tag: string;
}

export const FIRST_TIME_OFFERS: FirstTimeOfferItem[] = [
  {
    id: 'fto-1',
    title: '20% off first booking',
    subtitle: 'Use code FIRST20 on any service or package above ₹499',
    iconName: 'Percent',
    tag: 'Use FIRST20',
  },
  {
    id: 'fto-2',
    title: 'Zero convenience fee',
    subtitle: 'Transparent salon billing with no doorstep surge charges',
    iconName: 'ShieldCheck',
    tag: 'Always ₹0',
  },
  {
    id: 'fto-3',
    title: 'Pay after service available',
    subtitle: 'Review the work first, then pay securely via UPI, Card, or Cash',
    iconName: 'CreditCard',
    tag: '100% Risk Free',
  },
];

export interface WhyGlamgoCard {
  id: string;
  title: string;
  description: string;
  bullet: string;
  iconName: 'Award' | 'PackageCheck' | 'ReceiptText' | 'ShieldCheck';
}

export const WHY_GLAMGO_POINTS: WhyGlamgoCard[] = [
  {
    id: 'why-1',
    title: 'Verified & trained professionals',
    description: 'Every beauty artist passes a 3-stage trade test, criminal background verification, and 40+ hours of standardized protocol training.',
    bullet: '100% background checked',
    iconName: 'Award',
  },
  {
    id: 'why-2',
    title: 'Sealed single-use products',
    description: 'Mono-dose sachets and disposable kits opened in front of you. Zero decanting, zero contamination, barcode-verified authenticity.',
    bullet: 'Unopened mono-dose kits',
    iconName: 'PackageCheck',
  },
  {
    id: 'why-3',
    title: 'Transparent pricing',
    description: 'Fixed menu rates with zero hidden surge or fuel charges. What you see is what you pay, with itemized tax and disposable breakdown.',
    bullet: 'No hidden surge costs',
    iconName: 'ReceiptText',
  },
  {
    id: 'why-4',
    title: 'Service guarantee',
    description: 'Free re-work or 100% refund within 24 hours if you are not delighted with your haircut, waxing, or facial experience.',
    bullet: 'Free re-work if unsatisfied',
    iconName: 'ShieldCheck',
  },
];

export interface BrandPlaceholder {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const BRAND_PLACEHOLDERS: BrandPlaceholder[] = [
  { id: 'b-1', name: "L'Oréal Professionnel", category: 'Hair Care', description: 'Salon-exclusive color & scalp formulas' },
  { id: 'b-2', name: 'O3+ Professional', category: 'Facial & Glow', description: 'Derma-grade radiant peel treatments' },
  { id: 'b-3', name: 'Rica Italy', category: 'Depilatory Wax', description: 'Titanium dioxide sensitive waxing cartridges' },
  { id: 'b-4', name: 'Dyson Pro', category: 'Hot Styling', description: 'Heat-damage control airflow architecture' },
  { id: 'b-5', name: 'MAC Cosmetics', category: 'High Definition', description: 'Global studio finish long-wear pigments' },
  { id: 'b-6', name: 'Kérastase Paris', category: 'Hair Restoration', description: 'Fusio-Dose concentrated ampoule therapy' },
  { id: 'b-7', name: 'OPI Nail Couture', category: 'Nail Lacquer', description: 'Chip-resistant gel color palette' },
  { id: 'b-8', name: 'Kanpeki Labs', category: 'Japanese Skincare', description: 'Bio-peptide and fermented essence serums' },
];

export interface ReviewCarouselItem {
  id: string;
  name: string;
  avatarUrl: string;
  city: string;
  serviceTitle: string;
  rating: number;
  reviewText: string;
  verifiedBooking: boolean;
  date: string;
  helpfulCount: number;
}

export const REAL_REVIEWS: ReviewCarouselItem[] = [
  {
    id: 'rev-1',
    name: 'Ananya Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    city: 'Indiranagar, Bengaluru',
    serviceTitle: 'Hydra-Oxygen Facial Radiance Treatment',
    rating: 5,
    reviewText: 'The professional arrived 5 minutes early with sealed single-use kit pouches. She showed me the O3+ ampoules before unsealing. My skin glowed through the entire wedding weekend!',
    verifiedBooking: true,
    date: '3 days ago',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    name: 'Rohit Kulkarni',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    city: 'Koramangala, Bengaluru',
    serviceTitle: "Men's Beard Sculpt & De-Tan Facial",
    rating: 5,
    reviewText: 'Super convenient for a busy Sunday. Clean disposables, high quality scissors and trimmer, and absolutely zero mess left on my bathroom counter. Highly recommended!',
    verifiedBooking: true,
    date: '1 week ago',
    helpfulCount: 29,
  },
  {
    id: 'rev-3',
    name: 'Meera Nambiar',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    city: 'HSR Layout, Bengaluru',
    serviceTitle: 'Rica White Chocolate Painless Full Body Wax',
    rating: 5,
    reviewText: 'Hands down the most painless waxing session I have ever had. The Rica cartridge was unsealed in front of me and temperature checked on her wrist before application.',
    verifiedBooking: true,
    date: '2 weeks ago',
    helpfulCount: 56,
  },
  {
    id: 'rev-4',
    name: 'Priyanka Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    city: 'Bandra West, Mumbai',
    serviceTitle: 'Hollywood Bouncy Blowout & Scalp Therapy',
    rating: 5,
    reviewText: 'Dyson styler used with genuine heat protectant. The curls stayed bouncy and shiny for two full days through Mumbai humidity. Salon quality right in my living room.',
    verifiedBooking: true,
    date: '2 weeks ago',
    helpfulCount: 38,
  },
  {
    id: 'rev-5',
    name: 'Deepika Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    city: 'Whitefield, Bengaluru',
    serviceTitle: 'Signature Sabyasachi Bridal HD Package',
    rating: 5,
    reviewText: 'Tanya did my bridal makeup and saree draping. The 4K HD finish looked unreal in the photographs and lasted 16 hours through pheras without a smudge.',
    verifiedBooking: true,
    date: '3 weeks ago',
    helpfulCount: 84,
  },
];

export interface HowItWorksStep {
  step: number;
  title: string;
  subtitle: string;
  details: string;
  iconName: 'Sparkles' | 'Calendar' | 'Home';
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Choose service',
    subtitle: 'Curated salon, spa & makeup menus',
    details: 'Browse verified beauty services, packages, and master artists with transparent pricing and real customer reviews.',
    iconName: 'Sparkles',
  },
  {
    step: 2,
    title: 'Pick time',
    subtitle: 'Convenient 30-min booking slots',
    details: 'Select your preferred morning, afternoon, or evening time slot. Choose between home delivery or artist studio visits.',
    iconName: 'Calendar',
  },
  {
    step: 3,
    title: 'Relax at home',
    subtitle: 'Zero mess & guaranteed hygiene',
    details: 'Our verified professional arrives with sterilized tools and sealed products. Verify with start OTP and enjoy the pampering.',
    iconName: 'Home',
  },
];

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minBooking: number;
  expiryDate: string;
  terms: string[];
  tab: 'for_you' | 'bank_upi' | 'packages';
  isPopular?: boolean;
}

export const COUPONS_DATA: CouponItem[] = [
  {
    id: 'coup-1',
    code: 'FIRST20',
    title: 'Flat 20% Off First Booking',
    description: 'Valid across all salon, hair, skin, and waxing services. No convenience fee.',
    discountType: 'percentage',
    discountValue: 20,
    minBooking: 499,
    expiryDate: 'Valid till 31 Dec 2026',
    terms: ['Applicable once per new user', 'Maximum discount ₹300', 'Valid on all at-home services'],
    tab: 'for_you',
    isPopular: true,
  },
  {
    id: 'coup-2',
    code: 'GLAMVIP',
    title: 'Save ₹500 on Premium Combos',
    description: 'Flat ₹500 off on curated value salon suites above ₹2,000.',
    discountType: 'flat',
    discountValue: 500,
    minBooking: 2000,
    expiryDate: 'Valid till 15 Nov 2026',
    terms: ['Valid on Head-to-Toe and Bridal prep combos', 'Cannot be clubbed with referral credits'],
    tab: 'for_you',
  },
  {
    id: 'coup-3',
    code: 'HDFC250',
    title: 'Flat ₹250 Off with HDFC Bank Cards',
    description: 'Pay with HDFC Credit or Debit Card and get instant ₹250 discount on minimum booking of ₹1,499.',
    discountType: 'flat',
    discountValue: 250,
    minBooking: 1499,
    expiryDate: 'Valid on weekends till Dec 2026',
    terms: ['Valid once per month per card', 'Instant checkout discount on card selection'],
    tab: 'bank_upi',
  },
  {
    id: 'coup-4',
    code: 'UPI50',
    title: 'Flat ₹75 Cashback via UPI / GPay',
    description: 'Pay instantly via UPI on order completion and receive instant cashback.',
    discountType: 'flat',
    discountValue: 75,
    minBooking: 699,
    expiryDate: 'Valid till 30 Nov 2026',
    terms: ['Valid on Google Pay, PhonePe, and Paytm UPI', 'Credited within 24 hours of completion'],
    tab: 'bank_upi',
  },
  {
    id: 'coup-5',
    code: 'PACKAGE15',
    title: 'Extra 15% Off Custom Packages',
    description: 'Build your own package of 3 or more services and save an additional 15%.',
    discountType: 'percentage',
    discountValue: 15,
    minBooking: 1500,
    expiryDate: 'Valid all season',
    terms: ['Requires minimum 3 services selected in custom package', 'Max discount ₹450'],
    tab: 'packages',
    isPopular: true,
  },
  {
    id: 'coup-6',
    code: 'BRIDAL1000',
    title: 'Flat ₹1,000 Off Bridal Atelier',
    description: 'Exclusive discount on royal bridal hair, makeup & saree draping suites.',
    discountType: 'flat',
    discountValue: 1000,
    minBooking: 8000,
    expiryDate: 'Valid till 31 Dec 2026',
    terms: ['Valid on Sabyasachi HD and Haldi/Mehendi packages', 'Advance reservation required'],
    tab: 'packages',
  },
];

export interface AudienceCategoryMapping {
  audience: AudienceType;
  label: string;
  categories: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    imageUrl: string;
    subServices: string[];
    isHeroChip?: boolean;
  }[];
}

export const AUDIENCE_DATA: Record<AudienceType, AudienceCategoryMapping> = {
  women: {
    audience: 'women',
    label: 'Women',
    categories: [
      {
        id: 'w-makeup',
        slug: 'makeup',
        name: 'Makeup',
        tagline: 'HD party, airbrush & glam',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
        subServices: ['Party Glam', 'Airbrush Complexion', 'Eye Artistry & Lashes', 'Engagement Look'],
        isHeroChip: false,
      },
      {
        id: 'w-hair',
        slug: 'hair',
        name: 'Hair',
        tagline: 'Blowouts, styling & drape',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
        subServices: ['Blowdry & Curls', 'Braids & Updos', 'Kérastase Spa', 'Thermal Styling'],
        isHeroChip: true,
      },
      {
        id: 'w-nails',
        slug: 'nails',
        name: 'Nails',
        tagline: 'Gel couture & nail art',
        imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
        subServices: ['Russian Manicure', 'Gel Extensions', 'Chrome Glaze', 'Pedicure Spa'],
        isHeroChip: false,
      },
      {
        id: 'w-skin',
        slug: 'skin',
        name: 'Facial & Skin',
        tagline: 'Hydra facial & cleanups',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
        subServices: ['Hydra-Oxygen Infusion', 'D-Tan Cleanup', 'Cryo Ice Sculpt', 'Bio-Cellulose Mask'],
        isHeroChip: true,
      },
      {
        id: 'w-waxing',
        slug: 'waxing',
        name: 'Waxing',
        tagline: 'Rica roll-on & sensitive peel',
        imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=400&q=80',
        subServices: ['Rica White Chocolate', 'Full Arms & Legs', 'Bikini Line Care', 'Underarm Detan'],
        isHeroChip: true,
      },
      {
        id: 'w-bridal',
        slug: 'bridal',
        name: 'Bridal',
        tagline: 'Master bridal packages',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
        subServices: ['Sabyasachi HD Atelier', 'Traditional Muhurtham', 'Saree & Dupatta Draping', 'Haldi Prep'],
        isHeroChip: false,
      },
      {
        id: 'w-spa',
        slug: 'spa',
        name: 'Spa & Massage',
        tagline: 'Relaxation & massages',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
        subServices: ['Aromatherapy', 'Swedish Destress', 'Foot Reflexology', 'Rose Body Polish'],
        isHeroChip: false,
      },
      {
        id: 'w-combos',
        slug: 'packages',
        name: 'Salon Combos',
        tagline: 'Curated value packages',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
        subServices: ['Head-to-Toe Suite', 'Pre-Wedding Red Carpet', 'Weekend Refresh', 'Hair Rescue Spa'],
        isHeroChip: false,
      },
    ],
  },
  men: {
    audience: 'men',
    label: 'Men',
    categories: [
      {
        id: 'm-haircut',
        slug: 'hair',
        name: 'Haircut & Styling',
        tagline: 'Precision fades & classic cuts',
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
        subServices: ['Gentlemen Haircut', 'Skin Fade & Taper', 'Scalp Massage', 'Anti-Dandruff Spa'],
        isHeroChip: true,
      },
      {
        id: 'm-beard',
        slug: 'mens',
        name: 'Beard Sculpting',
        tagline: 'Hot towel trim & contouring',
        imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80',
        subServices: ['Precision Beard Trim', 'Hot Towel Razor Shave', 'Beard Spa & Oil Therapy', 'Mustache Styling'],
        isHeroChip: false,
      },
      {
        id: 'm-facial',
        slug: 'skin',
        name: 'De-Tan & Facial',
        tagline: 'Deep pore clean & tan clearing',
        imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b6f3b018?auto=format&fit=crop&w=400&q=80',
        subServices: ['Charcoal Detox Facial', 'O3+ Men De-Tan', 'Hydra Suction Cleanse', 'Eye Dark Circle Care'],
        isHeroChip: true,
      },
      {
        id: 'm-massage',
        slug: 'spa',
        name: 'Stress Relief Massage',
        tagline: 'Head, shoulder & foot therapy',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
        subServices: ['Deep Tissue Back Massage', 'Acupressure Head Massage', 'Foot Reflexology', 'Leg Relief Spa'],
        isHeroChip: false,
      },
      {
        id: 'm-grooming',
        slug: 'groom',
        name: 'Groom & Wedding',
        tagline: 'Wedding styling & glow packages',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        subServices: ['Groom Day Glow', 'Pre-Wedding Grooming', 'Turban Styling', 'Hair Patch & Setting'],
        isHeroChip: false,
      },
      {
        id: 'm-mani-pedi',
        slug: 'nails',
        name: 'Pedicure & Manicure',
        tagline: 'Gentlemen hand & foot care',
        imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=400&q=80',
        subServices: ['Classic Foot Cleanse', 'Cracked Heel Treatment', 'Nail Buffing', 'Hand Massage'],
        isHeroChip: false,
      },
      {
        id: 'm-waxing',
        slug: 'waxing',
        name: 'Body Waxing',
        tagline: 'Chest, back & arms grooming',
        imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6c51842?auto=format&fit=crop&w=400&q=80',
        subServices: ['Chest & Abdomen Wax', 'Back Waxing', 'Arms Grooming', 'Underarms Trim'],
        isHeroChip: true,
      },
      {
        id: 'm-combos',
        slug: 'packages',
        name: 'Men Packages',
        tagline: 'Complete all-in-one combos',
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
        subServices: ['Executive Cut + Beard', 'Weekend Reset Package', 'Pre-Party Detan + Cut', 'Full Body Groom'],
        isHeroChip: false,
      },
    ],
  },
  kids: {
    audience: 'kids',
    label: 'Kids',
    categories: [
      {
        id: 'k-haircut',
        slug: 'hair',
        name: "Kids' Haircut",
        tagline: 'Gentle & fun styling at home',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80',
        subServices: ['Toddler Friendly Cut', 'Boys Classic Fade', 'Girls Trim & Bob', 'Special Occasion Braids'],
        isHeroChip: true,
      },
      {
        id: 'k-braids',
        slug: 'makeup',
        name: 'Braiding & Fun Styling',
        tagline: 'Colorful ribbons & gentle updos',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=400&q=80',
        subServices: ['Dutch & French Braids', 'Glitter Hair Twists', 'Birthday Updo', 'Ribbon Wraps'],
        isHeroChip: false,
      },
      {
        id: 'k-mani',
        slug: 'nails',
        name: 'Gentle Kids Manicure',
        tagline: 'Non-toxic, water-based polishes',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
        subServices: ['Peel-Off Color Manicure', 'Cute Nail Stickers', 'Gentle Hand Cleanse', 'Fruit Aroma Lotion'],
        isHeroChip: false,
      },
      {
        id: 'k-parties',
        slug: 'packages',
        name: 'Mommy & Me / Party',
        tagline: 'Birthday & family salon celebrations',
        imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
        subServices: ['Mommy & Daughter Manicure', 'Birthday Group Styling', 'Family Groom Combo', 'Costume Makeup Fun'],
        isHeroChip: false,
      },
      {
        id: 'k-massage',
        slug: 'spa',
        name: 'Baby & Child Massage',
        tagline: 'Organic cold-pressed oils',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
        subServices: ['Infant Almond Oil Massage', 'Calming Bedtime Foot Rub', 'Gentle Scalp Care', 'Organic Coconut Moisturizing'],
        isHeroChip: false,
      },
      {
        id: 'k-lice',
        slug: 'skin',
        name: 'Scalp & Detangle Care',
        tagline: 'Tear-free botanical formulas',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
        subServices: ['Tear-Free Deep Wash', 'Botanical Detangling', 'Scalp Soothing Mask', 'Silk Ribbon Wrap'],
        isHeroChip: false,
      },
      {
        id: 'k-festive',
        slug: 'bridal',
        name: 'Festive & Traditional',
        tagline: 'Ethnic styling for family weddings',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
        subServices: ['Traditional Pattu Pavadai Draping', 'Kurta Dupatta Pinning', 'Floral Gajra Pinning', 'Bindi & Tikka Art'],
        isHeroChip: false,
      },
      {
        id: 'k-cleanups',
        slug: 'waxing',
        name: 'Gentle Cleanups',
        tagline: 'Mild organic fruit cleanups for teens',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
        subServices: ['Strawberry Teen Facial', 'Aloe Vera Calming Wash', 'Gentle Lip Balm Prep', 'Hydrating Cucumber Mask'],
        isHeroChip: false,
      },
    ],
  },
};
