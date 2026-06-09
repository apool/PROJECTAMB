import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-bebas)', ...fontFamily.sans],
      },
      colors: {
        brand: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc171',
          400: '#ff9d38',
          500: '#ff7d12',
          600: '#e8620a',  // primary
          700: '#c04b0b',
          800: '#983c11',
          900: '#7c3312',
          950: '#431806',
        },
        surface: {
          DEFAULT: '#141414',
          2: '#1a1a1a',
          3: '#222222',
          4: '#2a2a2a',
        },
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #E8620A 0%, #C04B0B 50%, #431806 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.7) 60%, #0A0A0A 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
