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
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: "#0a0e17",
        "cyber-pink": "#ff00ff",
        "soft-cyan": "#00ffff",
        "electric-purple": "#bd00ff",
      },
    },
  },
  plugins: [],
};
export default config;
