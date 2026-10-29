# Glamgo — Product Requirements Document (PRD)

**Version:** 1.0 | **Focus:** Customer app redesign (web + mobile) | **Status:** Draft

---

## 1. Introduction

Glamgo is a beauty aggregator marketplace connecting customers with beauty professionals (makeup artists, hairstylists, beauticians, nail artists, skincare specialists) and beauty product providers in one platform. Customers can discover, compare, and book services for grooming, weddings, parties, photoshoots, and special occasions, and can also shop beauty products.

This PRD defines the **customer-facing redesign**: a new UI/UX, sign-in experience, and a fast, low-friction booking flow in the style of Urban Company. Vendor, professional, and admin dashboards are referenced for dependencies but are out of scope for this release.

## 2. Problem Statement

Customers looking for beauty services face:
- Hard-to-trust discovery (unclear quality, no verified portfolios)
- Unclear pricing and hidden charges
- Too many steps and back-and-forth to book
- No single place for services + products
- Uncertainty about professional availability and punctuality

The current Glamgo UI does not make discovery and booking simple enough, which reduces conversion and repeat usage.

## 3. Goals & Non-Goals

### Goals
1. A customer can go from opening the app to a confirmed booking in **under 90 seconds** (returning user, repeat service: under 30 seconds).
2. Sign-up/sign-in takes **under 20 seconds** (phone OTP).
3. Build trust through verified professionals, real reviews, portfolios, and transparent pricing.
4. Increase booking conversion and repeat bookings.
5. Create a premium, calm, beauty-first visual experience.

### Non-Goals (this release)
- Redesign of vendor/professional/admin dashboards
- Professional onboarding flows
- Subscriptions/memberships (Phase 2)
- Video consultations (Phase 2)

## 4. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Everyday Groomer (Priya, 24)** | Working professional, books salon at home, threading, facials, manicure | Speed, fixed prices, trusted pros, repeat booking |
| **Bride / Event Client (Ananya, 27)** | Planning wedding or party looks | Portfolios, pre-consultation, packages, advance booking, trial sessions |
| **Occasion Seeker (Riya, 21)** | Needs a quick makeup/hair look for a party or photoshoot | Style inspiration, same-day slots, price comparison |
| **Product Shopper (Neha, 30)** | Buys skincare/haircare | Reliable products, easy checkout, combos with services |

## 5. Scope

### In Scope (MVP)
- Onboarding + Sign in / Sign up
- Home with categories, search, offers, recommendations
- Service listing, filters, sort
- Professional profile (portfolio, reviews, pricing, availability)
- Booking flow (service → slot → address → payment → confirmation)
- Cart for services and products
- Payments (UPI, cards, wallets, pay after service)
- Bookings management (upcoming, past, reschedule, cancel)
- Order tracking for products
- Reviews and ratings
- Notifications (push, SMS, WhatsApp, email)
- Profile, saved addresses, favorites
- Help & support

### Out of Scope (Later)
Memberships, loyalty tiers, gift cards, video consults, AI look-matching/virtual try-on, referral engine (basic referral in Phase 2).

## 6. Feature Requirements

Priority: **P0** = must have, **P1** = should have, **P2** = nice to have

### 6.1 Authentication & Onboarding

| ID | Requirement | Priority |
|---|---|---|
| AUTH-1 | Sign-in with **mobile number + OTP** as primary method | P0 |
| AUTH-2 | Social sign-in: Google, Apple (iOS) | P0 |
| AUTH-3 | **Browse as guest**; prompt for sign-in only at checkout | P0 |
| AUTH-4 | Auto-read OTP (Android SMS retriever), resend after 30s | P0 |
| AUTH-5 | First-time users: collect name (required), email (optional), gender preference for professional (optional) | P0 |
| AUTH-6 | Location permission prompt with manual city/pincode fallback | P0 |
| AUTH-7 | Language selection (English, Hindi, Kannada at launch; more later) | P1 |
| AUTH-8 | 3-screen skippable onboarding carousel | P1 |
| AUTH-9 | Session persistence; biometric re-login | P2 |

**Acceptance criteria:** A new user can sign in with phone OTP in ≤3 taps and ≤20 seconds. Guest can reach checkout with their cart preserved after login.

### 6.2 Home & Discovery

| ID | Requirement | Priority |
|---|---|---|
| HOME-1 | Location header with change-address option | P0 |
| HOME-2 | Global search (services, professionals, products) with suggestions and recent searches | P0 |
| HOME-3 | Category grid: Makeup, Hair, Nails, Skin & Facial, Waxing & Threading, Bridal, Spa & Wellness, Men's Grooming, Products | P0 |
| HOME-4 | Promotional banners/offers carousel | P0 |
| HOME-5 | Sections: Most Booked, Trending Near You, Top-Rated Professionals, Bridal Packages, Quick Services (under 60 min) | P0 |
| HOME-6 | "Book Again" for returning users | P0 |
| HOME-7 | Occasion-based entry points (Wedding, Party, Festive, Photoshoot, Date night) | P1 |
| HOME-8 | Beauty products rail with add-to-cart | P1 |
| HOME-9 | Personalized recommendations | P2 |

