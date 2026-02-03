// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          forest: "#2D4F1E",
          dark: "#1F3A14",
        },
        secondary: {
          earth: "#4B3621",
        },
        surface: {
          sand: "#F5F5DC",
        },
        bg: {
          warm: "#E6E6E6",
        },
        text: {
          dark: "#2B2B2B",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 18px rgba(43,43,43,0.08)",
      },
    },
  },
  plugins: [],
};