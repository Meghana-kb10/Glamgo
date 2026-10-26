-- ============================================================================
-- Glamgo Production Standalone SQL Seed Dump
-- PostgreSQL 16 + PostGIS + btree_gist
-- Populates:
--   - 1 Customer (Rhea Singhania)
--   - 5 Verified Celebrity MUAs/Hairstylists (Mumbai, Delhi) with Coordinates
--   - Before / After High-Resolution Transformation Portfolios
--   - 15 Luxury Service Packages
--   - 7-Day Availability Working Windows
--   - 3 Verified Luxury Cosmetic Vendors (Bandra, Colaba, Delhi Aerocity)
--   - 20 Luxury Beauty / Skincare SKUs with check-constrained stock quantities
--   - Active Confirmed Booking with tstzrange GiST guard
--   - Escrow Ledger Entry with Platform Commission & Payout Split
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Seed Customer User & Home Address
-- ----------------------------------------------------------------------------
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '+919820199481',
  'rhea.singhania@glamgo.luxury',
  'Rhea Singhania',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  '{CUSTOMER}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'HOME_VISIT',
  'Sea View Penthouse',
  'Penthouse 14, Carter Road Promenade',
  'Opposite Joggers Park',
  'Carter Road Seafront',
  'Mumbai',
  'Maharashtra',
  '400050',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8258, 19.0657), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Seed 5 Verified Celebrity MUAs & Stylists
-- ----------------------------------------------------------------------------

-- Artist 1: Tanya Grewal (Bandra West, Mumbai)
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000101',
  '+919820109481',
  'tanya@tanyagrewal.artistry',
  'Tanya Grewal',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  '{PROFESSIONAL}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000101',
  'a0000000-0000-0000-0000-000000000101',
  'STUDIO',
  'Tanya Grewal Haute Atelier',
  '4B Pali Hill Heritage Chambers',
  'Near Nargis Dutt Road',
  'Opposite Zigzag Rock',
  'Mumbai',
  'Maharashtra',
  '400050',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8362, 19.0607), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO professional_profiles (
  id, user_id, slug, business_name, bio, experience_years, specialties,
  service_mode, studio_address_id, studio_location, max_travel_radius_km,
  travel_fee_per_km, kyc_status, hygiene_score, rating_avg, review_count,
  commission_rate_pct, cover_image_url, instagram_handle, is_instant_bookable
) VALUES (
  'c0000000-0000-0000-0000-000000000101',
  'a0000000-0000-0000-0000-000000000101',
  'tanya-grewal-artistry',
  'Tanya Grewal Artistry Studio',
  'Vogue India featured bridal artist with 9+ years elevating modern South Asian brides. Specialized in timeless regal aesthetics with radiant, weightless skin finish that lasts 18+ hours under high-definition wedding lights.',
  9,
  ARRAY['Sabyasachi Bridal HD', 'Dewy Glass Skin', 'Royal Heritage Draping'],
  'BOTH',
  'b0000000-0000-0000-0000-000000000101',
  ST_SetSRID(ST_MakePoint(72.8362, 19.0607), 4326)::geography,
  35.00,
  45.00,
  'APPROVED',
  99.4,
  4.98,
  142,
  15.00,
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
  '@tanyagrewal.artistry',
  TRUE
) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

INSERT INTO portfolio_media (
  id, professional_id, media_type, media_url, thumbnail_url, occasion_tag,
  is_before_after, before_image_url, after_image_url, transformation_title,
  skin_type, display_order
) VALUES (
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000101',
  'IMAGE',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'Royal Bridal HD',
  TRUE,
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'Regal Sabyasachi Bride Transformation',
  'Combination / Mild Pigmentation',
  1
);

INSERT INTO service_offerings (
  id, professional_id, category, tier, title, description, products_used,
  inclusions, duration_minutes, buffer_minutes, base_price, deposit_pct,
  is_popular, is_active
) VALUES
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000101',
  'Bridal',
  'Bridal Couture',
  'Signature Sabyasachi Bridal HD Package',
  'Complete royal wedding day look. Customized color correction, ultra-dewy waterproof HD base, bespoke cut-crease eye artistry, and royal lehenga draping.',
  ARRAY['Charlotte Tilbury Hollywood Flawless Filter', 'NARS Natural Radiant Longwear Foundation', 'Pat McGrath Mothership VII Divine Rose Palette', 'Tom Ford Shade and Illuminate Duo', 'Huda Beauty Easy Bake Loose Powder'],
  ARRAY['180-min bespoke artistry session', 'Silk Faux 3D Mink Lashes with custom mapping', 'Couture Dupatta & Lehenga Draping with anti-crease pins', 'Designer Hair Artistry with floral accessory setting', 'Luxury Emergency Touch-up Kit with custom lip shade'],
  180,
  45,
  32000.00,
  30.00,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000101',
  'Bridal',
  'Signature',
  'Royal Heritage Airbrush Bridal Package',
  'Micro-fine Temptu silicon airbrush technology providing flawless 24-hour heat and humidity resistance. Ideal for summer and destination weddings.',
  ARRAY['Temptu Pro Silicon Airbrush System', 'Dior Backstage Glow Face Palette', 'Hourglass Veil Mineral Primer', 'MAC Prep + Prime Fix+ Goldlite'],
  ARRAY['Full-face silicon airbrush foundation & contour', 'Advanced structural hair styling with extensions', 'Double Dupatta draping with crown anchoring', 'Jewellery & Mathapatti placement', 'Pre-bridal skin prep ampoule'],
  210,
  45,
  38000.00,
  30.00,
  FALSE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000101',
  'Party & Occasion',
  'Red Carpet',
  'Cocktail & Sangeet Red Carpet Glam',
  'High-octane dramatic glam with sculpted cheekbones, metallic smoked eyeliner, and voluminous Hollywood wave hair.',
  ARRAY['Fenty Beauty Pro Filt''r Soft Matte', 'Rare Beauty Soft Pinch Liquid Blush', 'Natasha Denona Glam Palette'],
  ARRAY['Modern red carpet makeup', 'Textured Hollywood waves or sleek updo', 'Sari / Contemporary gown draping', 'Custom cluster lash accent'],
  120,
  30,
  18000.00,
  30.00,
  FALSE,
  TRUE
);

