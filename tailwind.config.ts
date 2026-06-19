import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0d0d",
        cream: "#f6f4ee",
        lime: "#d8ff63",
        cobalt: "#275efe",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
      },
      boxShadow: { soft: "0 24px 70px rgba(12,13,13,.10)" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulseSoft: { "0%,100%": { opacity: ".45" }, "50%": { opacity: "1" } },
      },
      animation: { float: "float 6s ease-in-out infinite", "pulse-soft": "pulseSoft 1.7s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
