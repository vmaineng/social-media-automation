import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightBg: "#ff9794",
        lightText: "f3f2d8",
        lightPrimary: "97d8c9",
        lightSecondary: "d8e194",
        lightAccent: "ff3900",

        darkBg: "1d1c1b",
        darkText: "929497",
        darkPrimary: "525F63",
        darkSecondary: "aed5df",
        darkAccent: "f75756"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
