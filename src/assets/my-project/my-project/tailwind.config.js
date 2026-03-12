/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Leadcore Brand Colors (Derived from your Logo)
        brand: {
          navy: '#0B1C33',   // Dark Blue (Primary Text/Headings)
          green: '#2F5D48',  // Forest Green (Buttons/Accents)
          gold: '#C5A666',   // Gold (Highlights/Icons)
          beige: '#F5F5F0',  // Light Cream (Background sections)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean corporate font
      }
    },
  },
  plugins: [],
}