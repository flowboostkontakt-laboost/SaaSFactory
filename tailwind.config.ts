import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8f7f4",
        ember: "#d9485f",
        moss: "#4c7b61",
        gold: "#c58d1b",
        // Landing palette: near-black + violet + turquoise.
        violet: "#7c5cff",
        aqua: "#22d3c5",
        charcoal: {
          950: "#060608",
          900: "#0c0c12",
          800: "#14141d",
          700: "#1f1f2b",
          600: "#33334a"
        },
        offwhite: {
          DEFAULT: "#f3f4f8",
          muted: "#a5a6bd",
          faint: "#6c6d85"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 42, 0.08)",
        ambient:
          "0 1px 0 rgba(245, 244, 241, 0.04) inset, 0 30px 80px -20px rgba(0, 0, 0, 0.7)"
      },
      backgroundImage: {
        "soft-grid":
          "linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "36px 36px"
      }
    }
  },
  plugins: []
};

export default config;
