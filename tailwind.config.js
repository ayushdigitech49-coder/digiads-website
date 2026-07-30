/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1352D0',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#1352D0',
          600: '#1D4ED8',
          700: '#1D40B0',
          800: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#2563EB',
          50: '#F0F7FF',
          100: '#E0EFFE',
          500: '#2563EB',
          600: '#1D4ED8',
        },
        accent: {
          DEFAULT: '#D91212',
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#D91212',
          600: '#C62828',
        },
        gold: {
          DEFAULT: '#F4B400',
          50: '#FFFDE7',
          500: '#F4B400',
          600: '#D99B00',
        },
        dark: {
          900: '#0B1120',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-33.333%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%,-40%) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