-- Artist 2: Zoya Akhtar Malik (Juhu, Mumbai)
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000102',
  '+919820874192',
  'zoya@zoyakhtarglam.com',
  'Zoya Akhtar Malik',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  '{PROFESSIONAL}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000102',
  'a0000000-0000-0000-0000-000000000102',
  'STUDIO',
  'Zoya Akhtar Studio Juhu',
  'Level 2, Juhu Tara Road Sea Promenade',
  'Next to Soho House',
  'Juhu Beach Entrance',
  'Mumbai',
  'Maharashtra',
  '400049',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8263, 19.1075), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO professional_profiles (
  id, user_id, slug, business_name, bio, experience_years, specialties,
  service_mode, studio_address_id, studio_location, max_travel_radius_km,
  travel_fee_per_km, kyc_status, hygiene_score, rating_avg, review_count,
  commission_rate_pct, cover_image_url, instagram_handle, is_instant_bookable
) VALUES (
  'c0000000-0000-0000-0000-000000000102',
  'a0000000-0000-0000-0000-000000000102',
  'zoya-akhtar-glam',
  'Zoya Akhtar Glam Studio',
  'Former Lakmé Fashion Week lead backstage artist. Passionate about enhancing authentic facial bone structure with micro-concealing and luminous monochromatic tones.',
  7,
  ARRAY['Editorial Glass Skin', 'Feathered Brows', 'Effortless Modern Bride'],
  'BOTH',
  'b0000000-0000-0000-0000-000000000102',
  ST_SetSRID(ST_MakePoint(72.8263, 19.1075), 4326)::geography,
  25.00,
  50.00,
  'APPROVED',
  100.0,
  4.94,
  98,
  15.00,
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
  '@zoyakhtarglam',
  TRUE
) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

INSERT INTO portfolio_media (
  id, professional_id, media_type, media_url, thumbnail_url, occasion_tag,
  is_before_after, before_image_url, after_image_url, transformation_title,
  skin_type, display_order
) VALUES (
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000102',
  'IMAGE',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'Clean Glass Skin',
  TRUE,
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'Luminous Reception Glam',
  'Dry / Sensitive',
  1
);

INSERT INTO service_offerings (
  id, professional_id, category, tier, title, description, products_used,
  inclusions, duration_minutes, buffer_minutes, base_price, deposit_pct,
  is_popular, is_active
) VALUES
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000102',
  'Bridal',
  'Signature',
  'Modern Minimalist Bride Edition',
  'Refined, featherlight complexion work with micro-draping of peachy blush and natural fluttery lashes for the discerning minimalist bride.',
  ARRAY['Westman Atelier Vital Skin Foundation Stick', 'Chanel Les Beiges Water-Fresh Tint', 'Rose Inc Cream Blush', 'Kosas Cloud Set Setting Powder'],
  ARRAY['Pre-makeup lymphatic drainage facial massage', 'Feathered micro-brow lamination effect', 'Sleek runway bun or textured soft pony', 'Boutique organza saree or gown draping'],
  150,
  30,
  25000.00,
  30.00,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000102',
  'Party & Occasion',
  'Red Carpet',
  'Sunset Sangeet Euphoria Look',
  'Duochrome holographic eyelids, juicy glazed lips, and multi-dimensional shimmer cheeks that catch stage lighting.',
  ARRAY['Danessa Myricks Colorfix Chrome', 'Fenty Gloss Bomb Heat', 'Patrick Ta Major Glow Crème'],
  ARRAY['Duochrome high-shimmer eye work', 'Textured bohemian bridal braids', 'Mirror-work lehenga styling'],
  120,
  30,
  19000.00,
  30.00,
  FALSE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000102',
  'Party & Occasion',
  'Classic',
  'Dewy Glass Skin Cocktail Reception',
  'Ultra-fresh radiant skin with subtle monochromatic contouring, nude glazed lips, and silk blowout curls.',
  ARRAY['Dior Forever Skin Glow', 'Hourglass Ambient Lighting Powder', 'Rare Beauty Liquid Blush'],
  ARRAY['Hyaluronic glow skin prep ampoule', 'Air-whipped foundation finish', 'Thermal blowout hair styling'],
  105,
  25,
  16500.00,
  30.00,
  FALSE,
  TRUE
);

