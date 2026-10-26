# Backend Architecture Specification: Glamgo

## 1. Architectural Pattern & Technology Stack
Glamgo employs a **Modular Monolith** architecture designed with strict domain boundaries (DDD) that can be independently extracted into microservices as traffic scales.

- **Runtime & Framework:** Node.js (v22 LTS) with **NestJS** (TypeScript) for strict dependency injection, modular encapsulation, and decorators.
- **API Protocols:**
  - RESTful OpenAPI 3.1 (Public & Mobile/Web client consumption)
  - WebSockets / Socket.io (Real-time booking status, live artist location, instant notifications)
  - Webhook Receivers (Payment gateways, 3PL shipping updates, KYC verification callbacks)
- **Primary Database:** PostgreSQL 16 with **PostGIS** extension (for geo-spatial radius and travel matrix queries).
- **Caching & Distributed Locks:** Redis 7 Cluster (Slot locking, rate limiting, session blacklist, BullMQ job queues).
- **Search & Discovery Engine:** Meilisearch / Elasticsearch (Typo-tolerant product catalog search, ingredient filtering, and geo-sorted professional discovery).
- **Object Storage & Media Processing:** AWS S3 + CloudFront CDN + AWS Lambda (Automated image compression, watermarking, and video transcoding).
- **Payment & Escrow Infrastructure:** Razorpay Route / Stripe Connect (Split payments, escrow holding, automated vendor/professional payouts).

---

## 2. Domain Modules Breakdown

```text
src/
├── modules/
│   ├── iam/                  # Auth, RBAC, JWT rotation, OAuth2, KYC verification workflows
│   ├── professionals/        # Artist profiles, portfolios, service menus, geo-service polygons
│   ├── scheduling/           # Availability engine, slot locking, calendar sync, buffer calculation
│   ├── bookings/             # Booking state machine, OTP start/complete, cancellation policies
│   ├── catalog/              # E-commerce products, variants, shades, categories, B2B/B2C pricing
│   ├── inventory/            # Multi-warehouse stock reservation, atomic decrements, low-stock alerts
│   ├── orders/               # E-commerce checkout, split vendor sub-orders, 3PL courier webhooks
│   ├── payments/             # Gateway orchestration, escrow ledgers, commissions, payouts, refunds
│   ├── reviews/              # Verified booking/order reviews, media moderation, rating aggregation
│   └── notifications/        # Multi-channel dispatcher (FCM Push, WhatsApp Business, SMS, Email)
```

---

## 3. Core Engine Designs & Algorithms

### 3.1 Availability & Concurrency-Safe Slot Booking Engine
Preventing double-booking for high-demand makeup artists and stylists is critical.

1. **Slot Computation Formula:**
   Given a professional's working window $[W_{\text{start}}, W_{\text{end}}]$ on date $D$, existing confirmed bookings $B_i$, and requested service duration $T_{\text{service}}$ plus travel buffer $T_{\text{buffer}}$, a candidate slot $[S_{\text{start}}, S_{\text{end}}]$ where $S_{\text{end}} = S_{\text{start}} + T_{\text{service}} + T_{\text{buffer}}$ is valid if and only if:
   $$\forall i, \quad [S_{\text{start}}, S_{\text{end}}] \cap [B_{i,\text{start}}, B_{i,\text{end}}] = \emptyset$$
2. **Distributed Locking (Redis Redlock):**
   - When a customer proceeds to checkout for professional $P$ at interval $[S_{\text{start}}, S_{\text{end}}]$, the backend executes an atomic Lua script in Redis to check and set a lock key `lock:pro:{proId}:{date}` with a TTL of $600\text{ seconds}$.
   - simultaneously, a database row is inserted into `bookings` with status `LOCKED_PENDING_PAYMENT` protected by a PostgreSQL `EXCLUDE USING gist` range constraint on `(professional_id, tstzrange(start_time, end_time))`.
   - If payment succeeds within 10 minutes, the webhook transitions the status to `CONFIRMED`. If the TTL expires, a BullMQ delayed job transitions the row to `EXPIRED`.

### 3.2 Split Payment & Escrow Settlement Engine
Glamgo processes hybrid checkouts (e.g., a bridal makeup booking deposit + two lipsticks from different vendors).

