import React, { useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Input,
  Badge,
  BottomSheet,
  Skeleton,
} from './index';
import { Sparkles, Search, MapPin } from 'lucide-react';

export const UiShowcase: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('Facial Care');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputValue, setInputValue] = useState('Kavita Sharma');
  const [inputError, setInputError] = useState('');

  return (
    <div className="min-h-screen bg-bg text-text p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="border-b border-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Visual Design Tokens &amp; Shared UI</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
          Warm Cream &amp; Ivory System
        </h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Modern, minimal, beginner-first luxury palette with 100% WCAG AA compliance. Alternating Ivory canvas, Cream accents, Sand fills, and Warm White cards.
        </p>
      </header>

      {/* 1. Design Token Palette Swatches */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          1. Color Tokens (CSS Variables)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-[14px] bg-bg border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-bg border border-border" />
            <span className="font-bold block text-text">Warm Ivory</span>
            <span className="text-[11px] text-text-muted font-mono">#F8F5EF</span>
            <span className="text-[10px] text-text-muted block">Main page &amp; header</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-bg-alt border border-border" />
            <span className="font-bold block text-text">Soft Cream</span>
            <span className="text-[11px] text-text-muted font-mono">#F1ECE3</span>
            <span className="text-[10px] text-text-muted block">Alternate sections</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-card border border-border" />
            <span className="font-bold block text-text">Warm White</span>
            <span className="text-[11px] text-text-muted font-mono">#FFFEFB</span>
            <span className="text-[10px] text-text-muted block">Cards, forms, menus</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-fill border border-border" />
            <span className="font-bold block text-text">Warm Beige</span>
            <span className="text-[11px] text-text-muted font-mono">#E5D9C9</span>
            <span className="text-[10px] text-text-muted block">Soft accents, avatars</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-champagne text-charcoal flex items-center justify-center font-bold text-xs">
              ★ Gold
            </div>
            <span className="font-bold block text-text">Champagne</span>
            <span className="text-[11px] text-text-muted font-mono">#C5A77D</span>
            <span className="text-[10px] text-text-muted block">Accents, stars, focus</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">
              Charcoal
            </div>
            <span className="font-bold block text-text">Deep Charcoal</span>
            <span className="text-[11px] text-text-muted font-mono">#292722</span>
            <span className="text-[10px] text-text-muted block">Main text &amp; buttons</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-accent-pressed text-white flex items-center justify-center font-bold text-xs">
              Hover
            </div>
            <span className="font-bold block text-text">Charcoal Hover</span>
            <span className="text-[11px] text-text-muted font-mono">#48443C</span>
            <span className="text-[10px] text-text-muted block">Primary button hover</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-text-muted text-bg flex items-center justify-center font-bold text-xs">
              Taupe
            </div>
            <span className="font-bold block text-text">Muted Taupe</span>
            <span className="text-[11px] text-text-muted font-mono">#82796D</span>
            <span className="text-[10px] text-text-muted block">Secondary text, labels</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-border border border-border-strong" />
            <span className="font-bold block text-text">Light Beige Border</span>
            <span className="text-[11px] text-text-muted font-mono">#E8E0D5</span>
            <span className="text-[10px] text-text-muted block">Edges &amp; dividers</span>
          </div>

          <div className="p-3 rounded-[14px] bg-charcoal border border-[#48443C] space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-[#48443C] text-dark-text flex items-center justify-center font-bold text-xs">
              Light Text
            </div>
            <span className="font-bold block text-white">Dark Text</span>
            <span className="text-[11px] text-dark-text-subtle font-mono">#D3CEC6</span>
            <span className="text-[10px] text-dark-text-subtle block">Text on dark sections</span>
          </div>

          <div className="p-3 rounded-[14px] bg-card border border-border space-y-1 shadow-warm-sm">
            <div className="h-10 rounded-lg bg-success text-white flex items-center justify-center font-bold text-xs">
              ✓ 100%
            </div>
            <span className="font-bold block text-text">Success</span>
            <span className="text-[11px] text-text-muted font-mono">#1E7F5C</span>
            <span className="text-[10px] text-text-muted block">Verified Badges</span>
          </div>
        </div>
      </section>

      {/* 2. Shared Buttons (14px Radius) */}
      <section className="space-y-4 p-6 rounded-[18px] bg-card border border-border shadow-warm-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          2. Shared Buttons (14px Radius, Warm Shadows)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Outline</Button>
          <Button variant="ghost">Ghost Gold</Button>
          <Button variant="gold" leftIcon={<Sparkles className="w-4 h-4" />}>Gold Rating</Button>
          <Button variant="danger">Cancel Booking</Button>
          <Button variant="primary" isLoading>Loading...</Button>
          <Button variant="primary" size="sm">Small (36px)</Button>
          <Button variant="primary" size="lg">Large (52px)</Button>
        </div>
      </section>

      {/* 3. Chips & Pills (Selected Sand with Gold Text & Border) */}
      <section className="space-y-4 p-6 rounded-[18px] bg-card border border-border shadow-warm-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          3. Shared Chips (Sand Fill &amp; Gold Text for Selected State)
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          {['Facial Care', 'Hair Styling', 'Bridal Makeup', 'Waxing & Threading', 'Manicure'].map((chip) => (
            <Chip
              key={chip}
              label={chip}
              selected={selectedChip === chip}
              onClick={() => setSelectedChip(chip)}
              count={chip === 'Facial Care' ? 12 : undefined}
            />
          ))}
        </div>
      </section>

      {/* 4. Badges */}
      <section className="space-y-4 p-6 rounded-[18px] bg-card border border-border shadow-warm-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          4. Shared Badges
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge type="verified" text="Verified Pro" />
          <Badge type="bestseller" text="Bestseller Combo" />
          <Badge type="offer" text="20% OFF FIRST20" />
          <Badge type="rating" text="4.92 (420)" />
          <Badge type="neutral" text="60 mins • At Home" />
        </div>
      </section>

      {/* 5. Inputs (Warm White with Linen Strong Outline >= 3:1) */}
      <section className="space-y-4 p-6 rounded-[18px] bg-card border border-border shadow-warm-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            5. Form Inputs (Warm White, Visible Borders, Focus Halo)
          </h2>
          <button
            type="button"
            onClick={() => setInputError(inputError ? '' : 'Please enter a valid mobile number')}
            className="text-xs font-semibold text-accent hover:underline cursor-pointer"
          >
            Toggle Validation State
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            helperText="Enter name as per government ID"
          />
          <Input
            label="Phone Number"
            defaultValue="+91 98765 43210"
            error={inputError}
            leftIcon={<MapPin className="w-4 h-4" />}
            helperText={inputError ? undefined : "We'll send your booking OTP here"}
          />
        </div>
      </section>

      {/* 6. Alternating Section Rhythm (Ivory & Cream) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          6. Surface Rhythm: Alternating Ivory &amp; Cream Bands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ivory Section Card */}
          <Card variant="surface" className="p-6 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-0.5 rounded-full inline-block">
              Canvas Surface (Ivory)
            </span>
            <h3 className="font-heading text-lg font-bold text-text">
              Warm White Card on Ivory
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Warm White cards (`#FFFEFB`) rest on Ivory (`#FFFDF8`) with a gentle Linen border (`#E8DDCB`) and warm-tinted shadow `rgba(80,60,40,0.08)`.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="font-heading font-bold text-text text-sm">₹1,499</span>
              <Button size="sm" variant="secondary">View Details</Button>
            </div>
          </Card>

          {/* Cream Section Card */}
          <Card variant="cream" className="p-6 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text bg-fill px-2.5 py-0.5 rounded-full inline-block">
              Alternating Surface (Cream)
            </span>
            <h3 className="font-heading text-lg font-bold text-text">
              Cream Accent Section Card
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Alternating Cream sections (`#F7F0E3`) host banner cards, review carousels, and footer areas without dark mode or harsh contrasts.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="font-heading font-bold text-text text-sm">Save 25%</span>
              <Button size="sm" variant="primary">Claim Offer</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Skeleton Shimmer (Sand to Cream) */}
      <section className="space-y-4 p-6 rounded-[18px] bg-card border border-border shadow-warm-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          7. Warm Skeleton Shimmer (Sand to Cream Gradient)
        </h2>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-28 rounded-[14px]" />
            <Skeleton className="h-10 w-28 rounded-[14px]" />
          </div>
        </div>
      </section>

      {/* 8. BottomSheet Demo Trigger */}
      <section className="p-6 rounded-[18px] bg-bg-alt border border-border flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-text">Interactive Bottom Sheet</h3>
          <p className="text-xs text-text-muted">24px top radius, Warm White card, warm-tinted backdrop.</p>
        </div>
        <Button variant="primary" onClick={() => setIsSheetOpen(true)}>
          Open Sheet
        </Button>
      </section>

      {/* BottomSheet Modal */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Customization Options"
      >
        <div className="space-y-4 text-xs">
          <p className="text-text-muted">
            Select your preferred wax type and add-on treatments. Notice the 24px top corners, warm white background, and Linen divider.
          </p>
          <div className="space-y-2">
            {['Rica Brazilian Wax (Gentle for Sensitive Skin)', 'Chocolate Peel Wax (Hypoallergenic)', 'Aloe Vera Cooling Pack'].map((opt, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                <span className="font-medium text-text">{opt}</span>
                <Button size="sm" variant={i === 0 ? 'primary' : 'secondary'}>
                  {i === 0 ? 'Selected' : 'Add'}
                </Button>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="font-bold text-sm text-text">Total: ₹899</span>
            <Button variant="primary" onClick={() => setIsSheetOpen(false)}>Done</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
