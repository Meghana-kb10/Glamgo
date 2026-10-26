# UI/UX & Motion Design Specification: Glamgo

## 1. Design Philosophy & Aesthetic Direction
Glamgo’s visual identity blends **Editorial Luxury** with **Tactile Digital Physics**. Because beauty, bridal styling, and cosmetics are deeply visual and sensory categories, the interface avoids rigid, static layouts in favor of fluid spatial continuity, glassmorphic depth, and responsive spring-driven micro-interactions.

- **Aesthetic Archetype:** High-Fashion Editorial meets Spatial Commerce (inspired by Sephora, Airbnb, and Apple Human Interface Guidelines).
- **Surface & Depth Language:** Warm alabaster/ivory surfaces in Light Mode (`#FAF7F5`) and rich obsidian/velvet plum surfaces in Dark Mode (`#0E0C0D`), paired with frosted acrylic overlays (`backdrop-filter: blur(20px)`).
- **Physics-First Motion:** Every interaction is governed by Hooke’s law spring dynamics rather than linear durations, making buttons, drawers, and galleries feel weighted, natural, and responsive to user velocity.

---

## 2. Visual Design Tokens

### 2.1 Color Palette
| Token | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FAF7F5` | `#0E0C0D` | Primary app background (warm skin-flattering neutral) |
| `--bg-surface-elevated` | `#FFFFFF` | `#181416` | Artist cards, product tiles, floating sheets |
| `--bg-glass` | `rgba(255,255,255,0.78)` | `rgba(24,20,22,0.78)` | Sticky headers, hybrid cart drawer, slot lock bar |
| `--brand-primary` | `#C84B6B` | `#E06384` | Velvet Rose — Primary CTAs, active slot badges |
| `--brand-secondary` | `#D4AF37` | `#E5C158` | Champagne Gold — Verified Pro badges, Bridal tier accents |
| `--text-primary` | `#161214` | `#F7F3F5` | High-contrast editorial headings & body copy |
| `--text-muted` | `#6E6568` | `#A3989C` | Metadata, distances, secondary labels |
| `--status-success` | `#1F8A5B` | `#34B37A` | Confirmed booking, verified hygiene badge |
| `--status-warning` | `#D97706` | `#F59E0B` | Slot lock countdown timer ($< 2\text{ mins}$ remaining) |
| `--status-danger` | `#DC2626` | `#EF4444` | Cancelled booking, low stock alert, error shake |

### 2.2 Typography Scale
- **Display / Editorial Headings:** *Cormorant Garamond* or *Playfair Display* (Semi-Bold, $-0.02\text{em}$ tracking) for Bridal Lookbooks, Artist Names, and Hero Campaigns.
- **UI & Functional Sans:** *Plus Jakarta Sans* or *Inter* (Regular, Medium, Semi-Bold) for slot pickers, pricing tables, shade matrices, and checkout forms.
- **Monospace / Numeric:** *JetBrains Mono* (`font-variant-numeric: tabular-nums`) for countdown timers, OTP inputs, and escrow ledgers so digits never jitter during live updates.

---

## 3. Physics & Motion Token System
All animations in Glamgo use **Framer Motion** (Web) and **React Native Reanimated 3** (Mobile) driven by spring physics:
$$F = -k \cdot x - c \cdot v$$
where $k$ is stiffness, $c$ is damping, and $m$ is mass.

| Motion Token | Spring Config / Bezier | Perceived Feel & Primary Use Case |
| :--- | :--- | :--- |
| `--spring-snappy` | `{ stiffness: 420, damping: 28, mass: 0.8 }` | Micro-interactions, button presses, toggle shifts, shade swatch selection |
| `--spring-fluid` | `{ stiffness: 280, damping: 26, mass: 1.0 }` | Shared element transitions, expanding artist cards, drawer flyouts |
| `--spring-bouncy` | `{ stiffness: 500, damping: 18, mass: 0.9 }` | Wishlist heart pop, booking confirmed checkmark, badge counters |
| `--spring-gentle` | `{ stiffness: 160, damping: 24, mass: 1.2 }` | Scroll-triggered reveals, staggered hero choreography, parallax settling |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | CSS-only fallback for hover lifts, focus rings, and opacity fades |

