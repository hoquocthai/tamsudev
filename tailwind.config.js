/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "container-xl": "540px",
      },
      colors: {
        info: "#d9edf7",
        "info-secondary": "#98cce7",
        "info-primary": "#3a87ad",
      },
      container: {
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
