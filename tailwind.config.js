module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#1f3350', dark: '#16263d', soft: '#2c4a6e' },
        gold: { DEFAULT: '#b8893b', soft: '#e7cf98', deep: '#8f6a26' },
        ivory: '#fbf7ee',
        cream: '#f3ebdc',
        ink: '#26324a',
        muted: '#5d6677',
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
