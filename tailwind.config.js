/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        handwritten: ['"Great Vibes"', 'cursive'], // For signature
      },
      colors: {
        themeDark: '#1e293b',
        themeLight: '#f8fafc',
        themeAccent: '#3b82f6',
      },
      backgroundImage: {
        // ✅ Custom background image class
        'resume-builder-bg': "url('https://images.unsplash.com/photo-1587614382346-4ecb7d3b3a2a?auto=format&fit=crop&w=1950&q=80')",
      }
    },
  },
  plugins: [],
}
