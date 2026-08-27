import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DEDBC8",
          soft: "#E1E0CC",
        },
        paper: {
          DEFAULT: "#000000",
          soft: "#101010",
          mute: "#212121",
        },
        ink: {
          DEFAULT: "#E1E0CC",
          soft: "#DEDBC8",
        },
        muted: "#9CA3AF",
        line: "rgba(222, 219, 200, 0.12)",
        accent: {
          DEFAULT: "#DEDBC8",
          soft: "rgba(222, 219, 200, 0.12)",
          deep: "#C8C4AB",
          mist: "#E1E0CC",
        },
        cta: {
          DEFAULT: "#DEDBC8",
          fg: "#000000",
          hover: "#E8E5D4",
        },
        surface: {
          DEFAULT: "#000000",
          raised: "#101010",
          hover: "#212121",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Almarai", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "serif"],
        display: ["var(--font-sans)", "Almarai", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        outback: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        floaty: "floaty 6.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
