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
        corm: ["var(--corm)"],
        "corm-uni": ["var(--corm-uni)"],
      },
    },
  },
  plugins: [],
};
export default config;
