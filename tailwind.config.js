const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    fontFamily: {
      sans: ["Recursive", ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
};