### 6.3 Service Listing & Details

| ID | Requirement | Priority |
|---|---|---|
| SVC-1 | Service cards: image, name, duration, price, rating, "Add" button | P0 |
| SVC-2 | Filters: price, rating, gender of professional, at-home vs. at-salon, availability today, distance | P0 |
| SVC-3 | Sort: popularity, price, rating, nearest | P0 |
| SVC-4 | Service detail: description, what's included, products used, duration, price, FAQs, precautions | P0 |
| SVC-5 | Packages/combos with savings shown | P0 |
| SVC-6 | Customizable add-ons (e.g., hair spa add-on to haircut) | P1 |
| SVC-7 | Before/after gallery | P1 |

### 6.4 Professional Profiles

| ID | Requirement | Priority |
|---|---|---|
| PRO-1 | Profile with photo, name, specialization, experience, verified badge, rating, jobs completed | P0 |
| PRO-2 | Portfolio gallery (photos, reels), filterable by style/occasion | P0 |
| PRO-3 | Services offered and price list | P0 |
| PRO-4 | Reviews with photos, rating breakdown | P0 |
| PRO-5 | Availability calendar | P0 |
| PRO-6 | Favorite/save professional | P1 |
| PRO-7 | Chat/enquiry before booking (for bridal/event bookings) | P1 |

### 6.5 Booking Flow (core)

**Principle:** Maximum 4 steps, always visible price, always visible progress, no surprises.

| Step | Screen | Key actions |
|---|---|---|
| 1 | Select service | Choose service/package, add-ons, quantity; see live total in sticky bar |
| 2 | Date, time & professional | Horizontal date strip, time-slot chips, "Assign best professional" (default) or pick a professional |
| 3 | Address & details | Saved address picker, map pin, special instructions, optional occasion note |
| 4 | Review & pay | Itemized bill, coupons, payment method, T&Cs, **Confirm Booking** |

| ID | Requirement | Priority |
|---|---|---|
| BOOK-1 | Sticky bottom bar with total price and primary CTA on every step | P0 |
| BOOK-2 | Real-time slot availability; unavailable slots greyed out, not hidden | P0 |
| BOOK-3 | Auto-assign best professional by default; manual pick optional | P0 |
| BOOK-4 | Save progress; resume abandoned booking | P0 |
| BOOK-5 | Price breakdown: service, add-ons, taxes, convenience fee, discount | P0 |
| BOOK-6 | Coupon/offer apply with instant validation | P0 |
| BOOK-7 | Booking confirmation screen with booking ID, summary, add-to-calendar, share | P0 |
| BOOK-8 | Multiple services in one booking (cart), with smart scheduling | P1 |
| BOOK-9 | Book for someone else (different name/phone) | P1 |
| BOOK-10 | Group/bridal-party booking | P1 |
| BOOK-11 | Same-day/instant booking ("Professional in 60 mins") | P2 |

### 6.5.1 Payments

| ID | Requirement | Priority |
|---|---|---|
| PAY-1 | UPI (GPay, PhonePe, Paytm, other), cards, net banking, wallets | P0 |
| PAY-2 | Pay after service (cash/UPI) where allowed | P0 |
| PAY-3 | Partial advance for high-value bookings (e.g., bridal) | P1 |
| PAY-4 | Automatic refund to source per cancellation policy | P0 |
| PAY-5 | Saved payment methods (tokenized) | P1 |
| PAY-6 | GST invoice download | P1 |

### 6.6 Booking Management

| ID | Requirement | Priority |
|---|---|---|
| MNG-1 | Tabs: Upcoming, Completed, Cancelled | P0 |
| MNG-2 | Booking detail with status timeline (Confirmed → Professional assigned → On the way → In progress → Completed) | P0 |
| MNG-3 | Reschedule and cancel with clear policy and refund preview | P0 |
| MNG-4 | Live professional ETA and call/chat masked number | P1 |
| MNG-5 | OTP-based service start verification (safety) | P1 |
| MNG-6 | Rebook in one tap | P0 |
| MNG-7 | Tip professional | P2 |

### 6.7 Product Shopping

| ID | Requirement | Priority |
|---|---|---|
| PRD-1 | Product listing, filters (brand, skin/hair type, price), search | P0 |
| PRD-2 | Product detail: images, description, ingredients, reviews, stock | P0 |
| PRD-3 | Unified cart for services + products (separate fulfillment shown clearly) | P1 |
| PRD-4 | Checkout with delivery address, delivery estimate | P0 |
| PRD-5 | Order tracking, returns/refunds | P0 |
| PRD-6 | "Used in your service" product suggestions after booking | P2 |

### 6.8 Reviews & Ratings

