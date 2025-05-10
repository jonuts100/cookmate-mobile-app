/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#309bae",
        secondary:"#095d40",
        light: {
          100: "#f8f9f0",
          200: "#f3f3f5",
          300: "#cbc7b7"
        },
        dark: {
          100: "#232d14",
          200: "#0d0d0d"
        },
        positive: "#8cb89f",
        negative: "#a73520",
        accent: "#ABBBFF",


      }
    },
  },
  plugins: [],
}

