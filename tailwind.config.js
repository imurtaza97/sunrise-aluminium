/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        customPrimary: '#f07e03',
        customPrimaryHover: '#7c2d12',
      },
      height: {
        navbarMinus: 'calc(100vh - 3.5rem)', // Custom height utility
      },
      width: {
        sidbarMinus: 'calc(100vw - 14rem)', // Custom height utility
        rem24: '24-rem',
      },

    },
  },
  plugins: [],
};
