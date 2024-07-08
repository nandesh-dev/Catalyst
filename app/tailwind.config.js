/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      slate: {
        950: "var(--slate-950)",
        900: "var(--slate-900)",
        800: "var(--slate-800)",
        700: "var(--slate-700)",
        600: "var(--slate-600)",
        200: "var(--slate-200)",
        100: "var(--slate-100)",
      },
      bright: {
        DEFAULT: "var(--bright)",
      },
      red: {
        DEFAULT: "var(--red)",
      },
      orange: {
        DEFAULT: "var(--orange)",
      },
      yellow: {
        DEFAULT: "var(--yellow)",
      },
      green: {
        DEFAULT: "var(--green)",
      },
      cyan: {
        DEFAULT: "var(--cyan)",
      },
      sky: {
        DEFAULT: "var(--sky)",
      },
      blue: {
        DEFAULT: "var(--blue)",
      },
      purple: {
        DEFAULT: "var(--purple)",
      },
      pink: {
        DEFAULT: "var(--pink)",
      },
    },
    borderRadius: {
      xxxl: "3rem",
      xxl: "2rem",
      xl: "1.5rem",
      l: "1rem",
      m: "0.5rem",
      s: "0.37rem",
      xs: "0.25rem",
    },
    fontSize: {
      l: "1.3em",
      m: "1em",
      DEFAULT: "1em",
      s: "0.9em",
    },
    extend: {
      spacing: {
        xxxl: "3rem",
        xxl: "2rem",
        xl: "1.5rem",
        l: "1rem",
        m: "0.5rem",
        s: "0.37rem",
        xs: "0.25rem",
      },
    },
  },
  plugins: [],
};
