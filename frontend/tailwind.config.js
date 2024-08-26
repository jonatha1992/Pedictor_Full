/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#480480", // Morado oscuro
        secondary: "#f3207a", // Rosa
        accent: "#2a1463", // Azul oscuro
        highlight: "#f7d431", // Amarillo
      },
    },
  },
  plugins: [],
};
