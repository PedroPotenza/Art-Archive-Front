/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "golden-yellow": {
          DEFAULT: "#D8A114",
          dark: "#C99103",
          darker: "#A97E03",
          light: "#E0B21B",
          lighter: "#E9C02F"
        },
        "almost-white": {
          DEFAULT: "#F9F9F9"
        },
        "almost-black": {
          DEFAULT: "#151515"
        },
        "sweet-gray": {
          DEFAULT: "#333333",
          light: "#3b3b3b",
          lighter: "#666666",
          lightest: "#999999",
          dark: "#262626",
          darker: "#1a1a1a"
        }
      }
    }
  },
  plugins: []
};
