# Glamgo — UI/UX Design Specification (Customer App)

**Goal:** A beautiful, calm, trustworthy, beauty-first interface where booking takes seconds.
**Reference feel:** Urban Company's clarity + Nykaa/Sephora's visual richness. Mobile-first; responsive for web.

---

## 1. Design Principles

1. **Book in seconds** – Every screen has one obvious primary action.
2. **Show, don't tell** – Large beautiful imagery, portfolios, before/after.
3. **Trust at every step** – Verified badges, ratings, transparent prices, guarantees.
4. **No surprises** – Price and total always visible; no hidden fees.
5. **Browse first, sign in later** – Never block exploration with a login wall.
6. **Thumb-friendly** – Primary actions in the bottom 40% of the screen.
7. **Calm luxury** – Generous whitespace, soft colors, gentle motion.

---

## 2. Visual Identity

### 2.1 Color Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary | Rose Plum | `#B8336A` | Primary buttons, active states, key accents |
| Primary Dark | Deep Plum | `#7A1F4A` | Pressed states, headings on light |
| Primary Light | Blush | `#FCE7F0` | Tinted backgrounds, chips, selected cards |
| Secondary | Champagne Gold | `#C9A25B` | Premium badges, ratings, bridal highlights |
| Background | Soft Ivory | `#FFFBF8` | App background |
| Surface | White | `#FFFFFF` | Cards, sheets |
| Text Primary | Ink | `#1F1A1D` | Headings, body |
| Text Secondary | Mauve Grey | `#6E6369` | Captions, helper text |
| Border | Mist | `#EDE4E8` | Dividers, outlines |
| Success | Emerald | `#1E9E6A` | Confirmed, verified |
| Warning | Amber | `#E8A33D` | Alerts, pending |
| Error | Coral Red | `#D6455D` | Errors, destructive |

**Contrast:** Text on Primary uses white (ratio ≥ 4.5:1). Never use Gold for body text.

### 2.2 Typography

| Use | Font | Weight | Size (mobile) |
|---|---|---|---|
| Display / Hero | Playfair Display | 600 | 28–32 |
| H1 | Poppins | 600 | 22 |
| H2 | Poppins | 600 | 18 |
| H3 | Poppins | 500 | 16 |
| Body | Inter | 400 | 14–16 |
| Caption | Inter | 400 | 12 |
| Button | Poppins | 500 | 15 |
| Price | Poppins | 600 | 16 |

Line height 1.4–1.6. Supports Devanagari (Noto Sans Devanagari) and Kannada (Noto Sans Kannada).

### 2.3 Spacing, Radius, Elevation

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48
- **Screen padding:** 16px
- **Radius:** Buttons 12, Cards 16, Bottom sheets 24 (top), Chips 999 (pill), Images 12
- **Shadows:** Cards `0 2px 12px rgba(31,26,29,0.06)`; Sheets `0 -4px 24px rgba(31,26,29,0.12)`
- **Touch targets:** minimum 44×44px

### 2.4 Iconography & Imagery

- Rounded 2px-stroke line icons (Lucide / Phosphor style), filled when active
- Photography: natural light, diverse skin tones and hair types, real professionals, warm tones
- Service thumbnails: 4:3; portfolio: 1:1 and 4:5; banners: 16:9
- Always include alt text

### 2.5 Motion

- Duration 150–300ms, ease-out
- Bottom sheets slide up; cards fade/scale 0.98 on press
- Skeleton loaders instead of spinners
- Subtle confetti or checkmark animation on booking confirmed
- Respect "reduce motion" setting

---

## 3. Core Components

| Component | Spec |
|---|---|
| **Primary Button** | Full-width, 52px height, Rose Plum, white text, radius 12; disabled = 40% opacity |
| **Secondary Button** | Outlined plum, transparent bg |
| **Text Button** | Plum text, no border |
| **Search Bar** | 48px, pill-shaped, search icon, rotating placeholder ("Search 'bridal makeup'") |
| **Category Tile** | 72px circular icon on Blush bg + label below (2 lines max) |
| **Service Card** | Image left/top, name, ⭐ rating (count), duration, price, **Add** button (turns into − 1 + stepper) |
| **Professional Card** | Avatar, name, verified ✓, specialization, ⭐ rating, starting price, next available slot |
| **Chip** | Pill; selected = plum fill + white text; unselected = white + border |
| **Date Strip** | Horizontal scroll, 7+ days, today preselected |
| **Slot Chip** | Time label; disabled = grey with strikethrough; popular slots get a small tag |
| **Bottom Sheet** | Handle bar, max 85% height, dismissible |
| **Sticky Cart Bar** | "2 items • ₹1,498" + "View Cart →" docked above bottom nav |
| **Toast / Snackbar** | Bottom, 3s, with Undo where applicable |
| **Rating Stars** | Gold fill, tappable 36px stars in review flow |
| **Badge** | Verified (green), Bestseller (gold), Offer (blush with plum text) |
| **Bottom Navigation** | 5 tabs: Home, Categories, Bookings, Shop, Profile |

