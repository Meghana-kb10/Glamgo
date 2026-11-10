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

        // Named Palette Utilities (User Specification)
        ivory: '#F8F5EF',
        cream: '#F1ECE3',
        sand: '#E5D9C9',
        'warm-white': '#FFFEFB',
        'warm-beige': '#E5D9C9',
        linen: '#E8E0D5',
        'linen-strong': '#C5A77D',
        'light-beige-border': '#E8E0D5',
        charcoal: '#292722',
        'charcoal-hover': '#48443C',
        espresso: '#292722',
        taupe: '#82796D',
        champagne: '#C5A77D',
        'champagne-gold': '#C5A77D',

        // Supporting Shades for Dark Sections
        'dark-text': '#D3CEC6',
        'dark-text-alt': '#D7D2C9',
        'dark-text-subtle': '#BDB6AB',

        // Aliases Mapped Directly to Tokens
        'soft-ivory': '#F8F5EF',
        blush: '#F1ECE3',
        mist: '#E8E0D5',
        ink: '#292722',
        'mauve-grey': '#82796D',
        'emerald-accent': '#1E7F5C',
        'coral-red': '#B3261E',
        'amber-accent': '#C5A77D',

        soft: {
          DEFAULT: '#F8F5EF',
          ivory: '#F8F5EF',
        },
        mauve: {
          DEFAULT: '#82796D',
          grey: '#82796D',
        },
        surface: {
          cream: '#F1ECE3',
          hover: '#E5D9C9',
          white: '#FFFEFB',
          card: '#FFFEFB',
        },
        canvas: {
          light: '#F8F5EF',
          DEFAULT: '#F8F5EF',
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
        'warm-sm': '0 2px 8px rgba(41, 39, 34, 0.05)',
        'card': '0 4px 20px rgba(41, 39, 34, 0.086)',
        'warm-card': '0 4px 20px rgba(41, 39, 34, 0.086)',
        'sheet': '0 -6px 28px rgba(41, 39, 34, 0.14)',
        'warm-sheet': '0 -6px 28px rgba(41, 39, 34, 0.14)',
        'warm-modal': '0 16px 40px rgba(41, 39, 34, 0.18)',
        'luxury': '0 20px 40px -15px rgba(41, 39, 34, 0.086), 0 0 1px 1px rgba(197, 167, 125, 0.25)',
        'luxury-hover': '0 24px 48px -12px rgba(41, 39, 34, 0.18), 0 0 1px 1px rgba(197, 167, 125, 0.45)',
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