-- Artist 3: Kabir & Aarav Studio (Colaba, Mumbai)
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000103',
  '+919819204812',
  'kabir@kabiraarav.couture',
  'Kabir & Aarav Deshmukh',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  '{PROFESSIONAL}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000103',
  'a0000000-0000-0000-0000-000000000103',
  'STUDIO',
  'Kabir & Aarav Master Suite',
  'Ground Floor, Royal Colaba Chambers',
  'Behind Taj Mahal Palace Hotel',
  'Gateway of India Promenade',
  'Mumbai',
  'Maharashtra',
  '400005',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8347, 18.9220), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO professional_profiles (
  id, user_id, slug, business_name, bio, experience_years, specialties,
  service_mode, studio_address_id, studio_location, max_travel_radius_km,
  travel_fee_per_km, kyc_status, hygiene_score, rating_avg, review_count,
  commission_rate_pct, cover_image_url, instagram_handle, is_instant_bookable
) VALUES (
  'c0000000-0000-0000-0000-000000000103',
  'a0000000-0000-0000-0000-000000000103',
  'kabir-aarav-couture',
  'Kabir & Aarav Couture Atelier',
  'Dual artist powerhouse duo catering to high-profile brides across India, Dubai, and Lake Como. Famous for 60-second indestructible drape engineering and sculptural hair art.',
  12,
  ARRAY['Architectural Updos', 'Kanjivaram Saree Pleating', 'Real Flower Floral Cascades'],
  'BOTH',
  'b0000000-0000-0000-0000-000000000103',
  ST_SetSRID(ST_MakePoint(72.8347, 18.9220), 4326)::geography,
  50.00,
  60.00,
  'APPROVED',
  99.8,
  4.96,
  180,
  15.00,
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85',
  '@kabiraarav.couture',
  TRUE
) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

INSERT INTO portfolio_media (
  id, professional_id, media_type, media_url, thumbnail_url, occasion_tag,
  is_before_after, before_image_url, after_image_url, transformation_title,
  skin_type, display_order
) VALUES (
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000103',
  'IMAGE',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  'Kanjivaram Royal Temple',
  TRUE,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  'South Indian Muhurtham Bride',
  'Normal / Olive undertone',
  1
);

INSERT INTO service_offerings (
  id, professional_id, category, tier, title, description, products_used,
  inclusions, duration_minutes, buffer_minutes, base_price, deposit_pct,
  is_popular, is_active
) VALUES
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000103',
  'Bridal',
  'Bridal Couture',
  'The Empress Muhurtham Temple Package',
  'Authentic 9-yard or 6-yard Kanjivaram silk saree draping with knife-edge pleats, floral jada poola hair cascade, and antique temple jewelry alignment.',
  ARRAY['Dior Forever Skin Glow Foundation', 'Bobbi Brown Long-Wear Gel Eyeliner', 'MAC Ruby Woo Retro Matte', 'Kryolan Dermacolor Camouflage'],
  ARRAY['Precision silk saree pleating and custom waist pinning', 'Fresh jasmine & baby breath floral architectural styling', 'Jewelry weight balance fitting (Vanki, Oddiyanam, Nethi Chutti)', 'High endurance anti-sweat matte base'],
  195,
  45,
  36000.00,
  30.00,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000103',
  'Hair & Styling',
  'Signature',
  'Architectural Sangeet Braids & Draping',
  'Sculpted fishtail or bubble braid accented with gold gota ribbons and custom anti-crease lehenga pleat engineering.',
  ARRAY['Oribe Dry Texturizing Spray', 'Schwarzkopf OSIS Session Label', 'Dyson Supersonic Pro Styling Tools'],
  ARRAY['Complex structured hair artistry with padding/donuts', 'Dupatta crown pinning with safety reinforcement', 'Back and décolletage body glow strobing'],
  135,
  30,
  22000.00,
  30.00,
  FALSE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000103',
  'Bridal',
  'Bridal Couture',
  'Royal Destination Double-Dupatta Masterclass',
  'Bespoke double-dupatta anchoring for heavy couture lehengas (Sabyasachi, Manish Malhotra) ensuring zero weight drag on the bride’s head.',
  ARRAY['Anti-Crease Silicone Pins', 'Color-matched Velvet Grip Anchors'],
  ARRAY['Shoulder & head weight distribution rig', 'Crown veil positioning for clear photography angles', '360-degree walking and rotation stability test'],
  150,
  30,
  28000.00,
  30.00,
  FALSE,
  TRUE
);

-- Artist 4: Meera Sen Gupta (Khar West, Mumbai)
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000104',
  '+919833112233',
  'meera@meerasen.beauty',
  'Meera Sen Gupta',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  '{PROFESSIONAL}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000104',
  'a0000000-0000-0000-0000-000000000104',
  'STUDIO',
  'Meera Sen Holistic Suite',
  '302 Sea Breeze Heights, 14th Road',
  'Khar Danda',
  'Near Khar Gymkhana',
  'Mumbai',
  'Maharashtra',
  '400052',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8360, 19.0700), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO professional_profiles (
  id, user_id, slug, business_name, bio, experience_years, specialties,
  service_mode, studio_address_id, studio_location, max_travel_radius_km,
  travel_fee_per_km, kyc_status, hygiene_score, rating_avg, review_count,
  commission_rate_pct, cover_image_url, instagram_handle, is_instant_bookable
) VALUES (
  'c0000000-0000-0000-0000-000000000104',
  'a0000000-0000-0000-0000-000000000104',
  'meera-sen-skincare-mua',
  'Meera Sen Holistic Bridal Artistry',
  'Esthetician turned celebrity MUA. We focus on healing and plumping your barrier before applying any pigment, guaranteeing makeup that looks invisible up close in daylight.',
  6,
  ARRAY['Cryo-Facial Prep', 'Natural Glow', 'Acne-Safe Formulations'],
  'BOTH',
  'b0000000-0000-0000-0000-000000000104',
  ST_SetSRID(ST_MakePoint(72.8360, 19.0700), 4326)::geography,
  25.00,
  40.00,
  'APPROVED',
  99.9,
  4.89,
  64,
  15.00,
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
  '@meerasen_skincare_mua',
  TRUE
) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