---

## 4. Information Architecture

```
Splash
 └─ Onboarding (skippable) → Sign In / Continue as Guest
     └─ Main App
         ├─ Home
         │   ├─ Search → Results (Services | Professionals | Products)
         │   ├─ Category → Service List → Service Detail → Booking Flow
         │   ├─ Professional Profile
         │   └─ Offers
         ├─ Categories (full grid)
         ├─ Bookings (Upcoming | Completed | Cancelled) → Booking Detail
         ├─ Shop (Products) → Product Detail → Cart → Checkout
         └─ Profile
             ├─ Edit Profile, Addresses, Payment Methods
             ├─ Favorites, Offers & Coupons
             ├─ Help & Support, Settings (language, notifications)
             └─ Logout / Delete Account
```

---

## 5. Screen-by-Screen Specification

### 5.1 Splash
- Ivory background, centered Glamgo logo with soft fade-in; ≤1.5s.

### 5.2 Onboarding (3 slides, skippable)
1. "Beauty experts, at your doorstep" – hero image of a professional at home service
2. "Transparent prices. Verified pros." – trust illustration
3. "Book in under a minute" – booking UI preview

- Dot indicators, **Skip** top-right, **Next / Get Started** bottom.

### 5.3 Sign In / Sign Up ⭐ (key screen)

**Layout (top to bottom):**
- Top ~35%: soft gradient (Blush → Ivory) with hero beauty imagery and logo
- Heading: *"Welcome to Glamgo"* (Playfair Display)
- Subtext: *"Sign in to book beauty services in seconds"*
- **Phone input:** `+91` country code chip + 10-digit field (numeric keyboard, auto-focus)
- **Primary CTA:** "Continue" (disabled until valid 10 digits)
- Divider: "or"
- **Social buttons:** Continue with Google, Continue with Apple (iOS)
- **Secondary link:** "Browse as guest →"
- Footer (small): "By continuing, you agree to our Terms & Privacy Policy" (links)

**States:**
- Focus: plum border; error: coral border + inline message ("Enter a valid 10-digit number")
- Loading: button shows spinner, inputs disabled

**Key UX decisions:**
- No password. OTP only → fastest, fewest errors.
- No separate Sign Up screen; the same flow handles both (new users get a short profile step).
- Keyboard never covers the CTA (screen scrolls/resizes).

### 5.4 OTP Verification
- Heading: "Verify your number", subtext shows masked number with **Edit** link
- 6 separate OTP boxes (auto-advance, auto-fill via SMS retriever, paste support)
- Timer: "Resend OTP in 0:30" → becomes "Resend OTP" link
- Auto-submits on 6th digit; wrong OTP = shake animation + coral message
- Option: "Get OTP on WhatsApp"

### 5.5 Profile Setup (new users only)
- Fields: Full name (required), Email (optional), "Preferred professional gender" (optional chips: Female / Male / No preference)
- CTA: "Start Exploring"; Skip allowed for optional fields only
- Followed by location permission prompt: custom pre-permission screen explaining why, then system dialog; fallback "Enter pincode / search area"

### 5.6 Home
1. **Header:** location pill ("📍 Indiranagar, Bengaluru ▾"), notification bell
2. **Search bar** (sticky on scroll)
3. **Offer banner carousel** (16:9, auto-scroll 4s, dots)
4. **Category grid:** 2 rows × 4 (Makeup, Hair, Nails, Skin, Waxing, Bridal, Spa, Men) + "See all"
5. **Book Again** rail (returning users)
6. **Occasion chips:** Wedding • Party • Festive • Photoshoot • Date Night
7. **Most Booked Services** (horizontal cards)
8. **Top-Rated Professionals Near You** (horizontal cards)
9. **Bridal Packages** (large cards with gold accent)
10. **Shop Beauty Products** rail
11. **Trust strip:** "Verified Professionals • Safe & Hygienic • Service Guarantee"
12. **Bottom nav** + sticky cart bar when cart has items

