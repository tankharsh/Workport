/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Add your chosen font
      },
      colors: {
        lightGray: "#f2f2f2",
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
