# Product Requirements Document (PRD): Glamgo

## 1. Executive Summary & Vision
**Glamgo** is a unified, dual-engine beauty and wellness marketplace connecting consumers with certified beauty professionals (makeup artists, hairstylists, estheticians, nail technicians) for on-demand/scheduled bookings, alongside an integrated e-commerce store for retail beauty products and professional-grade equipment. 

### 1.1 Objective
To build a scalable, high-trust digital beauty ecosystem that eliminates friction in discovering, vetting, and booking event/personal grooming specialists while empowering beauty professionals and product vendors with business management and monetization tools.

### 1.2 Target Audience & User Personas
1. **Customers (End Users):**
   - *Brides & Event Attendees:* Looking for high-stakes, portfolio-verified makeup and hair artists for weddings, parties, and photoshoots with advance slot booking and trial runs.
   - *Everyday Grooming Consumers:* Seeking convenient at-home or in-studio salon services (skincare, nails, hair) and authentic beauty products.
2. **Beauty Professionals (Service Providers):**
   - Independent freelancers, celebrity artists, and salon owners seeking client acquisition, calendar management, automated deposits, and discounted professional supplies.
3. **Product Vendors (Sellers):**
   - D2C beauty brands, authorized distributors, and salon equipment manufacturers selling to both retail consumers and B2B professionals.
4. **Platform Administrators:**
   - Internal operations, trust & safety, and finance teams managing KYC onboarding, dispute resolution, commission splits, and catalog moderation.

---

## 2. Core User Flows & Functional Requirements

### 2.1 Customer Module
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **CUST-01** | **Geo-Aware Discovery & Search** | Search by location (GPS/Pincode), date/time availability, occasion type (Bridal, Editorial, Party, Daily), price range, and travel preference (At-Venue vs. In-Studio). | P0 |
| **CUST-02** | **Rich Portfolio & Verification View** | View high-res before/after galleries, video reels, verified badges, hygiene ratings, product brands used by the artist, and customer review photos. | P0 |
| **CUST-03** | **Hybrid Cart (Services + Products)** | Ability to book a service slot and purchase physical products in a single unified checkout or separate flows. | P1 |
| **CUST-04** | **Dynamic Slot & Event Booking** | Real-time availability checking, multi-day bridal package booking, add-on selection (e.g., draping, hair extensions, guest makeup), and partial advance deposit support. | P0 |
| **CUST-05** | **E-Commerce Storefront** | Browse cosmetics, skincare, haircare, and tools by skin type, concern, brand, and ingredient; track shipments and manage returns. | P0 |
| **CUST-06** | **Post-Booking & Order Management** | Live status tracking (Artist En-Route, OTP Service Start/End), rescheduling/cancellation based on policy tiers, and invoice downloads. | P0 |

### 2.2 Beauty Professional Module
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **PRO-01** | **Onboarding & KYC Verification** | Upload government ID, professional certifications, portfolio samples, studio address, and bank/payout details. | P0 |
| **PRO-02** | **Service & Package Builder** | Create tiered offerings (e.g., HD Bridal vs. Airbrush Bridal), set duration, buffer times, travel fee radii, and upfront deposit percentages. | P0 |
| **PRO-03** | **Smart Calendar & Slot Engine** | Manage working hours, block personal dates, sync external calendars, and prevent double bookings automatically. | P0 |
| **PRO-04** | **Portfolio & Content Manager** | Upload tagged high-res images/videos categorized by occasion and skin tone to aid customer discovery. | P1 |
| **PRO-05** | **Earnings & Payout Dashboard** | Track completed bookings, escrow releases, platform commission deductions, and automated bank transfers. | P0 |
| **PRO-06** | **Pro-Supply Store Access** | Access wholesale/B2B pricing on professional beauty equipment and bulk consumables from verified vendors. | P2 |

### 2.3 Product Vendor Module
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **VEND-01** | **Catalog & SKU Management** | Bulk CSV/API upload of products with variants (shades, sizes), batch numbers, expiry dates, and ingredient lists. | P0 |
| **VEND-02** | **Inventory & Warehouse Sync** | Real-time stock alerts, multi-warehouse support, and B2C vs. B2B (Pro-only) pricing tiers. | P0 |
| **VEND-03** | **Order Fulfillment & Logistics** | Generate shipping labels, integrate with 3PL couriers, manage returns/RTOs, and track SLA compliance. | P0 |
| **VEND-04** | **Promotions & Sponsored Listings** | Create coupon codes, bundle deals, and bid on featured placement or artist recommendations. | P2 |

### 2.4 Admin & Operations Module
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **ADM-01** | **KYC & Quality Gatekeeping** | Approve/reject professional profiles and vendor brand authorizations; audit product authenticity certificates. | P0 |
| **ADM-02** | **Commission & Escrow Rule Engine** | Configure category-wise commission rates, cancellation penalty splits, tax (GST/VAT) rules, and payout settlement cycles. | P0 |
| **ADM-03** | **Dispute & Refund Resolution** | Mediate no-shows, damaged product claims, or service quality escalations with evidence logs and partial refund controls. | P0 |
| **ADM-04** | **CMS & Campaign Manager** | Curate seasonal wedding lookbooks, homepage banners, and regional festival promotions. | P1 |

---

## 3. Non-Functional Requirements (NFRs)
1. **Performance & Latency:**
   - Geo-spatial search and availability queries must return in $< 300\text{ ms}$ (p95).
   - High-resolution portfolio media must load progressively via global CDN with WebP/AVIF auto-optimization.
2. **Concurrency & Consistency:**
   - Zero double-bookings: Slot locking during checkout must use distributed locks with a 10-minute TTL before payment confirmation.
   - Inventory decrements must be atomic under high flash-sale traffic.
3. **Security & Compliance:**
   - PCI-DSS compliant payment processing; PII encryption at rest (AES-256) and in transit (TLS 1.3).
   - OTP-verified service start and completion to prevent fraudulent payouts.
4. **Scalability & Availability:**
   - $99.9\%$ uptime SLA, especially during peak wedding and festive seasons.

---

## 4. Monetization & Business Model
1. **Service Commissions:** $15\% - 25\%$ take-rate on bookings, tiered by professional loyalty and volume.
2. **Product Marketplace Commissions:** $10\% - 30\%$ margin on beauty product sales depending on category.
3. **Glamgo Pro Subscription:** SaaS tier for professionals offering reduced commissions, priority search ranking, and advanced CRM analytics.
4. **Sponsored Ads:** Promoted artist profiles and featured brand carousels.

---

## 5. Key Performance Indicators (KPIs)
- **Gross Merchandise Value (GMV):** Split across Service GMV and Product GMV.
- **Booking Conversion Rate:** Search-to-confirmed-booking ratio.
- **Cross-Sell Ratio:** Percentage of service customers who also purchase retail products within 30 days.
- **Slot Utilization Rate:** Active booked hours vs. total available hours of professionals.
- **Net Promoter Score (NPS) & Cancellation/No-Show Rate:** Must remain $< 2\%$ for confirmed bookings.

---

## 6. Phased Rollout Roadmap
- **Phase 1 (MVP - Months 1-3):** Customer & Professional onboarding, geo-search, portfolio showcase, real-time slot booking, advance/escrow payments, basic e-commerce catalog, and Admin KYC panel.
- **Phase 2 (Growth - Months 4-6):** Multi-day bridal packages, hybrid cart checkout, B2B Pro-Supply store, 3PL logistics automation, and live artist tracking.
- **Phase 3 (Scale - Months 7-12):** AI-powered virtual shade/makeup try-on, artist-curated affiliate storefront links, and loyalty/rewards program.