INSERT INTO portfolio_media (
  id, professional_id, media_type, media_url, thumbnail_url, occasion_tag,
  is_before_after, before_image_url, after_image_url, transformation_title,
  skin_type, display_order
) VALUES (
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000104',
  'IMAGE',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  'Derm-Safe Bridal HD',
  TRUE,
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  'Acne-Safe Dewy Wedding Glam',
  'Acne-Prone / Texture',
  1
);

INSERT INTO service_offerings (
  id, professional_id, category, tier, title, description, products_used,
  inclusions, duration_minutes, buffer_minutes, base_price, deposit_pct,
  is_popular, is_active
) VALUES
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000104',
  'Bridal',
  'Signature',
  'The Derm-Prep Radiant Bridal Glow',
  'Includes 30 mins of ice globe cryo-therapy, hyaluronic acid infusion, followed by non-clogging mineral HD makeup.',
  ARRAY['Biologique Recherche Lotion P50 Prep', 'Oxygenetix Oxygenating Foundation', 'RMS Beauty Living Luminizer', 'Tower 28 SOS Daily Rescue Facial Spray'],
  ARRAY['Cryo ice globe de-puffing lymphatic sculpt', 'Custom non-comedogenic pigment blending', 'Lightweight air-texture lashes', 'Textured bohemian romantic braided bun'],
  160,
  35,
  21500.00,
  30.00,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000104',
  'Skincare Prep',
  'Classic',
  'Cryo-Facial Lymphatic Sculpt & Party Base',
  'Instant de-bloat and contour therapy with frozen cryo sticks, followed by a featherlight radiant skin tint and soft eyes.',
  ARRAY['Lotion P50', 'Dr. Barbara Sturm Glow Drops', 'Ilia Super Serum Skin Tint'],
  ARRAY['Facial lymphatic sculpt with cold obsidian tools', 'Barrier recovery serum cocktail', 'Glossy nude makeup application'],
  90,
  20,
  14000.00,
  30.00,
  FALSE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000104',
  'Bridal',
  'Signature',
  'Sensitive Acne-Safe HD Reception Makeover',
  'Micro-color correction concealing redness without suffocating healing skin. Tested on hyper-sensitive wedding clients.',
  ARRAY['Oxygenetix Hydro-Matrix', 'Exa Beauty Color Corrector', 'Tower 28 SunnyDays SPF 30'],
  ARRAY['Sterilized single-use disposable applicators', 'Mineral setting shield without pore-clogging talc', 'Sleek chignon hair setting'],
  120,
  30,
  18500.00,
  30.00,
  FALSE,
  TRUE
);

