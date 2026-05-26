/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography"

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [typography],
  keyframes: {
  marquee: {
    "0%":   { transform: "translateX(0%)" },
    "100%": { transform: "translateX(-100%)" },
  },
  "marquee-reverse": {
    "0%":   { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(0%)" },
  },
},
animation: {
  marquee:           "marquee linear infinite",
  "marquee-reverse": "marquee-reverse linear infinite",
},
};
