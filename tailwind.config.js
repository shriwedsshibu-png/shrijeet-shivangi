module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#6f1d2b', dark: '#4a1120', soft: '#8a2d3d' },
        gold: { DEFAULT: '#b8893b', soft: '#e7cf98', deep: '#8f6a26' },
        ivory: '#fbf6ee',
        cream: '#f3e8d6',
        ink: '#2e1a1c',
        muted: '#6b5a52',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        deva: ['"Noto Serif Devanagari"', 'serif'],
      },
    },
  },
  plugins: [],
};
