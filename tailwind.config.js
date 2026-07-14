/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm, fresh cookbook palette
        cream: {
          50: '#FDF9F3',
          100: '#F7EDE1',
          200: '#F0E0CC',
        },
        terracotta: {
          50: '#FBEEE8',
          100: '#F6D9CC',
          300: '#EFA588',
          400: '#E8825C',
          500: '#E06A3C',
          600: '#C9552B',
          700: '#A64220',
        },
        sage: {
          50: '#EEF4E9',
          100: '#DBE8CE',
          300: '#A7C589',
          400: '#89AF66',
          500: '#6E964C',
          600: '#57783B',
        },
        cocoa: {
          400: '#8A7866',
          600: '#5C4A3A',
          800: '#3B2E23',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(92, 74, 58, 0.18)',
        card: '0 6px 24px -8px rgba(92, 74, 58, 0.22)',
        lift: '0 12px 34px -10px rgba(92, 74, 58, 0.30)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
