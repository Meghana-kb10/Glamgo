import { Artist, Product, IncomingBookingRequest, CalendarTimeSlot, VendorInventoryItem, KycApplicant } from '../types';

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Tanya Grewal',
    handle: '@tanyagrewal.artistry',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    portfolioImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    ],
    title: 'Celebrity & Royal Bridal Specialist',
    rating: 4.98,
    reviewCount: 142,
    startingPrice: 28000,
    distance: '2.4 km away',
    location: 'Bandra West, Mumbai',
    serviceTypes: ['At-Home Service', 'Studio Visit', 'Destination Event'],
    specialties: ['Sabyasachi Bridal HD', 'Dewy Glass Skin', 'Royal Heritage Draping'],
    isVerified: true,
    isBridalCertified: true,
    isInstantBook: true,
    bio: 'Vogue India featured bridal artist with 9+ years elevating modern South Asian brides. Specialized in timeless regal aesthetics with radiant, weightless skin finish that lasts 18+ hours under high-definition wedding lights.',
    experienceYears: 9,
    hygieneScore: '99.4% Medical Grade Sterilized Kits',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      title: 'Regal Sabyasachi Bride Transformation',
      skinType: 'Combination / Mild Pigmentation',
      transformationType: 'Ultra HD Glass Glow Bridal Makeup',
    },
    packages: [
      {
        id: 'pkg-1',
        name: 'Signature Sabyasachi Bridal HD Package',
        price: 32000,
        durationMinutes: 180,
        tier: 'Bridal Couture',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        isPopular: true,
        description: 'Complete royal wedding day look. Customized color correction, ultra-dewy waterproof HD base, bespoke cut-crease eye artistry, and royal lehenga draping.',
        productsUsed: [
          'Charlotte Tilbury Hollywood Flawless Filter',
          'NARS Natural Radiant Longwear Foundation',
          'Pat McGrath Mothership VII Divine Rose Palette',
          'Tom Ford Shade and Illuminate Duo',
          'Huda Beauty Easy Bake Loose Powder'
        ],
        inclusions: [
          '180-min bespoke artistry session',
          'Silk Faux 3D Mink Lashes with custom mapping',
          'Couture Dupatta & Lehenga Draping with anti-crease pins',
          'Designer Hair Artistry with floral accessory setting',
          'Luxury Emergency Touch-up Kit with custom lip shade'
        ]
      },
      {
        id: 'pkg-2',
        name: 'Royal Heritage Airbrush Bridal Package',
        price: 38000,
        durationMinutes: 210,
        tier: 'Signature',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        description: 'Micro-fine Temptu silicon airbrush technology providing flawless 24-hour heat and humidity resistance. Ideal for summer and destination weddings.',
        productsUsed: [
          'Temptu Pro Silicon Airbrush System',
          'Dior Backstage Glow Face Palette',
          'Hourglass Veil Mineral Primer',
          'MAC Prep + Prime Fix+ Goldlite',
          'Laura Mercier Translucent Honey'
        ],
        inclusions: [
          'Full-face silicon airbrush foundation & contour',
          'Advanced structural hair styling with extensions',
          'Double Dupatta draping with crown anchoring',
          'Jewellery & Mathapatti placement',
          'Pre-bridal skin prep ampoule'
        ]
      },
      {
        id: 'pkg-3',
        name: 'Cocktail & Sangeet Red Carpet Glam',
        price: 18000,
        durationMinutes: 120,
        tier: 'Red Carpet',
        category: 'makeup',
        serviceMode: 'HYBRID',
        description: 'High-octane dramatic glam with sculpted cheekbones, metallic smoked eyeliner, and voluminous Hollywood wave hair.',
        productsUsed: [
          'Fenty Beauty Pro Filt\'r Soft Matte',
          'Rare Beauty Soft Pinch Liquid Blush',
          'Natasha Denona Glam Palette',
          'Anastasia Beverly Hills Brow Wiz'
        ],
        inclusions: [
          'Modern red carpet makeup',
          'Textured Hollywood waves or sleek updo',
          'Sari / Contemporary gown draping',
          'Custom cluster lash accent'
        ]
      },
      {
        id: 'pkg-4',
        name: 'Hollywood Waves & Floral Hair Architecture',
        price: 6500,
        durationMinutes: 60,
        tier: 'Signature',
        category: 'hair',
        serviceMode: 'HYBRID',
        description: 'Glossy red-carpet waves crafted with thermal protection, micro-pin setting, and optional fresh floral integration.',
        productsUsed: [
          'Dyson Supersonic & Corrale',
          'Olaplex No. 7 Bonding Oil',
          'Moroccanoil Luminous Hairspray Extra Strong'
        ],
        inclusions: [
          'Thermal barrier protection',
          'Precision barrel tension sculpting',
          'Floral accessory anchoring',
          'Anti-humidity veil mist'
        ]
      },
      {
        id: 'pkg-5',
        name: 'Cryo-Infusion Pre-Bridal Hydra Facial',
        price: 4500,
        durationMinutes: 45,
        tier: 'Classic',
        category: 'skin',
        serviceMode: 'IN_STUDIO',
        description: 'Ice globe lymphatic drainage and hyaluronic acid dermal infusion designed to maximize makeup adherence and camera glow.',
        productsUsed: [
          'Biologique Recherche Lotion P50',
          'SkinCeuticals B5 Gel',
          'Bioderma Sensibio H2O'
        ],
        inclusions: [
          'Sonic deep pore cleanse',
          'Cryo ice globe sculpting',
          'Electrolyte sheet mask',
          'High-potency antioxidant serum'
        ]
      },
      {
        id: 'pkg-6',
        name: 'Royal Heritage Saree & Lehenga Drape Engineering',
        price: 3500,
        durationMinutes: 45,
        tier: 'Classic',
        category: 'draping',
        serviceMode: 'AT_VENUE',
        description: 'Knife-edge pleating and architectural anchoring for heavy bridal silk sarees, Kanjivarams, and couture designer lehengas.',
        productsUsed: [
          'High-tensile anti-snag safety pins',
          'Steam crease lock iron',
          'Waist contouring band'
        ],
        inclusions: [
          'Pre-pleating and iron pressing',
          'Waist anchoring with balance alignment',
          'Pallu and dupatta setting',
          'Jewelry safety check'
        ]
      },
      {
        id: 'pkg-7',
        name: 'Russian Gel Extension & Chrome Nail Couture',
        price: 3200,
        durationMinutes: 75,
        tier: 'Signature',
        category: 'nails',
        serviceMode: 'IN_STUDIO',
        description: 'Precision dry e-file cuticle detailing followed by sculpted gel tips and mirror-glaze chrome pigments.',
        productsUsed: [
          'Apres Gel-X System',
          'OPI GelColor',
          'Daily Charme Mirror Chrome'
        ],
        inclusions: [
          'Diamond bit cuticle refinement',
          'Custom nail shape sculpting',
          'Glazed donut or mirror finish',
          'Organic jojoba cuticle oil therapy'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Rhea Singhania',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '3 days ago',
        comment: 'Tanya did my bridal makeup for my Udaipur palace wedding. My makeup did not budge an inch despite 8 hours of pheras and emotional tears! Worth every single rupee.',
        verifiedBridal: true,
        lookTitle: 'Royal Rajputana Bridal Look'
      },
      {
        id: 'rev-2',
        author: 'Avantika Mehra',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The skin prep was heavenly and the before/after was mind-blowing without looking cakey. All my wedding guests asked who my makeup artist was!',
        verifiedBridal: true,
        lookTitle: 'Sabyasachi Velvet Evening Bride'
      }
    ]
  },
  {
    id: 'artist-2',
    name: 'Zoya Akhtar Malik',
    handle: '@zoyakhtarglam',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
    portfolioImages: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Clean Girl & Editorial Glow Guru',
    rating: 4.94,
    reviewCount: 98,
    startingPrice: 22000,
    distance: '3.8 km away',
    location: 'Juhu, Mumbai',
    serviceTypes: ['At-Home Service', 'Studio Visit'],
    specialties: ['Editorial Glass Skin', 'Feathered Brows', 'Effortless Modern Bride'],
    isVerified: true,
    isBridalCertified: true,
    isInstantBook: false,
    bio: 'Former Lakmé Fashion Week lead backstage artist. Passionate about enhancing authentic facial bone structure with micro-concealing and luminous monochromatic tones.',
    experienceYears: 7,
    hygieneScore: '100% Single-use Wands & Spatulas',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      title: 'Luminous Reception Glam',
      skinType: 'Dry / Sensitive',
      transformationType: 'Hydra-Infused Dewy Glass Skin',
    },
    packages: [
      {
        id: 'pkg-201',
        name: 'Modern Minimalist Bride Edition',
        price: 25000,
        durationMinutes: 150,
        tier: 'Signature',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        isPopular: true,
        description: 'Refined, featherlight complexion work with micro-draping of peachy blush and natural fluttery lashes for the discerning minimalist bride.',
        productsUsed: [
          'Westman Atelier Vital Skin Foundation Stick',
          'Chanel Les Beiges Water-Fresh Tint',
          'Rose Inc Cream Blush',
          'Kosas Cloud Set Setting Powder'
        ],
        inclusions: [
          'Pre-makeup lymphatic drainage facial massage',
          'Feathered micro-brow lamination effect',
          'Sleek runway bun or textured soft pony',
          'Boutique organza saree or gown draping'
        ]
      },
      {
        id: 'pkg-202',
        name: 'Sunset Sangeet Euphoria Look',
        price: 19000,
        durationMinutes: 120,
        tier: 'Red Carpet',
        category: 'makeup',
        serviceMode: 'HYBRID',
        description: 'Duochrome holographic eyelids, juicy glazed lips, and multi-dimensional shimmer cheeks that catch stage lighting.',
        productsUsed: [
          'Danessa Myricks Colorfix Chrome',
          'Fenty Gloss Bomb Heat',
          'Patrick Ta Major Glow Crème'
        ],
        inclusions: [
          'Duochrome high-shimmer eye work',
          'Textured bohemian bridal braids',
          'Mirror-work lehenga styling'
        ]
      },
      {
        id: 'pkg-203',
        name: 'Glass Skin Editorial Dewy Party Glam',
        price: 8500,
        durationMinutes: 75,
        tier: 'Signature',
        category: 'makeup',
        serviceMode: 'HYBRID',
        description: 'Ultra-luminous, weightless skin finish with sculpted monochromatic tones and wet-look glossy accents.',
        productsUsed: [
          'Charlotte Tilbury Beauty Light Wand',
          'Saie Glowy Super Gel',
          'Merit Minimalist Perfecting Complexion Stick'
        ],
        inclusions: [
          'Skin prep with barrier mist',
          'Featherweight complexion sculpting',
          'Defined individual lash spikes',
          'Non-sticky glazed lip gloss'
        ]
      },
      {
        id: 'pkg-204',
        name: 'Dyson Runway Volume Blowout & Gloss Mask',
        price: 3200,
        durationMinutes: 50,
        tier: 'Classic',
        category: 'hair',
        serviceMode: 'AT_VENUE',
        description: 'High-shine bouncy blowout using Dyson Airwrap with botanical keratin glaze for silk movement.',
        productsUsed: [
          'Dyson Airwrap Multi-Styler',
          'Color Wow Dream Coat',
          'Kérastase Elixir Ultime'
        ],
        inclusions: [
          'Hydro-mist heat protector',
          'Ceramic tension blowout',
          'Hair perfume & shine gloss veil',
          'Curved pin crown setting'
        ]
      },
      {
        id: 'pkg-205',
        name: 'Glazed Donut Gel Manicure & Hand Spa',
        price: 2800,
        durationMinutes: 60,
        tier: 'Classic',
        category: 'nails',
        serviceMode: 'IN_STUDIO',
        description: 'Hailey Bieber signature pearl-white chrome finish over natural nails with gentle cuticle nourishment.',
        productsUsed: [
          'OPI Funny Bunny Gel',
          'OPI Tin Man Can Chrome Powder',
          'L\'Occitane Shea Butter Balm'
        ],
        inclusions: [
          'Precision dry manicure cuticle care',
          'Mirror chrome glazed application',
          'Warm paraffin hand wrap',
          'Anti-aging cuticle oil massage'
        ]
      },
      {
        id: 'pkg-206',
        name: 'Lymphatic Drainage Pre-Event Barrier Repair',
        price: 4200,
        durationMinutes: 45,
        tier: 'Classic',
        category: 'skin',
        serviceMode: 'IN_STUDIO',
        description: 'Gua sha facial sculpting with squalane and ceramide ampoules to de-puff and sculpt jawline before makeup.',
        productsUsed: [
          'Augustinus Bader The Rich Cream',
          'Biossance Squalane Oil',
          'Mount Lai Jade Gua Sha'
        ],
        inclusions: [
          'Contouring gua sha lymphatic massage',
          'Hyaluronic barrier replenishing mask',
          'Cold compression de-puffing eye therapy',
          'Antioxidant shield moisturizer'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-201',
        author: 'Sana Qureshi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '1 week ago',
        comment: 'Zoya is an absolute magician. I wanted to look like myself, just glowing from within, and she delivered beyond expectations.',
        verifiedBridal: true,
        lookTitle: 'Morning Anand Karaj Bridal Glow'
      }
    ]
  },
  {
    id: 'artist-3',
    name: 'Kabir & Aarav Studio',
    handle: '@kabiraarav.couture',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85',
    portfolioImages: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    ],
    title: 'Bridal Hair Couturier & Royal Draping Masters',
    rating: 4.96,
    reviewCount: 180,
    startingPrice: 35000,
    distance: '5.1 km away',
    location: 'Colaba, South Mumbai',
    serviceTypes: ['At-Home Service', 'Studio Visit', 'Destination Event'],
    specialties: ['Architectural Updos', 'Kanjivaram Saree Pleating', 'Real Flower Floral Cascades'],
    isVerified: true,
    isBridalCertified: true,
    isInstantBook: true,
    bio: 'Dual artist powerhouse duo catering to high-profile brides across India, Dubai, and Lake Como. Famous for 60-second indestructible drape engineering and sculptural hair art.',
    experienceYears: 12,
    hygieneScore: '99.8% Certified Clean Beauty Practice',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      title: 'South Indian Muhurtham Bride',
      skinType: 'Normal / Olive undertone',
      transformationType: 'Traditional Gold Foil & Coral Temple Artistry',
    },
    packages: [
      {
        id: 'pkg-301',
        name: 'The Empress Muhurtham Temple Package',
        price: 36000,
        durationMinutes: 195,
        tier: 'Bridal Couture',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        isPopular: true,
        description: 'Authentic 9-yard or 6-yard Kanjivaram silk saree draping with knife-edge pleats, floral jada poola hair cascade, and antique temple jewelry alignment.',
        productsUsed: [
          'Dior Forever Skin Glow Foundation',
          'Bobbi Brown Long-Wear Gel Eyeliner',
          'MAC Ruby Woo Retro Matte',
          'Kryolan Dermacolor Camouflage'
        ],
        inclusions: [
          'Precision silk saree pleating and custom waist pinning',
          'Fresh jasmine & baby breath floral architectural styling',
          'Jewelry weight balance fitting (Vanki, Oddiyanam, Nethi Chutti)',
          'High endurance anti-sweat matte base'
        ]
      },
      {
        id: 'pkg-302',
        name: 'Sculptural Architectural Hair Updo & Floral Cascade',
        price: 9500,
        durationMinutes: 90,
        tier: 'Signature',
        category: 'hair',
        serviceMode: 'HYBRID',
        description: 'High-couture bridal bun or braided cascade with custom structural wireframing to support heavy temple jewelry and fresh South Indian poola jada.',
        productsUsed: [
          'Schwarzkopf OSIS+ Session Label',
          'Moroccanoil Glimmer Shine',
          'GHD Platinum+ Styler'
        ],
        inclusions: [
          'Custom padding & structural hair net support',
          'Fresh jasmine / rose garland interweaving',
          'Mathapatti and maang tikka central alignment',
          '18-hour freeze hold setting spray'
        ]
      },
      {
        id: 'pkg-303',
        name: 'Authentic 9-Yard Kanjivaram Pleating & Draping',
        price: 4500,
        durationMinutes: 45,
        tier: 'Classic',
        category: 'draping',
        serviceMode: 'AT_VENUE',
        description: 'Master draping for traditional Madisar, Iyer, Iyengar, or contemporary pleated silk bridal sarees with zero movement guarantee.',
        productsUsed: [
          'Anti-tear brass safety anchors',
          'Pleat pressing heat rollers',
          'Contoured hip pleat band'
        ],
        inclusions: [
          'Pre-wedding silk pleating and precision pinning',
          'Pallu fold measurement to waist proportion',
          'Oddiyanam waist belt positioning',
          'Post-ritual drape adjustment assistance'
        ]
      },
      {
        id: 'pkg-304',
        name: 'Royal South Indian Classical Bridal Makeup',
        price: 28000,
        durationMinutes: 150,
        tier: 'Bridal Couture',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        description: 'Sweat-proof, humidity-resistant golden undertone bridal complexion with wing-extended kohl eyes and crimson velvet lips.',
        productsUsed: [
          'Estée Lauder Double Wear Stay-in-Place',
          'Tom Ford Golden Peach Cream Shadow',
          'NARS Radiant Creamy Concealer'
        ],
        inclusions: [
          'Waterproof base with anti-oxidizing veil',
          'Classical extended winged eyeliner',
          'Gold foil eyelid micro-highlights',
          'Long-wear crimson matte lip artistry'
        ]
      },
      {
        id: 'pkg-305',
        name: '24k Gold Radiance Facial & Skin Polish',
        price: 5500,
        durationMinutes: 60,
        tier: 'Classic',
        category: 'skin',
        serviceMode: 'IN_STUDIO',
        description: 'Pure 24k colloidal gold leaf massage combined with enzymatic fruit enzymes for radiant wedding-morning glow.',
        productsUsed: [
          'Peter Thomas Roth 24K Gold Mask',
          'Omorovicza Queen of Hungary Mist',
          'Caudalie Vinoperfect Radiance Serum'
        ],
        inclusions: [
          'Enzymatic micro-peel exfoliation',
          'Warm colloidal gold leaf lymphatic massage',
          'Firming peptide collagen sheet',
          'Protective illuminating glow mist'
        ]
      },
      {
        id: 'pkg-306',
        name: 'Classic Bridal French Tip Nail Sculpting',
        price: 3400,
        durationMinutes: 70,
        tier: 'Classic',
        category: 'nails',
        serviceMode: 'IN_STUDIO',
        description: 'Micro-sculpted baby boomer or crisp bridal French tips with subtle crystal gem accents on the ring finger.',
        productsUsed: [
          'Bio Sculpture Gel',
          'Swarovski Crystal Accents',
          'OPI Infinite Shine'
        ],
        inclusions: [
          'Precision cuticle preparation',
          'Strengthening builder gel layer',
          'Crisp white smile line sculpting',
          'Ring finger crystal gem placement'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-301',
        author: 'Divya Sundaram',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '3 weeks ago',
        comment: 'My Kanjivaram looked like a regal sculpture. Not one pleat moved during 4 hours of temple rituals!',
        verifiedBridal: true,
        lookTitle: 'Chennai Palace Wedding'
      }
    ]
  },
  {
    id: 'artist-4',
    name: 'Meera Sen Gupta',
    handle: '@meerasen_skincare_mua',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
    portfolioImages: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    title: 'Holistic Skin Prep & HD Bridal Specialist',
    rating: 4.89,
    reviewCount: 64,
    startingPrice: 19500,
    distance: '1.2 km away',
    location: 'Khar West, Mumbai',
    serviceTypes: ['At-Home Service', 'Studio Visit'],
    specialties: ['Cryo-Facial Prep', 'Natural Glow', 'Acne-Safe Formulations'],
    isVerified: true,
    isBridalCertified: false,
    isInstantBook: true,
    bio: 'Esthetician turned celebrity MUA. We focus on healing and plumping your barrier before applying any pigment, guaranteeing makeup that looks invisible up close in daylight.',
    experienceYears: 6,
    hygieneScore: '99.9% Hypoallergenic Derm-Approved',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      title: 'Acne-Safe Dewy Wedding Glam',
      skinType: 'Acne-Prone / Texture',
      transformationType: 'Non-comedogenic Skin Smoothing HD',
    },
    packages: [
      {
        id: 'pkg-401',
        name: 'The Derm-Prep Radiant Bridal Glow',
        price: 21500,
        durationMinutes: 160,
        tier: 'Signature',
        category: 'bridal',
        serviceMode: 'AT_VENUE',
        isPopular: true,
        description: 'Includes 30 mins of ice globe cryo-therapy, hyaluronic acid infusion, followed by non-clogging mineral HD makeup.',
        productsUsed: [
          'Biologique Recherche Lotion P50 Prep',
          'Oxygenetix Oxygenating Foundation',
          'RMS Beauty Living Luminizer',
          'Tower 28 SOS Daily Rescue Facial Spray'
        ],
        inclusions: [
          'Cryo ice globe de-puffing lymphatic sculpt',
          'Custom non-comedogenic pigment blending',
          'Lightweight air-texture lashes',
          'Textured bohemian romantic braided bun'
        ]
      },
      {
        id: 'pkg-402',
        name: 'Non-Comedogenic Acne-Safe Party Glam',
        price: 7200,
        durationMinutes: 75,
        tier: 'Signature',
        category: 'makeup',
        serviceMode: 'HYBRID',
        description: 'Dermatologically safe evening makeup crafted specifically for reactive, rosacea, or acne-prone skin with clean mineral pigments.',
        productsUsed: [
          'Ilia Super Serum Skin Tint SPF 40',
          'Kosas Revealer Concealer',
          'Tower 28 BeachPlease Tinted Lip + Cheek'
        ],
        inclusions: [
          'Hypoallergenic calming skin mist',
          'Micro-spot blemish concealing',
          'Featherweight non-irritating mineral blush',
          'Soft natural lash enhancement'
        ]
      },
      {
        id: 'pkg-403',
        name: 'Hydra-Vortex Deep Blackhead Extraction & Facial',
        price: 4800,
        durationMinutes: 60,
        tier: 'Classic',
        category: 'skin',
        serviceMode: 'IN_STUDIO',
        description: 'Painless vacuum extraction of stubborn blackheads and pore debris followed by medical-grade LED blue-light therapy.',
        productsUsed: [
          'Paula\'s Choice 2% BHA Liquid',
          'SkinCeuticals Phyto Corrective Gel',
          'Dr. Dennis Gross SpectraLite LED Mask'
        ],
        inclusions: [
          'Ultrasonic cavitation pore cleanse',
          'Targeted hydro-vacuum extractions',
          'Antibacterial blue LED light therapy',
          'Centella asiatica soothing sheet mask'
        ]
      },
      {
        id: 'pkg-404',
        name: 'Romantic Textured Low Bun & Hair Styling',
        price: 4000,
        durationMinutes: 50,
        tier: 'Classic',
        category: 'hair',
        serviceMode: 'HYBRID',
        description: 'Soft, wispy face-framing curls with a low textured chignon bun, ideal for sangeet or intimate ceremonies.',
        productsUsed: [
          'Briogeo Farewell Frizz Rosarco Milk',
          'Verb Ghost Hairspray',
          'Dyson Supersonic Hair Dryer'
        ],
        inclusions: [
          'Botanical frizz protection cream',
          'Texturizing volume wave prep',
          'Low chignon bun pinning with hairnet',
          'Face-framing soft curl definition'
        ]
      },
      {
        id: 'pkg-405',
        name: 'Gentle Sensitive-Skin Body Polishing & Glow',
        price: 6000,
        durationMinutes: 80,
        tier: 'Classic',
        category: 'skin',
        serviceMode: 'IN_STUDIO',
        description: 'Full body sugar exfoliation and organic cold-pressed almond oil cocoon to eliminate rough texture and dryness.',
        productsUsed: [
          'Herbivore Botanicals Coco Rose Body Polish',
          'Kiehl\'s Creme de Corps Nourishing Dry Oil',
          'Pure Organic Sweet Almond Oil'
        ],
        inclusions: [
          'Gentle rose sugar scrub massage',
          'Warm towel steam wipe-down',
          'Deep hydrating body oil massage',
          'Anti-dryness barrier lock'
        ]
      },
      {
        id: 'pkg-406',
        name: 'Pure Botanical Nail Restoration Manicure',
        price: 2500,
        durationMinutes: 50,
        tier: 'Classic',
        category: 'nails',
        serviceMode: 'IN_STUDIO',
        description: 'Acetone-free, 10-free non-toxic nail repair treatment with botanical keratin strengthening drops.',
        productsUsed: [
          'Zoya Naked Manicure System',
          'Dior Huile Abricot Cuticle Serum',
          'Caudalie Hand and Nail Cream'
        ],
        inclusions: [
          'Gentle wooden stick cuticle pushing',
          'Botanical keratin nail bed strengthening',
          'Buff and high-gloss healthy sheen',
          'Organic apricot seed hand massage'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-401',
        author: 'Pooja Bhatt',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '1 month ago',
        comment: 'I have severe cystic acne and was terrified of bridal makeup. Meera made my skin look like silk without a single breakout the next morning!',
        verifiedBridal: true,
        lookTitle: 'Daytime Outdoor Wedding'
      }
    ]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Airbrush Flawless Setting Spray',
    brand: 'Charlotte Tilbury',
    category: 'Setting & Prep',
    price: 3600,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 840,
    description: 'Weightless, oil-free, pore-blurring shield that locks bridal makeup in place for up to 16 hours without melting or settling in fine lines.',
    stockCount: 18,
    isBestseller: true,
  },
  {
    id: 'prod-2',
    name: 'Backstage Glow Face Palette (001 Universal)',
    brand: 'Dior',
    category: 'Highlighter & Blush',
    price: 4900,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    reviewCount: 512,
    description: 'The secret weapon of bridal makeup artists worldwide. 4 iridescent shades delivering ethereal, glass-skin reflection without chunky glitter.',
    stockCount: 7,
    isBestseller: true,
    shades: [
      { name: 'White & Gold Glow', hex: '#F9F1DC' },
      { name: 'Rose & Bronze Strobe', hex: '#C98C7B' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Faux Mink 3D Couture Bridal Lashes (Pack of 3)',
    brand: 'Glamgo Atelier',
    category: 'Eye Accents',
    price: 1850,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    reviewCount: 310,
    description: 'Handcrafted cruelty-free ultra-fine tapered fibers on a featherlight invisible cotton band. Designed for all-day comfort without drooping.',
    stockCount: 34,
    isBestseller: true,
  },
  {
    id: 'prod-4',
    name: 'Soft Pinch Liquid Dewy Blush',
    brand: 'Rare Beauty',
    category: 'Cheeks',
    price: 2400,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    reviewCount: 940,
    description: 'A weightless, long-lasting liquid blush that blends and builds beautifully for a soft, healthy flush all day.',
    stockCount: 14,
    isBestseller: false,
    shades: [
      { name: 'Joy (Dewy Peach)', hex: '#E7785F' },
      { name: 'Encourage (Soft Neutral Pink)', hex: '#B86877' },
      { name: 'Hope (Nude Mauve)', hex: '#C6878F' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Advanced Night Repair Synchronized Multi-Recovery',
    brand: 'Estée Lauder',
    category: 'Skincare Prep',
    price: 7200,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    rating: 4.91,
    reviewCount: 1240,
    description: 'Deep overnight hydration and skin barrier restoration so your skin wakes up plump, smooth, and ready for HD bridal base application.',
    stockCount: 22,
    isBestseller: true,
  },
  {
    id: 'prod-6',
    name: 'Ambient Lighting Powder (Luminous Light)',
    brand: 'Hourglass',
    category: 'Finishing Powder',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    rating: 4.87,
    reviewCount: 420,
    description: 'Utilizes photoluminescent technology to filter out harsh light and refine the appearance of skin. Simulates soft, flattering ambient light.',
    stockCount: 5,
    isBestseller: false,
  },
  {
    id: 'prod-7',
    name: 'Hollywood Flawless Filter Complexion Booster',
    brand: 'Charlotte Tilbury',
    category: 'Complexion & Base',
    price: 4400,
    originalPrice: 4900,
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=600&q=80',
    rating: 4.97,
    reviewCount: 1420,
    description: 'A customizable complexion booster that gives a soft-focus filter effect to the skin. Wear underneath foundation or as a liquid highlighter.',
    stockCount: 19,
    isBestseller: true,
    shades: [
      { name: '2 Fair (Warm Golden)', hex: '#EAC8A9' },
      { name: '3 Medium (Warm Peach)', hex: '#DFA884' },
      { name: '4.5 Medium Tan (Golden Olive)', hex: '#C28B62' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Mothership VII: Divine Rose Eyeshadow Palette',
    brand: 'Pat McGrath Labs',
    category: 'Eye Accents',
    price: 11500,
    originalPrice: 12900,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    rating: 4.96,
    reviewCount: 380,
    description: 'Ten sublime formulations of gilded petal golds, incandescent duochrome roses, and rich astral pigments crafted for couture bridal looks.',
    stockCount: 8,
    isBestseller: true,
  },
  {
    id: 'prod-9',
    name: 'Rouge Dior Forever Liquid Transfer-Proof Lipstick',
    brand: 'Dior',
    category: 'Lips & Tint',
    price: 3900,
    originalPrice: 4300,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    rating: 4.93,
    reviewCount: 750,
    description: 'Ultra-pigmented, ultra-comfortable liquid lipstick that resists smudging and transfer for 12 hours across wedding feasts and ceremonies.',
    stockCount: 26,
    isBestseller: true,
    shades: [
      { name: '999 Forever Dior (Crimson)', hex: '#A81C26' },
      { name: '100 Forever Nude (Petal)', hex: '#B87A76' },
      { name: '558 Forever Grace (Rosewood)', hex: '#9E5664' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Vital Skin Foundation Stick & Concealer',
    brand: 'Westman Atelier',
    category: 'Complexion & Base',
    price: 6800,
    originalPrice: 7400,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    reviewCount: 290,
    description: 'Clean, botanical-infused foundation stick that melts invisibly into skin, correcting redness and leaving a fresh, luminous bridal glow.',
    stockCount: 12,
    isBestseller: false,
  },
  {
    id: 'prod-11',
    name: 'The Royal Bride Master Vanity Trunk Edition',
    brand: 'Glamgo Atelier',
    category: 'Bridal Vanity Kits',
    price: 24500,
    originalPrice: 29900,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    rating: 4.99,
    reviewCount: 145,
    description: 'Curated 14-piece bridal vanity chest containing luxury setting mists, 24k radiance primers, silk lashes, bespoke lip glazes, and sterilization kit.',
    stockCount: 6,
    isBestseller: true,
  },
  {
    id: 'prod-12',
    name: '24K Gold Camellia Infused Radiance Primer Serum',
    brand: 'Tatcha',
    category: 'Skincare Prep',
    price: 5800,
    originalPrice: 6400,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    rating: 4.94,
    reviewCount: 620,
    description: 'Silken beauty elixir combining Hadasei-3 bio-ferment and pure 24-karat gold flakes to nourish, firm, and prime skin for camera-ready finish.',
    stockCount: 15,
    isBestseller: false,
  }
];

export const MOCK_INCOMING_REQUESTS: IncomingBookingRequest[] = [
  {
    id: 'req-101',
    clientName: 'Simran Khurana',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    packageName: 'Signature Sabyasachi Bridal HD Package',
    serviceType: 'Destination Wedding (Taj Lands End)',
    date: 'Nov 18, 2026',
    time: '02:30 PM',
    venue: 'Sea View Suite 402, Bandra, Mumbai',
    amount: 32000,
    depositPaid: 10000,
    status: 'PENDING',
    countdownSeconds: 284,
  },
  {
    id: 'req-102',
    clientName: 'Aishwarya Kapoor',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    packageName: 'Cocktail & Sangeet Red Carpet Glam',
    serviceType: 'At-Home Service',
    date: 'Nov 20, 2026',
    time: '05:00 PM',
    venue: 'Pali Hill Bungalow #12, Bandra',
    amount: 18000,
    depositPaid: 6000,
    status: 'PENDING',
    countdownSeconds: 412,
  },
  {
    id: 'req-103',
    clientName: 'Natasha Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    packageName: 'Royal Heritage Airbrush Bridal Package',
    serviceType: 'In-Studio Visit',
    date: 'Nov 24, 2026',
    time: '10:00 AM',
    venue: 'Glamgo Master Studio, Bandra',
    amount: 38000,
    depositPaid: 12000,
    status: 'ACCEPTED',
    countdownSeconds: 0,
  }
];

export const MOCK_CALENDAR_SLOTS: CalendarTimeSlot[] = [
  { id: 'cal-1', day: 'Mon', time: '09:00 AM', status: 'available' },
  { id: 'cal-2', day: 'Mon', time: '02:00 PM', clientName: 'Sonam S.', serviceName: 'Bridal Trial', status: 'booked', price: 8000 },
  { id: 'cal-3', day: 'Mon', time: '06:00 PM', status: 'blocked' },

  { id: 'cal-4', day: 'Tue', time: '09:00 AM', status: 'available' },
  { id: 'cal-5', day: 'Tue', time: '01:30 PM', status: 'available' },
  { id: 'cal-6', day: 'Tue', time: '05:00 PM', clientName: 'Kareena M.', serviceName: 'Editorial Shoot', status: 'booked', price: 22000 },

  { id: 'cal-7', day: 'Wed', time: '09:00 AM', status: 'blocked' },
  { id: 'cal-8', day: 'Wed', time: '02:00 PM', status: 'available' },
  { id: 'cal-9', day: 'Wed', time: '06:00 PM', status: 'available' },

  { id: 'cal-10', day: 'Thu', time: '10:00 AM', clientName: 'Radhika M.', serviceName: 'Pre-Wedding Shoot', status: 'booked', price: 25000 },
  { id: 'cal-11', day: 'Thu', time: '03:00 PM', status: 'available' },
  { id: 'cal-12', day: 'Thu', time: '07:00 PM', status: 'available' },

  { id: 'cal-13', day: 'Fri', time: '08:30 AM', clientName: 'Simran K.', serviceName: 'Wedding Muhurtham', status: 'booked', price: 32000 },
  { id: 'cal-14', day: 'Fri', time: '02:00 PM', status: 'available' },
  { id: 'cal-15', day: 'Fri', time: '06:30 PM', clientName: 'Tanvi R.', serviceName: 'Sangeet Glam', status: 'booked', price: 18000 },

  { id: 'cal-16', day: 'Sat', time: '07:00 AM', clientName: 'Ananya D.', serviceName: 'Royal Bridal HD', status: 'booked', price: 38000 },
  { id: 'cal-17', day: 'Sat', time: '01:00 PM', status: 'available' },
  { id: 'cal-18', day: 'Sat', time: '06:00 PM', clientName: 'Priya G.', serviceName: 'Reception Couture', status: 'booked', price: 28000 },

  { id: 'cal-19', day: 'Sun', time: '09:00 AM', status: 'blocked' },
  { id: 'cal-20', day: 'Sun', time: '02:00 PM', status: 'available' },
  { id: 'cal-21', day: 'Sun', time: '06:00 PM', status: 'available' },
];

export const MOCK_VENDOR_INVENTORY: VendorInventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'GLAM-CT-SPRAY-100ML',
    name: 'Airbrush Flawless Setting Spray 100ml',
    brand: 'Charlotte Tilbury',
    category: 'Face Prep',
    inStock: 18,
    reserved: 6,
    reorderPoint: 20,
    price: 3600,
    status: 'LOW_STOCK',
    shippingStatus: 'READY',
  },
  {
    id: 'inv-2',
    sku: 'GLAM-DIOR-GLOW-001',
    name: 'Backstage Glow Face Palette Universal',
    brand: 'Dior',
    category: 'Cheeks',
    inStock: 4,
    reserved: 3,
    reorderPoint: 15,
    price: 4900,
    status: 'CRITICAL',
    shippingStatus: 'LABEL_GENERATED',
  },
  {
    id: 'inv-3',
    sku: 'GLAM-LASH-3D-MINK-03',
    name: 'Faux Mink 3D Couture Bridal Lashes (3-pack)',
    brand: 'Glamgo Atelier',
    category: 'Eyes',
    inStock: 68,
    reserved: 12,
    reorderPoint: 30,
    price: 1850,
    status: 'IN_STOCK',
    shippingStatus: 'READY',
  },
  {
    id: 'inv-4',
    sku: 'GLAM-RARE-BLUSH-JOY',
    name: 'Soft Pinch Liquid Blush (Joy)',
    brand: 'Rare Beauty',
    category: 'Cheeks',
    inStock: 29,
    reserved: 8,
    reorderPoint: 25,
    price: 2400,
    status: 'IN_STOCK',
    shippingStatus: 'SHIPPED',
  },
  {
    id: 'inv-5',
    sku: 'GLAM-EL-ANR-50ML',
    name: 'Advanced Night Repair Multi-Recovery 50ml',
    brand: 'Estée Lauder',
    category: 'Skincare',
    inStock: 9,
    reserved: 4,
    reorderPoint: 15,
    price: 7200,
    status: 'LOW_STOCK',
    shippingStatus: 'READY',
  }
];

export const MOCK_KYC_APPLICANTS: KycApplicant[] = [
  {
    id: 'kyc-1',
    artistName: 'Suhana Mirchandani',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    category: 'Bridal & Editorial MUA',
    city: 'South Delhi, DL',
    experienceYears: 6,
    idProof: 'Aadhaar Verified (XXXX-8921)',
    certificate: 'CIDESCO International Diploma in Media Makeup',
    portfolioSamples: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
    ],
    instagramHandle: '@suhanamua_delhi (48.2k followers)',
    status: 'PENDING',
  },
  {
    id: 'kyc-2',
    artistName: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'Celebrity Hair Stylist & Extensions',
    city: 'Mumbai, MH',
    experienceYears: 8,
    idProof: 'Passport Verified (Z349281)',
    certificate: 'Toni & Guy Advanced Creative Cutting & Styling',
    portfolioSamples: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    ],
    instagramHandle: '@rohandeshmukh_hair',
    status: 'PENDING',
  },
  {
    id: 'kyc-3',
    artistName: 'Aaliya Rehman',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    category: 'Airbrush & HD Bridal Specialist',
    city: 'Bengaluru, KA',
    experienceYears: 5,
    idProof: 'Aadhaar Verified (XXXX-4102)',
    certificate: 'Make Up For Ever Academy Paris Certification',
    portfolioSamples: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    ],
    instagramHandle: '@aaliyarehman_artistry',
    status: 'PENDING',
  }
];
