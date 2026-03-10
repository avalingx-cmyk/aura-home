import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Natural Cozy
        forest: {
          DEFAULT: '#2D5A3D',
          light: '#3D7A4D',
          dark: '#1D4A2D',
        },
        sage: {
          DEFAULT: '#8BAA8B',
          light: '#ABCAAB',
        },
        // Neutrals
        cream: '#FDF8F3',
        'warm-white': '#FFFEF9',
        beige: {
          DEFAULT: '#F5EFE6',
          dark: '#E5DFD6',
        },
        wood: {
          DEFAULT: '#8B7355',
          dark: '#5C4A3D',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.04)',
        'medium': '0 4px 16px rgba(0,0,0,0.08)',
        'large': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
export default config