### 5.7 Search
- On focus: recent searches, trending searches, category shortcuts
- Live suggestions as user types (typo tolerant)
- Results in tabs: **Services | Professionals | Products**
- Empty state: friendly illustration + "Try 'facial', 'bridal makeup', 'haircut'"

### 5.8 Category / Service Listing
- Top: category title, sub-category chips (horizontal scroll)
- Filter row (sticky): Sort, Price, Rating, At Home / At Salon, Gender, Available Today
- Service cards in single column (image 4:3, name, duration, rating, price, **Add**)
- Package cards highlighted with "Save ₹300" tag
- Sticky cart bar at the bottom

### 5.9 Service Detail
- Image carousel (hero)
- Title, ⭐ rating (count), duration, price (strike-through MRP if discounted)
- "What's included" checklist; "Products used"; before/after slider
- Add-ons (checkbox cards with price)
- FAQs (accordion), precautions, cancellation policy summary
- Reviews preview → See all
- Sticky bottom: price + **Add to Cart / Book Now**

### 5.10 Professional Profile
- Header: cover/portfolio image, avatar, name, ✓ Verified, specialization, years of experience, ⭐ 4.8 (320 reviews), jobs completed
- Tabs: **Portfolio | Services | Reviews | About**
- Portfolio: masonry grid, tap for full-screen viewer, filter chips (Bridal, Party, Natural)
- Services: list with prices and **Add**
- Reviews: rating breakdown bars, filter by photo/rating, verified-booking tag
- Sticky bottom: **Check Availability** / **Book Now**; ♡ favorite and share in top bar

### 5.11 Booking Flow ⭐ (4 steps, progress bar at top)

**Step 1 – Services (Cart review)**
- List of selected services with stepper (− 1 +), add-ons, remove
- "Frequently added together" suggestions
- Sticky bar: total + **Continue**

**Step 2 – Date, Time & Professional**
- Date strip (next 14 days)
- Time slots grouped: Morning / Afternoon / Evening (chips)
- Professional selection: default card "✨ Best available professional (recommended)"; link "Choose a professional" opens sheet with list
- Same-day slots flagged with "Fast" tag
- Sticky bar: **Continue**

**Step 3 – Address & Details**
- Saved address cards (Home, Work, + Add new) with radio select
- Add new: map pin, auto-detect, house/flat, landmark, save-as chips
- Optional note: "Instructions for professional" (e.g., parking, floor)
- "Booking for someone else?" toggle → name + phone fields
- Sticky bar: **Continue**

**Step 4 – Review & Pay**
- Summary card: services, date/time, address, professional
- Coupon row: "Apply coupon" → sheet with available offers; instant applied state "You saved ₹150 🎉"
- **Price breakdown:** Item total, Add-ons, Discount, Taxes, Convenience fee, **Total**
- Payment options: UPI (apps shown as icons) • Cards • Net banking • Wallets • Pay after service
- Cancellation policy (collapsed, link to expand)
- Sticky bar: total + **Confirm & Pay ₹X**

**Rules:** Back never loses progress; edits possible via "Edit" on summary; a single screen error never resets earlier steps.

### 5.12 Booking Confirmed
- Animated green checkmark, "Booking Confirmed! 🎉"
- Booking ID, date/time, address, professional (or "assigned 2 hours before")
- Buttons: **View Booking**, Add to Calendar, Share
- "What to expect" tips (prepare area, wash hair, etc.)
- Cross-sell: "Complete your look" with products

### 5.13 My Bookings
- Tabs: Upcoming | Completed | Cancelled
- Booking card: service, date/time, status chip, professional avatar, **View / Reschedule / Rebook**
- Empty state: illustration + "No bookings yet. Explore services"

### 5.14 Booking Detail
- Status timeline: Confirmed → Professional assigned → On the way → In progress → Completed
- Live ETA card with call/chat (masked number)
- **Service start OTP** displayed when pro is on the way
- Itemized bill, payment status, invoice download
- Actions: Reschedule, Cancel (refund amount shown before confirming), Get Help
- Post-service: Rate & Review, Tip, Rebook

### 5.15 Reviews Flow
- Bottom sheet right after completion: 5 stars → quick tags (On time, Skilled, Hygienic, Friendly) → optional text/photo → Submit
- Skippable; reminder notification after 24h

### 5.16 Shop (Products)
- Search + category chips (Skincare, Makeup, Haircare, Tools, Fragrance)
- 2-column product grid: image, brand, name, rating, price, quick Add
- Product detail: gallery, size/shade selector, description, ingredients, reviews, delivery estimate (pincode check)
- Cart → Checkout (address, delivery, payment) → Order tracking

