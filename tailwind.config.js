/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: "#A7C7E7",
        pastelPink: "#F7CAC9",
        pastelGreen: "#B7E4C7",
        pastelYellow: "#FFF9B1",
        pastelPurple: "#CBAACB",
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
}
