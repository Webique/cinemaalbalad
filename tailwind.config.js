/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgba(154,32,31,1)",    // red
        secondary: "rgba(57,35,63,1)",   // purple
      },
      fontFamily: {
        cinema: ['"Cinzel"', 'Bebas Neue', 'serif'],  // cinema-style fonts
      },
    },
  },
  plugins: [],
}
