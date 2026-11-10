# Glamgo Design Tokens — Warm Ivory, Soft Cream & Champagne Gold Luxury System

## 1. Overview
The Glamgo platform uses a refined, atelier-grade luxury palette featuring **Warm Ivory** and **Soft Cream** canvases, **Warm White** cards and forms, **Warm Beige** soft accents, **Champagne Gold** brand accents and stars, with **Deep Charcoal** high-contrast text, primary action buttons, announcement bar, and footer.

Text and focus colors must be checked against their actual surface to meet WCAG 2.1 AA contrast requirements ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and UI components).

---

## 2. Token Specification (User Canonical Palette)

| Colour Name | Hex Value | CSS Variable | Semantic Purpose |
|---|---|---|---|
| **Warm ivory** | `#F8F5EF` | `--bg` | Main page and header background |
| **Soft cream** | `#F1ECE3` | `--bg-alt`, `--accent-soft` | Alternate sections, hero backgrounds, selected controls |
| **Warm white** | `#FFFEFB` | `--card`, `--dark-text` | Cards, forms, menus, and light button text |
| **Warm beige** | `#E5D9C9` | `--fill` | Soft accents, chips, skeleton base, and account avatar background |
| **Champagne** | `#C5A77D` | `--border-strong`, `--champagne`, `--star` | Small brand accents, stars, verification icons, focus borders |
| **Deep charcoal** | `#292722` | `--text`, `--accent`, `--dark-bg` | Main text, primary buttons, announcement bar, footer |
| **Deep taupe** | `#665E53` | `--text-muted` | Secondary text, labels and descriptions |
| **Field taupe** | `#82796D` | `--border-field` | Input borders |
| **Light beige border** | `#E8E0D5` | `--border` | Card edges, dividers, input borders |

### Supporting Shades for High-Contrast Dark Sections

| Shade | Hex Value | Semantic Purpose |
|---|---|---|
| **Primary-button hover** | `#48443C` | Hover / pressed state for Deep Charcoal buttons and links |
| **Light text (Standard)** | `#D3CEC6` | Body text and nav links inside Deep Charcoal footer / dark sections |
| **Light text (Alternative)** | `#D7D2C9` | High-contrast secondary text on dark announcement bar and dark cards |
| **Light text (Subtle)** | `#BDB6AB` | Metadata, copyright, and subtle labels on dark sections |
| **Warm Shadow Alpha** | `#29272216` (`rgba(41, 39, 34, 0.086)`) | Subtle warm card elevation |
| **Photo Overlay Alpha** | `#29272291` (`rgba(41, 39, 34, 0.569)`) | High-contrast readability overlay across lifestyle photography |

---

## 3. Shadows & Surface Elevations

All shadows use transparent charcoal alphas rather than sterile gray:
- **Warm Small**: `0 2px 8px rgba(41, 39, 34, 0.05)` (chips, small badges)
- **Warm Card**: `0 4px 20px rgba(41, 39, 34, 0.08)` (service cards, floating panels)
- **Warm Sheet**: `0 -6px 28px rgba(41, 39, 34, 0.12)` (bottom sheets, mobile drawer)
- **Warm Modal**: `0 16px 40px rgba(41, 39, 34, 0.14)` (center dialogs, search overlay)

---

## 4. Radii & Geometry
- **Buttons**: `14px` (`rounded-button` or `rounded-[14px]`)
- **Cards**: `18px` (`rounded-card` or `rounded-[18px]`)
- **Bottom Sheets**: `24px` top corners (`rounded-t-[24px]`)
- **Chips & Pills**: Full rounded (`rounded-full` / `rounded-chip`)

---

## 5. WCAG AA Contrast Verification Matrix

| Text / Foreground | Background Surface | Contrast Ratio | WCAG AA Requirement | Result |
|---|---|---|---|---|
| **Deep Charcoal** (`#292722`) | **Warm Ivory** (`#F8F5EF`) | **13.71:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Deep Charcoal** (`#292722`) | **Soft Cream** (`#F1ECE3`) | **12.68:1** | $\ge 4.5:1$ (Body) | **PASS** |
| **Deep Charcoal** (`#292722`) | **Warm Beige** (`#E5D9C9`) | **10.73:1** | $\ge 4.5:1$ (Selected / Chips) | **PASS** |
| **Deep Charcoal** (`#292722`) | **Warm White** (`#FFFEFB`) | **14.79:1** | $\ge 4.5:1$ (Cards & Menus) | **PASS** |
| **Deep Taupe** (`#665E53`) | **Warm Ivory** (`#F8F5EF`) | **5.86:1** | $\ge 4.5:1$ (Secondary Text) | **PASS** |
| **Deep Taupe** (`#665E53`) | **Warm White** (`#FFFEFB`) | **6.33:1** | $\ge 4.5:1$ (Secondary on Cards) | **PASS** |
| **Warm White** (`#FFFEFB`) | **Deep Charcoal** (`#292722`) | **14.79:1** | $\ge 4.5:1$ (Primary Buttons) | **PASS** |
| **Warm White** (`#FFFEFB`) | **Button Hover** (`#48443C`) | **9.61:1** | $\ge 4.5:1$ (Hovered Buttons) | **PASS** |
| **Dark Text Alt** (`#D7D2C9`)| **Deep Charcoal** (`#292722`) | **9.91:1** | $\ge 4.5:1$ (Announcement Bar) | **PASS** |
| **Dark Text** (`#D3CEC6`) | **Deep Charcoal** (`#292722`) | **9.53:1** | $\ge 4.5:1$ (Footer Body) | **PASS** |
| **Champagne** (`#C5A77D`) | **Deep Charcoal** (`#292722`) | **6.53:1** | $\ge 4.5:1$ (Accents / Stars) | **PASS** |
| **Field Taupe** (`#82796D`) | **Warm White** (`#FFFEFB`) | **4.24:1** | $\ge 3:1$ (Field Borders) | **PASS** |
| **Champagne** (`#C5A77D`) | **Warm White** (`#FFFEFB`) | **2.26:1** | Focus Ring / Accent Stroke | **Decorative only; use charcoal for focus** |

---

## 6. Implementation Rules
1. **Single Source of Truth**: All components use semantic Tailwind tokens (`bg-bg`, `bg-bg-alt`, `bg-card`, `bg-fill`, `text-text`, `text-text-muted`, `border-border`, `border-champagne`, `bg-charcoal`, `text-champagne`).
2. **Alternating rhythm**: Page sections alternate between Warm Ivory (`--bg`) and Soft Cream (`--bg-alt`); never place two cream sections adjacently.
3. **Card elevations**: Cards use Warm White (`--card`) with Light Beige border (`--border`) and warm charcoal shadow (`shadow-warm-card`).
4. **Primary CTAs**: Primary action buttons use Deep Charcoal (`--accent: #292722`) with Warm White text (`#FFFEFB`) and transition to `#48443C` on hover.
