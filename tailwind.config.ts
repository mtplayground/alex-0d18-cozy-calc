import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffaf0',
          100: '#f8f0df',
          200: '#ecd9b7',
          300: '#dfc28f',
        },
        terracotta: {
          50: '#fff1ec',
          100: '#f9d8cc',
          200: '#efae98',
          300: '#e18261',
          400: '#c96645',
          500: '#a94f35',
          600: '#843d2d',
          700: '#5d2d24',
        },
        amberNeutral: {
          50: '#fbf6ea',
          100: '#efe2c3',
          200: '#dfc889',
          300: '#cca64f',
          400: '#a97d2f',
          500: '#815d28',
          600: '#5f4324',
          700: '#3e2d1d',
        },
        clay: {
          50: '#f7f0e8',
          100: '#e7d7c7',
          200: '#d2b9a4',
          300: '#b58f77',
          400: '#946650',
          500: '#714637',
          600: '#563329',
          700: '#39221d',
        },
        cocoa: {
          50: '#f1ebe5',
          100: '#d9c9ba',
          200: '#b89f8c',
          300: '#90705d',
          400: '#684938',
          500: '#4c3127',
          600: '#351f1a',
          700: '#241513',
        },
      },
      spacing: {
        calc: '1.125rem',
        'calc-tight': '0.75rem',
        'calc-comfort': '1.5rem',
        'calc-roomy': '2rem',
      },
      borderRadius: {
        pill: '999px',
        squircle: '1.35rem',
        'squircle-sm': '1rem',
        'squircle-lg': '1.75rem',
      },
      boxShadow: {
        'soft-depth': '0 1rem 2.5rem rgb(76 49 39 / 0.14), 0 0.25rem 0.75rem rgb(76 49 39 / 0.1)',
        'button-depth': '0 0.45rem 0 rgb(132 61 45 / 0.22), 0 0.8rem 1.2rem rgb(76 49 39 / 0.12)',
        'button-pressed': '0 0.18rem 0 rgb(132 61 45 / 0.2), 0 0.45rem 0.75rem rgb(76 49 39 / 0.1)',
        'display-inset': 'inset 0 0.125rem 0.6rem rgb(76 49 39 / 0.08)',
      },
      fontFamily: {
        display: [
          'Inter',
          'ui-rounded',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['clamp(2.5rem, 13vw, 4.5rem)', { lineHeight: '0.95', fontWeight: '700' }],
        'display-sm': ['clamp(1.75rem, 8vw, 3rem)', { lineHeight: '1', fontWeight: '700' }],
      },
      transitionTimingFunction: {
        cozy: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
