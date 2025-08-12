/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6F1EAB',
        secondary: '#9C27B0',
        tertiary: '#C2185B',
        accent: '#FFD700',
        'text-light': '#FFFFFF',
        'text-dark': '#333333',
        'bg-light': '#F0F0F0',
        'bg-dark': '#6F1EAB',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, #C2185B, #9C27B0, #6F1EAB)',
      },
    },
  },
  plugins: [],
}