### 5.17 Profile
- Header: avatar, name, phone, Edit
- List: My Bookings, My Orders, Saved Addresses, Payment Methods, Favorites, Offers & Coupons, Notifications, Language, Help & Support, About, Logout
- Delete Account in Settings (with confirmation)

### 5.18 Help & Support
- FAQs by topic, "Chat with us", "Call us", "Report an issue with booking"
- Service guarantee explainer

---

## 6. Interaction & UX Patterns

| Situation | Pattern |
|---|---|
| Loading | Skeleton screens matching final layout |
| Empty states | Friendly illustration + one clear CTA |
| Errors | Inline, plain language, with a fix ("Slot just got booked. Pick another →") |
| Network failure | Banner "You're offline" + retry; cached content still viewable |
| Destructive actions | Confirmation sheet with clear consequence |
| Success | Brief animation + toast |
| Pull to refresh | On Home, Bookings, Orders |
| Guest checkout trigger | At "Confirm" (Step 3→4): login sheet, cart and selections preserved |
| Price changes | Highlight changed values; never silently update totals |

---

## 7. Trust & Conversion Elements

- ✓ **Verified Professional** badge (background-checked, trained)
- ⭐ Ratings shown on every card
- 🛡 **Glamgo Service Guarantee** (re-do/refund)
- Transparent price breakdown before payment
- Hygiene promise (sanitized tools, sealed products)
- "X bookings this week" social proof (only real data)
- Easy cancellation/reschedule policy shown upfront
- Secure payment badges at checkout

---

## 8. Accessibility

- WCAG 2.1 AA: contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components
- Minimum touch target 44×44px; 8px spacing between targets
- Dynamic type support up to 200% without layout breaking
- Screen-reader labels on icons, images, and form fields; logical focus order
- Never rely on color alone (use icons/text for status)
- Support reduce-motion and dark-mode readiness (dark theme: Plum-tinted `#1A1216` background)
- Form errors announced to assistive tech

---

## 9. Responsive Behavior (Web)

| Breakpoint | Layout |
|---|---|
| < 600px | Mobile layout, bottom nav, sticky bars |
| 600–1024px | 2-column grids, side sheets instead of bottom sheets |
| > 1024px | Top navigation bar, 3–4 column grids, booking flow with right-hand sticky summary panel |

---

## 10. Localization

- Languages: English, Hindi, Kannada (expandable); in-app switcher
- Allow 30–40% text expansion in layouts
- Currency ₹ with Indian number formatting (₹1,24,500)
- Date format: DD MMM YYYY; 12-hour time

---

## 11. Microcopy Guidelines

- Friendly, warm, concise; avoid jargon
- Buttons start with verbs: "Book now", "Continue", "Confirm & Pay"
- Errors say what happened and how to fix it
- Examples: "Looking good! Your booking is confirmed." • "Hmm, that slot just filled up. Try another time."

---

## 12. Analytics Events to Track

`app_open`, `signin_started`, `otp_requested`, `otp_verified`, `guest_browse`, `search_performed`, `category_viewed`, `service_viewed`, `professional_viewed`, `add_to_cart`, `booking_step_viewed (1–4)`, `slot_selected`, `coupon_applied`, `payment_initiated`, `payment_success/failed`, `booking_confirmed`, `booking_cancelled`, `rebook_tapped`, `review_submitted`

Use these to find drop-offs in the booking funnel.

---

## 13. Design Handoff Checklist

- [ ] Design tokens (colors, type, spacing) defined in Figma variables
- [ ] Component library with states (default, pressed, disabled, error, loading)
- [ ] All screens in light mode; dark mode planned
- [ ] Empty, loading, and error states for each screen
- [ ] Prototype for the primary flow: Sign in → Browse → Book → Pay → Confirm
- [ ] Usability test with 5–8 target users before development
- [ ] Accessibility audit passed
- [ ] Redline specs and asset export (SVG icons, WebP images)

---

## 14. Suggested Rollout Approach (since the product already exists)

1. **Audit** the current UI: record where users drop off (funnel analytics).
2. **Design system first:** apply new colors, typography, and components.
3. **Redesign in order of impact:** Sign-in → Home → Booking flow → Bookings → Profile → Shop.
4. **A/B test** the new booking flow vs. the old one.
5. **Gradual rollout** (10% → 50% → 100%) while monitoring conversion and errors.