1. **Checkout Calculation:**
   $$\text{Total Payable} = \sum \text{Service Deposits} + \sum (\text{Product Price} \times \text{Qty}) + \text{Shipping} + \text{Taxes} - \text{Discounts}$$
2. **Escrow Hold & Release Rules:**
   - **Services:** Customer pays $30\% - 100\%$ upfront. Funds are held in Glamgo's nodal/escrow account. When the professional arrives at the venue and enters the Customer's 6-digit **Start OTP**, the booking moves to `IN_PROGRESS`. Upon completion and **End OTP** (or 24 hours post-slot with no dispute), the payout job calculates:
     $$\text{Pro Payout} = \text{Gross Service Amount} - \text{Platform Commission} - \text{TDS/TCS}$$
   - **Products:** Vendor payout is triggered $T + 7\text{ days}$ after the 3PL webhook emits `DELIVERED` and the return window closes.

---

## 4. REST API Contract Specification (Key Endpoints)

### 4.1 Authentication & Onboarding (`/api/v1/auth` & `/api/v1/kyc`)
- `POST /api/v1/auth/otp/send` — Trigger SMS/WhatsApp OTP for passwordless login.
- `POST /api/v1/auth/otp/verify` — Exchange OTP for short-lived `accessToken` (15m) and HTTP-only `refreshToken` (30d).
- `POST /api/v1/kyc/submit` — Submit identity documents, certifications, and bank details for Professional/Vendor verification.

### 4.2 Service Discovery & Booking (`/api/v1/professionals` & `/api/v1/bookings`)
- `GET /api/v1/professionals/search`
  - *Query Params:* `lat`, `lng`, `radius_km`, `date`, `category_id`, `occasion`, `service_mode` (`AT_VENUE` | `IN_STUDIO`), `min_price`, `max_price`, `sort_by`.
- `GET /api/v1/professionals/:id/slots`
  - *Query Params:* `date`, `service_ids[]`, `venue_lat`, `venue_lng`.
  - *Returns:* Available start times and dynamically calculated travel fee.
- `POST /api/v1/bookings/lock` — Acquire 10-minute slot lock and generate payment order.
- `POST /api/v1/bookings/:id/verify-otp` — Verify `START` or `COMPLETE` service OTP by the professional.
- `POST /api/v1/bookings/:id/reschedule` — Request slot change subject to policy window.

### 4.3 E-Commerce & Catalog (`/api/v1/products` & `/api/v1/orders`)
- `GET /api/v1/products/search` — Faceted search by category, brand, skin type, shade, and B2B/B2C visibility.
- `POST /api/v1/cart/checkout` — Unified checkout creating payment intent for both locked bookings and product sub-orders.
- `POST /api/v1/vendor/products/bulk` — Bulk SKU creation/update for vendors.
- `POST /api/v1/webhooks/logistics` — 3PL shipment status callback (`PICKED_UP`, `IN_TRANSIT`, `DELIVERED`, `RTO`).

---

## 5. Asynchronous Event-Driven Workflows (BullMQ)
- **`booking.slot_lock_expired`:** Releases temporary slot locks and notifies users of abandoned checkouts.
- **`booking.reminder_dispatcher`:** Sends automated WhatsApp and Push notifications at $T - 24\text{h}$ and $T - 2\text{h}$ before appointment time.
- **`media.portfolio_processor`:** Scans uploaded portfolio photos via AWS Rekognition (NSFW moderation), generates WebP thumbnails, and indexes visual tags.
- **`settlement.payout_runner`:** Nightly cron worker that aggregates eligible escrow balances and triggers bank transfers via payment gateway payouts API.

---

## 6. Security, Rate Limiting & Observability
- **RBAC & Ownership Guards:** Fine-grained NestJS Guards (`@Roles('CUSTOMER', 'PRO', 'VENDOR', 'ADMIN')`) and resource ownership policies ensuring vendors/professionals can only mutate their own catalogs/calendars.
- **Rate Limiting:**
  - Public search APIs: $100\text{ req/min/IP}$
  - OTP & Auth endpoints: $5\text{ req/10min/IP}$
  - Booking Lock endpoint: $10\text{ req/min/User}$ (prevents malicious calendar hoarding)
- **Observability:** OpenTelemetry tracing exported to Grafana/Prometheus, structured JSON logging (Pino), and Sentry error tracking.