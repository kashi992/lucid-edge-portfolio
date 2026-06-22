/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-warm":     "#faf6ef",
        "bg-grey":     "#f4f4f4",
        "bg-cold":     "#e8e9ef",
        "orange1":     "#ffbc95",
        "orange2":     "#f99e76",
        "accent-blue": "#2e54fe",
        "grey":        "#96908c",
      },
      fontFamily: {
        goga: ["'Goga'", "'Syne'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
