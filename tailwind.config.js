/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct CSS variable tokens (single source of truth)
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        fill: 'var(--fill)',
        card: 'var(--card)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'border-field': 'var(--border-field)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-pressed': 'var(--accent-pressed)',
        'accent-soft': 'var(--accent-soft)',
        star: 'var(--star)',
        success: 'var(--success)',
        'success-text': 'var(--success-text)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        'warning-text': 'var(--warning-text)',

        // Named Palette Utilities
        ivory: '#FFFDF8',
        cream: '#F7F0E3',
        sand: '#EFE4D0',
        'warm-white': '#FFFEFB',
        linen: '#E8DDCB',
        'linen-strong': '#CDBFA8',
        espresso: '#2B2420',
        taupe: '#6F6258',
        'rose-plum': '#B8336A',
        'deep-plum': '#7A1F4A',
        'champagne-gold': '#C9A25B',

        // Legacy Aliases Mapped Directly to New Warm Tokens
        'soft-ivory': '#FFFDF8',
        blush: '#F6E4EA',        // Warm accent-soft plum tint
        mist: '#E8DDCB',         // Linen border
        ink: '#2B2420',          // Espresso
        'mauve-grey': '#6F6258',  // Taupe
        'emerald-accent': '#1E7F5C',
        'coral-red': '#B3261E',
        'amber-accent': '#A8620A',

        soft: {
          DEFAULT: '#FFFDF8',
          ivory: '#FFFDF8',
        },
        mauve: {
          DEFAULT: '#6F6258',
          grey: '#6F6258',
        },
        surface: {
          cream: '#F7F0E3',
          hover: '#EFE4D0',
          white: '#FFFEFB',
          card: '#FFFEFB',
        },
        canvas: {
          light: '#FFFDF8',
          DEFAULT: '#FFFDF8',
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
        'button': '14px',
        'card': '18px',
        'sheet': '24px',
        'chip': '9999px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(80, 60, 40, 0.05)',
        'card': '0 4px 20px rgba(80, 60, 40, 0.08)',
        'warm-card': '0 4px 20px rgba(80, 60, 40, 0.08)',
        'sheet': '0 -6px 28px rgba(80, 60, 40, 0.12)',
        'warm-sheet': '0 -6px 28px rgba(80, 60, 40, 0.12)',
        'warm-modal': '0 16px 40px rgba(80, 60, 40, 0.14)',
        'luxury': '0 20px 40px -15px rgba(80, 60, 40, 0.08), 0 0 1px 1px rgba(184, 51, 106, 0.08)',
        'luxury-hover': '0 24px 48px -12px rgba(184, 51, 106, 0.16), 0 0 1px 1px rgba(201, 162, 91, 0.25)',
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
