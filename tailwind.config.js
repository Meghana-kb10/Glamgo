/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FAF7F5', // Alabaster Silk
          DEFAULT: '#FAF7F5',
          dark: '#0E0C0D',  // Velvet Plum Obsidian
        },
        surface: {
          cream: '#F3ECE7',  // Pearl Cream
          hover: '#F7EAE4',  // Warm Blush Tint
          white: '#FFFFFF',
          dark: '#181416',
          card: '#FCF9F7',
        },
        obsidian: {
          DEFAULT: '#181311', // Obsidian Espresso
          deep: '#120E0D',
          cocoa: '#4A3D36',   // High-contrast Muted Cocoa (WCAG AAA)
          muted: '#4A3D36',   // High-contrast Accessible Muted
          subtle: '#5C4E47',  // High-contrast Accessible Subtle
        },
        champagne: {
          DEFAULT: '#D4AF37', // Champagne Gold
          light: '#F4E7BE',
          soft: '#E8D288',
          dark: '#7A580A',    // High-contrast Deep Amber Bronze (WCAG AA > 5.5:1)
        },
        rose: {
          gold: '#C87D65',    // Editorial Rose Gold (Accents & Borders)
          velvet: '#A8324F',  // Accessible Velvet Crimson
          blush: '#F7EAE4',   // Warm Blush Tint
          dark: '#8E3824',    // High-contrast Terracotta Text (WCAG AA > 5.8:1)
        },
        sage: {
          DEFAULT: '#2E6F40', // Botanical Sage
          light: '#E2EFE5',
          emerald: '#1F8A5B',
        },
        crimson: {
          DEFAULT: '#B42318', // Velvet Crimson
          velvet: '#B42318',
          light: '#FEE4E2',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(24, 19, 17, 0.07), 0 0 1px 1px rgba(200, 125, 101, 0.08)',
        'luxury-hover': '0 30px 60px -12px rgba(200, 75, 107, 0.16), 0 0 1px 1px rgba(212, 175, 55, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'rose-glow': '0 0 25px rgba(200, 125, 101, 0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
