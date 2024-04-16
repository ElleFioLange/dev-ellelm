import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // blocklist: ["invert"],
  safelist: ["animate-fade-out"],
  theme: {
    extend: {
      colors: {
        fg: "rgb(var(--fg) / <alpha-value>)",
        bg: "rgb(var(--bg) / <alpha-value>)",
        // ===========================================
        accent: {
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
          bg: "rgb(var(--accent-bg) / <alpha-value>)",
        },
        // ===========================================
        green: "rgb(var(--green) / <alpha-value>)",
        red: "rgb(var(--red) / <alpha-value>)",
      },
      fontFamily: {
        cormorant: ["var(--cormorant)"],
      },
      animation: {
        "fade-in": "fade-in 1s ease-in-out",
        "fade-out": "fade-out 1s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
