/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui"), require("tw-elements/dist/plugin.cjs")],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#242F40",
          "primary-content": "#F1C40F",
          secondary: "#0E7C7B",
          accent: "#A76D60",
          neutral: "#D8DAD3",
          "base-100": "#F1F2EB",
          info: "#6CA0E5",
          success: "#209D5A",
          warning: "#F2BE31",
          error: "#ef4444",
        },
      },
      "dark",
    ],
  },
  darkTheme: "cupcake",
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
};
