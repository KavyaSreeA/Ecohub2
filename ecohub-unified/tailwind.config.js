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
          50: '#F0F7F7',
          100: '#D9EBEB',
          200: '#B3D7D7',
          300: '#8DC3C3',
          400: '#67AFAF',
          500: '#5A9E9E',
          600: '#4A8585',
          700: '#3D6B6B',
          800: '#2F5252',
          900: '#223939',
        },
        teal: {
          light: '#E8F4F4',
          DEFAULT: '#5A9E9E',
          dark: '#3D6B6B',
        },
        cream: '#FDFCFA',
        charcoal: '#2D3436',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
