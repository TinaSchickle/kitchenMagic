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
        // Grounding & calming, earthy palette.
        // Token names kept (terracotta/sage/cream/cocoa) so components need no
        // changes — only the values are retuned toward muted, natural tones.
        cream: {
          // warm oat / stone neutrals
          50: '#F5F2EA',
          100: '#EAE3D6',
          200: '#D9D0BE',
        },
        terracotta: {
          // muted clay / adobe — the grounding accent
          50: '#F1EAE4',
          100: '#E3D2C6',
          300: '#CBA48E',
          400: '#B58369',
          500: '#9E6A50',
          600: '#82573F',
          700: '#674531',
        },
        sage: {
          // soft olive / eucalyptus — the calming secondary
          50: '#ECF0E8',
          100: '#D9E1CD',
          300: '#A7B98E',
          400: '#889F6C',
          500: '#6C8552',
          600: '#54683F',
        },
        cocoa: {
          // espresso / bark text tones
          400: '#8A7C6B',
          600: '#574A3B',
          800: '#2F271E',
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
