/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "class",
  prefix: "plasmo-",
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#1e1b4b',
          900: '#111827',
          950: '#030712'
        }
      }
    }
  }
}
