import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: "#fff5f7",
          100: "#ffe4ea",
          200: "#ffb8c5",
          300: "#ff8fa3",
          400: "#ff6a82",
          500: "#ef4361",
          600: "#c8304a",
          700: "#972538",
          800: "#671924",
          900: "#3d0e16",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d8e0",
          400: "#7b8494",
          600: "#3c4454",
          800: "#1a1f2c",
          900: "#0d1018",
        },
      },
      fontFamily: {
        jp: [
          '"Noto Sans JP"',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(10, 15, 30, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
