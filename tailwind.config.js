module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    extend: {
      // Apple-inspired color palette
      colors: {
        'apple-gray': {
          50: '#fbf7f1',
          100: '#f5eee3',
          200: '#e8ddd0',
          300: '#d6c7b7',
          400: '#ad9c8c',
          500: '#8b7a6d',
          600: '#6d5d52',
          700: '#55463f',
          800: '#443530',
          900: '#3b2428',
          950: '#2a171b',
        },
        'apple-blue': {
          50: '#fbf1f2',
          100: '#f6e1e4',
          200: '#e9bdc4',
          300: '#d995a1',
          400: '#c66c7b',
          500: '#a94b5a',
          600: '#8d3948',
          700: '#742f3c',
          800: '#5e2933',
          900: '#4b242b',
        },
        maroon: '#7b2635',
        gold: '#b28a45',
        ivory: '#fbf7f1',
        'ivory-dark': '#f1e6d7',
        sage: '#6d806c',
      },
      // Typography scale
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'title-sm': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      // Shadows
      boxShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'apple-xl': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
      },
      // Blur
      backdropBlur: {
        'apple': '20px',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
