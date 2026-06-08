/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'military': {
          950: '#050a14',
          900: '#0a1628',
          800: '#0f2038',
          700: '#142a48',
          600: '#1a3458',
          500: '#1f3e68',
        },
        'tech': {
          300: '#66e8ff',
          400: '#33deff',
          500: '#00d4ff',
          600: '#00a8cc',
          700: '#007c99',
        },
        'alert': {
          green: '#00ff88',
          yellow: '#ffcc00',
          orange: '#ff6b35',
          red: '#ff3366',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      boxShadow: {
        'glow-tech': '0 0 15px rgba(0, 212, 255, 0.5)',
        'glow-green': '0 0 15px rgba(0, 255, 136, 0.5)',
        'glow-orange': '0 0 15px rgba(255, 107, 53, 0.5)',
        'glow-red': '0 0 15px rgba(255, 51, 102, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
      }
    },
  },
  plugins: [],
};
