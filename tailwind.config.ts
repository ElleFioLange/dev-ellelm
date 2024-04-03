import type { Config } from "tailwindcss";
import colors from "./utils/constants/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
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
