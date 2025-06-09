/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          pink: '#D856BF',
          purple: '#6750A2',
          blue: '#03B3C3',
          dark: '#0E5EA5',
          bg: '#080808',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #03B3C3, 0 0 10px #03B3C3, 0 0 15px #03B3C3',
          },
          '100%': { 
            boxShadow: '0 0 10px #03B3C3, 0 0 20px #03B3C3, 0 0 30px #03B3C3',
          },
        }
      }
    },
  },
  plugins: [],
}
