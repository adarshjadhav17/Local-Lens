import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        moss: "#496d58",
        tide: "#2f7d8a",
        sunrise: "#d96f45",
        paper: "#f7f4ee"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