-- Artist 5: Aaliya Rehman (Defence Colony, South Delhi)
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000105',
  '+919811884422',
  'aaliya@aaliyarehman.in',
  'Aaliya Rehman',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  '{PROFESSIONAL}',
  TRUE
) ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000105',
  'a0000000-0000-0000-0000-000000000105',
  'STUDIO',
  'Aaliya Rehman Royal Studio',
  'D-14 Defence Colony Ring Road',
  'Main Flyover Market',
  'Near Defence Colony Club',
  'New Delhi',
  'Delhi',
  '110024',
  'IN',
  ST_SetSRID(ST_MakePoint(77.2315, 28.5729), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO professional_profiles (
  id, user_id, slug, business_name, bio, experience_years, specialties,
  service_mode, studio_address_id, studio_location, max_travel_radius_km,
  travel_fee_per_km, kyc_status, hygiene_score, rating_avg, review_count,
  commission_rate_pct, cover_image_url, instagram_handle, is_instant_bookable
) VALUES (
  'c0000000-0000-0000-0000-000000000105',
  'a0000000-0000-0000-0000-000000000105',
  'aaliya-rehman-artistry',
  'Aaliya Rehman Royal Nikah Atelier',
  'Make Up For Ever Paris certified master artist. Revered for creating majestic, velvety matte Mughal bridal looks, antique kohled eyes, and ornate pasa/jhumar placement.',
  8,
  ARRAY['Mughal Royal Airbrush', 'Cut-Crease Eyes', 'Antique Gold Smokey Eyes'],
  'BOTH',
  'b0000000-0000-0000-0000-000000000105',
  ST_SetSRID(ST_MakePoint(77.2315, 28.5729), 4326)::geography,
  40.00,
  55.00,
  'APPROVED',
  99.6,
  4.95,
  112,
  15.00,
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
  '@aaliyarehman_artistry',
  TRUE
) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

INSERT INTO portfolio_media (
  id, professional_id, media_type, media_url, thumbnail_url, occasion_tag,
  is_before_after, before_image_url, after_image_url, transformation_title,
  skin_type, display_order
) VALUES (
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000105',
  'IMAGE',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'Mughal Nikah Couture',
  TRUE,
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'Mughal Royal Nikah Bride',
  'Normal / Warm undertone',
  1
);

INSERT INTO service_offerings (
  id, professional_id, category, tier, title, description, products_used,
  inclusions, duration_minutes, buffer_minutes, base_price, deposit_pct,
  is_popular, is_active
) VALUES
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000105',
  'Bridal',
  'Bridal Couture',
  'Mughal Royal Airbrush Nikah Couture',
  'Velvety flawless matte complexion, dramatic antique gold cut-crease eye art, bespoke pasa jewel pinning, and royal sharara draping.',
  ARRAY['Temptu 24-Hour Silicon Matte Airbrush', 'Natasha Denona Gold Palette', 'Huda Beauty Matte Liquid Lip (Trendsetter)'],
  ARRAY['Double veil Nikah dupatta draping with sheer face veil', 'Pasa & Mathapatti custom anchoring', 'Dramatic velvet matte contouring', 'Hand-tied 3D cluster mink lashes'],
  200,
  45,
  35000.00,
  30.00,
  TRUE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000105',
  'Party & Occasion',
  'Signature',
  'Antique Kohl Smokey Reception Glam',
  'Intense smoked smudged kohl liner with bronze metallic reflects, sculpted cheekbones, and cascading brushed waves.',
  ARRAY['Pat McGrath Permagel Eyeliner (Xtreme Black)', 'Tom Ford Quad in Nude Dip'],
  ARRAY['Smokey eye precision blending', 'Hollywood glam waves hair setting', 'Evening gown / sari draping'],
  120,
  30,
  20000.00,
  30.00,
  FALSE,
  TRUE
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000105',
  'Party & Occasion',
  'Classic',
  'Mehendi Pastel Dewdrop Glow',
  'Lightweight refreshing skin tint with pastel floral eye accents, rosy cheeks, and soft baby breath floral side braids.',
  ARRAY['Rare Beauty Tinted Moisturizer', 'Fenty Beauty Cheeks Out Cream Blush'],
  ARRAY['Pastel eye tint & waterproof mascara', 'Bohemian side braid with real floral insertion', 'Light lehenga draping'],
  90,
  20,
  15000.00,
  30.00,
  FALSE,
  TRUE
);

-- Availability rules for 5 artists (Mon-Sat 08:30-20:30, Sun off)
INSERT INTO professional_availability_rules (id, professional_id, day_of_week, start_time, end_time, is_day_off)
SELECT gen_random_uuid(), p.id, d.day, '08:30:00'::time, '20:30:00'::time, (d.day = 0)
FROM professional_profiles p
CROSS JOIN (SELECT generate_series(0, 6) AS day) d
ON CONFLICT (professional_id, day_of_week) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Seed 3 Luxury Product Vendors & 20 Skincare/Cosmetic SKUs
-- ----------------------------------------------------------------------------

-- Vendor 1: Glamgo Atelier Direct Hub
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000201',
  '+919833445566',
  'fulfillment@glamgo.luxury',
  'Glamgo Atelier Direct Hub',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
  '{VENDOR}',
  TRUE
) ON CONFLICT (phone) DO NOTHING;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000201',
  'a0000000-0000-0000-0000-000000000201',
  'STUDIO',
  'Bandra Central Fulfillment Hub',
  'Plot C-22, G-Block, Bandra Kurla Complex',
  'Logistics City Zone 1',
  'Customs Bonded Area',
  'Mumbai',
  'Maharashtra',
  '400051',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8687, 19.0662), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO vendor_profiles (
  id, user_id, brand_name, slug, gstin_or_tax_id, warehouse_address_id,
  kyc_status, commission_rate_pct
) VALUES (
  'd0000000-0000-0000-0000-000000000201',
  'a0000000-0000-0000-0000-000000000201',
  'Glamgo Atelier Direct',
  'glamgo-atelier-direct',
  '27AABCG9481Q1ZP',
  'b0000000-0000-0000-0000-000000000201',
  'APPROVED',
  10.00
) ON CONFLICT (user_id) DO NOTHING;