---

## 4. The 5 Pillars of Glamgo Motion Architecture

### 4.1 Pillar 1: Feedback & State Interactions
1. **Micro-Interactions:**
   - **Wishlist & Portfolio Save:** Tapping the heart icon on a makeup artist’s bridal look triggers `--spring-bouncy`, scaling from $1.0 \rightarrow 1.35 \rightarrow 1.0$ with a radial burst of champagne-gold particles and an SVG path fill.
   - **OTP Verification & Booking Confirmation:** Entering the 6th digit of the Start/Complete OTP morphs the input boxes into a unified green pill, drawing a celebratory SVG checkmark (`stroke-dashoffset` animation over $350\text{ ms}$) accompanied by a subtle haptic tap (`Haptics.notificationAsync(Success)`).
   - **Add-to-Hybrid-Cart Fly-In:** Clicking "Add Shade to Cart" spawns a miniature thumbnail clone that arcs along a quadratic Bézier curve into the top-right Hybrid Cart icon, causing the cart badge counter to roll vertically like an odometer.
2. **Hover & Focus States:**
   - **Artist & Product Cards:** On pointer hover, cards elevate by `translateY(-4px)` with a soft ambient rose-tinted shadow (`0 16px 32px -8px rgba(200, 75, 107, 0.14)`), while the cover image subtly scales to $1.03\times$ inside its `overflow-hidden` frame.
   - **Magnetic Primary CTAs:** Primary booking buttons ("Lock Slot & Pay Deposit") subtly track cursor proximity within a $12\text{px}$ radius and feature a specular sheen sweep across the button surface.
3. **Active Press States:**
   - All interactive buttons, time-slot pills, and cosmetic shade swatches apply `whileTap={{ scale: 0.96 }}` (or `0.94` on mobile touch), mimicking physical resistance and immediate tactile acknowledgment.
4. **Toggle Shifts:**
   - **Service Mode Switcher (`At-Venue` vs. `In-Studio`) & Theme Toggle:** Built with a shared `layoutId="activePill"` sliding indicator that glides smoothly behind the active label while morphing its width to fit the text.
   - **Services $\leftrightarrow$ Shop Mode Switch:** Morphs the header search bar placeholder and filter chips seamlessly without unmounting the navigation shell.

---

### 4.2 Pillar 2: Navigation & Structural Transitions
1. **Page & Screen Transitions:**
   - **Hierarchical Spatial Zoom:** Navigating from Category Discovery $\rightarrow$ Artist Profile uses a forward depth transition (`opacity: 0 -> 1`, `scale: 0.98 -> 1.0`), while step-by-step Booking Wizard screens slide horizontally along the X-axis (`x: 24px -> 0`) synchronized with user direction.
2. **Shared Element Transitions (`layoutId`):**
   - **Portfolio & Product Continuity:** Clicking an artist's card in the search grid or a lipstick SKU in the catalog keeps the hero image anchored on screen (`layoutId="pro-hero-${id}"`), smoothly interpolating its bounding box, border-radius ($16\text{px} \rightarrow 0\text{px}$), and aspect ratio into the full profile header.
3. **Expanding Cards:**
   - **Bridal Package Quick-View:** Tapping "Compare Packages" on a listing card expands the card inline or into a centered spatial sheet without losing scroll context, revealing tiered inclusions (HD vs. Airbrush, hairstyling, draping, lashes) with smooth height auto-animation.
