import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        background: '#FAFAF9',          // Soft Cream
        card: '#F5F5F4',
        primary: {
          DEFAULT: '#C2410C',           // Terracotta
          foreground: '#FFFFFF',        // White text
        },
        secondary: {
          DEFAULT: '#065F46',           // Olive Green
          foreground: '#FFFFFF',        // White text
        },
        foreground: {
          DEFAULT: '#1C1917',           // Charcoal
        },
        text: {
          primary: '#1C1917',           // Charcoal for readability
          secondary: '#44403C',         // Muted Stone
        },

        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
    },
    fontFamily: {
  sans: ["var(--font-inter)", "sans-serif"],
  serif: ["var(--font-playfair)", "serif"],
},
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