-- Vendor 2: Backstage Pro Formulations
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000202',
  '+919877665544',
  'pro-supplies@backstagebeauty.co',
  'Backstage Pro Beauty Formulations',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=200&q=80',
  '{VENDOR}',
  TRUE
) ON CONFLICT (phone) DO NOTHING;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000202',
  'a0000000-0000-0000-0000-000000000202',
  'STUDIO',
  'Colaba Port Logistics Depot',
  'Warehouse 9, Apollo Bunder Docklands',
  'Customs Bonded Area',
  'Near Gateway Docks',
  'Mumbai',
  'Maharashtra',
  '400001',
  'IN',
  ST_SetSRID(ST_MakePoint(72.8300, 18.9200), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO vendor_profiles (
  id, user_id, brand_name, slug, gstin_or_tax_id, warehouse_address_id,
  kyc_status, commission_rate_pct
) VALUES (
  'd0000000-0000-0000-0000-000000000202',
  'a0000000-0000-0000-0000-000000000202',
  'Backstage Pro Formulations',
  'backstage-pro-formulations',
  '27AABCP1104K1ZV',
  'b0000000-0000-0000-0000-000000000202',
  'APPROVED',
  12.00
) ON CONFLICT (user_id) DO NOTHING;

-- Vendor 3: Paris & London Haute Cosmetics Node
INSERT INTO users (id, phone, email, full_name, avatar_url, roles, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000203',
  '+919899112244',
  'curator@parisluxe.store',
  'Paris & London Haute Cosmetics Node',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  '{VENDOR}',
  TRUE
) ON CONFLICT (phone) DO NOTHING;

INSERT INTO user_addresses (
  id, user_id, address_type, title, street_line1, street_line2, landmark,
  city, state, postal_code, country_code, location, is_default
) VALUES (
  'b0000000-0000-0000-0000-000000000203',
  'a0000000-0000-0000-0000-000000000203',
  'STUDIO',
  'Delhi Aerocity Bonded Logistics',
  'Unit 4, Worldmark 3 Aerocity',
  'IGI Airport Air Cargo Complex',
  'Customs Clearance Area',
  'New Delhi',
  'Delhi',
  '110037',
  'IN',
  ST_SetSRID(ST_MakePoint(77.1210, 28.5520), 4326)::geography,
  TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO vendor_profiles (
  id, user_id, brand_name, slug, gstin_or_tax_id, warehouse_address_id,
  kyc_status, commission_rate_pct
) VALUES (
  'd0000000-0000-0000-0000-000000000203',
  'a0000000-0000-0000-0000-000000000203',
  'Paris & London Haute Cosmetics Node',
  'paris-london-haute-cosmetics',
  '07AAECP4921M1ZR',
  'b0000000-0000-0000-0000-000000000203',
  'APPROVED',
  15.00
) ON CONFLICT (user_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Products & SKUs (20 Luxury Items with CHECK stock_quantity >= 0)
-- ----------------------------------------------------------------------------
INSERT INTO products (
  id, vendor_id, slug, title, brand_name, category_path, description,
  ingredients, is_pro_equipment, b2b_only, rating_avg, review_count,
  is_bestseller, is_active
) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000201', 'airbrush-flawless-setting-spray', 'Airbrush Flawless Setting Spray', 'Charlotte Tilbury', 'Makeup/Face/Setting', 'Weightless, oil-free, pore-blurring shield that locks bridal makeup in place for up to 16 hours.', 'Aqua/Water, AMP-Acrylates Copolymer, Aloe Barbadensis Leaf Juice.', FALSE, FALSE, 4.90, 840, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000201', 'hollywood-flawless-filter', 'Hollywood Flawless Filter Primer & Glow Booster', 'Charlotte Tilbury', 'Makeup/Face/Primer', 'A customizable complexion booster with the versatility of a primer and mega-watt glow.', 'Aqua, Hydrogenated Didecene, Isododecane, Mica, Glycerin.', FALSE, FALSE, 4.94, 620, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000201', 'faux-mink-3d-couture-bridal-lashes', 'Faux Mink 3D Couture Bridal Lashes (Pack of 3)', 'Glamgo Atelier', 'Makeup/Eyes/Lashes', 'Handcrafted cruelty-free ultra-fine tapered fibers on a featherlight invisible cotton band.', 'Synthetic Silk Protein Polymer.', FALSE, FALSE, 4.88, 310, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000201', 'advanced-night-repair-multi-recovery', 'Advanced Night Repair Synchronized Multi-Recovery', 'Estée Lauder', 'Skincare/Serums', 'Deep overnight hydration and skin barrier restoration.', 'Bifida Ferment Lysate, Tripeptide-32, Sodium Hyaluronate, Caffeine.', FALSE, FALSE, 4.91, 1240, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000201', 'soft-pinch-liquid-dewy-blush', 'Soft Pinch Liquid Dewy Blush', 'Rare Beauty', 'Makeup/Cheeks/Blush', 'Weightless, long-lasting liquid blush that blends and builds beautifully.', 'Hydrogenated Polyisobutene, Hydrogenated Poly(C6-14 Olefin), Mica.', FALSE, FALSE, 4.92, 940, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000201', 'ambient-lighting-powder', 'Ambient Lighting Powder', 'Hourglass', 'Makeup/Face/Powder', 'Photoluminescent technology that captures, diffuses, and softens surrounding light.', 'Mica, Synthetic Fluorphlogopite, Boron Nitride.', FALSE, FALSE, 4.87, 420, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000201', 'sos-daily-rescue-facial-spray', 'SOS Daily Rescue Facial Spray', 'Tower 28', 'Skincare/Toners', 'Simple, gentle facial spray formulated with hypochlorous acid that calms skin.', 'Water, Sodium Chloride, Hypochlorous Acid.', FALSE, FALSE, 4.89, 380, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000202', 'backstage-glow-face-palette', 'Backstage Glow Face Palette (001 Universal)', 'Dior', 'Makeup/Face/Highlighter', '4 iridescent shades delivering ethereal, glass-skin reflection.', 'Mica, Talc, Synthetic Fluorphlogopite, Dimethicone.', TRUE, FALSE, 4.95, 512, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000202', 'forever-skin-glow-foundation', 'Forever Skin Glow 24H Hydrating Foundation', 'Dior', 'Makeup/Face/Foundation', 'Clean, 24-hour radiant foundation with 86% skincare base.', 'Iris Florentina Root Extract, Hibiscus Sabdariffa Flower Extract.', FALSE, FALSE, 4.91, 480, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000202', 'radiant-creamy-concealer', 'Radiant Creamy Concealer', 'NARS', 'Makeup/Face/Concealer', 'Multi-action, 16-hour formula that blurs, corrects, and sculpts all skin tones.', 'Magnolia Bark Extract, Grape Seed Extract, Vitamin E.', FALSE, FALSE, 4.93, 1100, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000202', 'easy-bake-loose-powder', 'Easy Bake Loose Baking & Setting Powder', 'Huda Beauty', 'Makeup/Face/Powder', 'Airbrushed, long-lasting complexion without flash-back.', 'Talc, Synthetic Fluorphlogopite, Silica, Dimethicone.', FALSE, FALSE, 4.88, 750, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000202', 'temptu-pro-airbrush-kit', 'Temptu Pro 2.0 Silicon Airbrush Starter Kit', 'Temptu Pro', 'Tools/Equipment/Airbrush', 'Professional grade micro-compressor with precision gun for high-definition bridal.', 'Machined Stainless Steel, Medical Grade Silicone Tubing.', TRUE, TRUE, 4.97, 94, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000202', 'prep-prime-fix-plus-goldlite', 'Prep + Prime Fix+ Shimmer (Goldlite)', 'MAC', 'Makeup/Face/Setting', 'Lightweight water mist packed with vitamins and minerals, infused with pearlescent gold.', 'Water, Glycerin, Butylene Glycol, Chamomilla Recutita.', FALSE, FALSE, 4.86, 520, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000203', 'mothership-vii-divine-rose', 'Mothership VII: Divine Rose Eyeshadow Palette', 'Pat McGrath Labs', 'Makeup/Eyes/Palettes', '10 sublime eyeshadow shades featuring luminous rose gold and duochromes.', 'Talc, Synthetic Fluorphlogopite, Mica, Dimethicone, Silica.', FALSE, FALSE, 4.98, 310, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000203', 'shade-and-illuminate-contour-duo', 'Shade and Illuminate Cream Contour Duo', 'Tom Ford', 'Makeup/Face/Contour', 'Luxurious cream-to-satin contour duo designed to sculpt facial bone structure.', 'Bis-Diglyceryl Polyacyladipate-2, Phenyl Trimethicone.', FALSE, FALSE, 4.92, 280, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000203', 'vital-skin-foundation-stick', 'Vital Skin Foundation & Concealer Stick', 'Westman Atelier', 'Makeup/Face/Foundation', 'Clean, luxurious cream foundation stick formulated with active skincare ingredients.', 'Phytosphingosine, Berryflux Vita, Camellia Seed Oil.', FALSE, FALSE, 4.90, 190, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000203', 'lotion-p50-exfoliator', 'Lotion P50 Balancing Exfoliator', 'Biologique Recherche', 'Skincare/Toners', 'World-famous cult Parisian exfoliating toner that regulates sebum and balances pH.', 'Lactic Acid, Gluconolactone, Salicylic Acid, Sulfur.', TRUE, FALSE, 4.99, 890, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000203', 'translucent-loose-setting-powder-honey', 'Translucent Loose Setting Powder (Honey)', 'Laura Mercier', 'Makeup/Face/Powder', '16-hour lightweight setting powder delivering zero flashback in photography.', 'Talc, Magnesium Myristate, Nylon-12.', FALSE, FALSE, 4.91, 640, TRUE, TRUE),
('e0000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-000000000203', 'colorfix-foil-cream', 'Colorfix Foil Multipurpose Metallic Cream', 'Danessa Myricks Beauty', 'Makeup/Eyes/Metallic', 'Long-wearing, waterproof liquid foil pigment for high-voltage party glam.', 'Isododecane, Cyclopentasiloxane, Isononyl Isononanoate.', FALSE, FALSE, 4.88, 220, FALSE, TRUE),
('e0000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000203', 'super-serum-skin-tint', 'Super Serum Skin Tint SPF 40', 'Ilia Beauty', 'Makeup/Face/Tint', 'Clean, light-coverage tinted serum with non-nano zinc oxide sunscreen and squalane.', 'Zinc Oxide 12%, Squalane, Niacinamide, Sodium Hyaluronate.', FALSE, FALSE, 4.87, 390, FALSE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 20 Product SKUs with check-constrained stock quantities
INSERT INTO product_skus (
  id, product_id, sku, barcode, shade_name, shade_hex, size_label,
  mrp_price, retail_price, pro_wholesale_price, stock_quantity,
  reserved_quantity, reorder_threshold, images
) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'GLAM-CT-SPRAY-100ML', 'BAR-CT-01', NULL, NULL, '100ml', 4200.00, 3600.00, 3100.00, 45, 6, 15, ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'GLAM-CT-HFF-45-MED', 'BAR-CT-02', '4.5 Medium Golden', '#D19C6E', '30ml', 4900.00, 4400.00, 3800.00, 28, 3, 10, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'GLAM-LASH-3D-MINK-03', 'BAR-LASH-01', 'Wispy Flutter', '#181311', '3 Pairs Pack', 2400.00, 1850.00, 1400.00, 110, 12, 30, ARRAY['https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 'GLAM-EL-ANR-50ML', 'BAR-EL-01', NULL, NULL, '50ml Bottle', 8500.00, 7200.00, 6200.00, 34, 5, 15, ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000005', 'GLAM-RARE-BLUSH-JOY', 'BAR-RARE-01', 'Joy (Dewy Peach)', '#E7785F', '7.5ml', 2800.00, 2400.00, 2000.00, 42, 8, 15, ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000005', 'GLAM-RARE-BLUSH-HOPE', 'BAR-RARE-02', 'Hope (Nude Mauve)', '#C6878F', '7.5ml', 2800.00, 2400.00, 2000.00, 36, 5, 15, ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000006', 'GLAM-HG-AMB-LUM', 'BAR-HG-01', 'Luminous Light', '#E9DEC9', '10g', 5800.00, 5200.00, 4500.00, 19, 2, 8, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000007', 'GLAM-T28-SOS-120ML', 'BAR-T28-01', NULL, NULL, '120ml', 3200.00, 2800.00, 2400.00, 52, 4, 15, ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000008', 'GLAM-DIOR-GLOW-001', 'BAR-DIOR-01', '001 Universal Glow', '#F9F1DC', '10g Palette', 5500.00, 4900.00, 4200.00, 18, 3, 10, ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000009', 'GLAM-DIOR-FSG-2N', 'BAR-DIOR-02', '2N Neutral', '#DEC1A7', '30ml', 6200.00, 5500.00, 4800.00, 24, 4, 8, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000010', 'GLAM-NARS-RCC-CUST', 'BAR-NARS-01', 'Custard (Medium 1)', '#E2BA8A', '6ml', 3400.00, 2950.00, 2500.00, 38, 5, 12, ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000011', 'GLAM-HUDA-EB-BANANA', 'BAR-HUDA-01', 'Banana Bread', '#EAD7A6', '20g', 3900.00, 3400.00, 2900.00, 31, 4, 10, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000012', 'GLAM-TEMPTU-KIT-PRO', 'BAR-TEMPTU-01', NULL, NULL, 'Full Master Kit', 48000.00, 42000.00, 36000.00, 12, 2, 4, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000013', 'GLAM-MAC-FIX-GOLD', 'BAR-MAC-01', 'Goldlite Shimmer', '#E4BC72', '100ml', 2600.00, 2250.00, 1900.00, 48, 6, 15, ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000014', 'GLAM-PML-MS-VII', 'BAR-PML-01', 'Divine Rose Special Shades', '#C77D8D', '10 Pan Vault', 12500.00, 10800.00, 9500.00, 15, 2, 5, ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000015', 'GLAM-TF-SI-01', 'BAR-TF-01', 'Intensity 0.5', '#9E7658', '14g', 9200.00, 8200.00, 7200.00, 21, 3, 8, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000016', 'GLAM-WA-VS-III', 'BAR-WA-01', 'Atelier III', '#E3C19C', '9g Stick', 7800.00, 6900.00, 6000.00, 26, 3, 8, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000018', 'e0000000-0000-0000-0000-000000000017', 'GLAM-BR-P50-150ML', 'BAR-BR-01', NULL, NULL, '150ml Bottle', 11000.00, 9800.00, 8500.00, 22, 4, 8, ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000019', 'e0000000-0000-0000-0000-000000000018', 'GLAM-LM-TLP-HONEY', 'BAR-LM-01', 'Honey Golden', '#DFBC8D', '29g', 4500.00, 3950.00, 3400.00, 35, 5, 12, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80']),
('f0000000-0000-0000-0000-000000000020', 'e0000000-0000-0000-0000-000000000019', 'GLAM-DMB-CF-MILKYWAY', 'BAR-DMB-01', 'Milky Way Opal', '#EAE1CC', '10ml', 2600.00, 2200.00, 1850.00, 28, 2, 8, ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'])
ON CONFLICT (sku) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

-- ----------------------------------------------------------------------------
-- 4. Seed Confirmed Booking with GiST Concurrency Time-Range Protection
-- ----------------------------------------------------------------------------
INSERT INTO bookings (
  id, booking_number, customer_id, professional_id, status, location_type,
  venue_address_id, venue_location, slot_start, slot_end, subtotal_amount,
  travel_fee, tax_amount, total_amount, deposit_paid_amount, balance_due_amount,
  start_otp_hash, complete_otp_hash
) VALUES (
  'c1000000-0000-0000-0000-000000000001',
  'GLAM-BK-202611-9481',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000101',
  'CONFIRMED',
  'HOME_VISIT',
  'b0000000-0000-0000-0000-000000000001',
  ST_SetSRID(ST_MakePoint(72.8258, 19.0657), 4326)::geography,
  '2026-11-15 14:30:00+05:30',
  '2026-11-15 17:30:00+05:30',
  32000.00,
  450.00,
  5841.00,
  38291.00,
  11487.00,
  26804.00,
  '582914',
  '394812'
) ON CONFLICT (booking_number) DO NOTHING;

-- Escrow Ledger Entry
INSERT INTO escrow_ledger_entries (
  id, transaction_reference, beneficiary_user_id, booking_id, gross_amount,
  platform_commission, escrow_guarantee_reserve, tax_withheld, net_payout_amount,
  status, eligible_release_at
) VALUES (
  gen_random_uuid(),
  'TXN-RZP-9481920',
  'a0000000-0000-0000-0000-000000000101',
  'c1000000-0000-0000-0000-000000000001',
  38291.00,
  5743.65,
  1148.73,
  382.91,
  31015.71,
  'HELD',
  '2026-11-15 19:30:00+05:30'
);

COMMIT;
