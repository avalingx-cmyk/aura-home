import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#2D5A3D",
          dark: "#1E3D29",
          light: "#4A7A5A",
        },
        sage: {
          DEFAULT: "#7D9A78",
          dark: "#5A7A58",
          light: "#A0BAA0",
        },
        cream: {
          DEFAULT: "#FDF8F3",
          dark: "#F5EDE5",
          light: "#FFFCF9",
        },
        wood: {
          DEFAULT: "#8B7355",
          dark: "#6B5340",
          light: "#A8947A",
        },
        beige: {
          DEFAULT: "#E8DFD5",
          dark: "#D4C7B8",
          light: "#F2EBE3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;