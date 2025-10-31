/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        volus: {
          emerald: '#1ccc67',
          mantis: '#76c96e',
          'emerald-dark': '#17A555',
          seasalt: '#fcfafa',
          jet: '#333333',
          'davys-gray': '#5e5e5e',
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          // Paleta para Dark Mode
          dark: {
            900: '#0D1117', // Quase preto azulado (background principal)
            800: '#161B22', // Cinza azulado escuro (cards, sidebar)
            700: '#21262D', // Borda e divisórias
            600: '#8B949E', // Texto secundário
            500: '#C9D1D9', // Texto principal
          }
        }
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
}
