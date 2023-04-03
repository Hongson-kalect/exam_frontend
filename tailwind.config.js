/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "1/12": "8.33%",
        "2/12": "16.67%",
        "3/12": "25%",
        "4/12": "33.33%",
        "5/12": "41.67%",
        "6/12": "50%",
        "7/12": "58.33%",
        "8/12": "66.67%",
        "9/12": "75%",
        "10/12": "83.33%",
        "11/12": "91.67%",
      },
      colors: {
        primary: {
          DEFAULT: "#41347c",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // <== disable this!
  },
};
