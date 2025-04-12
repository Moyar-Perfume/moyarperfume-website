/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        black: "var(--black)",
        white: "var(--white)",
        rose: "var(--rose)",
        floral: "var(--floral)",
        sweet: "var(--sweet)",
        ocean: "var(--ocean)",
        green: "var(--green)",
      },
    },
  },
  plugins: [],
};
