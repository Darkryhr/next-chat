/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#ededed',
          100: '#a0a0a0',
          200: '#707070',
          300: '#505050',
          400: '#3e3e3e',
          500: '#343434',
          600: '#2e2e2e',
          700: '#282828',
          800: '#1c1c1c',
          900: '#161616',
        },
      },
    },
  },
  plugins: [],
};
