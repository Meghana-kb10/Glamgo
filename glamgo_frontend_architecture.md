# Frontend Architecture Specification: Glamgo

## 1. Tech Stack & Ecosystem
To support high SEO discoverability for service marketplaces alongside complex dashboard interactivity for professionals, vendors, and admins, Glamgo utilizes a modern, type-safe monorepo architecture.

- **Monorepo Tooling:** Turborepo + pnpm workspaces
- **Web Framework:** Next.js 15 (App Router, React 19, Server Components & Server Actions)
- **Mobile Framework:** React Native (Expo SDK 52) sharing core business logic, API hooks, and validation schemas with Web
- **Language:** TypeScript 5.x (Strict mode)
- **Styling & Design System:** Tailwind CSS + shadcn/ui (Radix UI primitives) + Framer Motion for micro-interactions
- **State Management:**
  - *Server State & Caching:* TanStack Query v5
  - *Client State (Cart, Booking Wizard, Filters):* Zustand (with `persist` middleware)
- **Forms & Validation:** React Hook Form + Zod (shared schemas with Backend)
- **Maps & Geo-Location:** Mapbox GL JS / Google Maps Places API
- **Media Handling:** Cloudinary / AWS CloudFront loader with blurhash placeholders and Uppy for multi-part portfolio uploads

---

## 2. Monorepo Directory Structure

```text
glamgo-frontend/
├── apps/
│   ├── web-marketplace/          # Customer-facing SSR/ISR Web App (Services + Shop)
│   ├── portal-partner/           # Unified SPA/SSR Dashboard for Professionals & Vendors
│   ├── portal-admin/             # Internal Admin & Operations Dashboard
│   └── mobile-app/               # React Native Expo App (Customer + Pro Companion)
├── packages/
│   ├── ui/                       # Shared Design System (Buttons, Modals, Calendar, Swatches)
│   ├── api-client/               # Auto-generated OpenAPI/tRPC hooks & Axios instances
│   ├── schemas/                  # Shared Zod schemas (Auth, Booking, SKU, Checkout)
│   ├── store/                    # Shared Zustand stores (useHybridCart, useGeoStore)
│   └── config/                   # Shared ESLint, TypeScript, and Tailwind configs
```

---

## 3. Application Routing & Page Architecture (`web-marketplace`)

| Route Path | Rendering Strategy | Description |
| :--- | :--- | :--- |
| `/` | ISR (Revalidate 300s) | Geo-personalized landing page, featured artists, trending products, occasion categories. |
| `/services/[city]/[category]` | SSR | SEO-optimized service discovery with split map/grid view and faceted filters. |
| `/pro/[slug]` | ISR + Client Hydration | Professional profile, portfolio masonry grid, verified reviews, service packages, live slot picker. |
| `/shop` | ISR | E-commerce storefront landing page with brand carousels, skin concern filters, and flash deals. |
| `/shop/product/[slug]` | ISR + CSR Inventory | Product detail page with shade selector, ingredient breakdown, and real-time stock indicator. |
| `/checkout` | CSR (Protected) | Unified hybrid checkout handling service slot lock countdowns, shipping address, and split payments. |
| `/account/bookings` | CSR (Protected) | Upcoming and past appointments, OTP verification display, reschedule modal, and chat drawer. |
| `/account/orders` | CSR (Protected) | E-commerce order tracking, invoice downloads, and return requests. |

---

## 4. Core UI Modules & Component Engineering

### 4.1 Discovery & Faceted Search Engine
- **URL-Synchronized Filter State:** Uses `nuqs` (Next.js URL query state manager) so all filters (`?lat=...&lng=...&date=2026-11-15&occasion=bridal&at_venue=true&min_rating=4.5`) are shareable and SSR-compatible.
- **Interactive Portfolio Lightbox:** Supports high-FPS pinch-to-zoom, Before/After slider comparisons, and tagged products used in the look (allowing 1-click "Add to Cart" from a makeup artist's portfolio photo).

### 4.2 Real-Time Slot Booking Wizard
- **Step 1 (Service & Add-ons):** Select primary package (e.g., *Bridal HD Makeup*) and dynamic add-ons (e.g., *Mother of the Bride Party Makeup*). Calculates total duration dynamically:
  $$\text{Total Duration} = \sum \text{Service Durations} + \text{Travel Buffer}$$
- **Step 2 (Date & Time Slot):** Queries available intervals from the backend, greying out booked slots and displaying peak-demand surcharges if applicable.
- **Step 3 (Venue & Slot Lock):** Captures venue address, calculates travel fee via distance matrix, and acquires a 10-minute temporary Redis lock with a visible countdown timer (`09:59`) in the sticky checkout header.

### 4.3 Partner Portal (`portal-partner`)
- **Role-Based Workspace Switcher:** Supports independent professionals, multi-staff salons, and product vendors.
- **Interactive Drag-and-Drop Calendar:** Built with FullCalendar / custom virtualized grid supporting Day, Week, and Bridal Season views, colour-coded by status (`PENDING_DEPOSIT`, `CONFIRMED`, `EN_ROUTE`, `COMPLETED`).
- **Bulk SKU & Shade Matrix Editor:** Spreadsheet-like editable data table (TanStack Table v8) allowing vendors to update stock levels, MRP, discounted prices, and shade hex codes inline.

---

## 5. State Management & Data Fetching Patterns

### 5.1 Hybrid Cart Store (`useHybridCart`)
Glamgo's cart uniquely handles two distinct payload types: **Time-Bound Service Bookings** and **Physical Inventory Items**.
- **Service Slice:** Stores `proId`, `slotStart`, `slotEnd`, `lockToken`, `lockExpiresAt`, `venueAddress`, `selectedPackages[]`, and `depositAmount`.
- **Product Slice:** Stores `items[{ variantId, quantity, vendorId, price }]` and `shippingAddress`.
- **Optimistic Updates:** Cart mutations immediately update the UI badge and drawer total while syncing with `/api/v1/cart` in the background.

### 5.2 Caching & Invalidation Matrix
- **Professional Profiles & Portfolios:** Stale time `5 minutes`, cached on CDN edge.
- **Availability Slots:** Stale time `0ms` (`refetchOnWindowFocus: true`) to prevent stale slot selection.
- **Product Inventory:** Stale time `30 seconds`, revalidated immediately upon adding to cart.

---

## 6. Performance, Accessibility & UX Standards
- **Core Web Vitals Targets:**
  - Largest Contentful Paint (LCP): $< 2.0\text{ s}$ (achieved via priority preloading of hero portfolio images and responsive `srcset`).
  - Interaction to Next Paint (INP): $< 150\text{ ms}$ (heavy filter updates wrapped in React `useTransition`).
  - Cumulative Layout Shift (CLS): $< 0.05$ (strict aspect-ratio containers for portfolio galleries and product cards).
- **Accessibility (WCAG 2.1 AA):**
  - Full keyboard navigation for calendar date/slot pickers and shade swatches.
  - ARIA live regions for slot lock countdown expiration alerts and cart updates.
- **Offline & Poor Network Resilience (Mobile App):**
  - Professionals working at remote wedding venues can view their daily schedule, client addresses, and trigger service start/end OTPs offline via SQLite/MMKV local persistence with background sync queues.