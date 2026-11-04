# Glamgo Design Tokens — Warm Cream & Ivory Visual System

## 1. Overview
The Glamgo customer experience uses a warm **Ivory and Cream** foundation paired with rich **Espresso** typography, **Taupe** secondary text, and our signature **Rose Plum** accent. This replaces the cold white/dark legacy palette with a calming, luxurious, beginner-friendly atelier aesthetic.

---

## 2. Token Dictionary

| Token | CSS Variable | Hex Value | Semantic Purpose |
|---|---|---|---|
| **Ivory** | `--bg` | `#FFFDF8` | Base canvas: page background, topbar, sidebar, modal backdrops |
| **Cream** | `--bg-alt` | `#F7F0E3` | Alternating sections, announcement bar, footer, soft feature banners |
| **Sand** | `--fill` | `#EFE4D0` | Chip backgrounds, selected pill fills, hover states, skeleton base |
| **Warm White** | `--card` | `#FFFEFB` | Surface containers: cards, modal sheets, popovers, form inputs |
| **Linen** | `--border` | `#E8DDCB` | Standard card dividers, subtle hair-line borders |
| **Linen Strong** | `--border-strong`| `#CDBFA8` | Prominent section dividers, card boundary accents |
| **Field Outline** | `--border-field` | `#8E7D6A` | Form field outlines (ensures $\ge 3:1$ WCAG AA non-text contrast) |
| **Espresso** | `--text` | `#2B2420` | Headings, primary body text, active icon strokes |
| **Taupe** | `--text-muted` | `#6F6258` | Secondary labels, timestamps, metadata, placeholder text |
| **Rose Plum** | `--accent` | `#B8336A` | Primary action buttons, active links, focus rings, selected badges |
| **Deep Plum** | `--accent-pressed` | `#7A1F4A` | Button hover/pressed states, high-contrast badges |
| **Accent Soft** | `--accent-soft` | `#F6E4EA` | Soft plum tint for badge containers, row selection, focus ring halo |
| **Champagne** | `--star` | `#C9A25B` | Customer rating stars only |
| **Success** | `--success` | `#1E7F5C` | Verification badges, confirmation checks, positive status |
| **Error** | `--error` | `#B3261E` | Validation errors, destructive actions, alert banners |
| **Warning** | `--warning` | `#A8620A` | Non-blocking notices, stock warnings, time-critical alerts |
| **Warning Text**| `--warning-text` | `#8C4D00` | Accessible warning text on warm cards ($\ge 4.5:1$) |

---

## 3. Shadows & Surface Elevations (Warm-Tinted)

Pure black shadows are prohibited. All shadows use an amber-tinted warm umber alpha: `rgba(80, 60, 40, alpha)`.

- **Warm Small**: `0 2px 8px rgba(80, 60, 40, 0.05)` (chips, small badges)
- **Warm Card**: `0 4px 20px rgba(80, 60, 40, 0.08)` (service cards, floating panels)
- **Warm Sheet**: `0 -6px 28px rgba(80, 60, 40, 0.12)` (bottom sheets, mobile drawer)
- **Warm Modal**: `0 16px 40px rgba(80, 60, 40, 0.14)` (center dialogs, search overlay)

---

## 4. Radii & Geometry

- **Buttons**: `14px` (`rounded-button` or `rounded-[14px]`)
- **Cards**: `18px` (`rounded-card` or `rounded-[18px]`)
- **Bottom Sheets**: `24px` top corners (`rounded-t-[24px]`)
- **Chips & Pills**: Full rounded (`rounded-full` / `rounded-chip`)

---

## 5. WCAG AA Contrast Audit & Pairings

| Text / Foreground | Background Surface | Contrast Ratio | WCAG AA Requirement | Result |
|---|---|---|---|---|
| **Espresso** (`#2B2420`) | **Ivory** (`#FFFDF8`) | **15.01:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Espresso** (`#2B2420`) | **Cream** (`#F7F0E3`) | **13.47:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Espresso** (`#2B2420`) | **Sand** (`#EFE4D0`) | **12.12:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Espresso** (`#2B2420`) | **Warm White** (`#FFFEFB`) | **15.13:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Espresso** (`#2B2420`) | **Accent Soft** (`#F6E4EA`) | **12.50:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Taupe** (`#6F6258`) | **Ivory** (`#FFFDF8`) | **5.80:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Taupe** (`#6F6258`) | **Cream** (`#F7F0E3`) | **5.20:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Taupe** (`#6F6258`) | **Sand** (`#EFE4D0`) | **4.68:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Taupe** (`#6F6258`) | **Warm White** (`#FFFEFB`) | **5.84:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Rose Plum** (`#B8336A`) | **Ivory** (`#FFFDF8`) | **5.55:1** | $\ge 4.5:1$ (Links) | **PASS** |
| **Rose Plum** (`#B8336A`) | **Cream** (`#F7F0E3`) | **4.98:1** | $\ge 4.5:1$ (Links) | **PASS** |
| **Rose Plum** (`#B8336A`) | **Accent Soft** (`#F6E4EA`)| **4.63:1** | $\ge 4.5:1$ (Badges) | **PASS** |
| **Deep Plum** (`#7A1F4A`)| **Sand** (`#EFE4D0`) | **7.86:1** | $\ge 4.5:1$ (Selected) | **PASS** |
| **Deep Plum** (`#7A1F4A`)| **Accent Soft** (`#F6E4EA`)| **8.11:1** | $\ge 4.5:1$ (Badges) | **PASS** |
| **White** (`#FFFFFF`) | **Rose Plum** (`#B8336A`) | **5.65:1** | $\ge 4.5:1$ (Buttons) | **PASS** |
| **White** (`#FFFFFF`) | **Deep Plum** (`#7A1F4A`) | **9.89:1** | $\ge 4.5:1$ (Pressed) | **PASS** |
| **Success** (`#1E7F5C`) | **Warm White** (`#FFFEFB`) | **4.90:1** | $\ge 4.5:1$ (Text) | **PASS** |
| **Error** (`#B3261E`) | **Warm White** (`#FFFEFB`) | **6.48:1** | $\ge 4.5:1$ (Text) | **PASS** |
| **Warning** (`#8C4D00`) | **Warm White** (`#FFFEFB`) | **6.55:1** | $\ge 4.5:1$ (Text) | **PASS** |
| **Field Outline** (`#8E7D6A`) | **Warm White** (`#FFFEFB`)| **3.93:1** | $\ge 3:1$ (Non-text) | **PASS** |
| **Field Outline** (`#8E7D6A`) | **Cream** (`#F7F0E3`) | **3.50:1** | $\ge 3:1$ (Non-text) | **PASS** |

---

## 6. Implementation Rules
1. **Never use `#000` or `#FFF` as brand background surfaces.** White is reserved strictly for high-contrast button labels on Rose Plum and photo text overlays.
2. **Alternating rhythm:** Page sections alternate between Ivory (`--bg`) and Cream (`--bg-alt`); never place two Cream sections adjacently.
3. **Card elevations:** Cards use Warm White (`--card`) with either a subtle Linen border (`--border`) or a warm shadow (`shadow-warm-card`).
4. **Form input visibility:** Form controls must use `--border` in rest state, transition to `--border-field` on hover, and show an accent ring (`2px #B8336A` with `3px #F6E4EA` halo) on focus.
