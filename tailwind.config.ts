import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // blocklist: ["invert"],
  theme: {
    extend: {
      colors: {
        light: "rgb(var(--light) / <alpha-value>)",
        dark: "rgb(var(--dark) / <alpha-value>)",
        // ===========================================
        alabaster: "rgb(var(--alabaster) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        cave: "rgb(var(--cave) / <alpha-value>)",
        // ===========================================
        red: "rgb(var(--red) / <alpha-value>)",
        // ===========================================
        fg: "rgb(var(--fg) / <alpha-value>)",
        bg: "rgb(var(--bg) / <alpha-value>)",
        // ===========================================
        accent: {
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
          mid: "rgb(var(--accent-mid) / <alpha-value>)",
          bg: "rgb(var(--accent-bg) / <alpha-value>)",
        },
        // rose: "rgb(var(--rose) / <alpha-value>)",
        // eggplant: "rgb(var(--eggplant) / <alpha-value>)",
      },
      fontFamily: {
        cormorant: ["var(--cormorant)"],
      },
      animation: {
        "fade-in": "fade-in 1s ease-in-out",
        "fade-in-quick": "fade-in 0.25s ease-in-out",
        "fade-out": "fade-out 1s ease-in-out",
        "fade-out-quick": "fade-out 0.25s ease-in-out",
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
        "loading-bounce": {
          "0%, 60%, 100%": {
            transform: "translateY(0%)",
            "animation-timing-function": "cubic-bezier(1, -1, 0.65, 1)",
          },
          "40%": {
            transform: "translateY(-7%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
