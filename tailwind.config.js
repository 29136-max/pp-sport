/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sports: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          dark: '#0b1329',
          card: '#152238',
          accent: '#06b6d4',
          highlight: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
