import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: { xs: '475px' },
      colors: {
        // Warm graphite surfaces (bukan navy/biru generik)
        ink: {
          950: '#0C0C0B',
          900: '#141413',
          850: '#1A1A18',
          800: '#21211E',
          750: '#292925',
          700: '#32312D',
          600: '#46453F',
          500: '#5E5C53',
        },
        // Satu aksen tegas: citron
        accent: {
          300: '#DCF58A',
          400: '#CDEB5E',
          500: '#BCDD3C',
          600: '#A8CA25',
          700: '#8AA81B',
          800: '#6B8215',
          900: '#4D5E10',
        },
        // Teks netral hangat
        slate: colors.stone,
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in': {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-subtle': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.22s ease-out',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
