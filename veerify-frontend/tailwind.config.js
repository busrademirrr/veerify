/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#19a96b', // Veerify Yeşili
        dark: '#0d0e0e',    // Arka Plan Siyahı
        light: '#ffffff',   // Yazı Beyazı
        surface: '#121212', // Kartlar için koyu gri
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}