4. **Drawer & Modal Flyouts:**
   - **Hybrid Cart & Filter Drawers:** Slide in from the right edge (`x: "100%" -> "0%"`) using `--spring-fluid` while the background canvas scales down slightly (`scale: 0.97`, `borderRadius: 16px`) to create iOS-style layered depth.
   - **Mobile Bottom Sheets:** Support velocity-aware flick-to-dismiss and multi-detent snap points ($45\%$ peek for slot selection, $92\%$ full expansion for address & add-on customization).

---

### 4.3 Pillar 3: Progress & System Status
1. **Skeleton Loading Screens:**
   - Custom-tailored structural skeletons mirror the exact geometry of Artist Cards (circular avatar + 3-photo masonry strip + price pill) and Shade Matrices.
   - Uses a warm champagne shimmer gradient (`linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)`) sweeping at $1.4\text{s}$ intervals rather than harsh grey flashes.
2. **Progress Trackers:**
   - **Multi-Step Booking Stepper:** A continuous liquid progress bar at the top of the booking wizard smoothly fills across `1. Package` $\rightarrow$ `2. Slot & Venue` $\rightarrow$ `3. Deposit Escrow`.
   - **Live Slot-Lock Countdown Ring:** Once a 10-minute Redis slot lock is acquired, a compact radial SVG ring (`stroke-dasharray`) drains smoothly in the sticky checkout bar, shifting from Champagne Gold to Amber at $< 2\text{ minutes}$ and pulsing gently at $< 30\text{ seconds}$.
   - **Live Artist En-Route Tracker:** A real-time stepped timeline with an animated pulse beacon showing the makeup artist’s live travel progress toward the wedding/event venue.
3. **Pull-to-Refresh (Mobile & PWA):**
   - Pulling down on the Bookings or Discovery feed stretches an elastic SVG lotus/sparkle emblem with rubber-band physics; once pulled past the $72\text{px}$ threshold, it triggers a light haptic tick and spins smoothly until fresh availability slots hydrate.

---

### 4.4 Pillar 4: Attention Guidance & Directing Focus
1. **Explanatory Choreography (Staggered Entrances):**
   - On initial load of an Artist Profile or Seasonal Bridal Lookbook, elements enter in a choreographed cascade (`staggerChildren: 0.06s`):
     1. Hero Portfolio Gallery ($0\text{ms}$)
     2. Artist Name, Verified KYC Badge & Hygiene Rating ($60\text{ms}$)
     3. "Brands Used" Trust Pills ($120\text{ms}$)
     4. Sticky "Check Availability" CTA Bar ($180\text{ms}$)
2. **Dynamic Hints:**
   - **Validation & Empty Fields:** Attempting to lock a slot without selecting an event venue or shade triggers a damped horizontal harmonic shake (`x: [0, -8, 8, -5, 5, 0]` over $380\text{ms}$) and highlights the missing field border in `--status-danger`.
   - **Shoppable Look Hotspots:** Portfolio photos containing tagged cosmetic products display subtle breathing pearl pins (`scale: [1, 1.2, 1]`, infinite $2.4\text{s}$ loop). Tapping a pin reveals a floating product mini-card with 1-click "Add to Cart".
3. **Scroll-Triggered Reveals:**
   - As users scroll through long-form Bridal Packages, Ingredient Breakdowns, and Verified Customer Review galleries, cards fade and slide upward (`y: 20px -> 0`, `opacity: 0 -> 1`) when crossing $15\%$ of the viewport (`IntersectionObserver` / `whileInView`), triggering once per session to prevent scroll fatigue.

---

### 4.5 Pillar 5: Spatial Depth & Contextual Motion
1. **Parallax Scrolling:**
   - **Artist Profile & Lookbook Headers:** Scrolling down moves the background cover portrait at $0.4\times$ scroll speed while gently increasing blur (`0px -> 8px`), allowing the foreground Service Menu sheet to glide cleanly over the image.
   - ** Sticky Compact Header:** Once the user scrolls past the artist's bio, the header condenses into a frosted glass bar displaying the artist’s avatar, rating, and a persistent "Book Now" button.
