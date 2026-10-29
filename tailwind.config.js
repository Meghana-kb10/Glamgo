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
        // Core PRD & UI/UX Design System Tokens
        'rose-plum': '#B8336A',
        'deep-plum': '#7A1F4A',
        'blush': '#FCE7F0',
        'champagne-gold': '#C9A25B',
        'soft-ivory': '#FFFBF8',
        'ink': '#1F1A1D',
        'mauve-grey': '#6E6369',
        'mist': '#EDE4E8',
        'emerald-accent': '#14744E',
        'amber-accent': '#E8A33D',
        'coral-red': '#D6455D',

        soft: {
          DEFAULT: '#FFFBF8',
          ivory: '#FFFBF8',
        },
        blush: {
          DEFAULT: '#FCE7F0',
        },
        mist: {
          DEFAULT: '#EDE4E8',
        },
        ink: {
          DEFAULT: '#1F1A1D',
        },
        mauve: {
          DEFAULT: '#6E6369',
          grey: '#6E6369',
        },

        // Backward-compatible token mappings aligned to the new palette
        canvas: {
          light: '#FFFBF8', // Soft Ivory
          DEFAULT: '#FFFBF8',
          dark: '#1A1216',  // Plum-tinted Dark
        },
        surface: {
          cream: '#FCE7F0',  // Blush
          hover: '#FCE7F0',  // Warm Blush Tint
          white: '#FFFFFF',
          dark: '#1A1216',
          card: '#FFFFFF',
        },
        obsidian: {
          DEFAULT: '#1F1A1D', // Ink
          deep: '#130F11',
          cocoa: '#6E6369',   // Mauve Grey
          muted: '#6E6369',   // Accessible Mauve Grey
          subtle: '#6E6369',
        },
        champagne: {
          DEFAULT: '#C9A25B', // Champagne Gold
          gold: '#C9A25B',
          light: '#F8F1E4',
          soft: '#E8D5B5',
          dark: '#7A580A',
        },
        rose: {
          DEFAULT: '#B8336A',
          plum: '#B8336A',    // Rose Plum
          gold: '#B8336A',    // Rose Plum
          velvet: '#7A1F4A',  // Deep Plum
          blush: '#FCE7F0',   // Blush
          dark: '#7A1F4A',
        },
        deep: {
          plum: '#7A1F4A',
        },
        sage: {
          DEFAULT: '#1E9E6A', // Emerald
          light: '#E2F7ED',
          emerald: '#1E9E6A',
        },
        crimson: {
          DEFAULT: '#D6455D', // Coral Red
          velvet: '#D6455D',
          light: '#FDECEF',
        },
      },
      fontFamily: {
        serif: ['Poppins', '-apple-system', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'sans-serif'],
        display: ['Poppins', '-apple-system', 'sans-serif'],
        mono: ['monospace'],
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
        'sheet': '24px',
        'chip': '9999px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(31, 26, 29, 0.06)',
        'sheet': '0 -4px 24px rgba(31, 26, 29, 0.12)',
        'luxury': '0 20px 40px -15px rgba(31, 26, 29, 0.08), 0 0 1px 1px rgba(184, 51, 106, 0.08)',
        'luxury-hover': '0 24px 48px -12px rgba(184, 51, 106, 0.16), 0 0 1px 1px rgba(201, 162, 91, 0.25)',
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