| ID | Requirement | Priority |
|---|---|---|
| REV-1 | Post-service rating prompt (1–5 stars + tags) | P0 |
| REV-2 | Written review with photo upload | P1 |
| REV-3 | Verified-booking badge on reviews | P0 |
| REV-4 | Product reviews after delivery | P1 |

### 6.9 Notifications

| ID | Requirement | Priority |
|---|---|---|
| NOT-1 | Booking confirmation, reminder (24h, 2h), professional assigned/on the way, completion | P0 |
| NOT-2 | Channels: push, SMS, WhatsApp, email (user-configurable) | P0 |
| NOT-3 | Promotional notifications with opt-out | P1 |
| NOT-4 | Rebook reminders (e.g., "Time for your next hair spa") | P2 |

### 6.10 Profile, Support & Safety

| ID | Requirement | Priority |
|---|---|---|
| PRF-1 | Edit profile, saved addresses, favorites, payment methods | P0 |
| PRF-2 | Help center, FAQs, chat/call support | P0 |
| PRF-3 | Report a problem on a booking; service guarantee claim | P0 |
| PRF-4 | Safety: verified/background-checked professionals, SOS button during service | P1 |
| PRF-5 | Privacy controls, delete account | P0 |

## 7. User Stories (sample)

- As a new user, I want to browse services without signing up so I can decide before committing.
- As a customer, I want to sign in with just my phone number so that I don't have to remember a password.
- As a busy user, I want to rebook my last service in one tap.
- As a bride, I want to view a makeup artist's portfolio and message her before booking a trial.
- As a customer, I want to see the full price upfront so there are no surprises.
- As a customer, I want to reschedule easily if plans change.
- As a customer, I want to see that a professional is verified so I feel safe at home.

## 8. Key User Flows

**Flow A – New user booking:** Open app → Skip onboarding → Home → Pick category → Pick service → Add → Select slot → Prompt: Sign in (OTP) → Address → Pay → Confirmation.

**Flow B – Returning user:** Open app → "Book Again" → Confirm slot (pre-filled address) → Pay → Done.

**Flow C – Bridal enquiry:** Home → Bridal → Professional profile → View portfolio → Chat/enquiry → Book trial → Book wedding date with advance.

**Flow D – Cancel/reschedule:** Bookings → Select booking → Reschedule/Cancel → See refund policy → Confirm.

## 9. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Home loads <2s on 4G; interactions <100ms; image lazy loading and CDN |
| Availability | 99.9% uptime |
| Scalability | Support 10x load growth; horizontally scalable services |
| Security | HTTPS, OTP rate limiting, PCI-DSS compliant payments via gateway, encrypted PII |
| Privacy | Compliance with India's DPDP Act; explicit consent for location and marketing |
| Accessibility | WCAG 2.1 AA, minimum 4.5:1 contrast, 44px touch targets, screen reader labels |
| Compatibility | Android 8+, iOS 14+, latest Chrome/Safari/Edge/Firefox |
| Localization | English, Hindi, Kannada at launch; INR; IST |
| Offline | Graceful handling of poor network; cached bookings viewable |

## 10. Success Metrics (KPIs)

| Metric | Target (first 6 months) |
|---|---|
| Sign-in completion rate | >85% |
| Visit → booking conversion | +30% vs. current baseline |
| Booking completion rate (start → paid) | >70% |
| Avg. time to book | <90 seconds |
| Cart/booking abandonment | <30% |
| 30-day repeat booking rate | >35% |
| Average rating | >4.5 |
| App rating | >4.4 |
| NPS | >50 |
| Support tickets per 100 bookings | <5 |

## 11. Dependencies

- Backend APIs: auth, catalog, availability, booking, payments, orders, notifications
- Payment gateway (Razorpay/Cashfree/PayU)
- SMS/WhatsApp provider; maps/geocoding provider
- Professional dashboard supplying availability, services, portfolios
- Admin dashboard for catalog, pricing, coupons, disputes

## 12. Release Plan

| Phase | Scope |
|---|---|
| **Phase 1 (MVP)** | Auth, home, service listing/detail, professional profiles, booking flow, payments, bookings management, notifications, reviews |
| **Phase 2** | Product shopping unification, chat, group bookings, referrals, memberships |
| **Phase 3** | Personalization, instant booking, video consults, AI style suggestions |

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Professional no-shows/delays | Auto-reassign, ETA tracking, penalties, service guarantee |
| Inconsistent quality | Verification, training, rating thresholds |
| Low trust for at-home services | Background checks, OTP start, SOS, verified badges |
| Payment drop-offs | UPI-first, retries, pay-after-service option |
| Slow adoption of new UI | A/B test rollout, feedback loops, phased release |

## 14. Open Questions

1. Which platforms are priority: Android, iOS, web, or all at launch?
2. Which cities at launch?
3. Existing tech stack and design system to reuse?
4. Cancellation/refund policy details and convenience fee structure?
5. Will products ship from Glamgo warehouse or third-party vendors?
6. Is "pay after service" allowed for all services?
7. Existing user data/migration considerations for the redesign?