2. **Morphing Shapes (SVG & Layout Morphing):**
   - **CTA State Morphing:** The primary `"Lock Slot"` button morphs seamlessly into a circular spinning loader during the Redis lock API call, then expands into a `"Slot Locked • Proceed to Pay (09:59)"` pill without layout shift.
   - **Video Reel Controls:** Play/Pause and Mute/Unmute icons on artist portfolio reels morph their SVG paths smoothly using Flubber/SVG path interpolation.
   - **Floating Action Button (FAB) to Chat Window:** The bottom-right "Ask Artist / Concierge" button morphs directly from a $56\text{px}$ circle into a $380 \times 520\text{px}$ consultation drawer.
3. **Draggable & Physics-Based Motion:**
   - **Interactive Before/After Transformation Slider:** Customers can drag a tactile vertical divider across bridal/makeover photos with momentum and edge rubber-banding to inspect real, unedited skin texture and artistry.
   - **Calendar Time-Block Manipulation (Partner Portal):** Makeup artists and salon managers can drag, stretch, and drop appointment blocks on their schedule grid with snap-to-15-minute-interval physics and collision bounce-back if dragged over an already booked slot.
   - **Swipeable Shade Carousel:** Swiping through foundation or lipstick swatches uses velocity-based momentum scrolling with magnetic snap-to-center alignment, dynamically updating the model preview image in real time.

---

## 5. Key Screen UX Blueprints & Component Specs

### 5.1 Split-Screen Geo-Discovery (`/services/[city]/[category]`)
- **Left Pane ($60\%$ width on Desktop):** Filter ribbon + 2-column responsive grid of Artist Cards. Hovering over an Artist Card highlights and bounces their corresponding price pin on the map.
- **Right Pane ($40\%$ width, sticky):** Interactive Mapbox canvas with custom frosted-glass price pills (`₹15,000`) that cluster smoothly when zooming out and expand into mini-preview cards when clicked.

### 5.2 The "Shop the Look" Portfolio Lightbox
- **Interaction Flow:**
  1. User clicks a bridal portrait in the artist’s masonry gallery.
  2. Shared element transition expands the photo full-screen with a dark blurred backdrop.
  3. Bottom drawer displays the exact cosmetic SKUs used by the artist (e.g., *MAC Studio Fix Fluid NC42*, *Huda Beauty Power Bullet*) with live stock status and a `"Buy Complete Look"` bundle button.

### 5.3 Unified Hybrid Checkout (`/checkout`)
- **Visual Hierarchy:**
  - **Top Banner:** Glassmorphic Slot-Lock Banner with live radial countdown ring and venue summary.
  - **Left Column:** Split into **Card A: Scheduled Beauty Appointment** (Date, Time, Artist, Deposit vs. Balance Payable at Venue) and **Card B: Retail Beauty Delivery** (Product items, shade swatches, estimated delivery date).
  - **Right Column:** Unified Payment Summary showing exact Escrow Deposit due today, Product Subtotal, Taxes, and 1-Click UPI / Card payment button.

---

## 6. Accessibility & Reduced Motion Guardrails (`prefers-reduced-motion`)
Modern motion must never compromise usability, battery life, or vestibular comfort.
- **Automatic Motion Adaptation:** When `prefers-reduced-motion: reduce` is detected at the OS level:
  - All spatial `x/y` translations, parallax effects, and harmonic shakes are replaced with instant cross-fades (`opacity: 0 -> 1` over $150\text{ms}$).
  - Shared element layout morphs (`layoutId`) are disabled in favor of standard route transitions.
  - Infinite pulsing hotspots become static high-contrast pins.
- **60/120 FPS Hardware Acceleration Mandate:**
  - Only `transform` (`translate3d`, `scale`, `rotate`) and `opacity` properties are animated continuously; layout-thrashing properties (`top`, `left`, `width`, `height`) are strictly forbidden outside FLIP/projection animations.