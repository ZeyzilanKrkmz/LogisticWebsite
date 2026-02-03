/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "#2D4F1E",
        earth: "#4B3621",
        sand: "#F5F5DC",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(45,79,30,0.10)",
      },
      keyframes: {
        pulseDots: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-2px)", opacity: "1" },
        },
      },
      animation: {
        "dots-1": "pulseDots 1s infinite",
        "dots-2": "pulseDots 1s infinite 0.15s",
        "dots-3": "pulseDots 1s infinite 0.3s",
      },
    },
  },
  plugins: [],
};